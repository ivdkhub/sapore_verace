<?php
// Configurazioni giornaliere della sala (chiave "YYYY-MM-DD_pranzo|cena") con versione
// per il controllo dei conflitti tra dashboard admin e prenotazioni online.

declare(strict_types=1);

function valid_config_key(string $key): bool
{
    return (bool)preg_match('/^\d{4}-\d{2}-\d{2}_(pranzo|cena)$/', $key) && valid_date(substr($key, 0, 10));
}

function default_day_config(): array
{
    $layout = (array)(seed_data()['default_layout'] ?? []);
    $tables = array_map(function ($t) {
        $t['status'] = 'disponibile';
        $t['reservation'] = null;
        $t['colorOverride'] = null;
        return $t;
    }, (array)($layout['tables'] ?? []));
    return ['tables' => $tables];
}

// Legge la configurazione (bloccando la riga su MySQL se dentro una transazione)
function load_day_config(string $key, bool $forUpdate = false): ?array
{
    $sql = 'SELECT data, version, updated_at FROM day_configs WHERE config_key = ?';
    if ($forUpdate && db_driver() === 'mysql') $sql .= ' FOR UPDATE';
    $st = db()->prepare($sql);
    $st->execute([$key]);
    $row = $st->fetch();
    if (!$row) return null;
    return [
        'data' => json_decode((string)$row['data'], true) ?: default_day_config(),
        'version' => (int)$row['version'],
        'updatedAt' => $row['updated_at'],
    ];
}

function store_day_config(string $key, array $data, int $version): void
{
    $data['updatedAt'] = now_iso();
    db()->prepare('REPLACE INTO day_configs (config_key, data, version, updated_at) VALUES (?, ?, ?, ?)')
        ->execute([$key, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $version, now_iso()]);
}

// Stessa logica del frontend: il tavolo libero più piccolo che contiene tutti gli ospiti
function find_best_free_table(array $tables, int $guests): ?array
{
    $free = array_values(array_filter($tables, fn($t) => is_array($t) && empty($t['reservation'])));
    if (!$free) return null;
    $fitting = array_values(array_filter($free, fn($t) => (int)($t['seats'] ?? 4) >= $guests));
    if ($fitting) {
        usort($fitting, function ($a, $b) use ($guests) {
            $da = (int)($a['seats'] ?? 4) - $guests;
            $db = (int)($b['seats'] ?? 4) - $guests;
            if ($da !== $db) return $da <=> $db;
            return strnatcasecmp((string)($a['name'] ?? ''), (string)($b['name'] ?? ''));
        });
        return $fitting[0];
    }
    return null; // nessun tavolo abbastanza grande: meglio farlo gestire al telefono
}

function free_tables_count(array $tables, int $guests): int
{
    return count(array_filter($tables, fn($t) => is_array($t) && empty($t['reservation']) && (int)($t['seats'] ?? 4) >= $guests));
}

function purge_old_data(): void
{
    $days = max(7, (int)cfg('reservations.retention_days', 30));
    $cutoff = date('Y-m-d', strtotime("-$days days"));
    $pdo = db();
    $pdo->prepare('DELETE FROM day_configs WHERE config_key < ?')->execute([$cutoff]);
    $pdo->prepare('DELETE FROM reservations WHERE config_key < ?')->execute([$cutoff]);
    $pdo->prepare('DELETE FROM orders WHERE created_at < ?')->execute([$cutoff]);
    $pdo->prepare('DELETE FROM inquiries WHERE created_at < ?')->execute([$cutoff]);
}

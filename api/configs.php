<?php
// Configurazioni giornaliere della sala (tavoli + prenotazioni). Solo admin.
// GET ?since=ISO                       -> configurazioni da 7 giorni fa in poi (o solo quelle cambiate)
// PUT { key, data, baseVersion }      -> salva; 409 se nel frattempo è cambiata (es. nuova prenotazione online)

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/tables.php';

allow_methods(['GET', 'PUT']);
require_admin();

if (request_method() === 'GET') {
    if (random_int(1, 20) === 1) purge_old_data();

    $from = date('Y-m-d', strtotime('-7 days'));
    $since = (string)($_GET['since'] ?? '');
    $sql = 'SELECT config_key, data, version, updated_at FROM day_configs WHERE config_key >= ?';
    $params = [$from];
    if ($since !== '') {
        $sql .= ' AND updated_at >= ?'; // ">=": i timestamp hanno precisione al secondo
        $params[] = $since;
    }
    $st = db()->prepare($sql);
    $st->execute($params);
    $configs = [];
    foreach ($st->fetchAll() as $row) {
        $configs[$row['config_key']] = [
            'data' => json_decode((string)$row['data'], true),
            'version' => (int)$row['version'],
        ];
    }
    json_out(['ok' => true, 'serverTime' => now_iso(), 'configs' => $configs]);
}

// PUT
$body = read_json_body(4000000);
$key = (string)($body['key'] ?? '');
$data = $body['data'] ?? null;
$baseVersion = isset($body['baseVersion']) ? (int)$body['baseVersion'] : 0;

if (!valid_config_key($key)) fail('Data o turno non validi.');
if (!is_array($data) || !isset($data['tables']) || !is_array($data['tables'])) fail('Configurazione non valida.');

$pdo = db();
db_begin_write($pdo);
try {
    $current = load_day_config($key, true);
    $currentVersion = $current ? $current['version'] : 0;
    if ($currentVersion !== $baseVersion && empty($body['force'])) {
        db_rollback($pdo);
        json_out([
            'ok' => false,
            'conflict' => true,
            'error' => 'La sala è stata aggiornata nel frattempo (es. nuova prenotazione online).',
            'current' => $current ? ['data' => $current['data'], 'version' => $current['version']] : null,
        ], 409);
    }
    $newVersion = $currentVersion + 1;
    store_day_config($key, [
        'tables' => array_values($data['tables']),
        'zoneLabels' => $data['zoneLabels'] ?? [],
        'structure' => $data['structure'] ?? new stdClass(),
    ], $newVersion);
    db_commit($pdo);
} catch (Throwable $e) {
    db_rollback($pdo);
    throw $e;
}

json_out(['ok' => true, 'version' => $newVersion]);

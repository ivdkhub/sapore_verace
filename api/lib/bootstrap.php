<?php
// Bootstrap comune a tutti gli endpoint: configurazione, risposte JSON,
// sessione admin, protezione CSRF, database e archivio chiave/valore.

declare(strict_types=1);

date_default_timezone_set('Europe/Rome');
mb_internal_encoding('UTF-8');

ini_set('display_errors', '0');
error_reporting(E_ALL);

set_exception_handler(function ($e) {
    error_log('[sapore-verace] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['ok' => false, 'error' => 'Errore interno del server. Riprova tra poco.']);
    exit;
});

// --------------------------------------------------------------------------
// Configurazione
// --------------------------------------------------------------------------
function app_config(): array
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;

    $defaults = require __DIR__ . '/../config.example.php';
    $file = __DIR__ . '/../config.php';
    $local = is_file($file) ? require $file : [];
    $cfg = array_replace_recursive($defaults, is_array($local) ? $local : []);
    $cfg['_configured'] = is_file($file);
    return $cfg;
}

function cfg(string $path, $default = null)
{
    $node = app_config();
    foreach (explode('.', $path) as $part) {
        if (!is_array($node) || !array_key_exists($part, $node)) return $default;
        $node = $node[$part];
    }
    return $node;
}

// --------------------------------------------------------------------------
// Risposte JSON
// --------------------------------------------------------------------------
function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400, array $extra = []): void
{
    json_out(array_merge(['ok' => false, 'error' => $message], $extra), $status);
}

function request_method(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function allow_methods(array $methods): void
{
    if (!in_array(request_method(), $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        fail('Metodo non consentito.', 405);
    }
}

function read_json_body(int $maxBytes = 2000000): array
{
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || $raw === '') return [];
    if (strlen($raw) > $maxBytes) fail('Richiesta troppo grande.', 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) fail('Formato della richiesta non valido.');
    return $data;
}

// --------------------------------------------------------------------------
// Sessione e sicurezza
// --------------------------------------------------------------------------
function is_https(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') return true;
    return ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('sv_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function is_admin(): bool
{
    start_session();
    $ok = !empty($_SESSION['admin']) && ($_SESSION['expires'] ?? 0) > time();
    if ($ok) $_SESSION['expires'] = time() + 8 * 3600; // scadenza scorrevole: 8 ore di inattività
    return $ok;
}

function require_admin(): void
{
    if (!is_admin()) fail('Accesso riservato. Effettua di nuovo il login.', 401);
}

// Le richieste che modificano dati devono avere l'header personalizzato:
// un sito esterno non può inviarlo senza CORS, quindi blocca gli attacchi CSRF.
function require_csrf_header(): void
{
    if (in_array(request_method(), ['GET', 'HEAD', 'OPTIONS'], true)) return;
    if (($_SERVER['HTTP_X_SV_REQUEST'] ?? '') !== '1') fail('Richiesta non valida.', 403);
}

function client_ip(): string
{
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 64);
}

// Limite semplice di richieste per IP (anti-spam su prenotazioni/ordini/login)
function rate_limit(string $bucket, int $max, int $windowSeconds): void
{
    $pdo = db();
    $since = date('Y-m-d H:i:s', time() - $windowSeconds);
    $pdo->prepare('DELETE FROM rate_limits WHERE created_at < ?')->execute([date('Y-m-d H:i:s', time() - 86400)]);
    $st = $pdo->prepare('SELECT COUNT(*) FROM rate_limits WHERE bucket = ? AND ip = ? AND created_at >= ?');
    $st->execute([$bucket, client_ip(), $since]);
    if ((int)$st->fetchColumn() >= $max) {
        fail('Troppe richieste in poco tempo. Riprova tra qualche minuto.', 429);
    }
    $pdo->prepare('INSERT INTO rate_limits (bucket, ip, created_at) VALUES (?, ?, ?)')
        ->execute([$bucket, client_ip(), date('Y-m-d H:i:s')]);
}

// --------------------------------------------------------------------------
// Database (SQLite predefinito, MySQL opzionale)
// --------------------------------------------------------------------------
function db_driver(): string
{
    return cfg('db.driver') === 'mysql' ? 'mysql' : 'sqlite';
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $opts = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    if (db_driver() === 'mysql') {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', cfg('db.mysql_host'), cfg('db.mysql_name'));
        $pdo = new PDO($dsn, (string)cfg('db.mysql_user'), (string)cfg('db.mysql_pass'), $opts);
    } else {
        $path = (string)cfg('db.sqlite_path');
        $dir = dirname($path);
        if (!is_dir($dir)) mkdir($dir, 0750, true);
        $pdo = new PDO('sqlite:' . $path, null, null, $opts);
        $pdo->exec('PRAGMA busy_timeout = 5000');
        $pdo->exec('PRAGMA journal_mode = WAL');
    }

    db_migrate($pdo);
    return $pdo;
}

function db_migrate(PDO $pdo): void
{
    $mysql = db_driver() === 'mysql';
    $text = $mysql ? 'LONGTEXT' : 'TEXT';
    $key = $mysql ? 'VARCHAR(120)' : 'TEXT';
    $auto = $mysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    $suffix = $mysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4' : '';

    $pdo->exec("CREATE TABLE IF NOT EXISTS kv_store (k $key PRIMARY KEY, v $text NOT NULL, updated_at VARCHAR(32) NOT NULL)$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS day_configs (config_key $key PRIMARY KEY, data $text NOT NULL, version INT NOT NULL DEFAULT 1, updated_at VARCHAR(32) NOT NULL)$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS reservations (code $key PRIMARY KEY, config_key VARCHAR(40) NOT NULL, table_id VARCHAR(120), data $text NOT NULL, created_at VARCHAR(32) NOT NULL)$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (id $auto, code VARCHAR(40) NOT NULL UNIQUE, status VARCHAR(30) NOT NULL, total DECIMAL(10,2) NOT NULL, data $text NOT NULL, created_at VARCHAR(32) NOT NULL)$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inquiries (id $auto, status VARCHAR(30) NOT NULL, data $text NOT NULL, created_at VARCHAR(32) NOT NULL)$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (id $auto, bucket VARCHAR(40) NOT NULL, ip VARCHAR(64) NOT NULL, created_at VARCHAR(32) NOT NULL)$suffix");
}

// Avvia una transazione con blocco in scrittura (evita doppie assegnazioni dello stesso tavolo)
function db_begin_write(PDO $pdo): void
{
    if (db_driver() === 'sqlite') {
        $pdo->exec('BEGIN IMMEDIATE');
    } else {
        $pdo->beginTransaction();
    }
}

function db_commit(PDO $pdo): void
{
    if (db_driver() === 'sqlite') $pdo->exec('COMMIT');
    else $pdo->commit();
}

function db_rollback(PDO $pdo): void
{
    try {
        if (db_driver() === 'sqlite') $pdo->exec('ROLLBACK');
        elseif ($pdo->inTransaction()) $pdo->rollBack();
    } catch (Throwable $e) {
        // nessuna transazione attiva
    }
}

function now_iso(): string
{
    return date('c');
}

// --------------------------------------------------------------------------
// Archivio chiave/valore (menu, prodotti settimana, orari, ferie, impostazioni)
// --------------------------------------------------------------------------
function seed_data(): array
{
    static $seed = null;
    if ($seed === null) {
        $raw = @file_get_contents(__DIR__ . '/../seed.json');
        $seed = $raw ? (json_decode($raw, true) ?: []) : [];
    }
    return $seed;
}

function kv_get(string $key, $default = null)
{
    $st = db()->prepare('SELECT v FROM kv_store WHERE k = ?');
    $st->execute([$key]);
    $raw = $st->fetchColumn();
    if ($raw !== false) {
        $val = json_decode((string)$raw, true);
        if ($val !== null) return $val;
    }
    $seed = seed_data();
    return array_key_exists($key, $seed) ? $seed[$key] : $default;
}

function kv_set(string $key, $value): void
{
    // REPLACE INTO funziona sia su SQLite sia su MySQL
    db()->prepare('REPLACE INTO kv_store (k, v, updated_at) VALUES (?, ?, ?)')
        ->execute([$key, json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), now_iso()]);
}

// --------------------------------------------------------------------------
// Validazione e utilità
// --------------------------------------------------------------------------
function clean_text($value, int $max = 200): string
{
    $s = trim((string)($value ?? ''));
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

function valid_phone(string $phone): bool
{
    $digits = preg_replace('/\D/', '', $phone) ?? '';
    return strlen($digits) >= 6 && strlen($digits) <= 15;
}

function valid_date(string $date): bool
{
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d !== false && $d->format('Y-m-d') === $date;
}

function random_code(string $prefix, int $length = 6): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // niente 0/O e 1/I per evitare confusioni al telefono
    $out = '';
    for ($i = 0; $i < $length; $i++) {
        $out .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return $prefix . '-' . $out;
}

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Avvio comune
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
require_csrf_header();

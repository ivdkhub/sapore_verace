<?php
// Login / logout area admin.
// GET    -> { authenticated: bool }
// POST   { password } -> login
// DELETE -> logout

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';

allow_methods(['GET', 'POST', 'DELETE']);

if (request_method() === 'GET') {
    json_out(['ok' => true, 'authenticated' => is_admin(), 'configured' => (bool)cfg('_configured')]);
}

if (request_method() === 'DELETE') {
    start_session();
    $_SESSION = [];
    session_destroy();
    json_out(['ok' => true, 'authenticated' => false]);
}

// POST: login
$stored = (string)cfg('admin_password', '');
if (!cfg('_configured') || $stored === '' || $stored === 'CAMBIA-QUESTA-PASSWORD') {
    fail('Area admin non ancora configurata: crea il file api/config.php e imposta "admin_password".', 503);
}

rate_limit('login', 5, 15 * 60);

$body = read_json_body(10000);
$password = (string)($body['password'] ?? '');

$isHash = strpos($stored, '$2y$') === 0 || strpos($stored, '$argon2') === 0;
$valid = $isHash ? password_verify($password, $stored) : hash_equals($stored, $password);

if (!$valid) {
    usleep(400000);
    fail('Password non corretta.', 401);
}

start_session();
session_regenerate_id(true);
$_SESSION['admin'] = true;
$_SESSION['expires'] = time() + 8 * 3600;

json_out(['ok' => true, 'authenticated' => true]);

<?php
// Router per lo sviluppo locale con il server integrato di PHP:
//   php -S 127.0.0.1:8000 api/dev-router.php
// Vite (npm run dev) inoltra /api e /uploads a questo server.

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = dirname(__DIR__);

if (preg_match('#^/api/([a-z-]+)\.php$#', $path, $m) && is_file(__DIR__ . '/' . $m[1] . '.php')) {
    require __DIR__ . '/' . $m[1] . '.php';
    return true;
}
if (strpos($path, '/uploads/') === 0 && is_file($root . $path) && !preg_match('/\.php$/i', $path)) {
    return false; // file statico servito da PHP
}
http_response_code(404);
echo 'Not found';

<?php
// Dati condivisi del sito.
// GET  ?keys=menu_items,weekly_products,opening_hours,holidays  -> pubblico
// PUT  { key, value }                                            -> solo admin

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';

const PUBLIC_KEYS = ['menu_items', 'weekly_products', 'opening_hours', 'holidays'];

allow_methods(['GET', 'PUT']);

if (request_method() === 'GET') {
    $requested = array_filter(explode(',', (string)($_GET['keys'] ?? implode(',', PUBLIC_KEYS))));
    $out = [];
    foreach ($requested as $key) {
        if (in_array($key, PUBLIC_KEYS, true)) $out[$key] = kv_get($key);
    }
    json_out(['ok' => true, 'data' => $out]);
}

require_admin();
$body = read_json_body(8000000);
$key = (string)($body['key'] ?? '');
if (!in_array($key, PUBLIC_KEYS, true)) fail('Chiave non valida.');
$value = $body['value'] ?? null;

if (in_array($key, ['menu_items', 'weekly_products', 'holidays'], true) && !is_array($value)) {
    fail('Formato dati non valido.');
}
if ($key === 'opening_hours' && (!is_array($value) || !isset($value['monday']))) {
    fail('Formato orari non valido.');
}
// Le immagini vanno caricate con upload.php: niente base64 dentro il database
$encoded = json_encode($value);
if ($encoded !== false && strpos($encoded, 'data:image') !== false) {
    fail('Le immagini devono essere caricate tramite il pulsante di upload, non incorporate.');
}

kv_set($key, $value);
json_out(['ok' => true]);

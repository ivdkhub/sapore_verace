<?php
// Dati condivisi del sito.
// GET  ?keys=menu_items,weekly_products,opening_hours,holidays,events,fixed_menu  -> pubblico
// GET  ?keys=covers_capacity                                     -> solo admin (per gli altri viene saltata)
// PUT  { key, value }                                            -> solo admin

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/tables.php';

const PUBLIC_KEYS = ['menu_items', 'weekly_products', 'opening_hours', 'holidays', 'events', 'fixed_menu'];
const ADMIN_KEYS = ['covers_capacity'];

allow_methods(['GET', 'PUT']);

if (request_method() === 'GET') {
    $requested = array_filter(explode(',', (string)($_GET['keys'] ?? implode(',', PUBLIC_KEYS))));
    $out = [];
    foreach ($requested as $key) {
        if (in_array($key, PUBLIC_KEYS, true)) {
            $out[$key] = kv_get($key);
        } elseif ($key === 'covers_capacity' && is_admin()) {
            $out[$key] = normalize_covers_capacity(kv_get($key) ?? []) ?? normalize_covers_capacity([]);
        }
    }
    json_out(['ok' => true, 'data' => $out]);
}

require_admin();
$body = read_json_body(8000000);
$key = (string)($body['key'] ?? '');
if (!in_array($key, PUBLIC_KEYS, true) && !in_array($key, ADMIN_KEYS, true)) fail('Chiave non valida.');
$value = $body['value'] ?? null;

if (in_array($key, ['menu_items', 'weekly_products', 'holidays', 'events'], true) && !is_array($value)) {
    fail('Formato dati non valido.');
}
if ($key === 'opening_hours' && (!is_array($value) || !isset($value['monday']))) {
    fail('Formato orari non valido.');
}
// Menù fisso: null = torna ai testi originali tradotti; altrimenti serve almeno una categoria
if ($key === 'fixed_menu' && $value !== null
    && (!is_array($value) || !isset($value['sections']) || !is_array($value['sections']) || count($value['sections']) > 12)) {
    fail('Formato del menù fisso non valido.');
}
if ($key === 'covers_capacity') {
    $value = normalize_covers_capacity($value);
    if ($value === null) fail('Numero di coperti non valido (da 1 a 999; per una sera anche 0).');
}
// Le immagini vanno caricate con upload.php: niente base64 dentro il database
$encoded = json_encode($value);
if ($encoded !== false && strpos($encoded, 'data:image') !== false) {
    fail('Le immagini devono essere caricate tramite il pulsante di upload, non incorporate.');
}

kv_set($key, $value);
json_out(['ok' => true, 'value' => $value]);

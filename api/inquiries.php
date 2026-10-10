<?php
// Richieste per eventi e feste private (pubblico).
// POST { name, phone, email, eventType, date, guests, notes, privacyAccepted }

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/notify.php';

allow_methods(['POST']);
rate_limit('inquiry', 10, 60 * 60);

$b = read_json_body(20000);
$q = [
    'name' => clean_text($b['name'] ?? '', 80),
    'phone' => clean_text($b['phone'] ?? '', 30),
    'email' => clean_text($b['email'] ?? '', 120),
    'eventType' => clean_text($b['eventType'] ?? '', 80),
    'date' => clean_text($b['date'] ?? '', 10),
    'guests' => clean_text((string)($b['guests'] ?? ''), 10),
    'notes' => clean_text($b['notes'] ?? '', 1000),
];

if (empty($b['privacyAccepted'])) fail('Per inviare la richiesta è necessario accettare l\'informativa privacy.');
if (mb_strlen($q['name']) < 2) fail('Inserisci il tuo nome.');
if ($q['email'] !== '' && !filter_var($q['email'], FILTER_VALIDATE_EMAIL)) fail('L\'indirizzo email non è valido.');
// Serve almeno un recapito: telefono valido oppure email
if (!valid_phone($q['phone']) && $q['email'] === '') fail('Inserisci un numero di telefono valido.');
if ($q['date'] !== '' && (!valid_date($q['date']) || $q['date'] < date('Y-m-d'))) fail('La data dell\'evento non è valida.');

db()->prepare('INSERT INTO inquiries (status, data, created_at) VALUES (?, ?, ?)')
    ->execute(['nuova', json_encode($q, JSON_UNESCAPED_UNICODE), now_iso()]);

finish_response_then(function () use ($q) {
    dispatch_notification('notifyOnInquiry', inquiry_messages($q));
}, ['ok' => true]);

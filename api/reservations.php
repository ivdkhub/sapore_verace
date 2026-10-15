<?php
// Prenotazioni online dei clienti (pubblico).
// GET  ?date=YYYY-MM-DD&guests=N  -> turni aperti, fasce orarie e tavoli liberi
// POST { name, phone, email, date, time, shift, guests, notes, privacyAccepted }

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/schedule.php';
require __DIR__ . '/lib/tables.php';
require __DIR__ . '/lib/notify.php';

allow_methods(['GET', 'POST']);

function shift_availability(string $date, string $shift, int $guests): array
{
    $status = shift_status($date, $shift);
    $slots = booking_slots($date, $shift);
    if ($date === date('Y-m-d')) {
        $now = now_minutes();
        $slots = array_values(array_filter($slots, fn($s) => shift_minutes($date, $shift, $s) > $now + 30));
    }
    $cfg = load_day_config($date . '_' . $shift);
    $tables = $cfg ? (array)$cfg['data']['tables'] : default_day_config()['tables'];
    return [
        'open' => $status['open'],
        'reason' => $status['reason'],
        'slots' => $slots,
        'tablesFree' => free_tables_count($tables, $guests),
    ];
}

if (request_method() === 'GET') {
    $date = (string)($_GET['date'] ?? '');
    $guests = max(1, min(30, (int)($_GET['guests'] ?? 2)));
    if (!valid_date($date)) fail('Data non valida.');
    json_out([
        'ok' => true,
        'date' => $date,
        'pranzo' => shift_availability($date, 'pranzo', $guests),
        'cena' => shift_availability($date, 'cena', $guests),
    ]);
}

// ----------------------------- POST: nuova prenotazione ------------------
rate_limit('reservation', 12, 60 * 60, false);

$b = read_json_body(20000);
$name = clean_text($b['name'] ?? '', 80);
$phone = clean_text($b['phone'] ?? '', 30);
$email = clean_text($b['email'] ?? '', 120);
$date = clean_text($b['date'] ?? '', 10);
$time = clean_text($b['time'] ?? '', 5);
$shift = ($b['shift'] ?? '') === 'pranzo' ? 'pranzo' : 'cena';
$guests = (int)($b['guests'] ?? 0);
$notes = clean_text($b['notes'] ?? '', 500, true);

if (empty($b['privacyAccepted'])) fail('Per prenotare è necessario accettare l\'informativa privacy.');
if (mb_strlen($name) < 2) fail('Inserisci il tuo nome e cognome.');
if (!valid_phone($phone)) fail('Inserisci un numero di telefono valido.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('L\'indirizzo email non è valido.');
if ($guests < 1 || $guests > 30) fail('Numero di persone non valido. Per gruppi oltre 30 persone chiamaci.');
if (!valid_date($date)) fail('Data non valida.');

$today = date('Y-m-d');
$maxDate = date('Y-m-d', strtotime('+' . (int)cfg('reservations.max_days_ahead', 60) . ' days'));
if ($date < $today) fail('Non è possibile prenotare per una data passata.');
if ($date > $maxDate) fail('Si può prenotare al massimo con ' . (int)cfg('reservations.max_days_ahead', 60) . ' giorni di anticipo.');

$status = shift_status($date, $shift);
if (!$status['open']) fail($status['reason']);
if (!in_array($time, booking_slots($date, $shift), true)) fail('L\'orario scelto non è disponibile per questo turno.');
if ($date === $today && shift_minutes($date, $shift, $time) <= now_minutes() + 30) {
    fail('Per oggi è possibile prenotare solo con almeno 30 minuti di anticipo. Per urgenze chiamaci.');
}

$key = $date . '_' . $shift;
$pdo = db();
db_begin_write($pdo);
try {
    $current = load_day_config($key, true);
    $data = $current ? $current['data'] : default_day_config();
    $version = $current ? $current['version'] : 0;

    // Coperti: oltre il massimo del turno la prenotazione resta "Da Confermare" e lo staff richiama il cliente
    $maxCovers = max_covers_for($key);
    $bookedCovers = booked_covers((array)$data['tables']);
    $pending = $bookedCovers + $guests > $maxCovers;

    $table = find_best_free_table((array)$data['tables'], $guests);
    if (!$table && !$pending) {
        db_rollback($pdo);
        fail("Siamo spiacenti, non ci sono tavoli liberi per $guests persone in questo turno. Prova un altro giorno o chiamaci.", 409);
    }

    // Codice prenotazione univoco
    $check = $pdo->prepare('SELECT 1 FROM reservations WHERE code = ?');
    do {
        $code = random_code('SV');
        $check->execute([$code]);
    } while ($check->fetchColumn());

    $color = $pending ? '#a855f7' : '#f59e0b';
    $reservation = [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'time' => $time,
        'guests' => $guests,
        'status' => $pending ? SV_PENDING_STATUS : 'In Attesa',
        'notes' => $notes,
        'color' => $color,
        'code' => $code,
        'createdAt' => now_iso(),
        'updatedAt' => date('H:i'),
        'source' => 'online_client',
    ];
    if ($pending) $reservation['coversAtRequest'] = "$bookedCovers/$maxCovers";

    if ($table) {
        foreach ($data['tables'] as $i => $t) {
            if (($t['id'] ?? null) === $table['id']) {
                $data['tables'][$i]['status'] = 'in_corso';
                $data['tables'][$i]['colorOverride'] = $color;
                $data['tables'][$i]['reservation'] = $reservation;
            }
        }
        store_day_config($key, $data, $version + 1);
    } else {
        // Sala piena e nessun tavolo libero: la richiesta finisce tra le "Richieste" dell'admin
        $pdo->prepare('INSERT INTO inquiries (status, data, created_at) VALUES (?, ?, ?)')->execute(['nuova', json_encode([
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'eventType' => "Prenotazione tavolo da confermare ($code) - sala piena",
            'date' => $date,
            'guests' => (string)$guests,
            'notes' => 'Ore ' . $time . ' (' . $shift . '), coperti già prenotati ' . $bookedCovers . '/' . $maxCovers
                . ', nessun tavolo libero.' . ($notes !== '' ? "\n" . $notes : ''),
        ], JSON_UNESCAPED_UNICODE), now_iso()]);
    }
    $pdo->prepare('INSERT INTO reservations (code, config_key, table_id, data, created_at) VALUES (?, ?, ?, ?, ?)')
        ->execute([$code, $key, $table ? (string)$table['id'] : null, json_encode($reservation, JSON_UNESCAPED_UNICODE), now_iso()]);
    db_commit($pdo);
    rate_limit_record('reservation');
} catch (Throwable $e) {
    db_rollback($pdo);
    throw $e;
}

if (random_int(1, 20) === 1) purge_old_data(); // conservazione dati (GDPR) anche se l'admin non apre la dashboard

$payload = [
    'ok' => true,
    'success' => true,
    'bookingCode' => $code,
    'pending' => $pending, // true = coperti esauriti: lo staff contatterà il cliente per confermare
    'date' => $date,
    'shift' => $shift,
    'time' => $time,
    // il tavolo si comunica solo per le prenotazioni confermate
    'table' => $table && !$pending ? ['id' => $table['id'], 'name' => $table['name'] ?? ''] : null,
    'reservation' => ['name' => $name, 'guests' => $guests, 'time' => $time, 'code' => $code, 'notes' => $notes],
];

$covers = "$bookedCovers/$maxCovers";
finish_response_then(function () use ($code, $name, $guests, $date, $time, $shift, $phone, $email, $table, $notes, $pending, $covers) {
    dispatch_notification('notifyOnReservation', reservation_messages([
        'code' => $code, 'name' => $name, 'guests' => $guests, 'date' => $date, 'time' => $time, 'shift' => $shift,
        'phone' => $phone, 'email' => $email, 'tableName' => (string)($table['name'] ?? ''), 'notes' => $notes,
        'pending' => $pending, 'covers' => $covers,
    ]));
}, $payload);

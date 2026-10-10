<?php
// Ordini online.
// POST  (pubblico) { items:[{id,quantity}], orderType, customer:{...}, paymentMethod, requestedTime }
// GET   (admin)    -> ultimi ordini e richieste eventi
// PATCH (admin)    { code, status }

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/schedule.php';
require __DIR__ . '/lib/tables.php';
require __DIR__ . '/lib/notify.php';

allow_methods(['GET', 'POST', 'PATCH']);

const ORDER_STATUSES = ['nuovo', 'in_preparazione', 'in_consegna', 'completato', 'annullato'];

if (request_method() === 'GET') {
    require_admin();
    $from = date('Y-m-d', strtotime('-3 days'));
    $st = db()->prepare('SELECT code, status, data, created_at FROM orders WHERE created_at >= ? ORDER BY created_at DESC LIMIT 200');
    $st->execute([$from]);
    $orders = array_map(function ($r) {
        $d = json_decode((string)$r['data'], true) ?: [];
        $d['status'] = $r['status'];
        return $d;
    }, $st->fetchAll());

    $st = db()->prepare('SELECT id, status, data, created_at FROM inquiries WHERE created_at >= ? ORDER BY created_at DESC LIMIT 100');
    $st->execute([date('Y-m-d', strtotime('-30 days'))]);
    $inquiries = array_map(function ($r) {
        $d = json_decode((string)$r['data'], true) ?: [];
        $d['id'] = (int)$r['id'];
        $d['status'] = $r['status'];
        $d['createdAt'] = $r['created_at'];
        return $d;
    }, $st->fetchAll());

    json_out(['ok' => true, 'orders' => $orders, 'inquiries' => $inquiries]);
}

if (request_method() === 'PATCH') {
    require_admin();
    $b = read_json_body(5000);
    $status = (string)($b['status'] ?? '');
    if (!in_array($status, ORDER_STATUSES, true) && !in_array($status, ['nuova', 'gestita'], true)) fail('Stato non valido.');
    if (!empty($b['inquiryId'])) {
        db()->prepare('UPDATE inquiries SET status = ? WHERE id = ?')->execute([$status, (int)$b['inquiryId']]);
    } else {
        db()->prepare('UPDATE orders SET status = ? WHERE code = ?')->execute([$status, clean_text($b['code'] ?? '', 40)]);
    }
    json_out(['ok' => true]);
}

// ------------------------------ POST: nuovo ordine -----------------------
rate_limit('order', 15, 60 * 60);

$b = read_json_body(50000);
$orderType = ($b['orderType'] ?? '') === 'pickup' ? 'pickup' : 'delivery';
$payment = ($b['paymentMethod'] ?? '') === 'card' ? 'card' : 'cash';
$c = is_array($b['customer'] ?? null) ? $b['customer'] : [];
$customer = [
    'fullName' => clean_text($c['fullName'] ?? '', 80),
    'phone' => clean_text($c['phone'] ?? '', 30),
    'address' => clean_text($c['address'] ?? '', 160),
    'city' => clean_text($c['city'] ?? '', 80),
    'postalCode' => clean_text($c['postalCode'] ?? '', 10),
    'notes' => clean_text($c['notes'] ?? '', 500),
];
$requested = clean_text($b['requestedTime'] ?? 'asap', 5);

if (empty($b['privacyAccepted'])) fail('Per ordinare è necessario accettare l\'informativa privacy.');
if (mb_strlen($customer['fullName']) < 2) fail('Inserisci il tuo nome e cognome.');
if (!valid_phone($customer['phone'])) fail('Inserisci un numero di telefono valido.');
if ($orderType === 'delivery') {
    if (mb_strlen($customer['address']) < 5 || !preg_match('/\d/', $customer['address'])) {
        fail('Inserisci l\'indirizzo completo di numero civico.');
    }
    if ($customer['city'] === '') fail('Inserisci la città di consegna.');
    if (!preg_match('/^\d{5}$/', $customer['postalCode'])) fail('Inserisci un CAP valido (5 cifre).');
    $allowed = array_map('strval', (array)cfg('orders.delivery_postcodes', []));
    if ($allowed && !in_array($customer['postalCode'], $allowed, true)) {
        fail('Purtroppo non consegniamo nel CAP ' . $customer['postalCode'] . '. Puoi scegliere il ritiro in pizzeria.');
    }
}

// --- Orario: oggi, durante un turno aperto ---
$today = date('Y-m-d');
$now = now_minutes();
$prep = max(0, (int)cfg('orders.prep_minutes', 20));
$openShift = null;
foreach (['pranzo', 'cena'] as $shift) {
    $s = shift_status($today, $shift);
    if (!$s['open']) continue;
    $open = time_to_minutes((string)$s['hours']['open']);
    $close = time_to_minutes((string)$s['hours']['close']);
    if ($open === null || $close === null) continue;
    if ($close <= $open) $close += 1440;
    if ($requested === 'asap') {
        if ($now >= $open && $now <= $close - 15) $openShift = $shift;
    } else {
        $t = time_to_minutes($requested);
        if ($t !== null && $t >= $open && $t <= $close && $t >= $now + $prep) $openShift = $shift;
    }
    if ($openShift) break;
}
if (!$openShift) {
    fail($requested === 'asap'
        ? 'In questo momento la cucina è chiusa: scegli un orario programmato durante l\'apertura di oggi.'
        : 'L\'orario scelto non è disponibile: deve essere durante l\'apertura di oggi e almeno ' . $prep . ' minuti da adesso.');
}

// --- Prezzi ricalcolati dal menu sul server (mai fidarsi del browser) ---
$catalog = [];
foreach (array_merge((array)kv_get('menu_items', []), (array)kv_get('weekly_products', [])) as $p) {
    if (is_array($p) && isset($p['id'])) $catalog[(string)$p['id']] = $p;
}
$items = [];
$subtotal = 0.0;
foreach (array_slice((array)($b['items'] ?? []), 0, 60) as $it) {
    $id = (string)($it['id'] ?? '');
    $qty = (int)($it['quantity'] ?? 0);
    if ($qty < 1 || $qty > 50) fail('Quantità non valida nel carrello.');
    if (!isset($catalog[$id])) fail('Un prodotto nel carrello non è più disponibile. Aggiorna la pagina.');
    $p = $catalog[$id];
    if (isset($p['available']) && $p['available'] === false) fail('"' . ($p['name'] ?? 'Prodotto') . '" è esaurito: rimuovilo dal carrello.');
    $price = is_numeric($p['numericPrice'] ?? null) ? (float)$p['numericPrice'] : null;
    if ($price === null || $price <= 0) fail('Prezzo non disponibile per "' . ($p['name'] ?? 'prodotto') . '".');
    $line = round($price * $qty, 2);
    $subtotal += $line;
    $items[] = ['id' => $id, 'name' => (string)($p['name'] ?? ''), 'quantity' => $qty, 'numericPrice' => $price, 'lineTotal' => $line, 'image' => $p['image'] ?? null];
}
if (!$items) fail('Il carrello è vuoto.');

$minOrder = (float)cfg('orders.min_order_delivery', 0);
if ($orderType === 'delivery' && $subtotal < $minOrder) {
    fail('L\'ordine minimo per la consegna a domicilio è di €' . number_format($minOrder, 2, ',', '') . '.');
}
$deliveryFee = $orderType === 'delivery' ? (float)cfg('orders.delivery_fee', 2.5) : 0.0;
$total = round($subtotal + $deliveryFee, 2);

$pdo = db();
$check = $pdo->prepare('SELECT 1 FROM orders WHERE code = ?');
do {
    $code = random_code('ORD');
    $check->execute([$code]);
} while ($check->fetchColumn());

$order = [
    'orderId' => $code,
    'items' => $items,
    'subtotal' => round($subtotal, 2),
    'deliveryFee' => $deliveryFee,
    'totalPrice' => $total,
    'orderType' => $orderType,
    'customer' => $customer,
    'paymentMethod' => $payment,
    'requestedTime' => $requested,
    'createdAt' => now_iso(),
    'status' => 'nuovo',
];
$pdo->prepare('INSERT INTO orders (code, status, total, data, created_at) VALUES (?, ?, ?, ?, ?)')
    ->execute([$code, 'nuovo', $total, json_encode($order, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), now_iso()]);

finish_response_then(function () use ($order) {
    dispatch_notification('notifyOnOrder', order_messages($order));
}, ['ok' => true, 'order' => $order]);

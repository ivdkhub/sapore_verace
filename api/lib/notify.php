<?php
// Notifiche al ristorante (Telegram, WhatsApp CallMeBot, Email) inviate DAL SERVER:
// token e chiavi restano nel database e non arrivano mai al browser dei clienti.

declare(strict_types=1);

function default_notification_settings(): array
{
    return [
        'email' => ['enabled' => false, 'recipients' => ''],
        'telegram' => ['enabled' => false, 'token' => '', 'chatId' => ''],
        'whatsapp' => ['enabled' => false, 'phone' => '', 'apiKey' => ''],
        'events' => ['notifyOnOrder' => true, 'notifyOnReservation' => true, 'notifyOnInquiry' => true],
    ];
}

function normalize_notification_settings($input): array
{
    $d = default_notification_settings();
    $in = is_array($input) ? $input : [];
    $out = $d;
    $out['email']['enabled'] = !empty($in['email']['enabled']);
    $out['email']['recipients'] = clean_text($in['email']['recipients'] ?? '', 1000);
    $out['telegram']['enabled'] = !empty($in['telegram']['enabled']);
    $out['telegram']['token'] = clean_text($in['telegram']['token'] ?? '', 200);
    $out['telegram']['chatId'] = clean_text($in['telegram']['chatId'] ?? '', 60);
    $out['whatsapp']['enabled'] = !empty($in['whatsapp']['enabled']);
    $out['whatsapp']['phone'] = clean_text($in['whatsapp']['phone'] ?? '', 30);
    $out['whatsapp']['apiKey'] = clean_text($in['whatsapp']['apiKey'] ?? '', 100);
    foreach (array_keys($d['events']) as $k) {
        $out['events'][$k] = isset($in['events'][$k]) ? (bool)$in['events'][$k] : $d['events'][$k];
    }
    return $out;
}

function notification_settings(): array
{
    return normalize_notification_settings(kv_get('notification_settings', default_notification_settings()));
}

function parse_recipients(string $text): array
{
    $list = preg_split('/[\s,;]+/', $text) ?: [];
    return array_values(array_filter($list, fn($e) => filter_var($e, FILTER_VALIDATE_EMAIL)));
}

function http_request(string $url, ?array $jsonBody = null): array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);
        if ($jsonBody !== null) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($jsonBody, JSON_UNESCAPED_UNICODE));
        }
        $body = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        return ['status' => $status, 'body' => $body === false ? '' : (string)$body, 'error' => $err];
    }
    $ctx = stream_context_create(['http' => [
        'method' => $jsonBody !== null ? 'POST' : 'GET',
        'header' => $jsonBody !== null ? "Content-Type: application/json\r\n" : '',
        'content' => $jsonBody !== null ? json_encode($jsonBody, JSON_UNESCAPED_UNICODE) : '',
        'timeout' => 10,
        'ignore_errors' => true,
    ]]);
    $body = @file_get_contents($url, false, $ctx);
    $status = 0;
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) $status = (int)$m[1];
    return ['status' => $status, 'body' => $body === false ? '' : $body, 'error' => $body === false ? 'connessione fallita' : ''];
}

function send_telegram(string $token, string $chatId, string $html): array
{
    if ($token === '' || $chatId === '') return ['ok' => false, 'detail' => 'Token del bot o Chat ID mancanti.'];
    $res = http_request('https://api.telegram.org/bot' . rawurlencode($token) . '/sendMessage', [
        'chat_id' => $chatId,
        'text' => $html,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ]);
    $data = json_decode($res['body'], true);
    if (!empty($data['ok'])) return ['ok' => true, 'detail' => 'Notifica inviata con successo su Telegram!'];
    return ['ok' => false, 'detail' => 'Telegram: ' . ($data['description'] ?? ($res['error'] ?: 'richiesta non riuscita'))];
}

function telegram_find_chats(string $token): array
{
    $res = http_request('https://api.telegram.org/bot' . rawurlencode($token) . '/getUpdates?limit=100');
    $data = json_decode($res['body'], true);
    if (empty($data['ok'])) {
        throw new RuntimeException('Telegram: ' . ($data['description'] ?? 'impossibile contattare i server Telegram.'));
    }
    $chats = [];
    foreach ($data['result'] ?? [] as $u) {
        $chat = $u['message']['chat'] ?? $u['my_chat_member']['chat'] ?? $u['channel_post']['chat'] ?? $u['edited_message']['chat'] ?? null;
        if (!$chat) continue;
        $id = (string)$chat['id'];
        $name = $chat['title'] ?? trim(($chat['first_name'] ?? '') . ' ' . ($chat['last_name'] ?? ''));
        if ($name === '') $name = $chat['username'] ?? $id;
        $chats[$id] = ['id' => $id, 'name' => $name, 'type' => $chat['type'] ?? 'private'];
    }
    return array_values($chats);
}

function send_whatsapp(string $phone, string $apiKey, string $text): array
{
    $phone = preg_replace('/[^\d+]/', '', $phone) ?? '';
    if ($phone === '' || $apiKey === '') return ['ok' => false, 'detail' => 'Numero di telefono o API Key CallMeBot mancanti.'];
    $url = 'https://api.callmebot.com/whatsapp.php?phone=' . rawurlencode($phone) . '&text=' . rawurlencode($text) . '&apikey=' . rawurlencode($apiKey);
    $res = http_request($url);
    $body = strtolower(strip_tags($res['body']));
    // CallMeBot risponde 200 anche in alcuni errori: controlliamo anche il testo della risposta
    if ($res['status'] >= 200 && $res['status'] < 300 && strpos($body, 'error') === false && strpos($body, 'invalid') === false) {
        return ['ok' => true, 'detail' => 'Messaggio WhatsApp inviato a ' . $phone . '.'];
    }
    $snippet = trim(mb_substr(preg_replace('/\s+/', ' ', strip_tags($res['body'])) ?? '', 0, 160));
    return ['ok' => false, 'detail' => 'WhatsApp (CallMeBot) non ha accettato il messaggio' . ($snippet ? ': ' . $snippet : ($res['error'] ? ': ' . $res['error'] : '.'))];
}

function send_email_message(string $recipientsText, string $subject, string $text, string $html): array
{
    $to = parse_recipients($recipientsText);
    if (!$to) return ['ok' => false, 'detail' => 'Nessun destinatario email valido.'];
    $from = (string)cfg('mail_from', 'noreply@localhost');
    $fromName = (string)cfg('mail_from_name', 'Sapore Verace');
    $boundary = 'sv_' . bin2hex(random_bytes(8));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . mb_encode_mimeheader($fromName) . ' <' . $from . '>',
        'Reply-To: ' . $from,
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    $body = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text))
        . "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html))
        . "--$boundary--";
    $sent = @mail(implode(', ', $to), mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers), '-f' . $from);
    return $sent
        ? ['ok' => true, 'detail' => 'Email consegnata al server di posta per: ' . implode(', ', $to) . '. Se non arriva, controlla lo spam.']
        : ['ok' => false, 'detail' => 'Il server non è riuscito a inviare l\'email (funzione mail() non disponibile o mittente non valido).'];
}

// Invia lo stesso evento su tutti i canali attivi. $msg = ['telegram'=>html, 'whatsapp'=>text, 'subject'=>, 'text'=>, 'html'=>]
function dispatch_notification(string $eventFlag, array $msg): array
{
    $s = notification_settings();
    $results = [];
    if (empty($s['events'][$eventFlag])) return $results;
    if ($s['telegram']['enabled']) {
        $results['telegram'] = send_telegram($s['telegram']['token'], $s['telegram']['chatId'], $msg['telegram']);
    }
    if ($s['whatsapp']['enabled']) {
        $results['whatsapp'] = send_whatsapp($s['whatsapp']['phone'], $s['whatsapp']['apiKey'], $msg['whatsapp']);
    }
    if ($s['email']['enabled']) {
        $results['email'] = send_email_message($s['email']['recipients'], $msg['subject'], $msg['text'], $msg['html']);
    }
    foreach ($results as $channel => $r) {
        if (empty($r['ok'])) error_log("[sapore-verace] notifica $channel fallita: " . ($r['detail'] ?? ''));
    }
    return $results;
}

// Le risposte al cliente non devono attendere Telegram/WhatsApp/Email
function finish_response_then(callable $work, array $payload, int $status = 200): void
{
    ignore_user_abort(true);
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    $out = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    header('Content-Length: ' . strlen($out));
    header('Connection: close');
    echo $out;
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        @ob_end_flush();
        @flush();
    }
    try {
        $work();
    } catch (Throwable $e) {
        error_log('[sapore-verace] errore notifiche: ' . $e->getMessage());
    }
    exit;
}

// ---------------------------- Messaggi ------------------------------------

function reservation_messages(array $r): array
{
    $shiftLabel = $r['shift'] === 'pranzo' ? 'Pranzo' : 'Cena';
    $dateIt = date('d/m/Y', strtotime($r['date']));
    // Coperti esauriti: la prenotazione va confermata dallo staff richiamando il cliente
    $pending = !empty($r['pending']);
    $title = $pending ? 'PRENOTAZIONE DA CONFERMARE' : 'NUOVA PRENOTAZIONE';
    $icon = $pending ? '⚠️' : '📅';
    $warn = 'COPERTI ESAURITI (' . ($r['covers'] ?? '') . ' già prenotati): richiama il cliente per confermare.';
    $tg = "$icon <b>$title — Sapore Verace</b>\n"
        . ($pending ? '❗ <b>' . h($warn) . "</b>\n" : '')
        . 'Codice: <code>' . h($r['code']) . "</code>\n\n"
        . '👤 <b>Cliente:</b> ' . h($r['name']) . "\n"
        . '👥 <b>Coperti:</b> ' . (int)$r['guests'] . "\n"
        . '📅 <b>Data:</b> ' . h($dateIt) . ' ore ' . h($r['time']) . ' (' . $shiftLabel . ")\n"
        . ($r['tableName'] ? '🪑 <b>Tavolo:</b> ' . h($r['tableName']) . "\n" : '')
        . '📞 <b>Telefono:</b> ' . h($r['phone']) . "\n"
        . ($r['email'] ? '✉️ <b>Email:</b> ' . h($r['email']) . "\n" : '')
        . ($r['notes'] ? '💬 <b>Note:</b> ' . h($r['notes']) . "\n" : '');
    $wa = "*$icon $title — Sapore Verace*\n" . ($pending ? "*$warn*\n" : '') . "Codice: {$r['code']}\n\n"
        . "*Cliente:* {$r['name']}\n*Coperti:* {$r['guests']}\n*Data:* $dateIt ore {$r['time']} ($shiftLabel)\n"
        . ($r['tableName'] ? "*Tavolo:* {$r['tableName']}\n" : '')
        . "*Telefono:* {$r['phone']}\n"
        . ($r['notes'] ? "*Note:* {$r['notes']}\n" : '');
    $text = ($pending ? "$warn\nPrenotazione da confermare" : 'Nuova prenotazione') . " {$r['code']}\nCliente: {$r['name']}\nCoperti: {$r['guests']}\nData: $dateIt ore {$r['time']} ($shiftLabel)\n"
        . "Tavolo: {$r['tableName']}\nTelefono: {$r['phone']}\nEmail: {$r['email']}\nNote: {$r['notes']}";
    $html = '<div style="font-family:sans-serif;max-width:600px;padding:24px;background:#181818;color:#fff;border-radius:12px">'
        . '<h2 style="color:#ffa323;margin-top:0">' . ($pending ? 'Prenotazione da confermare ' : 'Nuova prenotazione ') . h($r['code']) . '</h2>'
        . ($pending ? '<p style="color:#f87171;font-weight:bold">' . h($warn) . '</p>' : '')
        . '<p><strong>Cliente:</strong> ' . h($r['name']) . '</p>'
        . '<p><strong>Coperti:</strong> ' . (int)$r['guests'] . '</p>'
        . '<p><strong>Data e ora:</strong> ' . h($dateIt) . ' ore ' . h($r['time']) . ' (' . $shiftLabel . ')</p>'
        . ($r['tableName'] ? '<p><strong>Tavolo:</strong> ' . h($r['tableName']) . '</p>' : '')
        . '<p><strong>Telefono:</strong> ' . h($r['phone']) . '</p>'
        . ($r['email'] ? '<p><strong>Email:</strong> ' . h($r['email']) . '</p>' : '')
        . ($r['notes'] ? '<p><strong>Note:</strong> ' . nl2br(h($r['notes'])) . '</p>' : '')
        . '</div>';
    return [
        'telegram' => $tg,
        'whatsapp' => $wa,
        'subject' => ($pending ? 'DA CONFERMARE - Prenotazione' : 'Nuova prenotazione') . " {$r['code']} - {$r['name']} ({$r['guests']} persone) - $dateIt",
        'text' => $text,
        'html' => $html,
    ];
}

function order_messages(array $o): array
{
    $isDelivery = $o['orderType'] === 'delivery';
    $typeLabel = $isDelivery ? '🛵 Consegna a domicilio' : '🛍️ Ritiro in pizzeria';
    $payLabel = $o['paymentMethod'] === 'card' ? 'Carta / POS' : 'Contanti';
    $when = $o['requestedTime'] === 'asap' ? 'Prima possibile' : 'Ore ' . $o['requestedTime'];
    $c = $o['customer'];
    $address = trim($c['address'] . ', ' . $c['postalCode'] . ' ' . $c['city'], ', ');
    $lines = array_map(fn($it) => ' • ' . $it['quantity'] . 'x ' . $it['name'] . ' (€' . number_format($it['lineTotal'], 2, ',', '') . ')', $o['items']);
    $itemsText = implode("\n", $lines);
    $total = number_format((float)$o['totalPrice'], 2, ',', '');

    $tg = "🛒 <b>NUOVO ORDINE — Sapore Verace</b>\nCodice: <code>" . h($o['orderId']) . "</code>\n"
        . 'Modalità: <b>' . $typeLabel . '</b> — ' . h($when) . "\n\n"
        . '👤 <b>Cliente:</b> ' . h($c['fullName']) . "\n📞 <b>Telefono:</b> " . h($c['phone']) . "\n"
        . ($isDelivery ? '📍 <b>Indirizzo:</b> ' . h($address) . "\n" : '')
        . '💵 <b>Pagamento:</b> ' . $payLabel . "\n\n🍕 <b>Prodotti:</b>\n" . h($itemsText) . "\n\n"
        . "💰 <b>TOTALE: €$total</b>\n"
        . ($c['notes'] ? '💬 <b>Note:</b> ' . h($c['notes']) . "\n" : '');
    $wa = "*🛒 NUOVO ORDINE — Sapore Verace*\nCodice: {$o['orderId']}\nTipo: *$typeLabel* — $when\n\n"
        . "*Cliente:* {$c['fullName']}\n*Telefono:* {$c['phone']}\n"
        . ($isDelivery ? "*Indirizzo:* $address\n" : '')
        . "*Pagamento:* $payLabel\n\n*Prodotti:*\n$itemsText\n\n*TOTALE: €$total*"
        . ($c['notes'] ? "\n*Note:* {$c['notes']}" : '');
    $text = "Nuovo ordine {$o['orderId']} ($typeLabel, $when)\nCliente: {$c['fullName']}\nTelefono: {$c['phone']}\n"
        . ($isDelivery ? "Indirizzo: $address\n" : '') . "Pagamento: $payLabel\n\nProdotti:\n$itemsText\n\nTotale: €$total\nNote: {$c['notes']}";
    $html = '<div style="font-family:sans-serif;max-width:600px;padding:24px;background:#181818;color:#fff;border-radius:12px">'
        . '<h2 style="color:#d2401e;margin-top:0">Nuovo ordine ' . h($o['orderId']) . '</h2>'
        . '<p><strong>Tipo:</strong> ' . $typeLabel . ' — ' . h($when) . '</p>'
        . '<p><strong>Cliente:</strong> ' . h($c['fullName']) . '</p>'
        . '<p><strong>Telefono:</strong> ' . h($c['phone']) . '</p>'
        . ($isDelivery ? '<p><strong>Indirizzo:</strong> ' . h($address) . '</p>' : '')
        . '<p><strong>Pagamento:</strong> ' . $payLabel . '</p>'
        . '<pre style="background:#111;padding:12px;border-radius:8px;color:#ddd">' . h($itemsText) . '</pre>'
        . '<h3 style="color:#22c55e">Totale: €' . $total . '</h3>'
        . ($c['notes'] ? '<p><strong>Note:</strong> ' . nl2br(h($c['notes'])) . '</p>' : '')
        . '</div>';
    return [
        'telegram' => $tg,
        'whatsapp' => $wa,
        'subject' => "Nuovo ordine {$o['orderId']} (€$total) - " . ($isDelivery ? 'Domicilio' : 'Ritiro'),
        'text' => $text,
        'html' => $html,
    ];
}

function inquiry_messages(array $q): array
{
    // Il modulo contatti usa lo stesso canale: eventType inizia con "Messaggio dal sito"
    $isMessage = strpos($q['eventType'], 'Messaggio dal sito') === 0;
    $label = $isMessage ? 'MESSAGGIO DAL SITO' : 'RICHIESTA EVENTO';
    $icon = $isMessage ? '✉️' : '🎉';
    $labelLower = $isMessage ? 'Messaggio dal sito' : 'Richiesta evento';
    $tg = "$icon <b>$label — Sapore Verace</b>\n\n"
        . '👤 <b>Nome:</b> ' . h($q['name']) . "\n📞 <b>Telefono:</b> " . h($q['phone']) . "\n"
        . ($q['email'] ? '✉️ <b>Email:</b> ' . h($q['email']) . "\n" : '')
        . '🎈 <b>Tipo:</b> ' . h($q['eventType']) . "\n"
        . ($q['date'] ? '📅 <b>Data:</b> ' . h($q['date']) . "\n" : '')
        . '👥 <b>Ospiti:</b> ' . h($q['guests']) . "\n"
        . ($q['notes'] ? '💬 <b>Note:</b> ' . h($q['notes']) . "\n" : '');
    $plain = "$labelLower\nNome: {$q['name']}\nTelefono: {$q['phone']}\nEmail: {$q['email']}\nTipo: {$q['eventType']}\nData: {$q['date']}\nOspiti: {$q['guests']}\nNote: {$q['notes']}";
    return [
        'telegram' => $tg,
        'whatsapp' => "*$icon $label — Sapore Verace*\n" . $plain,
        'subject' => ($isMessage ? $q['eventType'] : "Richiesta evento: {$q['eventType']}") . " - {$q['name']}",
        'text' => $plain,
        'html' => '<div style="font-family:sans-serif"><h2>' . $labelLower . '</h2><pre>' . h($plain) . '</pre></div>',
    ];
}

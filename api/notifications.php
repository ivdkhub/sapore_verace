<?php
// Impostazioni notifiche (solo admin).
// GET                                   -> impostazioni salvate
// PUT  { settings }                     -> salva
// POST { action:'test', channel, settings }       -> invia un messaggio di prova
// POST { action:'telegram_chats', token }         -> elenca le chat del bot

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/notify.php';

allow_methods(['GET', 'PUT', 'POST']);
require_admin();

if (request_method() === 'GET') {
    json_out(['ok' => true, 'settings' => notification_settings(), 'mailFrom' => cfg('mail_from')]);
}

$b = read_json_body(50000);

if (request_method() === 'PUT') {
    $settings = normalize_notification_settings($b['settings'] ?? []);
    kv_set('notification_settings', $settings);
    json_out(['ok' => true, 'settings' => $settings]);
}

$action = (string)($b['action'] ?? '');

if ($action === 'telegram_chats') {
    $token = clean_text($b['token'] ?? '', 200);
    if ($token === '') fail('Inserisci il token del bot Telegram.');
    try {
        json_out(['ok' => true, 'chats' => telegram_find_chats($token)]);
    } catch (RuntimeException $e) {
        fail($e->getMessage(), 502);
    }
}

if ($action === 'test') {
    $s = normalize_notification_settings($b['settings'] ?? notification_settings());
    $channel = (string)($b['channel'] ?? '');
    $stamp = date('d/m/Y H:i');
    if ($channel === 'telegram') {
        $r = send_telegram($s['telegram']['token'], $s['telegram']['chatId'],
            "🔔 <b>TEST NOTIFICHE — Sapore Verace</b>\n\nSe leggi questo messaggio, Telegram è configurato correttamente.\n⏰ $stamp");
        $enabled = $s['telegram']['enabled'];
    } elseif ($channel === 'whatsapp') {
        $r = send_whatsapp($s['whatsapp']['phone'], $s['whatsapp']['apiKey'],
            "*🔔 TEST NOTIFICHE — Sapore Verace*\n\nSe leggi questo messaggio, WhatsApp è configurato correttamente.\n⏰ $stamp");
        $enabled = $s['whatsapp']['enabled'];
    } elseif ($channel === 'email') {
        $r = send_email_message($s['email']['recipients'], '[TEST] Sapore Verace — notifiche email',
            "Messaggio di prova delle notifiche di Sapore Verace.\nData: $stamp",
            '<div style="font-family:sans-serif"><h2>Test notifiche — Sapore Verace</h2><p>Se ricevi questa email, il canale è configurato correttamente.</p><p>' . h($stamp) . '</p></div>');
        $enabled = $s['email']['enabled'];
    } else {
        fail('Canale non riconosciuto.');
    }
    if ($r['ok'] && !$enabled) {
        $r['detail'] .= ' ⚠️ Il canale è DISATTIVATO: attiva la levetta e salva per ricevere le notifiche reali.';
    }
    json_out(['ok' => true, 'result' => $r]);
}

fail('Azione non riconosciuta.');

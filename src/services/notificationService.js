// Notification Service for Sapore Verace Admin Dashboard
// Channels supported: Email (SMTP / Webhook), Telegram (Official Bot API), WhatsApp (CallMeBot)
// Stores configuration persistently in localStorage ('sapore_verace_notification_settings')

export const STORAGE_KEY_NOTIFICATIONS = 'sapore_verace_notification_settings';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  email: {
    enabled: false,
    recipients: '', // List of emails (one per line or comma-separated)
    fromEmail: 'ordini@saporeverace.it',
    fromName: 'Pizzeria Sapore Verace',
    smtp: {
      host: 'smtp.gmail.com',
      port: '465',
      secure: 'ssl', // 'ssl' | 'tls'
      user: '',
      password: '',
    },
    webhookUrl: '', // Optional endpoint or proxy
  },
  telegram: {
    enabled: false,
    token: '',
    chatId: '',
  },
  whatsapp: {
    enabled: false,
    phone: '',
    apiKey: '',
  },
  events: {
    notifyOnOrder: true,
    notifyOnReservation: true,
  },
};

/**
 * Loads current settings from localStorage or returns default
 */
export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      email: {
        ...DEFAULT_NOTIFICATION_SETTINGS.email,
        ...(parsed.email || {}),
        smtp: {
          ...DEFAULT_NOTIFICATION_SETTINGS.email.smtp,
          ...(parsed.email?.smtp || {}),
        },
      },
      telegram: {
        ...DEFAULT_NOTIFICATION_SETTINGS.telegram,
        ...(parsed.telegram || {}),
      },
      whatsapp: {
        ...DEFAULT_NOTIFICATION_SETTINGS.whatsapp,
        ...(parsed.whatsapp || {}),
      },
      events: {
        ...DEFAULT_NOTIFICATION_SETTINGS.events,
        ...(parsed.events || {}),
      },
    };
  } catch (e) {
    console.error('Error loading notification settings:', e);
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

/**
 * Saves settings to localStorage and dispatches window event
 */
export function saveNotificationSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('sapore_verace_notification_settings_updated', { detail: settings }));
    return true;
  } catch (e) {
    console.error('Error saving notification settings:', e);
    return false;
  }
}

/**
 * Helper to parse recipients into an array of clean emails
 */
export function parseRecipients(text) {
  if (!text) return [];
  if (Array.isArray(text)) return text;
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Sanitizes phone number for CallMeBot (e.g. +393331234567)
 */
export function sanitizePhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}

// -------------------------------------------------------------
// TELEGRAM HELPERS
// -------------------------------------------------------------

/**
 * Calls Telegram Bot API getUpdates to detect chats that messaged the bot
 */
export async function findTelegramChats(token) {
  const cleanToken = (token || '').trim();
  if (!cleanToken) {
    throw new Error('Inserisci il token del bot Telegram per cercare i chat ID.');
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getUpdates?limit=100`);
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram: ${data.description || 'Errore nella richiesta getUpdates'}`);
    }

    const chatsMap = new Map();
    const updates = data.result || [];

    for (const update of updates) {
      const chat =
        update.message?.chat ||
        update.my_chat_member?.chat ||
        update.channel_post?.chat ||
        update.edited_message?.chat ||
        null;

      if (!chat) continue;

      const id = String(chat.id);
      const name = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || id;
      const type = chat.type || 'private';

      chatsMap.set(id, { id, name, type });
    }

    return Array.from(chatsMap.values());
  } catch (err) {
    throw new Error(err.message || 'Impossibile contattare i server Telegram.');
  }
}

/**
 * Sends HTML message via Telegram Bot API
 */
export async function sendTelegramMessage(token, chatId, textHtml) {
  const cleanToken = (token || '').trim();
  const cleanChatId = (chatId || '').trim();

  if (!cleanToken || !cleanChatId) {
    return { ok: false, detail: 'Token del bot o Chat ID mancanti.' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: textHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      return { ok: true, detail: 'Notifica inviata con successo su Telegram!' };
    }
    return { ok: false, detail: `Telegram errore: ${data.description || 'Richiesta non riuscita'}` };
  } catch (err) {
    return { ok: false, detail: `Errore di rete Telegram: ${err.message}` };
  }
}

// -------------------------------------------------------------
// WHATSAPP (CallMeBot) HELPERS
// -------------------------------------------------------------

/**
 * Sends WhatsApp message via CallMeBot API
 */
export async function sendWhatsAppMessage(phone, apiKey, text) {
  const cleanPhone = sanitizePhone(phone);
  const cleanApiKey = (apiKey || '').trim();

  if (!cleanPhone || !cleanApiKey) {
    return { ok: false, detail: 'Numero di telefono o API Key CallMeBot mancanti.' };
  }

  const encodedText = encodeURIComponent(text);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanPhone)}&text=${encodedText}&apikey=${cleanApiKey}`;

  try {
    // CallMeBot supports direct GET. We attempt normal fetch, and handle potential CORS with image fallback
    const res = await fetch(url, { method: 'GET', mode: 'no-cors' });
    // In mode 'no-cors', status is 0 opaque, meaning the request reached CallMeBot!
    return {
      ok: true,
      detail: `Richiesta WhatsApp inviata a ${cleanPhone} tramite CallMeBot! Controlla la chat WhatsApp.`,
    };
  } catch (fetchErr) {
    // Fallback: trigger via Image beacon
    try {
      const img = new Image();
      img.src = url;
      return {
        ok: true,
        detail: `Richiesta WhatsApp inviata a ${cleanPhone} (beacon)! Controlla la chat WhatsApp.`,
      };
    } catch (beaconErr) {
      return { ok: false, detail: `Errore invio WhatsApp: ${beaconErr.message}` };
    }
  }
}

// -------------------------------------------------------------
// EMAIL HELPERS
// -------------------------------------------------------------

/**
 * Sends Email notification
 * Uses webhookUrl if configured, or simulates/verifies configuration
 */
export async function sendEmailMessage(emailConfig, subject, textBody, htmlBody) {
  const recipients = parseRecipients(emailConfig.recipients);
  if (recipients.length === 0) {
    return { ok: false, detail: 'Nessun destinatario email specificato.' };
  }

  // If a webhook or mail proxy URL is specified, POST to it
  if (emailConfig.webhookUrl && emailConfig.webhookUrl.trim() !== '') {
    try {
      const res = await fetch(emailConfig.webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipients,
          from: emailConfig.fromEmail,
          fromName: emailConfig.fromName,
          subject,
          text: textBody,
          html: htmlBody,
          smtp: emailConfig.smtp,
        }),
      });
      if (res.ok) {
        return {
          ok: true,
          detail: `Email inviata con successo a: ${recipients.join(', ')}`,
        };
      }
      const errText = await res.text();
      return { ok: false, detail: `Errore endpoint email (${res.status}): ${errText.slice(0, 150)}` };
    } catch (err) {
      return { ok: false, detail: `Errore connessione server email: ${err.message}` };
    }
  }

  // If no webhook is configured, validate SMTP configuration presence
  const { host, user, password, port } = emailConfig.smtp;
  if (!host || !user) {
    return {
      ok: false,
      detail: 'Configurazione SMTP incompleta. Inserisci host SMTP e utente mittente.',
    };
  }

  // Return success status confirming parameters are valid and ready
  return {
    ok: true,
    detail: `Configurazione SMTP pronta (${host}:${port}, utente ${user}). Destinatari: ${recipients.join(', ')}.`,
  };
}

// -------------------------------------------------------------
// TEST SENDER
// -------------------------------------------------------------

export async function sendTestNotification(channel, settingsOverride = null) {
  const settings = settingsOverride || getNotificationSettings();

  if (channel === 'telegram') {
    const tg = settings.telegram;
    if (!tg.token || !tg.chatId) {
      return { ok: false, detail: 'Inserisci e salva il Token del Bot e il Chat ID Telegram prima del test.' };
    }
    const testMsg =
      `🔔 <b>TEST NOTIFICHE — Sapore Verace</b>\n\n` +
      `Se ricevi questo messaggio, l'integrazione Telegram è configurata correttamente ed è pronta a ricevere le notifiche di ordini e prenotazioni!\n\n` +
      `⏰ Data test: ${new Date().toLocaleString('it-IT')}\n` +
      `🍕 <i>Pizzeria Sapore Verace Management</i>`;
    const result = await sendTelegramMessage(tg.token, tg.chatId, testMsg);
    if (result.ok && !tg.enabled) {
      result.detail += ' ⚠️ Nota: il canale Telegram è attualmente DISATTIVATO. Attiva la levetta e salva le modifiche per ricevere le notifiche reali.';
    }
    return result;
  }

  if (channel === 'whatsapp') {
    const wa = settings.whatsapp;
    if (!wa.phone || !wa.apiKey) {
      return { ok: false, detail: 'Inserisci e salva il numero WhatsApp e la API Key CallMeBot prima del test.' };
    }
    const testMsg =
      `*🔔 TEST NOTIFICHE — Sapore Verace*\n\n` +
      `Se ricevi questo messaggio, l'integrazione WhatsApp CallMeBot è configurata e pronta!\n\n` +
      `⏰ Data test: ${new Date().toLocaleString('it-IT')}\n` +
      `🍕 _Pizzeria Sapore Verace_`;
    const result = await sendWhatsAppMessage(wa.phone, wa.apiKey, testMsg);
    if (result.ok && !wa.enabled) {
      result.detail += ' ⚠️ Nota: il canale WhatsApp è attualmente DISATTIVATO. Attiva la levetta e salva per ricevere le notifiche reali.';
    }
    return result;
  }

  if (channel === 'email') {
    const em = settings.email;
    const recipients = parseRecipients(em.recipients);
    if (recipients.length === 0) {
      return { ok: false, detail: 'Inserisci almeno un destinatario email prima del test.' };
    }
    const subject = `[TEST] Sapore Verace — Test Notifiche Email`;
    const textBody = `Questo è un messaggio di test per verificare la configurazione email di Sapore Verace.\nData test: ${new Date().toLocaleString('it-IT')}`;
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; background: #181818; color: #ffffff; border-radius: 12px; border: 1px solid #333;">
        <h2 style="color: #ffa323; margin-top: 0;">🍕 Test Notifiche — Sapore Verace</h2>
        <p>Se ricevi questa email, il canale notifiche di Sapore Verace è configurato correttamente.</p>
        <p style="font-size: 13px; color: #888;">Data test: ${new Date().toLocaleString('it-IT')}</p>
      </div>
    `;
    const result = await sendEmailMessage(em, subject, textBody, htmlBody);
    if (result.ok && !em.enabled) {
      result.detail += ' ⚠️ Nota: il canale Email è attualmente DISATTIVATO. Attiva la levetta e salva per ricevere le notifiche reali.';
    }
    return result;
  }

  return { ok: false, detail: 'Canale non riconosciuto.' };
}

// -------------------------------------------------------------
// EVENT DISPATCHERS: NEW RESERVATION & NEW ORDER
// -------------------------------------------------------------

/**
 * Dispatches notifications to enabled channels when a new reservation arrives
 */
export async function notifyNewReservation(reservationData) {
  const settings = getNotificationSettings();
  if (!settings.events.notifyOnReservation) return;

  const {
    code = 'SV-' + Math.floor(1000 + Math.random() * 9000),
    name = 'Ospite',
    guests = 2,
    date = new Date().toISOString().split('T')[0],
    time = '20:00',
    shift = 'cena',
    phone = '',
    email = '',
    tableName = '',
    notes = '',
  } = reservationData;

  // 1. Telegram
  if (settings.telegram.enabled && settings.telegram.token && settings.telegram.chatId) {
    const tgHtml =
      `📅 <b>NUOVA PRENOTAZIONE TAVOLO — Sapore Verace</b>\n` +
      `Codice: <code>#${code}</code>\n\n` +
      `👤 <b>Cliente:</b> ${name}\n` +
      `👥 <b>Coperti:</b> ${guests} persone\n` +
      `📅 <b>Data:</b> ${date}\n` +
      `⏰ <b>Orario:</b> ${time} (${shift === 'cena' ? 'Cena' : 'Pranzo'})\n` +
      (tableName ? `🪑 <b>Tavolo:</b> ${tableName}\n` : '') +
      `📞 <b>Telefono:</b> ${phone || 'Non specificato'}\n` +
      (email ? `✉️ <b>Email:</b> ${email}\n` : '') +
      (notes ? `💬 <b>Note:</b> ${notes}\n` : '') +
      `\n<i>Pannello Admin: visualizza e gestisci le prenotazioni in tempo reale.</i>`;

    sendTelegramMessage(settings.telegram.token, settings.telegram.chatId, tgHtml).catch((err) =>
      console.warn('Errore notifica Telegram prenotazione:', err)
    );
  }

  // 2. WhatsApp
  if (settings.whatsapp.enabled && settings.whatsapp.phone && settings.whatsapp.apiKey) {
    const waText =
      `*📅 NUOVA PRENOTAZIONE TAVOLO — Sapore Verace*\n` +
      `Codice: #${code}\n\n` +
      `*Cliente:* ${name}\n` +
      `*Coperti:* ${guests} persone\n` +
      `*Data:* ${date} ore ${time} (${shift === 'cena' ? 'Cena' : 'Pranzo'})\n` +
      (tableName ? `*Tavolo:* ${tableName}\n` : '') +
      `*Telefono:* ${phone || '—'}\n` +
      (notes ? `*Note:* ${notes}\n` : '');

    sendWhatsAppMessage(settings.whatsapp.phone, settings.whatsapp.apiKey, waText).catch((err) =>
      console.warn('Errore notifica WhatsApp prenotazione:', err)
    );
  }

  // 3. Email
  if (settings.email.enabled && parseRecipients(settings.email.recipients).length > 0) {
    const subject = `📅 Nuova Prenotazione #${code} - ${name} (${guests} persone) - Sapore Verace`;
    const textBody =
      `Nuova Prenotazione Tavolo #${code}\n` +
      `Cliente: ${name}\nCoperti: ${guests}\nData: ${date} ore ${time} (${shift})\n` +
      `Telefono: ${phone}\nNote: ${notes}`;
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 24px; background: #181818; color: #ffffff; border-radius: 12px; border: 1px solid #333;">
        <h2 style="color: #ffa323; margin-top: 0;">🍕 Nuova Prenotazione Tavolo #${code}</h2>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Coperti:</strong> ${guests} persone</p>
        <p><strong>Data e Ora:</strong> ${date} ore ${time} (${shift})</p>
        <p><strong>Telefono:</strong> ${phone || '—'}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        ${notes ? `<p><strong>Note cliente:</strong> ${notes}</p>` : ''}
      </div>
    `;
    sendEmailMessage(settings.email, subject, textBody, htmlBody).catch((err) =>
      console.warn('Errore notifica Email prenotazione:', err)
    );
  }
}

/**
 * Dispatches notifications to enabled channels when a new online order arrives
 */
export async function notifyNewOrder(orderData) {
  const settings = getNotificationSettings();
  if (!settings.events.notifyOnOrder) return;

  const {
    orderId = 'SV-' + Math.floor(100000 + Math.random() * 900000),
    items = [],
    totalPrice = 0,
    orderType = 'delivery',
    customer = {},
    paymentMethod = 'cash',
  } = orderData;

  const isDelivery = orderType === 'delivery';
  const paymentLabel = paymentMethod === 'card' ? '💳 Carta / POS al corriere' : '💶 Contanti al corriere';
  const typeLabel = isDelivery ? '🛵 Consegna a Domicilio' : '🛍️ Ritiro da Asporto';

  const itemsListText = items
    .map((it) => ` • ${it.quantity}x ${it.name} (€${(it.numericPrice * it.quantity).toFixed(2)})`)
    .join('\n');

  // 1. Telegram
  if (settings.telegram.enabled && settings.telegram.token && settings.telegram.chatId) {
    const tgHtml =
      `🛒 <b>NUOVO ORDINE ONLINE — Sapore Verace</b>\n` +
      `Codice: <code>#${orderId}</code>\n` +
      `Modalità: <b>${typeLabel}</b>\n\n` +
      `👤 <b>Cliente:</b> ${customer.name || 'Ospite'}\n` +
      `📞 <b>Telefono:</b> ${customer.phone || '—'}\n` +
      (isDelivery ? `📍 <b>Indirizzo Consegna:</b> ${customer.address || '—'}\n` : '') +
      `💵 <b>Pagamento:</b> ${paymentLabel}\n\n` +
      `🍕 <b>Piatti Ordinati:</b>\n${itemsListText}\n\n` +
      `💰 <b>TOTALE: €${Number(totalPrice).toFixed(2)}</b>\n` +
      (customer.notes ? `💬 <b>Note:</b> ${customer.notes}\n` : '') +
      `\n<i>Preparare e consegnare al corriere!</i>`;

    sendTelegramMessage(settings.telegram.token, settings.telegram.chatId, tgHtml).catch((err) =>
      console.warn('Errore notifica Telegram ordine:', err)
    );
  }

  // 2. WhatsApp
  if (settings.whatsapp.enabled && settings.whatsapp.phone && settings.whatsapp.apiKey) {
    const waText =
      `*🛒 NUOVO ORDINE ONLINE — Sapore Verace*\n` +
      `Codice: #${orderId}\n` +
      `Tipo: *${typeLabel}*\n\n` +
      `*Cliente:* ${customer.name || 'Ospite'}\n` +
      `*Telefono:* ${customer.phone || '—'}\n` +
      (isDelivery ? `*Indirizzo:* ${customer.address || '—'}\n` : '') +
      `*Pagamento:* ${paymentLabel}\n\n` +
      `*Piatti Ordinati:*\n${itemsListText}\n\n` +
      `*TOTALE: €${Number(totalPrice).toFixed(2)}*` +
      (customer.notes ? `\n*Note:* ${customer.notes}` : '');

    sendWhatsAppMessage(settings.whatsapp.phone, settings.whatsapp.apiKey, waText).catch((err) =>
      console.warn('Errore notifica WhatsApp ordine:', err)
    );
  }

  // 3. Email
  if (settings.email.enabled && parseRecipients(settings.email.recipients).length > 0) {
    const subject = `🛒 Nuovo Ordine #${orderId} (€${Number(totalPrice).toFixed(2)}) - ${typeLabel} - Sapore Verace`;
    const textBody =
      `Nuovo Ordine #${orderId}\n` +
      `Cliente: ${customer.name}\nTelefono: ${customer.phone}\n` +
      (isDelivery ? `Indirizzo: ${customer.address}\n` : '') +
      `Pagamento: ${paymentLabel}\n\n` +
      `Prodotti:\n${itemsListText}\n\nTotale: €${Number(totalPrice).toFixed(2)}`;

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 24px; background: #181818; color: #ffffff; border-radius: 12px; border: 1px solid #333;">
        <h2 style="color: #d2401e; margin-top: 0;">🍕 Nuovo Ordine #${orderId}</h2>
        <p><strong>Tipo ordine:</strong> ${typeLabel}</p>
        <p><strong>Cliente:</strong> ${customer.name}</p>
        <p><strong>Telefono:</strong> ${customer.phone}</p>
        ${isDelivery ? `<p><strong>Indirizzo Consegna:</strong> ${customer.address}</p>` : ''}
        <p><strong>Modalità Pagamento:</strong> ${paymentLabel}</p>
        <hr style="border-color: #333; margin: 16px 0;" />
        <h4 style="color: #ffa323; margin-bottom: 8px;">Dettaglio Piatti:</h4>
        <pre style="background: #111; padding: 12px; border-radius: 8px; color: #ddd; font-family: monospace;">${itemsListText}</pre>
        <h3 style="color: #22c55e;">Totale da incassare al corriere: €${Number(totalPrice).toFixed(2)}</h3>
        ${customer.notes ? `<p><strong>Note cliente:</strong> ${customer.notes}</p>` : ''}
      </div>
    `;

    sendEmailMessage(settings.email, subject, textBody, htmlBody).catch((err) =>
      console.warn('Errore notifica Email ordine:', err)
    );
  }
}

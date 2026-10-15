// Impostazioni notifiche dell'area admin.
// Le notifiche (Telegram, WhatsApp CallMeBot, Email) partono DAL SERVER quando arriva
// una prenotazione, un ordine o una richiesta evento: token e chiavi restano sul server
// e non vengono mai inviati al browser dei clienti.

import { api } from './api';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  email: {
    enabled: false,
    recipients: '', // uno per riga o separati da virgola
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
    notifyOnInquiry: true,
  },
};

const mergeWithDefaults = (s = {}) => ({
  email: { ...DEFAULT_NOTIFICATION_SETTINGS.email, ...(s.email || {}) },
  telegram: { ...DEFAULT_NOTIFICATION_SETTINGS.telegram, ...(s.telegram || {}) },
  whatsapp: { ...DEFAULT_NOTIFICATION_SETTINGS.whatsapp, ...(s.whatsapp || {}) },
  events: { ...DEFAULT_NOTIFICATION_SETTINGS.events, ...(s.events || {}) },
});

/** Legge le impostazioni salvate sul server (solo admin) */
export async function getNotificationSettings() {
  const res = await api.get('notifications.php');
  return { settings: mergeWithDefaults(res.settings), mailFrom: res.mailFrom || '' };
}

/** Salva le impostazioni sul server (solo admin) */
export async function saveNotificationSettings(settings) {
  const res = await api.put('notifications.php', { settings });
  return mergeWithDefaults(res.settings);
}

/** Invia un messaggio di prova con le impostazioni attualmente a schermo */
export async function sendTestNotification(channel, settings) {
  const res = await api.post('notifications.php', { action: 'test', channel, settings });
  return res.result;
}

/** Elenca le chat che hanno scritto al bot Telegram (per trovare il Chat ID) */
export async function findTelegramChats(token) {
  const res = await api.post('notifications.php', { action: 'telegram_chats', token });
  return res.chats || [];
}

export function parseRecipients(text) {
  if (!text) return [];
  if (Array.isArray(text)) return text;
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

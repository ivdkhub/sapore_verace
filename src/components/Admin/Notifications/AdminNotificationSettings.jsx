import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Send,
  MessageCircle,
  Save,
  Search,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  ShoppingBag,
  Calendar,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  sendTestNotification,
  findTelegramChats,
  parseRecipients,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../../../services/notificationService';

export const AdminNotificationSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { kind: 'ok'|'warn'|'error', text: string, channel: string }
  const [testingChannel, setTestingChannel] = useState(null); // 'telegram'|'whatsapp'|'email'|null
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [showTgToken, setShowTgToken] = useState(false);
  const [showWaKey, setShowWaKey] = useState(false);
  const [telegramChats, setTelegramChats] = useState([]);
  const [isFindingChats, setIsFindingChats] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const loaded = getNotificationSettings();
    setSettings(loaded);
    setSavedSettings(loaded);
  }, []);

  // Check for unsaved changes
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleFieldChange = (channel, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [field]: value,
      },
    }));
  };

  const handleSmtpChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        smtp: {
          ...prev.email.smtp,
          [field]: value,
        },
      },
    }));
  };

  const handleEventToggle = (eventField) => {
    setSettings((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [eventField]: !prev.events[eventField],
      },
    }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTestStatus(null);
    try {
      const success = saveNotificationSettings(settings);
      if (success) {
        setSavedSettings(settings);
        setTestStatus({
          kind: 'ok',
          text: 'Tutte le impostazioni di notifica sono state salvate con successo!',
          channel: 'global',
        });
      } else {
        setTestStatus({
          kind: 'error',
          text: 'Impossibile salvare le impostazioni nel browser.',
          channel: 'global',
        });
      }
    } catch (err) {
      setTestStatus({ kind: 'error', text: err.message, channel: 'global' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestChannel = async (channel) => {
    setTestingChannel(channel);
    setTestStatus(null);
    try {
      // Use current unsaved settings so user can test immediately before/after saving
      const res = await sendTestNotification(channel, settings);
      setTestStatus({
        kind: res.ok ? 'ok' : 'error',
        text: res.detail,
        channel,
      });
    } catch (err) {
      setTestStatus({
        kind: 'error',
        text: `Errore durante il test di ${channel}: ${err.message}`,
        channel,
      });
    } finally {
      setTestingChannel(null);
    }
  };

  const handleFindTelegramChats = async () => {
    if (!settings.telegram.token) {
      setTestStatus({
        kind: 'error',
        text: 'Inserisci il Token del bot Telegram prima di cercare i chat ID.',
        channel: 'telegram',
      });
      return;
    }

    setIsFindingChats(true);
    setTestStatus(null);
    try {
      const chats = await findTelegramChats(settings.telegram.token);
      setTelegramChats(chats);
      if (chats.length === 0) {
        setTestStatus({
          kind: 'warn',
          text: 'Nessuna chat recente trovata. Apri Telegram, invia un messaggio o scrivi /start al tuo bot (o aggiungilo in un gruppo e scrivi un messaggio), poi riprova.',
          channel: 'telegram',
        });
      } else {
        setTestStatus({
          kind: 'ok',
          text: `Trovate ${chats.length} chat! Clicca su quella desiderata per selezionarla automaticamente.`,
          channel: 'telegram',
        });
      }
    } catch (err) {
      setTestStatus({
        kind: 'error',
        text: err.message,
        channel: 'telegram',
      });
    } finally {
      setIsFindingChats(false);
    }
  };

  const renderBadge = (enabled) => (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-oswald uppercase tracking-wider font-bold transition-all border ${
        enabled
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-white/5 text-stone-400 border-white/10'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
      {enabled ? 'Attivo' : 'Disattivato'}
    </span>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ============================================================ */}
      {/* 1. HEADER HERO BANNER                                        */}
      {/* ============================================================ */}
      <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-[#ffa323]/10 to-[#d2401e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d2401e] to-[#ffa323] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffa323]/25">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-bold">
                  Sapore Verace Alert Center
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#d2401e]/20 text-[#ffa323] text-[10px] font-mono uppercase font-bold border border-[#d2401e]/30">
                  Real-Time
                </span>
              </div>
              <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                Configurazione Notifiche Istantanee
              </h2>
              <p className="text-sm text-stone-300 font-sans max-w-2xl mt-1.5">
                Ricevi un avviso immediato con tutti i dati del cliente su <b>Telegram</b>, <b>WhatsApp</b> e <b>Email</b>{' '}
                ogni volta che viene ricevuta una nuova prenotazione o un ordine online.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d2401e] via-[#e54b24] to-[#ffa323] hover:from-[#c23717] hover:to-[#f59e0b] text-white font-oswald text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#d2401e]/30 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvataggio...' : 'Salva Impostazioni'}</span>
            </button>
          </div>
        </div>

        {/* Global Event Trigger Selectors */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-sans">
          <span className="font-oswald uppercase text-white/50 tracking-wider font-bold">
            Eventi che generano notifiche:
          </span>
          <label className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={settings.events.notifyOnReservation}
              onChange={() => handleEventToggle('notifyOnReservation')}
              className="w-4 h-4 rounded text-[#ffa323] focus:ring-[#ffa323] accent-[#ffa323] cursor-pointer"
            />
            <span className="text-white font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ffa323]" />
              Nuove Prenotazioni Tavolo
            </span>
          </label>

          <label className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={settings.events.notifyOnOrder}
              onChange={() => handleEventToggle('notifyOnOrder')}
              className="w-4 h-4 rounded text-[#ffa323] focus:ring-[#ffa323] accent-[#ffa323] cursor-pointer"
            />
            <span className="text-white font-medium flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#d2401e]" />
              Nuovi Ordini Online (Domicilio & Asporto)
            </span>
          </label>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STATUS NOTIFICATION BANNER                                   */}
      {/* ============================================================ */}
      {testStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all shadow-lg animate-in slide-in-from-top-2 duration-300 ${
            testStatus.kind === 'ok'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-emerald-950/30'
              : testStatus.kind === 'warn'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-amber-950/30'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-rose-950/30'
          }`}
        >
          {testStatus.kind === 'ok' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-sans">
            <p className="font-semibold">{testStatus.text}</p>
          </div>
          <button
            onClick={() => setTestStatus(null)}
            className="text-white/40 hover:text-white text-xs px-2 py-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* UNSAVED CHANGES HINT                                         */}
      {/* ============================================================ */}
      {hasUnsavedChanges && (
        <div className="px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">
              Ci sono modifiche non salvate alle notifiche. Clicca <b>"Salva Impostazioni"</b> per renderle effettive.
            </span>
          </div>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-oswald text-xs uppercase font-bold cursor-pointer transition-all shrink-0"
          >
            Salva Ora
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CHANNELS GRID                                             */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========================================================== */}
        {/* CHANNEL 1: TELEGRAM (Official Bot API)                    */}
        {/* ========================================================== */}
        <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="space-y-5">
            {/* Header & Toggle */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
                  <Send className="w-5 h-5 -rotate-12" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-bold uppercase text-white flex items-center gap-2">
                    Telegram
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">Official Bot API</span>
                </div>
              </div>
              {renderBadge(settings.telegram.enabled)}
            </div>

            {/* Enable switch */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-colors">
              <span className="text-xs font-oswald uppercase tracking-wider text-white font-bold">
                Invia notifiche su Telegram
              </span>
              <input
                type="checkbox"
                checked={settings.telegram.enabled}
                onChange={(e) => handleFieldChange('telegram', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded text-[#229ED9] focus:ring-[#229ED9] accent-[#229ED9] cursor-pointer"
              />
            </label>

            {/* Quick Setup Instructions */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-stone-300 font-sans space-y-1.5 leading-relaxed">
              <div className="font-oswald uppercase text-[#ffa323] text-xs font-bold flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-3.5 h-3.5" /> Come configurare il bot:
              </div>
              <p>
                1. Cerca <b>@BotFather</b> su Telegram e invia <code>/newbot</code>.
              </p>
              <p>
                2. Incolla il <b>Token</b> rilasciato nel campo sottostante.
              </p>
              <p>
                3. Scrivi un messaggio al tuo bot (o aggiungilo al gruppo del locale).
              </p>
              <p>
                4. Clicca <b>"Trova Chat ID"</b> per compilare l'ID in un click.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                  Token del Bot Telegram
                </label>
                <div className="relative">
                  <input
                    type={showTgToken ? 'text' : 'password'}
                    placeholder="es. 123456789:ABCdefGhIJKlmNoPQRstuVWxyz"
                    value={settings.telegram.token}
                    onChange={(e) => handleFieldChange('telegram', 'token', e.target.value.trim())}
                    className="w-full bg-[#101010] border border-white/15 focus:border-[#229ED9] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 outline-none transition-all pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTgToken(!showTgToken)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                  >
                    {showTgToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                  Chat ID (Personale o Gruppo)
                </label>
                <input
                  type="text"
                  placeholder="es. 123456789 oppure -100123456789"
                  value={settings.telegram.chatId}
                  onChange={(e) => handleFieldChange('telegram', 'chatId', e.target.value.trim())}
                  className="w-full bg-[#101010] border border-white/15 focus:border-[#229ED9] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 outline-none transition-all font-mono"
                />
              </div>

              {/* Detected Chats List */}
              {telegramChats.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/30 space-y-2">
                  <span className="text-[10px] font-oswald uppercase text-[#229ED9] tracking-wider font-bold block">
                    Chat rilevate dal Bot:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {telegramChats.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleFieldChange('telegram', 'chatId', c.id)}
                        className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg border font-mono transition-all cursor-pointer ${
                          settings.telegram.chatId === c.id
                            ? 'bg-[#229ED9] text-white border-[#229ED9] font-bold shadow'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/15'
                        }`}
                      >
                        {c.name} <span className="text-[9px] opacity-70">({c.id})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 space-y-2 mt-6">
            <button
              type="button"
              onClick={handleFindTelegramChats}
              disabled={isFindingChats || !settings.telegram.token}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
            >
              <Search className="w-3.5 h-3.5 text-[#229ED9]" />
              <span>{isFindingChats ? 'Ricerca in corso...' : 'Trova Chat ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTestChannel('telegram')}
              disabled={testingChannel !== null}
              className="w-full py-2.5 px-3 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/40 text-[#229ED9] font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testingChannel === 'telegram' ? 'Invio in corso...' : 'Invia Notifica di Prova'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CHANNEL 2: WHATSAPP (CallMeBot)                            */}
        {/* ========================================================== */}
        <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="space-y-5">
            {/* Header & Toggle */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-bold uppercase text-white flex items-center gap-2">
                    WhatsApp
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">CallMeBot Gateway</span>
                </div>
              </div>
              {renderBadge(settings.whatsapp.enabled)}
            </div>

            {/* Enable switch */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-colors">
              <span className="text-xs font-oswald uppercase tracking-wider text-white font-bold">
                Invia notifiche su WhatsApp
              </span>
              <input
                type="checkbox"
                checked={settings.whatsapp.enabled}
                onChange={(e) => handleFieldChange('whatsapp', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded text-[#25D366] focus:ring-[#25D366] accent-[#25D366] cursor-pointer"
              />
            </label>

            {/* Quick Setup Instructions */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-stone-300 font-sans space-y-1.5 leading-relaxed">
              <div className="font-oswald uppercase text-[#25D366] text-xs font-bold flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-3.5 h-3.5" /> Come ottenere l'API Key CallMeBot:
              </div>
              <p>
                1. Salva il numero <b>+34 644 99 26 98</b> nella rubrica del tuo cellulare.
              </p>
              <p>
                2. Invia a questo contatto su WhatsApp il messaggio esatto:
                <br />
                <code className="bg-black/40 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] select-all">
                  I allow callmebot to send me messages
                </code>
              </p>
              <p>
                3. Riceverai un messaggio con la tua <b>API Key</b> personale numerica.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                  Il Tuo Numero WhatsApp (con prefisso)
                </label>
                <input
                  type="tel"
                  placeholder="es. +393331234567"
                  value={settings.whatsapp.phone}
                  onChange={(e) => handleFieldChange('whatsapp', 'phone', e.target.value.trim())}
                  className="w-full bg-[#101010] border border-white/15 focus:border-[#25D366] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                  API Key CallMeBot
                </label>
                <div className="relative">
                  <input
                    type={showWaKey ? 'text' : 'password'}
                    placeholder="es. 123456"
                    value={settings.whatsapp.apiKey}
                    onChange={(e) => handleFieldChange('whatsapp', 'apiKey', e.target.value.trim())}
                    className="w-full bg-[#101010] border border-white/15 focus:border-[#25D366] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 outline-none transition-all pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWaKey(!showWaKey)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                  >
                    {showWaKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 space-y-2 mt-6">
            <button
              type="button"
              onClick={() => handleTestChannel('whatsapp')}
              disabled={testingChannel !== null}
              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-40"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{testingChannel === 'whatsapp' ? 'Invio in corso...' : 'Invia Notifica di Prova'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CHANNEL 3: EMAIL & SMTP                                    */}
        {/* ========================================================== */}
        <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="space-y-5">
            {/* Header & Toggle */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ffa323]/20 border border-[#ffa323]/30 flex items-center justify-center text-[#ffa323]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-bold uppercase text-white flex items-center gap-2">
                    Email
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">SMTP & Webhook</span>
                </div>
              </div>
              {renderBadge(settings.email.enabled)}
            </div>

            {/* Enable switch */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-colors">
              <span className="text-xs font-oswald uppercase tracking-wider text-white font-bold">
                Invia notifiche via Email
              </span>
              <input
                type="checkbox"
                checked={settings.email.enabled}
                onChange={(e) => handleFieldChange('email', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded text-[#ffa323] focus:ring-[#ffa323] accent-[#ffa323] cursor-pointer"
              />
            </label>

            {/* Recipients */}
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-stone-300 font-bold mb-1.5">
                Destinatari (uno per riga o separati da virgola)
              </label>
              <textarea
                rows={2}
                placeholder={'ordini@saporeverace.it\nprenotazioni@saporeverace.it'}
                value={settings.email.recipients}
                onChange={(e) => handleFieldChange('email', 'recipients', e.target.value)}
                className="w-full bg-[#101010] border border-white/15 focus:border-[#ffa323] rounded-xl p-3 text-xs text-white placeholder-stone-600 outline-none transition-all font-sans resize-y"
              />
            </div>

            {/* Sender details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-oswald uppercase tracking-wider text-stone-400 font-bold mb-1">
                  Email Mittente
                </label>
                <input
                  type="email"
                  placeholder="ordini@saporeverace.it"
                  value={settings.email.fromEmail}
                  onChange={(e) => handleFieldChange('email', 'fromEmail', e.target.value.trim())}
                  className="w-full bg-[#101010] border border-white/15 focus:border-[#ffa323] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-oswald uppercase tracking-wider text-stone-400 font-bold mb-1">
                  Nome Mittente
                </label>
                <input
                  type="text"
                  placeholder="Sapore Verace"
                  value={settings.email.fromName}
                  onChange={(e) => handleFieldChange('email', 'fromName', e.target.value)}
                  className="w-full bg-[#101010] border border-white/15 focus:border-[#ffa323] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* SMTP Details */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <span className="text-[11px] font-oswald uppercase tracking-wider text-[#ffa323] font-bold block">
                Parametri Server SMTP
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-stone-400 font-sans mb-1">Host SMTP</label>
                  <input
                    type="text"
                    placeholder="smtp.gmail.com"
                    value={settings.email.smtp.host}
                    onChange={(e) => handleSmtpChange('host', e.target.value.trim())}
                    className="w-full bg-[#101010] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 font-sans mb-1">Sicurezza / Porta</label>
                  <div className="flex gap-1.5">
                    <select
                      value={settings.email.smtp.secure}
                      onChange={(e) => {
                        handleSmtpChange('secure', e.target.value);
                        handleSmtpChange('port', e.target.value === 'ssl' ? '465' : '587');
                      }}
                      className="bg-[#101010] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="ssl">SSL (465)</option>
                      <option value="tls">TLS (587)</option>
                    </select>
                    <input
                      type="text"
                      value={settings.email.smtp.port}
                      onChange={(e) => handleSmtpChange('port', e.target.value)}
                      className="w-14 bg-[#101010] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-stone-400 font-sans mb-1">Utente / Login</label>
                  <input
                    type="text"
                    placeholder="es. pizzeria@gmail.com"
                    value={settings.email.smtp.user}
                    onChange={(e) => handleSmtpChange('user', e.target.value.trim())}
                    className="w-full bg-[#101010] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 font-sans mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showSmtpPassword ? 'text' : 'password'}
                      placeholder="Password app o mailbox"
                      value={settings.email.smtp.password}
                      onChange={(e) => handleSmtpChange('password', e.target.value)}
                      className="w-full bg-[#101010] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono pr-7"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-2 top-2 text-stone-400 hover:text-white"
                    >
                      {showSmtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 space-y-2 mt-6">
            <button
              type="button"
              onClick={() => handleTestChannel('email')}
              disabled={testingChannel !== null}
              className="w-full py-2.5 px-3 rounded-xl bg-[#ffa323]/20 hover:bg-[#ffa323]/30 border border-[#ffa323]/40 text-[#ffa323] font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-40"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{testingChannel === 'email' ? 'Invio in corso...' : 'Invia Email di Prova'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM SUMMARY & ACTIONS                                     */}
      {/* ============================================================ */}
      <div className="bg-[#181818] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-stone-400 font-sans">
          <p>
            💡 I messaggi inviati tramite <b>"Invia di Prova"</b> utilizzano i parametri attualmente inseriti a schermo.
            Ricorda di cliccare <b>"Salva Impostazioni"</b> per salvare la configurazione per tutti gli ordini futuri.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#c23717] hover:to-[#f59e0b] text-white font-oswald text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d2401e]/30 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvataggio...' : 'Salva Impostazioni'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

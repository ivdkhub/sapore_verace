import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, PartyPopper, RefreshCw, Phone, MapPin, Clock } from 'lucide-react';
import { api } from '../../../services/api';

const ORDER_STATUS_LABELS = {
  nuovo: 'Nuovo',
  in_preparazione: 'In preparazione',
  in_consegna: 'In consegna',
  completato: 'Completato',
  annullato: 'Annullato',
};

const STATUS_COLORS = {
  nuovo: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  in_preparazione: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  in_consegna: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  completato: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  annullato: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  nuova: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  gestita: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
};

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

// Doppio segnale acustico per un nuovo ordine
const playOrderBeep = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [0, 0.25].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.2);
    });
  } catch {
    // audio non disponibile
  }
};

// Ordini online e richieste eventi ricevuti dal sito (aggiornati ogni 20 secondi)
export const AdminOrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const knownOrdersRef = useRef(null);

  const load = async () => {
    try {
      const res = await api.get('orders.php');
      const codes = new Set(res.orders.map((o) => o.orderId));
      if (knownOrdersRef.current && res.orders.some((o) => !knownOrdersRef.current.has(o.orderId))) {
        playOrderBeep();
      }
      knownOrdersRef.current = codes;
      setOrders(res.orders);
      setInquiries(res.inquiries);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // anche in background, così il segnale dei nuovi ordini arriva sempre
    const t = setInterval(load, 20000);
    const onVisible = () => !document.hidden && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const updateStatus = async (payload) => {
    try {
      await api.patch('orders.php', payload);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-oswald text-2xl font-bold text-white uppercase">Ordini online & richieste eventi</h2>
          <p className="text-xs text-stone-400">Ordini degli ultimi 3 giorni e richieste degli ultimi 30. Aggiornamento automatico.</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-oswald text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Aggiorna
        </button>
      </div>

      {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
      {isLoading && <p className="text-sm text-stone-400">Caricamento...</p>}

      <section>
        <h3 className="font-oswald text-lg text-[#ffa323] uppercase flex items-center gap-2 mb-3">
          <ShoppingBag className="w-5 h-5" /> Ordini ({orders.length})
        </h3>
        {!isLoading && orders.length === 0 && <p className="text-sm text-stone-500">Nessun ordine recente.</p>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => (
            <article key={o.orderId} className="bg-[#181818] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-[#ffa323]">{o.orderId}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status] || ''}`}>
                  {ORDER_STATUS_LABELS[o.status] || o.status}
                </span>
              </div>
              <p className="text-white font-semibold">
                {o.customer.fullName}{' '}
                <a href={`tel:${o.customer.phone}`} className="text-[#ffa323] text-sm inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {o.customer.phone}
                </a>
              </p>
              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {o.orderType === 'delivery' ? 'Domicilio' : 'Ritiro'} · {o.requestedTime === 'asap' ? 'prima possibile' : `ore ${o.requestedTime}`} · ricevuto {formatTime(o.createdAt)}
              </p>
              {o.orderType === 'delivery' && (
                <p className="text-xs text-stone-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {o.customer.address}, {o.customer.postalCode} {o.customer.city}
                </p>
              )}
              <ul className="text-sm text-stone-200 border-t border-white/10 pt-2">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.quantity}× {it.name}</span>
                    <span>€{it.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              {o.customer.notes && <p className="text-xs text-amber-200">Note: {o.customer.notes}</p>}
              <div className="flex items-center justify-between pt-1">
                <span className="font-oswald text-white">
                  Totale €{o.totalPrice.toFixed(2)} · {o.paymentMethod === 'card' ? 'Carta' : 'Contanti'}
                </span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus({ code: o.orderId, status: e.target.value })}
                  className="bg-[#101010] border border-white/15 rounded-lg px-2 py-1 text-xs text-white"
                  aria-label={`Stato ordine ${o.orderId}`}
                >
                  {Object.entries(ORDER_STATUS_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-oswald text-lg text-[#ffa323] uppercase flex items-center gap-2 mb-3">
          <PartyPopper className="w-5 h-5" /> Richieste eventi ({inquiries.length})
        </h3>
        {!isLoading && inquiries.length === 0 && <p className="text-sm text-stone-500">Nessuna richiesta recente.</p>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {inquiries.map((q) => (
            <article key={q.id} className="bg-[#181818] border border-white/10 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-semibold">{q.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[q.status] || ''}`}>
                  {q.status === 'gestita' ? 'Gestita' : 'Nuova'}
                </span>
              </div>
              <a href={`tel:${q.phone}`} className="text-[#ffa323] text-sm inline-flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {q.phone}
              </a>
              {q.email && <p className="text-xs text-stone-300">{q.email}</p>}
              <p className="text-xs text-stone-300">
                {q.eventType} · {q.guests} ospiti {q.date ? `· ${q.date}` : ''}
              </p>
              {q.notes && <p className="text-xs text-stone-400">{q.notes}</p>}
              <p className="text-[11px] text-stone-500">Ricevuta {formatTime(q.createdAt)}</p>
              {q.status !== 'gestita' && (
                <button
                  onClick={() => updateStatus({ inquiryId: q.id, status: 'gestita' })}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-oswald uppercase cursor-pointer"
                >
                  Segna come gestita
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

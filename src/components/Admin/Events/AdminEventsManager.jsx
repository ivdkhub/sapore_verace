import React, { useRef, useState } from 'react';
import {
  PartyPopper,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Upload,
  CheckCircle2,
  Calendar,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useMenu } from '../../../context/MenuContext';
import { getTodayDateString } from '../../../context/AdminContext';
import { EVENT_CATEGORIES, EVENT_IMAGES } from '../../../data/eventsData';
import { api } from '../../../services/api';
import { compressImage } from '../../../utils/image';

const EMPTY_FORM = {
  title: '',
  category: 'degustazioni',
  categoryLabel: '',
  date: '',
  time: '',
  price: '',
  image: EVENT_IMAGES[0],
  shortDesc: '',
  fullDesc: '',
  highlights: '',
  active: true,
  endDate: '',
};

const inputClass =
  'w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] transition-colors';
const labelClass = 'block text-xs font-oswald uppercase text-white/70 mb-1.5 font-bold tracking-wider';

// Stato di un evento come lo vede il cliente
const eventStatus = (ev, today) => {
  if (ev.active === false) return { label: 'Nascosto', className: 'bg-white/10 text-white/60 border-white/15' };
  if (ev.endDate && ev.endDate < today) return { label: 'Scaduto', className: 'bg-rose-500/15 text-rose-300 border-rose-500/40' };
  return { label: 'Visibile sul sito', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' };
};

// Scheda admin: aggiunta, modifica, eliminazione e ordine degli eventi e serate a tema
export const AdminEventsManager = () => {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    toggleEventActive,
    moveEvent,
    resetEventsToDefault,
    toastMessage,
  } = useMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef(null);

  const today = getTodayDateString();
  const visibleCount = events.filter((ev) => eventStatus(ev, today).label === 'Visibile sul sito').length;

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMessage('');
    setUploadStatus('');
    setIsModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      ...EMPTY_FORM,
      ...ev,
      highlights: (ev.highlights || []).join('\n'),
      // etichetta uguale a quella della categoria: lasciata vuota, così segue il cambio di categoria
      categoryLabel: EVENT_CATEGORIES.some((c) => c.label === ev.categoryLabel) ? '' : ev.categoryLabel || '',
      active: ev.active !== false,
      endDate: ev.endDate || '',
    });
    setErrorMessage('');
    setUploadStatus('');
    setIsModalOpen(true);
  };

  const handleUpload = async (original) => {
    if (!original) return;
    if (!original.type.startsWith('image/')) {
      setErrorMessage("Il file scelto non è un'immagine (usa JPG, PNG o WEBP).");
      return;
    }
    setErrorMessage('');
    setUploadStatus(`Caricamento di ${original.name}...`);
    try {
      const file = await compressImage(original);
      if (file.size > 5 * 1024 * 1024) throw new Error("l'immagine supera 5 MB");
      const { url } = await api.upload('upload.php', file);
      setForm((prev) => ({ ...prev, image: url }));
      setUploadStatus(`Caricata: ${original.name}`);
    } catch (err) {
      setUploadStatus('');
      setErrorMessage(`Caricamento immagine non riuscito: ${err.message}`);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrorMessage("Inserisci il titolo dell'evento.");
      return;
    }
    if (!form.shortDesc.trim()) {
      setErrorMessage('Inserisci una breve descrizione (si vede nella scheda dell’evento).');
      return;
    }
    if (editingId) updateEvent(editingId, form);
    else addEvent(form);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl font-oswald text-xs tracking-wider uppercase font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 border ${
            toastMessage.type === 'delete'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/50'
              : toastMessage.type === 'warning'
              ? 'bg-amber-500 text-black border-amber-300'
              : 'bg-[#10b981] text-black border-emerald-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Intestazione */}
      <div className="bg-[#181818] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-bold">
            SEZIONE "EVENTI & SERATE A TEMA" DEL SITO
          </span>
          <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide flex items-center gap-2">
            <PartyPopper className="w-7 h-7 text-[#ffa323]" />
            <span>Eventi</span>
            <span className="text-sm font-sans font-normal text-white/50">
              ({visibleCount} visibili su {events.length})
            </span>
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Le modifiche compaiono subito sul sito. Un evento nascosto o scaduto resta qui ma i clienti non lo vedono.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-oswald text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-2 border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ripristina iniziali</span>
          </button>
          <button
            onClick={openNew}
            className="px-5 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white font-oswald text-xs sm:text-sm font-black tracking-wider uppercase rounded-xl flex items-center gap-2 shadow-lg shadow-[#d2401e]/30 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo evento</span>
          </button>
        </div>
      </div>

      {/* Elenco eventi */}
      {events.length === 0 ? (
        <div className="bg-[#181818] border border-dashed border-white/15 rounded-3xl p-10 text-center text-white/60 font-sans text-sm">
          Nessun evento. Sul sito compare un invito a richiedere un evento su misura.
          <div className="mt-4">
            <button onClick={openNew} className="text-[#ffa323] font-oswald uppercase tracking-wider text-xs font-bold hover:underline cursor-pointer">
              + Aggiungi il primo evento
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((ev, idx) => {
            const status = eventStatus(ev, today);
            return (
              <div
                key={ev.id}
                className={`bg-[#181818] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-xl ${
                  status.label === 'Visibile sul sito' ? '' : 'opacity-70'
                }`}
              >
                <div className="relative aspect-[16/9] bg-black/60">
                  <img src={ev.image} alt={ev.title} loading="lazy" className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-oswald uppercase tracking-wider font-bold border ${status.className}`}>
                    {status.label}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-[#ffa323] text-[10px] font-oswald uppercase tracking-wider font-bold border border-[#ffa323]/40">
                    {ev.categoryLabel}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-oswald text-lg font-black text-white uppercase leading-tight">{ev.title}</h3>
                  <div className="flex flex-wrap gap-3 text-[11px] text-white/60 font-oswald uppercase tracking-wider mt-1.5">
                    {ev.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#ffa323]" /> {ev.date}
                      </span>
                    )}
                    {ev.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ffa323]" /> {ev.time}
                      </span>
                    )}
                    {ev.price && <span className="text-[#ffa323]">{ev.price}</span>}
                  </div>
                  {ev.endDate && (
                    <p className="text-[11px] text-white/40 font-sans mt-1">
                      Visibile fino al {ev.endDate.split('-').reverse().join('/')}
                    </p>
                  )}
                  <p className="text-xs text-stone-300 font-sans mt-2 line-clamp-2 flex-1">{ev.shortDesc}</p>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveEvent(ev.id, -1)}
                        disabled={idx === 0}
                        title="Sposta prima"
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveEvent(ev.id, 1)}
                        disabled={idx === events.length - 1}
                        title="Sposta dopo"
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleEventActive(ev.id)}
                        title={ev.active === false ? 'Mostra sul sito' : 'Nascondi dal sito'}
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        {ev.active === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => duplicateEvent(ev.id)}
                        title="Duplica"
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(ev)}
                        title="Modifica"
                        className="p-2 rounded-lg text-[#ffa323] hover:bg-[#ffa323]/15 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEventToDelete(ev)}
                        title="Elimina"
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conferma eliminazione */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="font-oswald text-xl font-black uppercase text-white">Eliminare l'evento?</h3>
            <p className="text-sm text-white/70 font-sans mt-2">
              "{eventToDelete.title}" verrà tolto dal sito e dall'elenco. Se vuoi solo nasconderlo per un po', usa l'icona con l'occhio.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setEventToDelete(null)}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-oswald text-xs font-bold uppercase tracking-wider border border-white/10 cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  deleteEvent(eventToDelete.id);
                  setEventToDelete(null);
                }}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-oswald text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conferma ripristino */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
            <RotateCcw className="w-10 h-10 text-[#ffa323] mx-auto mb-3" />
            <h3 className="font-oswald text-xl font-black uppercase text-white">Ripristinare gli eventi iniziali?</h3>
            <p className="text-sm text-white/70 font-sans mt-2">
              Tutti gli eventi attuali verranno sostituiti con i 9 eventi di esempio del sito.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setConfirmReset(false)}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-oswald text-xs font-bold uppercase tracking-wider border border-white/10 cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  resetEventsToDefault();
                  setConfirmReset(false);
                }}
                className="py-3 rounded-xl bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Ripristina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale aggiunta / modifica */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="relative w-full max-w-3xl bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl space-y-5"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-oswald text-2xl font-black uppercase text-white">
              {editingId ? 'Modifica evento' : 'Nuovo evento'}
            </h3>

            {errorMessage && (
              <div className="px-4 py-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm font-sans">{errorMessage}</div>
            )}

            <div>
              <label className={labelClass}>Titolo *</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="es. Serata Pizza & Vini del Vesuvio" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Categoria (filtro sul sito)</label>
                <select value={form.category} onChange={set('category')} className={inputClass}>
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Etichetta sulla foto (facoltativa)</label>
                <input
                  type="text"
                  value={form.categoryLabel}
                  onChange={set('categoryLabel')}
                  placeholder={EVENT_CATEGORIES.find((c) => c.id === form.category)?.label}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Quando</label>
                <input type="text" value={form.date} onChange={set('date')} placeholder="es. Tutti i mercoledì / 31 ottobre" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Orario</label>
                <input type="text" value={form.time} onChange={set('time')} placeholder="es. 20:30" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Prezzo</label>
                <input type="text" value={form.price} onChange={set('price')} placeholder="es. 28 € a persona" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Foto</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <img src={form.image} alt="" className="w-full sm:w-48 aspect-[16/10] object-cover rounded-xl border border-white/10 bg-black/50" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {EVENT_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img}
                        onClick={() => setForm((prev) => ({ ...prev, image: img }))}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 cursor-pointer ${form.image === img ? 'border-[#ffa323]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-oswald text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#ffa323]" />
                    <span>Carica una foto dal PC o dal telefono</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      handleUpload(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                  {uploadStatus && <p className="text-xs text-white/60 font-sans">{uploadStatus}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Breve descrizione * (scheda dell'evento)</label>
              <textarea rows={2} value={form.shortDesc} onChange={set('shortDesc')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Descrizione completa (finestra di dettaglio)</label>
              <textarea rows={4} value={form.fullDesc} onChange={set('fullDesc')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Punti forti (uno per riga)</label>
              <textarea
                rows={4}
                value={form.highlights}
                onChange={set('highlights')}
                placeholder={'Musica dal vivo\nMenù alla carta\nPrenotazione consigliata'}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className={labelClass}>Visibile fino al (facoltativo)</label>
                <input type="date" value={form.endDate} min={editingId ? undefined : today} onChange={set('endDate')} className={inputClass} />
                <p className="text-[11px] text-white/40 font-sans mt-1">Per gli eventi con una data precisa: il giorno dopo sparisce da solo dal sito.</p>
              </div>
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/15 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={set('active')} className="w-5 h-5 accent-[#10b981] cursor-pointer" />
                <span className="font-oswald text-xs uppercase tracking-wider text-white font-bold">Visibile sul sito</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-oswald text-xs font-bold uppercase tracking-wider border border-white/10 cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="py-3.5 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white font-oswald text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer"
              >
                {editingId ? 'Salva modifiche' : 'Aggiungi evento'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

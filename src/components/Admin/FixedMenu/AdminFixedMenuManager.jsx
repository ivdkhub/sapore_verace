import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Save, RotateCcw, Eye, EyeOff, Undo2, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { useMenu } from '../../../context/MenuContext';
import { DEFAULT_FIXED_MENU, FIXED_MENU_ICONS } from '../../../data/fixedMenuData';

// Copia profonda: la bozza dell'editor non deve toccare i dati pubblicati finché non si salva
const clone = (v) => JSON.parse(JSON.stringify(v));

// Stile dei campi senza larghezza (per le righe in flex) e versione a tutta larghezza
const inputBase =
  'min-w-0 bg-[#0f0f0f] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ffa323] transition-colors';
const inputCls = `w-full ${inputBase}`;
const labelCls = 'block text-[11px] font-oswald uppercase text-white/60 mb-1 font-bold tracking-wider';

const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className={labelCls}>{label}</span>
    {children}
  </label>
);

const IconButton = ({ onClick, title, disabled, danger, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    disabled={disabled}
    className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-25 disabled:cursor-default ${
      danger ? 'text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10' : 'text-white/50 hover:text-white hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

// Sposta l'elemento i di delta posizioni (restituisce un nuovo array)
const move = (list, i, delta) => {
  const to = i + delta;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[i], next[to]] = [next[to], next[i]];
  return next;
};

export const AdminFixedMenuManager = () => {
  const { fixedMenu, saveFixedMenu, isMenuLoaded, toastMessage } = useMenu();
  // Dati pubblicati completati con i valori predefiniti: un campo mancante non deve bloccare l'editor
  const published = fixedMenu
    ? {
        ...DEFAULT_FIXED_MENU,
        ...fixedMenu,
        features: DEFAULT_FIXED_MENU.features.map((f, i) => ({ title: '', desc: '', ...(fixedMenu.features?.[i] || {}) })),
        sections: (fixedMenu.sections || []).map((s, i) => ({
          id: s.id || `sez_${i}`,
          label: s.label || '',
          icon: s.icon || 'utensils',
          items: (s.items || []).map((it) => ({ name: it?.name || '', desc: it?.desc || '', tag: it?.tag || '' })),
        })),
      }
    : DEFAULT_FIXED_MENU;
  const [draft, setDraft] = useState(() => clone(published));
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dati arrivati dal server (o appena salvati): la bozza si allinea se non ci sono modifiche in corso
  useEffect(() => {
    if (!isDirty) setDraft(clone(published));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedMenu, isMenuLoaded]);

  const update = (patch) => {
    setDraft((d) => ({ ...d, ...patch }));
    setIsDirty(true);
  };
  const updateFeature = (i, patch) => update({ features: draft.features.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
  const updateSection = (si, patch) => update({ sections: draft.sections.map((s, j) => (j === si ? { ...s, ...patch } : s)) });
  const updateItem = (si, ii, patch) =>
    updateSection(si, { items: draft.sections[si].items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) });

  const addSection = () =>
    update({ sections: [...draft.sections, { id: `sez_${Date.now()}`, label: 'Nuova categoria', icon: 'utensils', items: [] }] });
  const removeSection = (si) => {
    const s = draft.sections[si];
    if (!window.confirm(`Eliminare la categoria "${s.label}" con i suoi ${s.items.length} piatti?`)) return;
    update({ sections: draft.sections.filter((_, j) => j !== si) });
  };
  const addItem = (si) => updateSection(si, { items: [...draft.sections[si].items, { name: '', desc: '', tag: '' }] });
  const removeItem = (si, ii) => updateSection(si, { items: draft.sections[si].items.filter((_, j) => j !== ii) });

  const handleSave = async () => {
    // Piatti senza nome scartati, testi ripuliti dagli spazi in eccesso
    const sections = draft.sections
      .map((s) => ({
        ...s,
        label: s.label.trim(),
        items: s.items
          .filter((it) => it.name.trim())
          .map((it) => ({ name: it.name.trim(), desc: it.desc.trim(), tag: it.tag.trim().toUpperCase() })),
      }))
      .filter((s) => s.label);
    if (sections.length === 0) return alert('Serve almeno una categoria con un nome.');
    if (!draft.title.trim()) return alert('Inserisci il titolo del menù fisso.');
    const price = Number(String(draft.price).replace(',', '.'));
    if (!(price > 0) || price > 999) return alert('Inserisci un prezzo valido (es. 14 oppure 14,50).');

    setIsSaving(true);
    const value = { ...draft, price, sections };
    const ok = await saveFixedMenu(value);
    setIsSaving(false);
    if (ok) {
      setDraft(clone(value));
      setIsDirty(false);
    }
  };

  const handleDiscard = () => {
    setDraft(clone(published));
    setIsDirty(false);
  };

  const handleRestoreOriginal = async () => {
    if (!window.confirm('Ripristinare il menù fisso originale? Le tue modifiche verranno perse e il sito tornerà ai testi iniziali tradotti in 4 lingue.')) return;
    const ok = await saveFixedMenu(null);
    if (ok) {
      setDraft(clone(DEFAULT_FIXED_MENU));
      setIsDirty(false);
    }
  };

  const isVisible = draft.active !== false;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Esito del salvataggio (stesso stile delle altre schede) */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl font-oswald text-xs tracking-wider uppercase font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 border ${
            toastMessage.type === 'delete' ? 'bg-rose-950/90 text-rose-200 border-rose-500/50' : 'bg-[#10b981] text-black border-emerald-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* INTESTAZIONE */}
      <div className="bg-[#181818] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-oswald text-[#ffa323] tracking-[0.2em] uppercase font-bold block mb-1">
            SEZIONE «MENÙ FISSO» DEL SITO
          </span>
          <h2 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white tracking-wide flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-[#d2401e]" /> Menù Fisso
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1 max-w-2xl">
            {fixedMenu
              ? 'Versione personalizzata: i testi che scrivi qui sono mostrati uguali in tutte le lingue del sito.'
              : 'Ora il sito mostra il menù originale, tradotto automaticamente in 4 lingue. Dopo il primo salvataggio verrà mostrato il tuo testo, uguale in tutte le lingue.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => update({ active: !isVisible })}
            className={`px-4 py-2.5 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border transition-all ${
              isVisible
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
            }`}
            title="Mostra o nascondi la sezione sul sito (ricorda di salvare)"
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isVisible ? 'Visibile sul sito' : 'Nascosto dal sito'}
          </button>
          {fixedMenu && (
            <button
              type="button"
              onClick={handleRestoreOriginal}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-oswald text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Ripristina originale
            </button>
          )}
        </div>
      </div>

      {/* TESTI E PREZZO */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#181818] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="font-oswald text-lg font-bold uppercase text-white">Titolo e presentazione</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Titolo *">
              <input className={inputCls} value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="MENÙ FISSO" />
            </Field>
            <Field label="Sottotitolo (in colore)">
              <input className={inputCls} value={draft.subtitle} onChange={(e) => update({ subtitle: e.target.value })} placeholder="PRANZO LAVORO" />
            </Field>
          </div>
          <Field label="Giorni e orari (etichetta in alto)">
            <input className={inputCls} value={draft.tag} onChange={(e) => update({ tag: e.target.value })} placeholder="DAL LUNEDÌ AL VENERDÌ • ORE 12:00 – 14:30" />
          </Field>
          <Field label="Nastro nell'angolo">
            <input className={inputCls} value={draft.ribbon} onChange={(e) => update({ ribbon: e.target.value })} placeholder="FORMULA BUSINESS LUNCH" />
          </Field>
          <Field label="Descrizione">
            <textarea rows={3} className={`${inputCls} resize-y`} value={draft.desc} onChange={(e) => update({ desc: e.target.value })} />
          </Field>
          <Field label="Nota in fondo al menù">
            <input className={inputCls} value={draft.bottomNote} onChange={(e) => update({ bottomNote: e.target.value })} placeholder="Formula valida solo a pranzo…" />
          </Field>
        </div>

        <div className="bg-[#181818] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="font-oswald text-lg font-bold uppercase text-white">Prezzo e punti di forza</h3>
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
            <Field label="Prezzo (€) *">
              <input
                type="number"
                min="0"
                step="0.5"
                className={`${inputCls} font-bold text-lg`}
                value={draft.price}
                onChange={(e) => update({ price: e.target.value })}
              />
            </Field>
            <Field label="Cosa è compreso (sotto il prezzo)">
              <input className={inputCls} value={draft.priceNote} onChange={(e) => update({ priceNote: e.target.value })} />
            </Field>
          </div>
          {draft.features.map((f, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
              <Field label={`Punto di forza ${i + 1} · titolo`}>
                <input className={inputCls} value={f.title} onChange={(e) => updateFeature(i, { title: e.target.value })} />
              </Field>
              <Field label="Descrizione">
                <input className={inputCls} value={f.desc} onChange={(e) => updateFeature(i, { desc: e.target.value })} />
              </Field>
            </div>
          ))}
          <p className="text-[11px] text-white/40 font-sans">Lascia vuoti titolo e descrizione per non mostrare un punto di forza.</p>
        </div>
      </div>

      {/* CATEGORIE E PIATTI */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-oswald text-xl font-bold uppercase text-white">
          Categorie e piatti <span className="text-sm text-white/40 font-sans normal-case">({draft.sections.length} categorie)</span>
        </h3>
        <button
          type="button"
          onClick={addSection}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-oswald font-bold uppercase rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Aggiungi categoria
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {draft.sections.map((s, si) => (
          <div key={s.id || si} className="bg-[#181818] p-5 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-end gap-2">
              <Field label={`Categoria ${si + 1} · nome della scheda`} className="flex-1">
                <input className={`${inputCls} font-bold`} value={s.label} onChange={(e) => updateSection(si, { label: e.target.value })} />
              </Field>
              <Field label="Icona" className="w-44 shrink-0">
                <select className={inputCls} value={s.icon} onChange={(e) => updateSection(si, { icon: e.target.value })}>
                  {FIXED_MENU_ICONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-center pb-1">
                <IconButton title="Sposta la categoria prima" disabled={si === 0} onClick={() => update({ sections: move(draft.sections, si, -1) })}>
                  <ChevronUp className="w-4 h-4" />
                </IconButton>
                <IconButton
                  title="Sposta la categoria dopo"
                  disabled={si === draft.sections.length - 1}
                  onClick={() => update({ sections: move(draft.sections, si, 1) })}
                >
                  <ChevronDown className="w-4 h-4" />
                </IconButton>
                <IconButton title="Elimina la categoria" danger onClick={() => removeSection(si)}>
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            <div className="space-y-2">
              {s.items.map((it, ii) => (
                <div key={ii} className="bg-[#111] border border-white/5 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      className={`${inputBase} flex-1 font-semibold`}
                      value={it.name}
                      onChange={(e) => updateItem(si, ii, { name: e.target.value })}
                      placeholder="Nome del piatto"
                      aria-label="Nome del piatto"
                    />
                    <input
                      className={`${inputBase} w-28 sm:w-32 shrink-0 uppercase text-xs`}
                      value={it.tag}
                      onChange={(e) => updateItem(si, ii, { tag: e.target.value })}
                      placeholder="Etichetta"
                      aria-label="Etichetta (es. MARE)"
                    />
                    <div className="flex items-center shrink-0">
                      <IconButton title="Sposta su" disabled={ii === 0} onClick={() => updateSection(si, { items: move(s.items, ii, -1) })}>
                        <ChevronUp className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        title="Sposta giù"
                        disabled={ii === s.items.length - 1}
                        onClick={() => updateSection(si, { items: move(s.items, ii, 1) })}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </IconButton>
                      <IconButton title="Elimina il piatto" danger onClick={() => removeItem(si, ii)}>
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </div>
                  <input
                    className={`${inputCls} text-xs`}
                    value={it.desc}
                    onChange={(e) => updateItem(si, ii, { desc: e.target.value })}
                    placeholder="Descrizione / ingredienti"
                    aria-label="Descrizione"
                  />
                </div>
              ))}
              {s.items.length === 0 && <p className="text-xs text-white/40 font-sans">Nessun piatto in questa categoria.</p>}
            </div>

            <button
              type="button"
              onClick={() => addItem(si)}
              className="w-full py-2 rounded-xl border border-dashed border-white/15 hover:border-[#ffa323]/60 text-white/60 hover:text-[#ffa323] text-xs font-oswald font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Aggiungi piatto
            </button>
          </div>
        ))}
      </div>

      {/* BARRA DI SALVATAGGIO */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors ${
          isDirty ? 'bg-[#1d1206]/95 border-[#ffa323]/40' : 'bg-[#121212]/90 border-white/10'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className={`text-sm font-sans ${isDirty ? 'text-[#ffa323] font-semibold' : 'text-white/50'}`}>
            {isDirty ? '● Modifiche non ancora pubblicate sul sito' : '✓ Tutto salvato'}
          </span>
          <div className="flex items-center gap-2">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-oswald font-bold uppercase rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" /> Annulla modifiche
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#e68e17] text-white text-xs font-oswald font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-[#d2401e]/30 cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Salvataggio…' : 'Salva e pubblica'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFixedMenuManager;

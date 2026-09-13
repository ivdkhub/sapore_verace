import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, AlertCircle, Check, Trash2, RefreshCw } from 'lucide-react';
import { parseNumericPrice, formatPriceString } from '../../../context/MenuContext';

const PRESET_IMAGES = [
  { label: 'Pizza Margherita / Classica 1', url: '/images/menu_pizza_1.png', type: 'pizza' },
  { label: 'Pizza 4 Formaggi / Wurstel 2', url: '/images/menu_pizza_2.png', type: 'pizza' },
  { label: 'Pizza Diavola / Gourmet 3', url: '/images/menu_pizza_3.png', type: 'pizza' },
  { label: 'Pizza Tradizione / Napoli 4', url: '/images/menu_pizza_4.png', type: 'pizza' },
  { label: 'Pizza Salsiccia / Patatine 5', url: '/images/menu_pizza_5.png', type: 'pizza' },
  { label: 'Pizza Gourmet Nera / Speciale 6', url: '/images/menu_pizza_6.png', type: 'pizza' },
  { label: 'Cuoppo Fritti di Terra', url: '/images/cucina_cuoppo.jpg', type: 'cucina' },
  { label: 'Frittura di Pesce & Calamari', url: '/images/cucina_frittura.jpg', type: 'cucina' },
  { label: 'Tagliere Crudo & Scialatielli', url: '/images/cucina_scialatielli.jpg', type: 'cucina' },
  { label: 'Gnocchi alla Sorrentina', url: '/images/cucina_gnocchi.jpg', type: 'cucina' },
  { label: 'Polpette al Ragù Napoletano', url: '/images/cucina_polpette.jpg', type: 'cucina' },
  { label: 'Coca-Cola 33cl', url: '/images/cocacola.png', type: 'bevande' },
  { label: 'Birra Moretti 66cl', url: '/images/moretti.png', type: 'bevande' },
  { label: 'Vino Bianco della Casa', url: '/images/vinobianco.png', type: 'bevande' },
  { label: 'Vino Rosso della Casa', url: '/images/vinorosso.png', type: 'bevande' },
];

const SUGGESTED_BADGES = [
  'DOCG',
  'DOP',
  'TOP SELLER',
  'PICCANTE',
  'VEG',
  'FRITTA',
  'CALZONE',
  'SPECIALITÀ',
  'NOVITÀ',
  'TRADIZIONE',
  'CANTINA',
  'BIBITA 33CL',
  'BIRRA 66CL',
];

export const ProductEditModal = ({ isOpen, onClose, productToEdit, onSave }) => {
  const fileInputRef = useRef(null);
  const isEditing = Boolean(productToEdit && productToEdit.id);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('classiche');
  const [priceInput, setPriceInput] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('/images/menu_pizza_1.png');
  const [imageFileName, setImageFileName] = useState('');
  const [available, setAvailable] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setName(productToEdit.name || '');
        setCategory(productToEdit.category || 'classiche');
        setPriceInput(productToEdit.numericPrice !== undefined ? String(productToEdit.numericPrice) : String(parseNumericPrice(productToEdit.price)));
        setIngredients(productToEdit.ingredients || '');
        setBadge(productToEdit.badge || '');
        setImage(productToEdit.image || '/images/menu_pizza_1.png');
        setImageFileName(productToEdit.image?.startsWith('data:') ? 'Foto personalizzata caricata' : '');
        setAvailable(productToEdit.available !== false);
      } else {
        // Reset for new item
        setName('');
        setCategory('classiche');
        setPriceInput('9.00');
        setIngredients('');
        setBadge('');
        setImage('/images/menu_pizza_1.png');
        setImageFileName('');
        setAvailable(true);
      }
      setErrorMessage('');
      setShowPresets(false);
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  // Handle local PC file selection and convert to Base64
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Il file selezionato non è un\'immagine valida (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('L\'immagine è troppo grande (max 8MB). Scegli una foto più leggera.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setImageFileName(file.name);
    };
    reader.onerror = () => {
      setErrorMessage('Errore durante la lettura del file dal PC.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Inserisci il nome del piatto o prodotto.');
      return;
    }

    const numericPrice = parseNumericPrice(priceInput);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMessage('Inserisci un prezzo valido in Euro (es. 8.50).');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      price: formatPriceString(numericPrice),
      numericPrice,
      ingredients: ingredients.trim(),
      badge: badge.trim() || null,
      image: image || '/images/menu_pizza_1.png',
      available,
    };

    if (isEditing) {
      onSave(productToEdit.id, payload);
    } else {
      onSave(null, payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-3xl bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-white/10 rounded-full"
          aria-label="Chiudi"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-white/10">
          <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-bold">
            {isEditing ? 'MODIFICA SCHEDA PRODOTTO' : 'NUOVO INSERIMENTO NEL MENÙ'}
          </span>
          <h2 className="font-oswald text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            {isEditing ? `Modifica: ${productToEdit.name}` : 'Aggiungi Nuovo Piatto o Bevanda'}
          </h2>
          <p className="text-xs text-stone-300 font-sans mt-0.5">
            Tutte le modifiche salvate appariranno istantaneamente nel menù pubblico del sito e nel carrello.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ============================================================ */}
          {/* SECTION 1: PHOTO UPLOADER (FROM PC OR PRESETS)               */}
          {/* ============================================================ */}
          <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
            <label className="block text-xs font-oswald tracking-[0.2em] text-[#ffa323] uppercase font-bold mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#ffa323]" />
                Foto del Prodotto (Carica dal tuo PC o scegli un'immagine)
              </span>
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-xs font-oswald text-white/70 hover:text-white uppercase tracking-wider underline cursor-pointer"
              >
                {showPresets ? 'Chiudi Galleria Preset' : 'Sfoglia Preset'}
              </button>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Preview Avatar Box */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-[#181818] rounded-2xl border border-white/10">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#ffa323]/50 shadow-xl bg-black/50 flex items-center justify-center relative group">
                  {image ? (
                    <img
                      src={image}
                      alt="Anteprima Prodotto"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-white/20" />
                  )}
                </div>
                <span className="text-[11px] font-oswald text-white/60 tracking-wider mt-2 uppercase text-center truncate max-w-full px-2">
                  {imageFileName || 'Anteprima Live'}
                </span>
              </div>

              {/* PC Upload Drag & Drop Area */}
              <div className="sm:col-span-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isDragOver
                      ? 'border-[#ffa323] bg-[#ffa323]/10 scale-[1.01]'
                      : 'border-white/20 hover:border-[#ffa323]/60 bg-[#161616] hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#ffa323]/10 text-[#ffa323] flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="font-oswald text-sm font-bold text-white uppercase tracking-wider">
                    Clicca qui per caricare una foto dal tuo PC
                  </p>
                  <p className="text-xs text-white/50 font-sans mt-1">
                    oppure trascina e rilascia il file qui (PNG, JPG, WEBP fino a 8MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Collapsible Preset Gallery */}
            {showPresets && (
              <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-200">
                <span className="text-[11px] font-oswald tracking-widest text-white/60 uppercase block mb-2.5">
                  OPPURE SELEZIONA DA QUESTE IMMAGINI PRONTE:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImage(preset.url);
                        setImageFileName(preset.label);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                        image === preset.url
                          ? 'border-[#ffa323] bg-[#ffa323]/15 shadow-md shadow-[#ffa323]/20'
                          : 'border-white/10 bg-[#161616] hover:border-white/30'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-12 object-contain rounded-lg mb-1"
                      />
                      <span className="text-[10px] font-oswald text-white/70 line-clamp-1">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: PRODUCT DATA FIELDS                               */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-oswald tracking-wider text-white/80 uppercase font-semibold mb-1.5">
                Nome del Piatto / Prodotto <span className="text-[#d2401e]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="es. Pizza Regina Margherita"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-oswald tracking-wider text-white/80 uppercase font-semibold mb-1.5">
                Categoria nel Menù <span className="text-[#d2401e]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-sans focus:border-[#ffa323] outline-none transition-colors cursor-pointer"
              >
                <option value="classiche">🍕 Pizze Classiche (Forno a Legna)</option>
                <option value="gourmet">⭐ Le Veraci Gourmet</option>
                <option value="ripieni">🥟 I Ripieni & Panuozzi</option>
                <option value="cucina">🥘 Dalla Cucina & Fritti</option>
                <option value="bevande">🍺 Bevande, Birre & Vini</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price Input */}
            <div>
              <label className="block text-xs font-oswald tracking-wider text-white/80 uppercase font-semibold mb-1.5">
                Prezzo al Pubblico (€) <span className="text-[#d2401e]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="es. 9.50"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 rounded-xl pl-4 pr-12 py-3 text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-oswald font-bold text-white/50">
                  €
                </span>
              </div>
            </div>

            {/* Badge / Special Tag */}
            <div>
              <label className="block text-xs font-oswald tracking-wider text-white/80 uppercase font-semibold mb-1.5">
                Badge / Etichetta Speciale (Opzionale)
              </label>
              <input
                type="text"
                placeholder="es. DOCG, TOP SELLER, PICCANTE..."
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors uppercase"
              />
            </div>
          </div>

          {/* Quick Badge Chips */}
          <div className="flex flex-wrap items-center gap-1.5 -mt-2">
            <span className="text-[10px] font-oswald text-white/40 uppercase mr-1">Suggeriti:</span>
            {SUGGESTED_BADGES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setBadge(chip)}
                className={`text-[10px] font-oswald px-2 py-0.5 rounded transition-colors uppercase cursor-pointer ${
                  badge === chip
                    ? 'bg-[#ffa323] text-black font-bold'
                    : 'bg-white/5 hover:bg-white/15 text-white/60 hover:text-white'
                }`}
              >
                {chip}
              </button>
            ))}
            {badge && (
              <button
                type="button"
                onClick={() => setBadge('')}
                className="text-[10px] font-oswald text-rose-400 hover:text-rose-300 ml-1 underline cursor-pointer"
              >
                Rimuovi
              </button>
            )}
          </div>

          {/* Ingredients / Description */}
          <div>
            <label className="block text-xs font-oswald tracking-wider text-white/80 uppercase font-semibold mb-1.5">
              Ingredienti & Descrizione del Piatto
            </label>
            <textarea
              rows={3}
              placeholder="es. Pomodoro San Marzano dell'Agro Sarnese Nocerino, fiordilatte del Matese, basilico fresco e olio extravergine d'oliva."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-sans placeholder-white/30 focus:border-[#ffa323] outline-none transition-colors resize-none"
            />
          </div>

          {/* Availability Toggle Switch */}
          <div className="bg-[#121212] border border-white/15 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-oswald text-xs uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${available ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                Stato Disponibilità nel Menù
              </h5>
              <p className="text-[11px] text-white/60 font-sans mt-0.5">
                {available
                  ? 'Il prodotto è ATTIVO e ordinabile dai clienti.'
                  : 'Il prodotto è contrassegnato come INDISPONIBILE (Esaurito) e bloccato.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAvailable(!available)}
              className={`px-4 py-2.5 rounded-xl font-oswald text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                available
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
                  : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 shadow-md shadow-rose-500/10'
              }`}
            >
              <span>{available ? '✓ DISPONIBILE' : '✕ INDISPONIBILE (ESAURITO)'}</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* MODAL ACTIONS                                                */}
          {/* ============================================================ */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-oswald text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
            >
              Annulla
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ff5722] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs tracking-[0.15em] uppercase font-bold shadow-lg shadow-[#d2401e]/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Salva Modifiche' : 'Aggiungi al Menù'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

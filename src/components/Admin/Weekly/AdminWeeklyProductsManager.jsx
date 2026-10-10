import React, { useState, useRef } from 'react';
import { useMenu } from '../../../context/MenuContext';
import { api } from '../../../services/api';
import {
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Flame,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Search,
  CheckCircle2,
  Tag,
  Star,
  ExternalLink,
} from 'lucide-react';
import { MoustacheIcon } from '../../common/Icons';

const PRESET_IMAGES = [
  { label: 'Pizza Margherita / Classica 1', url: '/images/hero_section_1.png' },
  { label: 'Pizza Gourmet Nera / Speciale 2', url: '/images/hero_section_2.png' },
  { label: 'Cuoppo Fritti di Terra', url: '/images/cucina_cuoppo.jpg' },
  { label: 'Frittura di Pesce & Calamari', url: '/images/cucina_frittura.jpg' },
  { label: 'Tagliere Crudo & Scialatielli', url: '/images/cucina_scialatielli.jpg' },
  { label: 'Gnocchi alla Sorrentina', url: '/images/cucina_gnocchi.jpg' },
  { label: 'Polpette al Ragù Napoletano', url: '/images/cucina_polpette.jpg' },
];

export const AdminWeeklyProductsManager = () => {
  const {
    weeklyProducts,
    menuItems,
    addWeeklyProduct,
    updateWeeklyProduct,
    deleteWeeklyProduct,
    resetWeeklyProductsToDefault,
    toastMessage,
  } = useMenu();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuPickerOpen, setIsMenuPickerOpen] = useState(false);
  const [menuPickerTargetIndex, setMenuPickerTargetIndex] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form states for Add/Edit Modal
  const fileInputRef = useRef(null);
  const [titlePrefix, setTitlePrefix] = useState('');
  const [titleHighlight, setTitleHighlight] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('PRODOTTO DELLA SETTIMANA');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('11.50');
  const [oldPrice, setOldPrice] = useState('13.50');
  const [image, setImage] = useState('/images/hero_section_1.png');
  const [floatingImage, setFloatingImage] = useState('/images/hero_section_2.png');
  const [errorMessage, setErrorMessage] = useState('');

  const openAddModal = () => {
    if (weeklyProducts.length >= 3) return;
    setEditingItem(null);
    setTitlePrefix('SPECIALE');
    setTitleHighlight('DELLA SETTIMANA');
    setSubtitle('PIZZERIA NAPOLETANA & PICCOLA CUCINA');
    setBadge('PRODOTTO DELLA SETTIMANA');
    setDesc('Piatto esclusivo preparato con materie prime d’eccellenza selezionate.');
    setPrice('12.00');
    setOldPrice('14.50');
    setImage('/images/hero_section_1.png');
    setFloatingImage('/images/hero_section_2.png');
    setErrorMessage('');
    setIsEditModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitlePrefix(item.titlePrefix || '');
    setTitleHighlight(item.titleHighlight || item.name || '');
    setSubtitle(item.subtitle || 'PIZZERIA NAPOLETANA & PICCOLA CUCINA');
    setBadge(item.badge || 'PRODOTTO DELLA SETTIMANA');
    setDesc(item.desc || '');
    setPrice(item.numericPrice ? String(item.numericPrice) : String(item.price || '').replace('€', '').trim());
    setOldPrice(item.oldPrice ? String(item.oldPrice).replace('€', '').trim() : '');
    setImage(item.image || '/images/hero_section_1.png');
    setFloatingImage(item.floatingImage || '/images/hero_section_2.png');
    setErrorMessage('');
    setIsEditModalOpen(true);
  };

  // 1-Click Set from Existing Menu Item
  const handleSelectFromMenu = (menuItem) => {
    const words = (menuItem.name || '').trim().split(' ');
    let prefix = '';
    let highlight = menuItem.name;
    if (words.length >= 2) {
      const mid = Math.ceil(words.length / 2);
      prefix = words.slice(0, mid).join(' ');
      highlight = words.slice(mid).join(' ');
    }

    const numeric = menuItem.numericPrice || 10.0;
    const oldNum = (numeric * 1.2).toFixed(2);

    const payload = {
      name: menuItem.name,
      titlePrefix: prefix.toUpperCase(),
      titleHighlight: highlight.toUpperCase(),
      subtitle: menuItem.category === 'cucina' ? 'DALLA CUCINA & SFIZI VERACI' : 'PIZZERIA NAPOLETANA & FORNO A LEGNA',
      badge: 'PRODOTTO DELLA SETTIMANA',
      desc: menuItem.ingredients || 'Specialità napoletana preparata artigianalmente.',
      price: menuItem.price,
      oldPrice: `${oldNum.replace('.', ',')} €`,
      numericPrice: numeric,
      image: menuItem.image || '/images/hero_section_1.png',
      floatingImage: '/images/hero_section_2.png',
    };

    if (menuPickerTargetIndex !== null && weeklyProducts[menuPickerTargetIndex]) {
      updateWeeklyProduct(weeklyProducts[menuPickerTargetIndex].id, payload);
    } else if (weeklyProducts.length < 3) {
      addWeeklyProduct(payload);
    }
    setIsMenuPickerOpen(false);
    setMenuPickerTargetIndex(null);
  };

  // Image upload from local PC
  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMessage('Seleziona un\'immagine valida.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('L\'immagine è troppo grande (max 5MB).');
      return;
    }
    // Caricata sul server: nei dati resta solo il percorso del file
    setErrorMessage('');
    api
      .upload('upload.php', file)
      .then(({ url }) => setImage(url))
      .catch((err) => setErrorMessage(`Caricamento immagine non riuscito: ${err.message}`));
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!titleHighlight.trim() && !titlePrefix.trim()) {
      setErrorMessage('Inserisci il titolo del prodotto.');
      return;
    }

    const payload = {
      titlePrefix: titlePrefix.trim(),
      titleHighlight: titleHighlight.trim(),
      name: `${titlePrefix} ${titleHighlight}`.trim(),
      subtitle: subtitle.trim() || 'PIZZERIA NAPOLETANA & PICCOLA CUCINA',
      badge: badge.trim() || 'PRODOTTO DELLA SETTIMANA',
      desc: desc.trim(),
      price: price,
      oldPrice: oldPrice.trim() || null,
      image,
      floatingImage,
    };

    if (editingItem) {
      updateWeeklyProduct(editingItem.id, payload);
    } else {
      addWeeklyProduct(payload);
    }
    setIsEditModalOpen(false);
  };

  const filteredMenuItems = menuItems.filter((i) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase().trim();
    return i.name.toLowerCase().includes(q) || (i.ingredients && i.ingredients.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl font-oswald text-xs tracking-wider uppercase font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 border ${
            toastMessage.type === 'delete'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/50'
              : 'bg-[#10b981] text-black border-emerald-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* HEADER BAR & CONTROLS                                        */}
      {/* ============================================================ */}
      <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-[#ffa323]" />
            <span className="text-xs font-oswald text-[#ffa323] uppercase tracking-[0.2em] font-bold">
              HERO SECTION SPOTLIGHT
            </span>
          </div>
          <h2 className="font-oswald text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            I Prodotti della Settimana (Max 3)
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-1 max-w-2xl">
            Personalizza fino a 3 piatti/pizze in evidenza nella parte superiore della homepage (Hero Section). 
            La foto manterrà automaticamente l'effetto di galleggiamento 3D con bagliore luminoso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Reset button */}
          <button
            onClick={resetWeeklyProductsToDefault}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-oswald text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
            title="Ripristina i 3 prodotti predefiniti di fabbrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ripristina Predefiniti</span>
          </button>

          {/* Add Weekly Product Button (max 3) */}
          <button
            onClick={openAddModal}
            disabled={weeklyProducts.length >= 3}
            className={`px-5 py-2.5 rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg ${
              weeklyProducts.length >= 3
                ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-[#d2401e] to-[#ff5722] hover:from-[#b83314] hover:to-[#d2401e] text-white shadow-[#d2401e]/30 cursor-pointer hover:scale-105'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Aggiungi Prodotto ({weeklyProducts.length}/3)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3 WEEKLY PRODUCT SLOTS GRID                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeklyProducts.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#181818] border border-white/15 hover:border-[#ffa323]/50 rounded-3xl p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
          >
            {/* Ambient subtle glow on card */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#d2401e]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar: Slot Badge & Action Icons */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white font-oswald text-[11px] font-black tracking-widest uppercase rounded-lg shadow-md flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-current text-white" />
                  SLOT {index + 1} DI 3
                </span>

                <span className="text-[10px] font-oswald text-[#ffa323] tracking-wider uppercase font-bold">
                  {item.badge || 'PRODOTTO DELLA SETTIMANA'}
                </span>
              </div>

              {/* Showcase Image with Floating Preview */}
              <div className="relative w-full aspect-video bg-[#121212] border border-white/10 rounded-2xl mb-5 flex items-center justify-center overflow-hidden p-3 shadow-inner">
                {item.image && (item.image.endsWith('.jpg') || item.image.endsWith('.jpeg') || item.image.endsWith('.webp')) ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl animate-float">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <img
                    src={item.image || '/images/hero_section_1.png'}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] animate-float"
                  />
                )}
                <span className="absolute bottom-2 right-2 text-[9px] font-oswald text-white/50 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  Effetto Floating 3D
                </span>
              </div>

              {/* Subtitle */}
              <div className="text-[11px] font-oswald text-white/50 tracking-widest uppercase mb-1">
                {item.subtitle || 'PIZZERIA NAPOLETANA & PICCOLA CUCINA'}
              </div>

              {/* Grand Headline */}
              <h3 className="font-oswald text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2 leading-tight">
                {item.titlePrefix && <span className="text-white">{item.titlePrefix} </span>}
                <span className="bg-gradient-to-r from-[#ff7a45] via-[#ffa323] to-[#d2401e] bg-clip-text text-transparent">
                  {item.titleHighlight}
                </span>
              </h3>

              {/* Price Row */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-oswald text-xl font-black text-[#d2401e]">
                  {item.price}
                </span>
                {item.oldPrice && (
                  <span className="font-oswald text-xs text-white/40 line-through">
                    {item.oldPrice}
                  </span>
                )}
                <span className="text-[10px] font-oswald bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold ml-1">
                  OFFERTA HERO
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-white/70 font-sans leading-relaxed line-clamp-3 mb-6">
                {item.desc}
              </p>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3.5 py-2 bg-[#ffa323]/10 hover:bg-[#ffa323] text-[#ffa323] hover:text-black rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Modifica</span>
                </button>

                {/* Quick Pick from Menu Button */}
                <button
                  onClick={() => {
                    setMenuPickerTargetIndex(index);
                    setPickerSearch('');
                    setIsMenuPickerOpen(true);
                  }}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer border border-white/5"
                  title="Scegli un piatto dal menù esistente"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ffa323]" />
                  <span>Da Menù</span>
                </button>
              </div>

              {/* Delete Button (keep at least 1) */}
              <button
                onClick={() => setItemToDelete(item)}
                disabled={weeklyProducts.length <= 1}
                className={`p-2 rounded-xl transition-colors ${
                  weeklyProducts.length <= 1
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 cursor-pointer'
                }`}
                title={weeklyProducts.length <= 1 ? 'Devi mantenere almeno 1 prodotto' : 'Rimuovi questo slot'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty Slot Card placeholder if less than 3 */}
        {weeklyProducts.length < 3 && (
          <div
            onClick={openAddModal}
            className="border-2 border-dashed border-white/20 hover:border-[#ffa323] bg-[#181818]/40 hover:bg-[#181818] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[360px] group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-[#ffa323]/20 flex items-center justify-center text-white/40 group-hover:text-[#ffa323] transition-all mb-4 group-hover:scale-110">
              <Plus className="w-8 h-8" />
            </div>
            <h4 className="font-oswald text-lg font-bold text-white uppercase tracking-wider mb-1">
              Aggiungi Slot {weeklyProducts.length + 1} di 3
            </h4>
            <p className="text-xs text-white/50 font-sans max-w-xs mb-4">
              Puoi aggiungere fino a 3 prodotti della settimana per farli ruotare nella Hero Section.
            </p>
            <span className="px-4 py-2 rounded-xl bg-white/10 group-hover:bg-[#ffa323] text-white group-hover:text-black font-oswald text-xs font-bold uppercase tracking-wider transition-all">
              + Configura Prodotto
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: ADD / EDIT WEEKLY PRODUCT                           */}
      {/* ============================================================ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl my-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-[0.2em] font-bold block mb-1">
                HERO SECTION SPOTLIGHT
              </span>
              <h3 className="font-oswald text-2xl sm:text-3xl font-black uppercase text-white">
                {editingItem ? 'Modifica Prodotto della Settimana' : 'Nuovo Prodotto della Settimana'}
              </h3>
            </div>

            {errorMessage && (
              <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-200 mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4 font-sans text-xs">
              {/* Image Preview & Upload */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-black/50 border border-white/15 overflow-hidden flex items-center justify-center shrink-0 p-2 relative">
                  <img src={image} alt="Preview" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-[#ffa323] text-black font-oswald font-bold uppercase rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carica Foto dal PC</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 items-center justify-center sm:justify-start">
                    <span className="text-[10px] text-white/40 font-oswald uppercase mr-1">Preset:</span>
                    {PRESET_IMAGES.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(p.url)}
                        className={`text-[9px] font-oswald px-2 py-0.5 rounded uppercase border transition-colors cursor-pointer ${
                          image === p.url ? 'bg-[#ffa323] text-black border-[#ffa323]' : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                        }`}
                      >
                        {p.label.split(' ')[0]} {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title Split (Prefix & Highlight) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                    Prefisso Titolo (es. "L'ARTE DELLA" o "PIZZA")
                  </label>
                  <input
                    type="text"
                    value={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value)}
                    placeholder="es. L'ARTE DELLA"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[#ffa323] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-oswald text-[#ffa323] uppercase tracking-wider mb-1">
                    Titolo Evidenziato Gradiente (es. "VERA PIZZA") *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleHighlight}
                    onChange={(e) => setTitleHighlight(e.target.value)}
                    placeholder="es. VERA PIZZA"
                    className="w-full bg-[#121212] border border-[#ffa323]/50 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[#ffa323] outline-none"
                  />
                </div>
              </div>

              {/* Subtitle & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                    Sottotitolo / Categoria
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="es. PIZZERIA NAPOLETANA & PICCOLA CUCINA"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[#ffa323] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                    Etichetta / Badge Superiore
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="es. PRODOTTO DELLA SETTIMANA"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[#ffa323] outline-none"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-oswald text-[#d2401e] uppercase tracking-wider mb-1">
                    Prezzo Offerta Settimanale (€) *
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="es. 11.50"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#ffa323] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-oswald text-white/50 uppercase tracking-wider mb-1">
                    Prezzo Originale Barrato (€) (Opzionale)
                  </label>
                  <input
                    type="text"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="es. 13.50"
                    className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white/60 focus:border-[#ffa323] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-oswald text-white/70 uppercase tracking-wider mb-1">
                  Descrizione / Ingredienti del Piatto *
                </label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Descrivi l'impasto, la lievitazione e gli ingredienti DOP..."
                  className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#ffa323] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-oswald text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ff5722] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#d2401e]/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salva Prodotto della Settimana</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: 1-CLICK SELECTOR FROM EXISTING MENU ITEMS           */}
      {/* ============================================================ */}
      {isMenuPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => {
                setIsMenuPickerOpen(false);
                setMenuPickerTargetIndex(null);
              }}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-[0.2em] font-bold block mb-1">
                SELEZIONE RAPIDA DA MENÙ
              </span>
              <h3 className="font-oswald text-2xl font-black uppercase text-white">
                Scegli il Piatto per lo Slot {menuPickerTargetIndex !== null ? menuPickerTargetIndex + 1 : 'Nuovo'}
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 text-[#ffa323] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Cerca pizza o piatto (es. Margherita, Bufala, Frittura, Cuoppo)..."
                className="w-full bg-[#121212] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#ffa323] outline-none"
              />
            </div>

            {/* Grid of menu items to pick */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFromMenu(item)}
                  className="bg-[#121212] border border-white/10 hover:border-[#ffa323] rounded-2xl p-3.5 cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center">
                    <img src={item.image || '/images/menu_pizza_1.png'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-oswald text-sm font-bold text-white uppercase truncate group-hover:text-[#ffa323] transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-white/50 uppercase block">{item.category}</span>
                    <span className="font-oswald text-xs font-bold text-[#d2401e] block mt-0.5">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#181818] border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-oswald text-xl font-bold uppercase text-white mb-2">
              Rimuovere "{itemToDelete.name}"?
            </h3>
            <p className="text-xs text-white/60 font-sans mb-6">
              Questo piatto non sarà più visualizzato nella Hero Section della homepage. Potrai riaggiungerlo in qualsiasi momento.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-oswald text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  deleteWeeklyProduct(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-oswald text-xs uppercase tracking-wider font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Conferma Rimozione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

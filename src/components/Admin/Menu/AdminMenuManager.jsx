import React, { useState, useMemo } from 'react';
import { useMenu } from '../../../context/MenuContext';
import { ProductEditModal } from './ProductEditModal';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  RotateCcw,
  Sparkles,
  Flame,
  UtensilsCrossed,
  Wine,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  Tag,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Ban,
} from 'lucide-react';
import { MoustacheIcon } from '../../common/Icons';

// Popular ingredients for 1-click filter tags
const POPULAR_INGREDIENTS = [
  'Mozzarella di Bufala',
  'Pistacchio di Bronte',
  'Burrata',
  'Salsiccia',
  "N'duja di Spilinga",
  'Crudo di Parma',
  'Friarielli',
  'Provola affumicata',
  'Acciughe di Cetara',
  'Gorgonzola',
  'Melanzane',
  'Pomodoro San Marzano',
  'Patate',
  'Stracciatella',
];

// Helper: Highlight matching substring inside text
const renderHighlightedText = (text, query) => {
  if (!text) return null;
  if (!query || !query.trim()) return text;

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  if (parts.length <= 1) return text;

  return parts.map((part, idx) =>
    regex.test(part) ? (
      <mark
        key={idx}
        className="bg-amber-400/30 text-[#ffa323] font-bold px-1 py-0.5 rounded border border-amber-500/50 shadow-sm mx-0.5 animate-pulse"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
};

export const AdminMenuManager = () => {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    toggleProductAvailability,
    deleteMenuItem,
    duplicateMenuItem,
    resetMenuToDefault,
    toastMessage,
  } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'unavailable'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState('all'); // 'all' | 'ingredients' | 'name'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let list = [...menuItems];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Availability filter
    if (availabilityFilter === 'available') {
      list = list.filter((item) => item.available !== false);
    } else if (availabilityFilter === 'unavailable') {
      list = list.filter((item) => item.available === false);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const matchName = item.name.toLowerCase().includes(q);
        const matchIngredients = item.ingredients && item.ingredients.toLowerCase().includes(q);
        const matchBadge = item.badge && item.badge.toLowerCase().includes(q);

        if (searchTarget === 'ingredients') {
          return matchIngredients;
        }
        if (searchTarget === 'name') {
          return matchName;
        }
        return matchName || matchIngredients || matchBadge;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        list.sort((a, b) => (a.numericPrice || 0) - (b.numericPrice || 0));
        break;
      case 'price_desc':
        list.sort((a, b) => (b.numericPrice || 0) - (a.numericPrice || 0));
        break;
      default:
        break;
    }

    return list;
  }, [menuItems, selectedCategory, availabilityFilter, searchQuery, searchTarget, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = menuItems.length;
    const availableCount = menuItems.filter((i) => i.available !== false).length;
    const unavailableCount = menuItems.filter((i) => i.available === false).length;
    const pizzas = menuItems.filter((i) => ['classiche', 'gourmet', 'ripieni'].includes(i.category)).length;
    const kitchen = menuItems.filter((i) => i.category === 'cucina').length;
    const drinks = menuItems.filter((i) => i.category === 'bevande').length;
    const customPhotos = menuItems.filter((i) => i.image && i.image.startsWith('data:')).length;

    const totalPrice = menuItems.reduce((acc, i) => acc + (i.numericPrice || 0), 0);
    const avgPrice = total > 0 ? (totalPrice / total).toFixed(2).replace('.', ',') : '0,00';

    return { total, availableCount, unavailableCount, pizzas, kitchen, drinks, customPhotos, avgPrice };
  }, [menuItems]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (id, payload) => {
    if (id) {
      updateMenuItem(id, payload);
    } else {
      addMenuItem(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMenuItem(productToDelete.id);
      setProductToDelete(null);
    }
  };

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
      {/* STATS OVERVIEW CARDS                                         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Products */}
        <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-oswald text-white/50 uppercase tracking-widest block">
            Prodotti Totali
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-black text-white mt-1">
            {stats.total}
          </h3>
        </div>

        {/* Total Pizzas */}
        <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-oswald text-[#d2401e] uppercase tracking-widest block">
            Pizze & Forno
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-black text-[#d2401e] mt-1">
            {stats.pizzas}
          </h3>
        </div>

        {/* Cucina & Fritti */}
        <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-oswald text-[#ffa323] uppercase tracking-widest block">
            Cucina & Fritti
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-black text-[#ffa323] mt-1">
            {stats.kitchen}
          </h3>
        </div>

        {/* Drinks */}
        <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-oswald text-sky-400 uppercase tracking-widest block">
            Bevande & Birre
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-black text-sky-400 mt-1">
            {stats.drinks}
          </h3>
        </div>

        {/* Average Price */}
        <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-oswald text-white/50 uppercase tracking-widest block">
            Prezzo Medio
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-black text-white mt-1">
            {stats.avgPrice} €
          </h3>
        </div>

        {/* Custom Uploaded Photos */}
        <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[11px] font-oswald text-emerald-400 uppercase tracking-widest block">
            Foto Caricate PC
          </span>
          <h3 className="font-oswald text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {stats.customPhotos}
          </h3>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TOOLBAR: ACTION BUTTONS, SEARCH & CATEGORY TABS              */}
      {/* ============================================================ */}
      <div className="bg-[#181818] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MoustacheIcon className="w-4 h-2 text-[#d2401e]" />
              <h2 className="font-oswald text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                CATALOGO PRODOTTI & MENÙ RISTORANTE
              </h2>
            </div>
            <p className="text-xs text-white/60 font-sans">
              Gestisci l'offerta culinaria: modifica descrizioni, prezzi, cerca per ingrediente ed evidenzia le corrispondenze.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Reset Factory Default Button */}
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
              title="Ripristina il menù originale"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#ffa323]" />
              <span>Ripristina Default</span>
            </button>

            {/* Prominent Add Product Button */}
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-gradient-to-r from-[#d2401e] to-[#ff5722] hover:from-[#b83314] hover:to-[#d2401e] text-white rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-[#d2401e]/30 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Nuovo Prodotto</span>
            </button>
          </div>
        </div>

        {/* Search, Scope & Sort Controls */}
        <div className="flex flex-col lg:flex-row items-center gap-3 pt-4 border-t border-white/10">
          {/* Search Input Bar with Mode Switcher */}
          <div className="relative flex-1 w-full flex items-center bg-[#121212] border border-white/15 rounded-xl focus-within:border-[#ffa323] transition-colors overflow-hidden">
            <div className="pl-4 pr-2 text-white/40">
              <Search className="w-4 h-4 text-[#ffa323]" />
            </div>
            <input
              type="text"
              placeholder="Cerca ingrediente o piatto (es. bufala, pistacchio, salsiccia, tartufo, friarielli)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-white font-sans placeholder-white/40 focus:outline-none"
            />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 text-white/40 hover:text-white text-xs cursor-pointer"
                title="Cancella ricerca"
              >
                ✕
              </button>
            )}

            {/* Search Target Mode Selector */}
            <div className="border-l border-white/10 px-2 flex items-center shrink-0">
              <select
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="bg-transparent text-[11px] font-oswald text-[#ffa323] uppercase tracking-wider py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#181818] text-white">Cerca Ovunque</option>
                <option value="ingredients" className="bg-[#181818] text-white">🔍 Solo Ingredienti</option>
                <option value="name" className="bg-[#181818] text-white">🍕 Solo Nome</option>
              </select>
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[#ffa323] shrink-0 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-auto bg-[#121212] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-oswald uppercase tracking-wider focus:border-[#ffa323] outline-none transition-colors cursor-pointer"
            >
              <option value="default">Ordinamento Predefinito</option>
              <option value="name_asc">Nome (A - Z)</option>
              <option value="name_desc">Nome (Z - A)</option>
              <option value="price_asc">Prezzo (Crescente)</option>
              <option value="price_desc">Prezzo (Decrescente)</option>
            </select>
          </div>
        </div>

        {/* 1-Click Popular Ingredient Search Chips */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] font-oswald text-[#ffa323] uppercase font-bold tracking-wider mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Ingredienti Rapidi:
          </span>
          {POPULAR_INGREDIENTS.map((ing) => {
            const isSelected = searchQuery.toLowerCase() === ing.toLowerCase();
            return (
              <button
                key={ing}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSearchQuery('');
                  } else {
                    setSearchQuery(ing);
                    setSearchTarget('ingredients');
                  }
                }}
                className={`text-[10px] font-oswald px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ffa323] text-black font-bold shadow-md shadow-[#ffa323]/30 scale-105'
                    : 'bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/5'
                }`}
              >
                {ing}
              </button>
            );
          })}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchTarget('all');
              }}
              className="text-[10px] font-oswald text-rose-400 hover:text-rose-300 underline ml-1 cursor-pointer"
            >
              Azzera Ricerca
            </button>
          )}
        </div>

        {/* Category Pills Filter & Availability Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-oswald text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#d2401e] text-white shadow-lg shadow-[#d2401e]/30 scale-105'
                      : 'bg-[#121212] text-white/70 hover:text-white hover:bg-[#202020] border border-white/10'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Availability Filter Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 bg-[#121212] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                availabilityFilter === 'all'
                  ? 'bg-white/20 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tutti ({stats.total})
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-3 py-1 rounded-lg text-[11px] font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 ${
                availabilityFilter === 'available'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span>✓ Disponibili</span>
              <span>({stats.availableCount})</span>
            </button>
            <button
              onClick={() => setAvailabilityFilter('unavailable')}
              className={`px-3 py-1 rounded-lg text-[11px] font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 ${
                availabilityFilter === 'unavailable'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              <span>✕ Esauriti</span>
              <span>({stats.unavailableCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PRODUCTS LIST / GRID WITH HIGHLIGHTED INGREDIENTS            */}
      {/* ============================================================ */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="bg-[#181818] border border-white/10 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center text-white/40">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-oswald text-xl font-bold uppercase text-white mb-1">
            Nessun Prodotto Corrispondente
          </h3>
          <p className="text-xs text-white/60 font-sans max-w-sm mx-auto mb-6">
            Nessun piatto o bevanda contiene l'ingrediente "{searchQuery}" o corrisponde ai filtri selezionati.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setAvailabilityFilter('all');
              setSearchQuery('');
              setSearchTarget('all');
            }}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-oswald text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
          >
            Azzera Filtri e Ricerca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredAndSortedItems.map((item) => {
            const isAvailable = item.available !== false;
            const hasIngredientMatch =
              searchQuery.trim() &&
              item.ingredients &&
              item.ingredients.toLowerCase().includes(searchQuery.toLowerCase().trim());

            return (
              <div
                key={item.id}
                className={`bg-[#181818] rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden border ${
                  !isAvailable
                    ? 'border-rose-500/40 bg-gradient-to-b from-[#1b1212] to-[#181818] opacity-90'
                    : hasIngredientMatch
                    ? 'border-[#ffa323] shadow-[0_0_20px_rgba(255,163,35,0.15)] bg-gradient-to-b from-[#1c1914] to-[#181818]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                {/* Status Badges */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                  {!isAvailable && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-oswald font-black tracking-widest uppercase rounded shadow-md flex items-center gap-1">
                      <EyeOff className="w-2.5 h-2.5" />
                      ESAURITO
                    </span>
                  )}
                  {hasIngredientMatch && (
                    <span className="px-2 py-0.5 bg-[#ffa323] text-black text-[9px] font-oswald font-black tracking-widest uppercase rounded shadow-md flex items-center gap-1">
                      ✓ INGREDIENTE TROVATO
                    </span>
                  )}
                </div>

                {/* Top Row: Thumbnail + Title + Price */}
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    {/* Item Image Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center relative shadow-inner">
                      <img
                        src={item.image || '/images/menu_pizza_1.png'}
                        alt={item.name}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                          !isAvailable ? 'grayscale opacity-60' : ''
                        }`}
                      />
                      {item.image?.startsWith('data:') && (
                        <span
                          className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black shadow"
                          title="Foto caricata da PC"
                        />
                      )}
                    </div>

                    {/* Title & Badge */}
                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-[#ffa323] text-black text-[10px] font-oswald font-bold tracking-widest uppercase rounded">
                            {renderHighlightedText(item.badge, searchQuery)}
                          </span>
                        )}
                        <span className="text-[10px] font-oswald text-white/50 tracking-wider uppercase">
                          {item.category}
                        </span>
                      </div>

                      <h4 className={`font-oswald text-lg font-bold uppercase tracking-tight truncate transition-colors ${
                        !isAvailable ? 'text-white/70 line-through decoration-rose-500' : 'text-white group-hover:text-[#ffa323]'
                      }`}>
                        {renderHighlightedText(item.name, searchQuery)}
                      </h4>

                      <div className="font-oswald text-base font-black text-[#d2401e] mt-0.5">
                        {item.price}
                      </div>
                    </div>
                  </div>

                  {/* Ingredients / Description with Live Highlight */}
                  <div className="mb-4">
                    <p className="text-xs text-white/70 font-sans leading-relaxed line-clamp-3">
                      {renderHighlightedText(item.ingredients || 'Nessuna descrizione inserita.', searchQuery)}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons Bar */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Availability 1-Click Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleProductAvailability(item.id)}
                      className={`px-3 py-1.5 rounded-lg font-oswald text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isAvailable
                          ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40'
                      }`}
                      title={isAvailable ? 'Clicca per rendere INDISPONIBILE' : 'Clicca per rendere DISPONIBILE'}
                    >
                      {isAvailable ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Disponibile</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                          <span>Esaurito</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-3 py-1.5 bg-[#ffa323]/10 hover:bg-[#ffa323] text-[#ffa323] hover:text-black rounded-lg font-oswald text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modifica</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Duplicate Button */}
                    <button
                      onClick={() => duplicateMenuItem(item.id)}
                      className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Duplica questo prodotto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setProductToDelete(item)}
                      className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Elimina dal menù"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD / EDIT PRODUCT MODAL                                     */}
      {/* ============================================================ */}
      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productToEdit={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#181818] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <h3 className="font-oswald text-xl font-bold uppercase text-white">
                Eliminare Questo Prodotto?
              </h3>
              <p className="text-xs text-stone-300 font-sans mt-2">
                Stai per eliminare definitivamente <strong className="text-white">"{productToDelete.name}"</strong> ({productToDelete.price}) dal menù del ristorante.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-oswald text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-oswald text-xs tracking-wider uppercase font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Elimina Prodotto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* RESET TO FACTORY DEFAULT CONFIRMATION MODAL                  */}
      {/* ============================================================ */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#181818] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-[#ffa323] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <h3 className="font-oswald text-xl font-bold uppercase text-white">
                Ripristinare Menù di Fabbrica?
              </h3>
              <p className="text-xs text-stone-300 font-sans mt-2">
                Questa operazione ripristinerà i 48 piatti originali di Sapore Verace e cancellerà le modifiche o foto personali caricate.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-oswald text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  resetMenuToDefault();
                  setIsResetConfirmOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#ffa323] hover:bg-[#e5921f] text-black font-oswald text-xs tracking-wider uppercase font-bold shadow-lg shadow-[#ffa323]/30 transition-all cursor-pointer"
              >
                Ripristina Tutto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

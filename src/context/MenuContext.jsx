import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_ITEMS as DEFAULT_MENU_ITEMS, CATEGORIES as DEFAULT_CATEGORIES } from '../data/menuData';

const MenuContext = createContext();
const MENU_STORAGE_KEY = 'sapore_verace_menu_items_v1';
const WEEKLY_STORAGE_KEY = 'sapore_verace_weekly_products_v1';

export const DEFAULT_WEEKLY_PRODUCTS = [
  {
    id: 'weekly_1',
    badge: 'PRODOTTO DELLA SETTIMANA',
    subtitle: 'PIZZERIA NAPOLETANA & PICCOLA CUCINA',
    titlePrefix: "L'ARTE DELLA",
    titleHighlight: 'VERA PIZZA',
    name: "L'Arte della Vera Pizza",
    desc: 'Impasto ad alta idratazione con lievitazione naturale di 48 ore, pomodoro San Marzano DOP, mozzarella di bufala campana e cottura rapida a 450°C.',
    price: '11,50 €',
    oldPrice: '13,50 €',
    numericPrice: 11.5,
    primaryBtn: 'ORDINA ORA',
    secondaryBtn: 'PRENOTA UN TAVOLO',
    image: '/images/hero_section_1.png',
    floatingImage: '/images/hero_section_2.png',
  },
  {
    id: 'weekly_2',
    badge: 'SPECIALITÀ DELLA SETTIMANA',
    subtitle: 'TRADIZIONE, PASSIONE & QUALITÀ',
    titlePrefix: 'SAPORE',
    titleHighlight: 'VERACE GOURMET',
    name: 'Sapore Verace Gourmet',
    desc: 'Croccante alla base e straordinariamente soffice all’interno. Scopri il vero gusto della pizza napoletana a Castellanza con ingredienti selezionati.',
    price: '13,50 €',
    oldPrice: '15,50 €',
    numericPrice: 13.5,
    primaryBtn: 'ORDINA ORA',
    secondaryBtn: 'PRENOTA UN TAVOLO',
    image: '/images/hero_section_2.png',
    floatingImage: '/images/hero_section_1.png',
  },
  {
    id: 'weekly_3',
    badge: 'CREAZIONE DELLO CHEF',
    subtitle: 'PICCOLA CUCINA & SFIZI VERACI',
    titlePrefix: 'CUOPPO',
    titleHighlight: 'FRITTI NAPOLETANI',
    name: 'Cuoppo Fritti Napoletani',
    desc: 'Frittura mista della tradizione partenopea con crocchè di patate, arancini al ragù, zeppoline alle alghe e montanarine calde.',
    price: '9,00 €',
    oldPrice: '11,00 €',
    numericPrice: 9.0,
    primaryBtn: 'ORDINA ORA',
    secondaryBtn: 'PRENOTA UN TAVOLO',
    image: '/images/cucina_cuoppo.jpg',
    floatingImage: '/images/hero_section_1.png',
  },
];

// Format numeric price to Italian display string (e.g. 9.5 -> '9,00 €' or '9,50 €')
export const formatPriceString = (val) => {
  if (typeof val === 'string' && val.includes('€')) return val;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(',', '.')) || 0;
  return `${num.toFixed(2).replace('.', ',')} €`;
};

// Parse price string or number to numeric float (e.g. '9,50 €' -> 9.5)
export const parseNumericPrice = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace('€', '').replace(/\s+/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading menu items from storage:', e);
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [weeklyProducts, setWeeklyProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(WEEKLY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch (e) {
      console.error('Error loading weekly products from storage:', e);
    }
    return DEFAULT_WEEKLY_PRODUCTS;
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save menuItems to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.error('Error saving menu items to localStorage:', e);
    }
  }, [menuItems]);

  // Save weeklyProducts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WEEKLY_STORAGE_KEY, JSON.stringify(weeklyProducts));
    } catch (e) {
      console.error('Error saving weekly products to localStorage:', e);
    }
  }, [weeklyProducts]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === MENU_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setMenuItems(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === WEEKLY_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setWeeklyProducts(parsed.slice(0, 3));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Compute dynamic categories and item counts
  const categories = React.useMemo(() => {
    const counts = {
      all: menuItems.length,
      classiche: 0,
      gourmet: 0,
      ripieni: 0,
      cucina: 0,
      bevande: 0,
    };

    menuItems.forEach((item) => {
      const cat = item.category;
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
    });

    return [
      { id: 'all', name: 'Tutti i Prodotti', count: counts.all },
      { id: 'classiche', name: 'Pizze Classiche', count: counts.classiche },
      { id: 'gourmet', name: 'Le Veraci Gourmet', count: counts.gourmet },
      { id: 'ripieni', name: 'I Ripieni & Panuozzi', count: counts.ripieni },
      { id: 'cucina', name: 'Dalla Cucina', count: counts.cucina },
      { id: 'bevande', name: 'Bevande & Birre', count: counts.bevande },
    ];
  }, [menuItems]);

  // ADD NEW ITEM
  const addMenuItem = (itemData) => {
    const numeric = parseNumericPrice(itemData.numericPrice ?? itemData.price);
    const formatted = formatPriceString(numeric);
    const newId = itemData.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newItem = {
      id: newId,
      name: (itemData.name || 'Nuovo Prodotto').trim(),
      category: itemData.category || 'classiche',
      mainCategory: ['classiche', 'gourmet', 'ripieni'].includes(itemData.category) ? 'pizza' : 'cucina',
      price: formatted,
      numericPrice: numeric,
      ingredients: (itemData.ingredients || '').trim(),
      image: itemData.image || '/images/menu_pizza_1.png',
      badge: itemData.badge ? itemData.badge.trim().toUpperCase() : null,
      available: itemData.available !== undefined ? itemData.available : true,
      createdAt: new Date().toISOString(),
    };

    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Prodotto "${newItem.name}" aggiunto con successo!`);
    return newItem;
  };

  // UPDATE ITEM
  const updateMenuItem = (id, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const numeric = updatedFields.price !== undefined
            ? parseNumericPrice(updatedFields.price)
            : updatedFields.numericPrice !== undefined
            ? parseNumericPrice(updatedFields.numericPrice)
            : item.numericPrice;

          const formatted = formatPriceString(numeric);
          const category = updatedFields.category || item.category;
          const mainCategory = ['classiche', 'gourmet', 'ripieni'].includes(category) ? 'pizza' : 'cucina';
          const available = updatedFields.available !== undefined ? updatedFields.available : (item.available !== false);

          return {
            ...item,
            ...updatedFields,
            category,
            mainCategory,
            price: formatted,
            numericPrice: numeric,
            badge: updatedFields.badge !== undefined ? (updatedFields.badge ? updatedFields.badge.trim().toUpperCase() : null) : item.badge,
            available,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast(`Prodotto aggiornato con successo!`);
  };

  // TOGGLE PRODUCT AVAILABILITY (DISPONIBILE / INDISPONIBILE)
  const toggleProductAvailability = (id) => {
    let newStatus = true;
    let targetName = 'Prodotto';

    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isCurrentlyAvailable = item.available !== false;
          newStatus = !isCurrentlyAvailable;
          targetName = item.name || 'Prodotto';
          return {
            ...item,
            available: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    if (newStatus) {
      showToast(`"${targetName}" reso DISPONIBILE nel menù.`);
    } else {
      showToast(`"${targetName}" contrassegnato come INDISPONIBILE (Esaurito).`, 'warning');
    }
  };

  // DELETE ITEM
  const deleteMenuItem = (id) => {
    const itemToDelete = menuItems.find((i) => i.id === id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    showToast(`Prodotto "${itemToDelete?.name || ''}" eliminato.`, 'delete');
  };

  // DUPLICATE ITEM
  const duplicateMenuItem = (id) => {
    const original = menuItems.find((i) => i.id === id);
    if (!original) return;

    const duplicated = {
      ...original,
      id: `item_${Date.now()}_copy`,
      name: `${original.name} (Copia)`,
      available: original.available !== false,
      createdAt: new Date().toISOString(),
    };

    setMenuItems((prev) => [duplicated, ...prev]);
    showToast(`Prodotto "${original.name}" duplicato.`);
  };

  // RESET TO FACTORY DEFAULT
  const resetMenuToDefault = () => {
    setMenuItems(DEFAULT_MENU_ITEMS);
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
    } catch (e) {}
    showToast(`Menù ripristinato ai prodotti di fabbrica iniziali.`);
  };

  // ==========================================
  // WEEKLY PRODUCTS MANAGEMENT (UP TO 3 ITEMS)
  // ==========================================

  // ADD WEEKLY PRODUCT (MAX 3)
  const addWeeklyProduct = (productData) => {
    if (weeklyProducts.length >= 3) {
      showToast('Puoi avere al massimo 3 prodotti della settimana contemporaneamente.', 'warning');
      return false;
    }

    const numeric = parseNumericPrice(productData.numericPrice ?? productData.price);
    const formatted = formatPriceString(numeric);
    const newId = productData.id || `weekly_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newWeekly = {
      id: newId,
      badge: productData.badge || 'PRODOTTO DELLA SETTIMANA',
      subtitle: productData.subtitle || 'SPECIALITÀ IN EVIDENZA',
      titlePrefix: productData.titlePrefix || '',
      titleHighlight: productData.titleHighlight || productData.name || 'PIZZA SPECIALE',
      name: productData.name || 'Speciale della Settimana',
      desc: productData.desc || productData.ingredients || 'Specialità preparata con ingredienti freschi.',
      price: formatted,
      oldPrice: productData.oldPrice ? formatPriceString(parseNumericPrice(productData.oldPrice)) : null,
      numericPrice: numeric,
      primaryBtn: productData.primaryBtn || 'ORDINA ORA',
      secondaryBtn: productData.secondaryBtn || 'PRENOTA UN TAVOLO',
      image: productData.image || '/images/hero_section_1.png',
      floatingImage: productData.floatingImage || '/images/hero_section_2.png',
      createdAt: new Date().toISOString(),
    };

    setWeeklyProducts((prev) => [...prev, newWeekly]);
    showToast(`"${newWeekly.name}" aggiunto ai prodotti della settimana!`);
    return newWeekly;
  };

  // UPDATE WEEKLY PRODUCT
  const updateWeeklyProduct = (id, updatedFields) => {
    setWeeklyProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const numeric = updatedFields.price !== undefined
            ? parseNumericPrice(updatedFields.price)
            : updatedFields.numericPrice !== undefined
            ? parseNumericPrice(updatedFields.numericPrice)
            : item.numericPrice;

          const formatted = formatPriceString(numeric);
          const oldPriceFormatted = updatedFields.oldPrice
            ? formatPriceString(parseNumericPrice(updatedFields.oldPrice))
            : item.oldPrice;

          return {
            ...item,
            ...updatedFields,
            price: formatted,
            numericPrice: numeric,
            oldPrice: oldPriceFormatted,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast(`Prodotto della settimana aggiornato!`);
  };

  // DELETE WEEKLY PRODUCT
  const deleteWeeklyProduct = (id) => {
    if (weeklyProducts.length <= 1) {
      showToast('Devi mantenere almeno 1 prodotto della settimana.', 'warning');
      return false;
    }
    const itemToDelete = weeklyProducts.find((i) => i.id === id);
    setWeeklyProducts((prev) => prev.filter((item) => item.id !== id));
    showToast(`"${itemToDelete?.name || 'Prodotto'}" rimosso dai prodotti della settimana.`, 'delete');
    return true;
  };

  // RESET WEEKLY PRODUCTS TO DEFAULT
  const resetWeeklyProductsToDefault = () => {
    setWeeklyProducts(DEFAULT_WEEKLY_PRODUCTS);
    try {
      localStorage.setItem(WEEKLY_STORAGE_KEY, JSON.stringify(DEFAULT_WEEKLY_PRODUCTS));
    } catch (e) {}
    showToast('Prodotti della settimana ripristinati ai valori iniziali.');
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        weeklyProducts,
        addMenuItem,
        updateMenuItem,
        toggleProductAvailability,
        deleteMenuItem,
        duplicateMenuItem,
        resetMenuToDefault,
        addWeeklyProduct,
        updateWeeklyProduct,
        deleteWeeklyProduct,
        resetWeeklyProductsToDefault,
        toastMessage,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);

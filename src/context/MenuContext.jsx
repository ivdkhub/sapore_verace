import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MENU_ITEMS as DEFAULT_MENU_ITEMS } from '../data/menuData';
import { DEFAULT_WEEKLY_PRODUCTS } from '../data/weeklyData';
import { api } from '../services/api';

const MenuContext = createContext();

export { DEFAULT_WEEKLY_PRODUCTS };

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
  // Valori iniziali dal codice (render immediato), poi sostituiti da quelli salvati sul server
  const [menuItems, setMenuItemsState] = useState(DEFAULT_MENU_ITEMS);
  const [weeklyProducts, setWeeklyProductsState] = useState(DEFAULT_WEEKLY_PRODUCTS);
  const [isMenuLoaded, setIsMenuLoaded] = useState(false);

  // Solo le modifiche fatte dall'admin vengono salvate sul server
  const dirtyRef = useRef({ menu: false, weekly: false });
  // Se il menu non è arrivato dal server non si salva: si sovrascriverebbe con quello predefinito
  const loadedFromServerRef = useRef(false);
  const setMenuItems = (updater) => {
    dirtyRef.current.menu = true;
    setMenuItemsState(updater);
  };
  const setWeeklyProducts = (updater) => {
    dirtyRef.current.weekly = true;
    setWeeklyProductsState(updater);
  };

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Carica menu e prodotti della settimana dal server
  useEffect(() => {
    let cancelled = false;
    api
      .get('state.php?keys=menu_items,weekly_products')
      .then(({ data }) => {
        if (cancelled) return;
        loadedFromServerRef.current = true;
        if (Array.isArray(data.menu_items) && data.menu_items.length > 0) setMenuItemsState(data.menu_items);
        if (Array.isArray(data.weekly_products) && data.weekly_products.length > 0) {
          setWeeklyProductsState(data.weekly_products.slice(0, 3));
        }
      })
      .catch((err) => console.warn('Menu: uso i dati predefiniti, server non raggiungibile.', err.message))
      .finally(() => !cancelled && setIsMenuLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Salvataggio sul server (con piccolo ritardo per raggruppare modifiche ravvicinate)
  useEffect(() => {
    if (!dirtyRef.current.menu) return;
    if (!loadedFromServerRef.current) {
      showToast('Menù NON salvato: dati del server non caricati. Ricarica la pagina e riprova.', 'delete');
      return;
    }
    const timer = setTimeout(() => {
      dirtyRef.current.menu = false;
      api.put('state.php', { key: 'menu_items', value: menuItems }).catch((err) => {
        dirtyRef.current.menu = true;
        showToast(`Menù NON salvato sul server: ${err.message}`, 'delete');
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [menuItems]);

  useEffect(() => {
    if (!dirtyRef.current.weekly) return;
    if (!loadedFromServerRef.current) {
      showToast('Prodotti della settimana NON salvati: dati del server non caricati. Ricarica la pagina e riprova.', 'delete');
      return;
    }
    const timer = setTimeout(() => {
      dirtyRef.current.weekly = false;
      api.put('state.php', { key: 'weekly_products', value: weeklyProducts }).catch((err) => {
        dirtyRef.current.weekly = true;
        showToast(`Prodotti della settimana NON salvati sul server: ${err.message}`, 'delete');
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [weeklyProducts]);

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
    showToast('Prodotti della settimana ripristinati ai valori iniziali.');
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isMenuLoaded,
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

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_TABLES, INITIAL_ZONE_LABELS, INITIAL_STRUCTURE } from '../data/defaultLayout';
import { DEFAULT_OPENING_HOURS, DEFAULT_HOLIDAYS } from '../data/defaultSchedule';
import { api } from '../services/api';
import { buildSlots } from '../utils/schedule';

const AdminContext = createContext();

export { INITIAL_TABLES, INITIAL_ZONE_LABELS, INITIAL_STRUCTURE, DEFAULT_OPENING_HOURS, DEFAULT_HOLIDAYS };

// Helper: Determina se un tavolo è modulare da 2 persone (o unito da tavoli da 2)
export const isModularTable = (table) => {
  if (!table) return false;
  if (table.type === 'round') return false;
  if (table.isModular === true) return true;
  if (table.mergedFrom && table.mergedFrom.length > 0) return true;
  if (table.type === 'square' && table.seats === 2) return true;
  return false;
};

export const getTodayDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Cleanup configurations older than 7 days from today
const cleanupOldDailyConfigs = (configs) => {
  if (!configs || typeof configs !== 'object') return {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = getTodayDateString(cutoff);

  const cleaned = {};
  Object.keys(configs).forEach((key) => {
    const datePart = key.split('_')[0];
    if (datePart >= cutoffStr) {
      cleaned[key] = configs[key];
    }
  });
  return cleaned;
};


export const AdminProvider = ({ children }) => {
  // ============================================================
  // ACCESSO ADMIN (sessione sul server PHP)
  // ============================================================
  const [isAdminView, setIsAdminViewState] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const isAuthenticatedRef = useRef(false);
  isAuthenticatedRef.current = isAuthenticated;

  const [activeTab, setActiveTab] = useState('tavoli');
  const [isStructureEditMode, setIsStructureEditMode] = useState(false);
  const [selectedStructureItem, setSelectedStructureItem] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [activeShift, setActiveShift] = useState('cena');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Aprire l'area admin richiede il login; chiuderla no
  const setIsAdminView = (value) => {
    if (!value) {
      setIsAdminViewState(false);
      return;
    }
    if (isAuthenticated) setIsAdminViewState(true);
    else setIsLoginOpen(true);
  };

  const login = async (password) => {
    await api.post('auth.php', { password });
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setIsAdminViewState(true);
  };

  const logout = async () => {
    try {
      await api.del('auth.php');
    } catch (e) {
      // la sessione verrà comunque chiusa lato client
    }
    setIsAuthenticated(false);
    setIsAdminViewState(false);
  };

  // L'area admin si apre dall'indirizzo del sito + "#admin" (es. https://www.saporeverace.it/#admin)
  useEffect(() => {
    const openFromHash = (authenticated) => {
      if (window.location.hash !== '#admin') return;
      if (authenticated) setIsAdminViewState(true);
      else setIsLoginOpen(true);
    };
    api
      .get('auth.php')
      .then((res) => {
        setIsAuthenticated(!!res.authenticated);
        openFromHash(!!res.authenticated);
      })
      .catch(() => openFromHash(false));
    const onHash = () => openFromHash(isAuthenticatedRef.current);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // ============================================================
  // OPENING HOURS & HOLIDAYS / VACATION STATE (pubblici, salvati sul server)
  // ============================================================
  const [openingHours, setOpeningHoursState] = useState(DEFAULT_OPENING_HOURS);
  const [holidays, setHolidaysState] = useState(DEFAULT_HOLIDAYS);
  const scheduleDirtyRef = useRef({ hours: false, holidays: false });
  const setOpeningHours = (updater) => {
    scheduleDirtyRef.current.hours = true;
    setOpeningHoursState(updater);
  };
  const setHolidays = (updater) => {
    scheduleDirtyRef.current.holidays = true;
    setHolidaysState(updater);
  };

  useEffect(() => {
    api
      .get('state.php?keys=opening_hours,holidays')
      .then(({ data }) => {
        if (data.opening_hours && data.opening_hours.monday) setOpeningHoursState(data.opening_hours);
        if (Array.isArray(data.holidays)) setHolidaysState(data.holidays);
      })
      .catch((err) => console.warn('Orari: uso i valori predefiniti, server non raggiungibile.', err.message));
  }, []);

  useEffect(() => {
    if (!scheduleDirtyRef.current.hours) return;
    scheduleDirtyRef.current.hours = false;
    api.put('state.php', { key: 'opening_hours', value: openingHours }).catch((err) => {
      scheduleDirtyRef.current.hours = true;
      setSaveSuccessMessage(`⚠️ Orari NON salvati sul server: ${err.message}`);
      setTimeout(() => setSaveSuccessMessage(''), 5000);
    });
  }, [openingHours]);

  useEffect(() => {
    if (!scheduleDirtyRef.current.holidays) return;
    scheduleDirtyRef.current.holidays = false;
    api.put('state.php', { key: 'holidays', value: holidays }).catch((err) => {
      scheduleDirtyRef.current.holidays = true;
      setSaveSuccessMessage(`⚠️ Ferie NON salvate sul server: ${err.message}`);
      setTimeout(() => setSaveSuccessMessage(''), 5000);
    });
  }, [holidays]);

  // ============================================================
  // CONFIGURAZIONI GIORNALIERE DELLA SALA (solo admin, sul server)
  // ============================================================
  // Mappa "YYYY-MM-DD_turno" -> { tables, zoneLabels, structure }
  const [dailyConfigs, setDailyConfigs] = useState(() => {
    const today = getTodayDateString();
    return {
      [`${today}_cena`]: {
        tables: INITIAL_TABLES,
        zoneLabels: INITIAL_ZONE_LABELS,
        structure: INITIAL_STRUCTURE,
        updatedAt: new Date().toISOString(),
      },
    };
  });
  const dailyConfigsRef = useRef(dailyConfigs);
  dailyConfigsRef.current = dailyConfigs;

  // Versione sul server di ogni configurazione (0 = non ancora salvata)
  const versionsRef = useRef({});
  // Codici delle prenotazioni già viste, per avvisare solo di quelle nuove
  const knownReservationCodesRef = useRef(null);
  const lastSyncRef = useRef('');

  // Current active tables, zoneLabels, and structure for the selectedDate and activeShift
  const currentKey = `${selectedDate}_${activeShift}`;

  const [tables, setTables] = useState(() => {
    const initialConfig = dailyConfigs[currentKey];
    if (initialConfig && initialConfig.tables) return initialConfig.tables;
    return INITIAL_TABLES;
  });

  const [zoneLabels, setZoneLabels] = useState(() => {
    const initialConfig = dailyConfigs[currentKey];
    if (initialConfig && initialConfig.zoneLabels) return initialConfig.zoneLabels;
    return INITIAL_ZONE_LABELS;
  });

  const [structure, setStructure] = useState(() => {
    const initialConfig = dailyConfigs[currentKey];
    if (initialConfig && initialConfig.structure) return initialConfig.structure;
    return INITIAL_STRUCTURE;
  });

  // Ultimo stato caricato (dal server o dal cambio data): se tables/zone/struttura sono
  // ancora questi oggetti, non c'è nessuna modifica dell'admin da salvare.
  const loadedSnapshotRef = useRef({ key: currentKey, tables, zoneLabels, structure });
  const skipNextSaveRef = useRef(true);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newReservationToast, setNewReservationToast] = useState(null);

  const flashMessage = (msg, ms = 3500) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(''), ms);
  };

  // Play subtle bell notification chime via Web Audio API
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1 (D5 - 587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2 (A5 - 880 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);
    } catch (e) {
      // Audio autoplay restrictions or not supported
    }
  };

  // Applica una configurazione arrivata dal server alla vista corrente (senza risalvarla)
  const applyServerConfigToView = (key, data) => {
    if (key !== `${selectedDateRef.current}_${activeShiftRef.current}`) return;
    const nextTables = data.tables || INITIAL_TABLES;
    const nextZones = data.zoneLabels || INITIAL_ZONE_LABELS;
    const nextStructure = data.structure || INITIAL_STRUCTURE;
    loadedSnapshotRef.current = { key, tables: nextTables, zoneLabels: nextZones, structure: nextStructure };
    setTables(nextTables);
    setZoneLabels(nextZones);
    setStructure(nextStructure);
  };

  const selectedDateRef = useRef(selectedDate);
  const activeShiftRef = useRef(activeShift);
  selectedDateRef.current = selectedDate;
  activeShiftRef.current = activeShift;
  const pendingSaveRef = useRef(null); // { key, timer }

  // Scarica dal server le configurazioni (tutte, o solo quelle cambiate) e segnala le nuove prenotazioni online
  const syncConfigsFromServer = async ({ full = false } = {}) => {
    const since = full ? '' : lastSyncRef.current;
    const res = await api.get(`configs.php${since ? `?since=${encodeURIComponent(since)}` : ''}`);
    lastSyncRef.current = res.serverTime;
    const incoming = res.configs || {};
    const changedKeys = Object.keys(incoming).filter(
      (key) => incoming[key].version !== versionsRef.current[key]
    );
    if (changedKeys.length === 0 && knownReservationCodesRef.current) return;

    const isFirstSync = knownReservationCodesRef.current === null;
    if (isFirstSync) knownReservationCodesRef.current = new Set();
    const newOnline = [];

    changedKeys.forEach((key) => {
      versionsRef.current[key] = incoming[key].version;
      (incoming[key].data?.tables || []).forEach((t) => {
        const code = t.reservation?.code;
        if (!code || knownReservationCodesRef.current.has(code)) return;
        knownReservationCodesRef.current.add(code);
        if (!isFirstSync && t.reservation.source === 'online_client') {
          const [date, shift] = key.split('_');
          newOnline.push({ id: `${code}_${Date.now()}`, reservation: t.reservation, table: t, date, shift });
        }
      });
    });

    if (changedKeys.length > 0) {
      setDailyConfigs((prev) => {
        const next = { ...prev };
        changedKeys.forEach((key) => {
          next[key] = incoming[key].data;
        });
        return cleanupOldDailyConfigs(next);
      });
      // Non sovrascrivere la vista se l'admin ha una modifica in attesa di salvataggio
      const viewKey = `${selectedDateRef.current}_${activeShiftRef.current}`;
      if (incoming[viewKey] && changedKeys.includes(viewKey) && pendingSaveRef.current?.key !== viewKey) {
        applyServerConfigToView(viewKey, incoming[viewKey].data);
      }
    }

    if (newOnline.length > 0) {
      playNotificationChime();
      setNewReservationToast(newOnline[newOnline.length - 1]);
    }
  };

  // Primo caricamento e aggiornamento periodico mentre l'admin è autenticato
  useEffect(() => {
    if (!isAuthenticated) return;
    let stopped = false;
    syncConfigsFromServer({ full: true }).catch((err) => {
      if (err.status === 401) setIsAuthenticated(false);
      else flashMessage(`⚠️ Impossibile caricare la sala dal server: ${err.message}`, 6000);
    });
    // Continua anche con la scheda in background (il browser rallenta da solo i controlli):
    // così il tablet del ristorante riceve le prenotazioni anche se l'admin non è in primo piano.
    const poll = () => {
      if (stopped) return;
      syncConfigsFromServer().catch((err) => {
        if (err.status === 401) {
          setIsAuthenticated(false);
          setIsAdminViewState(false);
        }
      });
    };
    const interval = setInterval(poll, 15000);
    const onVisible = () => !document.hidden && poll();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isAuthenticated]);

  // Salva una configurazione sul server; in caso di conflitto carica la versione del server
  const putConfig = async (key, data) => {
    try {
      const res = await api.put('configs.php', {
        key,
        data: { tables: data.tables, zoneLabels: data.zoneLabels, structure: data.structure },
        baseVersion: versionsRef.current[key] || 0,
      });
      versionsRef.current[key] = res.version;
      (data.tables || []).forEach((t) => t.reservation?.code && knownReservationCodesRef.current?.add(t.reservation.code));
      return true;
    } catch (err) {
      if (err.status === 409 && err.data?.current) {
        const current = err.data.current;
        versionsRef.current[key] = current.version;
        setDailyConfigs((prev) => ({ ...prev, [key]: current.data }));
        applyServerConfigToView(key, current.data);
        flashMessage('⚠️ È arrivata una prenotazione online mentre modificavi: la sala è stata aggiornata, ripeti l\'ultima modifica.', 7000);
      } else if (err.status === 401) {
        setIsAuthenticated(false);
        setIsAdminViewState(false);
      } else {
        flashMessage(`⚠️ Modifica NON salvata sul server: ${err.message}`, 6000);
      }
      return false;
    }
  };

  // When selectedDate or activeShift changes, load that day's setup or create a fresh standard setup
  useEffect(() => {
    const targetKey = `${selectedDate}_${activeShift}`;
    const existing = dailyConfigs[targetKey];
    skipNextSaveRef.current = true;

    if (existing && existing.tables) {
      loadedSnapshotRef.current = {
        key: targetKey,
        tables: existing.tables,
        zoneLabels: existing.zoneLabels || INITIAL_ZONE_LABELS,
        structure: existing.structure || INITIAL_STRUCTURE,
      };
      setTables(existing.tables);
      setZoneLabels(existing.zoneLabels || INITIAL_ZONE_LABELS);
      setStructure(existing.structure || INITIAL_STRUCTURE);
    } else {
      // New date / shift: create clean default template ready for booking & planning
      const freshTables = INITIAL_TABLES.map((t) => ({
        ...t,
        status: 'disponibile',
        reservation: null,
        colorOverride: null,
      }));
      loadedSnapshotRef.current = { key: targetKey, tables: freshTables, zoneLabels: INITIAL_ZONE_LABELS, structure: INITIAL_STRUCTURE };
      setTables(freshTables);
      setZoneLabels(INITIAL_ZONE_LABELS);
      setStructure(INITIAL_STRUCTURE);

      setDailyConfigs((prev) => {
        const updated = {
          ...prev,
          [targetKey]: {
            tables: freshTables,
            zoneLabels: INITIAL_ZONE_LABELS,
            structure: INITIAL_STRUCTURE,
            updatedAt: new Date().toISOString(),
          },
        };
        return cleanupOldDailyConfigs(updated);
      });
    }
    setSelectedTable(null);
  }, [selectedDate, activeShift]);

  // Auto-save: ogni modifica dell'admin alla sala del giorno/turno attivo viene salvata sul server
  useEffect(() => {
    if (skipNextSaveRef.current) {
      // render del cambio data/turno: tables contiene ancora i dati del giorno precedente
      skipNextSaveRef.current = false;
      return;
    }
    const targetKey = `${selectedDate}_${activeShift}`;
    const snap = loadedSnapshotRef.current;
    if (snap.key === targetKey && snap.tables === tables && snap.zoneLabels === zoneLabels && snap.structure === structure) {
      return; // nessuna modifica rispetto a quanto caricato
    }

    const data = { tables, zoneLabels, structure, updatedAt: new Date().toISOString() };
    setDailyConfigs((prev) => cleanupOldDailyConfigs({ ...prev, [targetKey]: data }));
    loadedSnapshotRef.current = { key: targetKey, tables, zoneLabels, structure };

    if (!isAuthenticated) return;
    if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current.timer);
    const timer = setTimeout(() => {
      pendingSaveRef.current = null;
      putConfig(targetKey, data);
    }, 700);
    pendingSaveRef.current = { key: targetKey, timer, data };
  }, [tables, zoneLabels, structure, selectedDate, activeShift]);

  // Esplicito salvataggio manuale del layout con feedback toast
  const saveLayout = async () => {
    const targetKey = `${selectedDate}_${activeShift}`;
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current.timer);
      pendingSaveRef.current = null;
    }
    const ok = await putConfig(targetKey, { tables, zoneLabels, structure });
    if (ok) flashMessage(`Configurazione salvata per ${selectedDate} (${activeShift})!`);
    return ok;
  };

  // Helper: Ottieni riassunto prenotazioni e configurazione per una data
  const getSummaryForDate = (dateStr, shift = activeShift) => {
    const key = `${dateStr}_${shift}`;
    const config = dailyConfigs[key];
    if (!config || !config.tables) {
      return {
        totalReservations: 0,
        totalGuests: 0,
        hasCustomLayout: false,
      };
    }
    const booked = config.tables.filter((t) => t.reservation !== null);
    const totalGuests = booked.reduce((sum, t) => sum + (Number(t.reservation?.guests) || 0), 0);
    return {
      totalReservations: booked.length,
      totalGuests,
      hasCustomLayout: true,
    };
  };

  // Helper: Copia disposizione tavoli da una data sorgente a una data target
  const copyLayoutFromDate = (sourceDate, targetDate, shift = activeShift) => {
    const sourceKey = `${sourceDate}_${shift}`;
    const sourceConfig = dailyConfigs[sourceKey];
    if (!sourceConfig || !sourceConfig.tables) return false;

    const targetKey = `${targetDate}_${shift}`;
    const targetConfig = dailyConfigs[targetKey];
    // Le prenotazioni già presenti nel giorno di destinazione non vanno perse
    const targetReservations = (targetConfig?.tables || []).filter((t) => t.reservation);
    if (targetReservations.length > 0) {
      flashMessage(`⚠️ Il ${targetDate} ha già ${targetReservations.length} prenotazioni: sposta o cancella prima quelle prenotazioni.`, 6000);
      return false;
    }

    // Clona i tavoli azzerando le prenotazioni passate
    const clonedTables = sourceConfig.tables.map((t) => ({
      ...t,
      status: 'disponibile',
      reservation: null,
      colorOverride: null,
    }));

    const data = {
      tables: clonedTables,
      zoneLabels: sourceConfig.zoneLabels || INITIAL_ZONE_LABELS,
      structure: sourceConfig.structure || INITIAL_STRUCTURE,
      updatedAt: new Date().toISOString(),
    };

    setDailyConfigs((prev) => cleanupOldDailyConfigs({ ...prev, [targetKey]: data }));
    putConfig(targetKey, data);

    if (targetDate === selectedDate && shift === activeShift) {
      loadedSnapshotRef.current = { key: targetKey, tables: data.tables, zoneLabels: data.zoneLabels, structure: data.structure };
      setTables(data.tables);
      setZoneLabels(data.zoneLabels);
      setStructure(data.structure);
    }

    flashMessage(`Disposizione copiata da ${sourceDate} al ${targetDate}!`);
    return true;
  };

  // Helper: Trova il primo tavolo libero che ha la capacità (nr di coperti) contenente gli ospiti
  const findBestFreeTable = (guestsCount, preferredTableId = null, currentTablesList = tables) => {
    const numGuests = Number(guestsCount) || 1;

    // Tavoli liberi (oppure il tavolo attualmente preferito/selezionato)
    const availableTables = (currentTablesList || []).filter(
      (t) => t.id === preferredTableId || t.reservation === null
    );

    if (availableTables.length === 0) return null;

    // 1. Tavoli con capienza sufficiente (seats >= numGuests)
    const fittingTables = availableTables.filter((t) => (t.seats || 4) >= numGuests);

    if (fittingTables.length > 0) {
      // Ordiniamo per capienza crescente (il più piccolo che contiene il numero di persone) e ordine del nome
      fittingTables.sort((a, b) => {
        const diffA = (a.seats || 4) - numGuests;
        const diffB = (b.seats || 4) - numGuests;
        if (diffA !== diffB) return diffA - diffB;
        return (a.name || '').localeCompare(b.name || '');
      });
      return fittingTables[0];
    }

    // 2. Se nessun tavolo libero ha capienza >= numGuests, prendiamo il tavolo libero con capienza maggiore
    const sortedByLargest = [...availableTables].sort(
      (a, b) => (b.seats || 4) - (a.seats || 4)
    );
    return sortedByLargest[0] || null;
  };

  // Prenotazione online del cliente: il server verifica orari, ferie e tavoli liberi,
  // assegna il tavolo in modo atomico e avvisa il ristorante.
  const createClientReservation = async (data) => {
    try {
      const result = await api.post('reservations.php', data);
      return { ...result, success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Disponibilità (fasce orarie e tavoli liberi) per una data, letta dal server
  const getAvailableSlotsForDate = async (date, guests = 2) => {
    const res = await api.get(`reservations.php?date=${encodeURIComponent(date)}&guests=${Number(guests) || 2}`);
    return {
      pranzoAvailable: res.pranzo.open && res.pranzo.tablesFree > 0,
      cenaAvailable: res.cena.open && res.cena.tablesFree > 0,
      pranzoTablesFree: res.pranzo.tablesFree,
      cenaTablesFree: res.cena.tablesFree,
      pranzoSlots: res.pranzo.slots,
      cenaSlots: res.cena.slots,
    };
  };

  // Aggiungi o aggiorna prenotazione su un tavolo con auto-assegnazione
  const saveReservation = (tableId, resData, sourceTableId = null) => {
    let targetTableId = tableId;

    // Se non è stato passato un tableId specifico o se serve trovare il miglior tavolo
    if (!targetTableId) {
      const best = findBestFreeTable(resData.guests);
      if (!best) {
        alert('Nessun tavolo libero disponibile per il numero di persone indicato.');
        return false;
      }
      targetTableId = best.id;
    }

    setTables((prev) =>
      prev.map((t) => {
        // Se la prenotazione è stata spostata da un altro tavolo, libera il vecchio tavolo
        if (sourceTableId && t.id === sourceTableId && sourceTableId !== targetTableId) {
          return {
            ...t,
            status: 'disponibile',
            colorOverride: null,
            reservation: null,
          };
        }
        if (t.id === targetTableId) {
          return {
            ...t,
            status: resData.status === 'Seduti' ? 'occupato' : 'in_corso',
            colorOverride: resData.color || (resData.status === 'Seduti' ? '#d2401e' : '#f59e0b'),
            reservation: {
              ...resData,
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          };
        }
        return t;
      })
    );
    setIsModalOpen(false);
    setSelectedTable(null);
    return true;
  };

  // Libera tavolo
  const clearTable = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'disponibile',
            colorOverride: null,
            reservation: null,
          };
        }
        return t;
      })
    );
    setSelectedTable(null);
  };

  // Aggiorna posizione tavolo (Drag & Drop)
  const updateTablePosition = (tableId, newX, newY) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, x: newX, y: newY } : t))
    );
  };

  // Ruota tavolo di 90 gradi
  const rotateTable = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          const newRot = ((t.rotation || 0) + 90) % 360;
          return { ...t, rotation: newRot };
        }
        return t;
      })
    );
  };

  // Rimuovi tavolo dalla planimetria
  const deleteTable = (tableId) => {
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    setSelectedTable(null);
  };

  // Unisci due tavoli modulari vicini in un unico grande tavolo allungato
  const mergeTables = (sourceId, targetId) => {
    const sourceTable = tables.find((t) => t.id === sourceId);
    const targetTable = tables.find((t) => t.id === targetId);
    if (!sourceTable || !targetTable) return;
    if (!isModularTable(sourceTable) || !isModularTable(targetTable)) return;

    const totalSeats = (sourceTable.seats || 2) + (targetTable.seats || 2);
    const mergedId = 'T_MODULAR_' + Date.now().toString().slice(-4);
    const combinedName = `${targetTable.name}+${sourceTable.name}`;

    // Modular dimension calculation: each 2 seats adds ~42px length
    const unitLength = 42;
    const baseBreadth = 44;
    const computedLength = Math.max(84, (totalSeats / 2) * unitLength);

    const isHorizontal = Math.abs(sourceTable.x - targetTable.x) >= Math.abs(sourceTable.y - targetTable.y);
    const minX = Math.min(sourceTable.x, targetTable.x);
    const minY = Math.min(sourceTable.y, targetTable.y);

    const mergedTable = {
      id: mergedId,
      name: combinedName,
      room: targetTable.room || 'main',
      type: 'rect',
      isModular: true,
      seats: totalSeats,
      x: Math.round(minX),
      y: Math.round(minY),
      width: isHorizontal ? computedLength : baseBreadth,
      height: isHorizontal ? baseBreadth : computedLength,
      rotation: 0,
      status:
        sourceTable.status !== 'disponibile' || targetTable.status !== 'disponibile'
          ? 'occupato'
          : 'disponibile',
      colorOverride: sourceTable.colorOverride || targetTable.colorOverride || null,
      reservation: targetTable.reservation || sourceTable.reservation || null,
      mergedFrom: [
        ...(targetTable.mergedFrom || [targetTable]),
        ...(sourceTable.mergedFrom || [sourceTable]),
      ],
    };

    setTables((prev) => [
      ...prev.filter((t) => t.id !== sourceId && t.id !== targetId),
      mergedTable,
    ]);
    setSelectedTable(mergedTable);
    setSaveSuccessMessage(`Tavoli modulari uniti! (${combinedName} - ${totalSeats} Persone)`);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  // Separa un tavolo precedentemente unito nei tavoli originali
  const splitTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.mergedFrom || table.mergedFrom.length < 2) return;

    const [t1, t2] = table.mergedFrom;
    const restoredT1 = { ...t1, x: table.x, y: table.y };
    const restoredT2 = { ...t2, x: table.x + (t1.width || 42) + 12, y: table.y };

    setTables((prev) => [
      ...prev.filter((t) => t.id !== tableId),
      restoredT1,
      restoredT2,
    ]);
    setSelectedTable(null);
    setSaveSuccessMessage(`Tavoli separati con successo!`);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  // Aggiungi nuovo tavolo
  const addTable = ({ type, name, seats, x, y }) => {
    const id = 'T_' + Date.now().toString().slice(-4);
    let newTableProps = {};

    switch (type) {
      case 'single_2_modular':
      case 'single_2_4':
        newTableProps = {
          type: 'square',
          isModular: true,
          seats: seats || 2,
          width: 44,
          height: 44,
        };
        break;
      case 'round_4':
        newTableProps = {
          type: 'round',
          seats: 4,
          radius: 28,
        };
        break;
      case 'double_4_6':
        const seatCount = seats || 6;
        newTableProps = {
          type: 'rect',
          seats: seatCount,
          width: seatCount <= 4 ? 85 : 125,
          height: 50,
        };
        break;
      case 'large_8':
        newTableProps = {
          type: 'rect',
          seats: seats || 8,
          width: 170,
          height: 52,
        };
        break;
      default:
        newTableProps = {
          type: 'round',
          seats: 4,
          radius: 28,
        };
    }

    const newTable = {
      id,
      name: name || `T${tables.length + 1}`,
      room: 'main',
      x: x || 550,
      y: y || 500,
      rotation: 0,
      status: 'disponibile',
      reservation: null,
      ...newTableProps,
    };

    setTables((prev) => [...prev, newTable]);
    setSelectedTable(newTable);
    return newTable;
  };

  // --- GESTIONE ETICHETTE SALE (ZONE LABELS) ---
  const addZoneLabel = ({ name, subtitle, color }) => {
    const newZone = {
      id: 'zone_' + Date.now().toString().slice(-4),
      name: name || 'NUOVA SALA',
      subtitle: subtitle || 'Zona Riservata',
      x: 550,
      y: 400,
      color: color || '#ffa323',
    };
    setZoneLabels((prev) => [...prev, newZone]);
  };

  const updateZonePosition = (id, newX, newY) => {
    setZoneLabels((prev) =>
      prev.map((z) => (z.id === id ? { ...z, x: newX, y: newY } : z))
    );
  };

  const updateZoneLabel = (id, newProps) => {
    setZoneLabels((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...newProps } : z))
    );
  };

  const deleteZoneLabel = (id) => {
    setZoneLabels((prev) => prev.filter((z) => z.id !== id));
  };

  // ============================================================
  // GESTIONE ELEMENTI STRUTTURALI (PARETI, PORTE, ARREDI, PERIMETRO)
  // ============================================================
  const updatePerimeter = (newPerimeterProps) => {
    setStructure((prev) => ({
      ...prev,
      perimeter: { ...prev.perimeter, ...newPerimeterProps },
    }));
  };

  // Pareti
  const addWall = (wallData) => {
    const newWall = {
      id: 'wall_' + Date.now().toString().slice(-4),
      name: wallData?.name || (wallData?.type === 'partition' ? 'Divisorio Legno' : 'Parete'),
      x: wallData?.x || 500,
      y: wallData?.y || 450,
      width: wallData?.width || (wallData?.orientation === 'horizontal' ? 220 : 12),
      height: wallData?.height || (wallData?.orientation === 'horizontal' ? 12 : 220),
      rotation: wallData?.rotation || 0,
      type: wallData?.type || 'wall',
      color: wallData?.type === 'partition' ? '#78350f' : '#555555',
    };
    setStructure((prev) => ({
      ...prev,
      walls: [...(prev.walls || []), newWall],
    }));
    setSelectedStructureItem({ type: 'wall', id: newWall.id, data: newWall });
    return newWall;
  };

  const updateWall = (id, newProps) => {
    setStructure((prev) => ({
      ...prev,
      walls: (prev.walls || []).map((w) => (w.id === id ? { ...w, ...newProps } : w)),
    }));
    if (selectedStructureItem?.id === id) {
      setSelectedStructureItem((prev) => ({ ...prev, data: { ...prev.data, ...newProps } }));
    }
  };

  const rotateWall = (id) => {
    setStructure((prev) => ({
      ...prev,
      walls: (prev.walls || []).map((w) => {
        if (w.id === id) {
          return {
            ...w,
            width: w.height,
            height: w.width,
            rotation: ((w.rotation || 0) + 90) % 360,
          };
        }
        return w;
      }),
    }));
  };

  const deleteWall = (id) => {
    setStructure((prev) => ({
      ...prev,
      walls: (prev.walls || []).filter((w) => w.id !== id),
    }));
    if (selectedStructureItem?.id === id) setSelectedStructureItem(null);
  };

  // Porte
  const addDoor = (doorData) => {
    const newDoor = {
      id: 'door_' + Date.now().toString().slice(-4),
      name: doorData?.name || 'Nuova Porta',
      x: doorData?.x || 500,
      y: doorData?.y || 450,
      width: doorData?.width || 65,
      rotation: doorData?.rotation || 0,
      swing: doorData?.swing || 'left',
    };
    setStructure((prev) => ({
      ...prev,
      doors: [...(prev.doors || []), newDoor],
    }));
    setSelectedStructureItem({ type: 'door', id: newDoor.id, data: newDoor });
    return newDoor;
  };

  const updateDoor = (id, newProps) => {
    setStructure((prev) => ({
      ...prev,
      doors: (prev.doors || []).map((d) => (d.id === id ? { ...d, ...newProps } : d)),
    }));
    if (selectedStructureItem?.id === id) {
      setSelectedStructureItem((prev) => ({ ...prev, data: { ...prev.data, ...newProps } }));
    }
  };

  const rotateDoor = (id) => {
    setStructure((prev) => ({
      ...prev,
      doors: (prev.doors || []).map((d) =>
        d.id === id ? { ...d, rotation: ((d.rotation || 0) + 90) % 360 } : d
      ),
    }));
  };

  const deleteDoor = (id) => {
    setStructure((prev) => ({
      ...prev,
      doors: (prev.doors || []).filter((d) => d.id !== id),
    }));
    if (selectedStructureItem?.id === id) setSelectedStructureItem(null);
  };

  // Finestre
  const addWindow = (winData) => {
    const newWindow = {
      id: 'win_' + Date.now().toString().slice(-4),
      name: winData?.name || 'Vetrata',
      x: winData?.x || 450,
      y: winData?.y || 80,
      width: winData?.width || 200,
      height: winData?.height || 12,
      rotation: winData?.rotation || 0,
    };
    setStructure((prev) => ({
      ...prev,
      windows: [...(prev.windows || []), newWindow],
    }));
    setSelectedStructureItem({ type: 'window', id: newWindow.id, data: newWindow });
    return newWindow;
  };

  const updateWindow = (id, newProps) => {
    setStructure((prev) => ({
      ...prev,
      windows: (prev.windows || []).map((w) => (w.id === id ? { ...w, ...newProps } : w)),
    }));
    if (selectedStructureItem?.id === id) {
      setSelectedStructureItem((prev) => ({ ...prev, data: { ...prev.data, ...newProps } }));
    }
  };

  const rotateWindow = (id) => {
    setStructure((prev) => ({
      ...prev,
      windows: (prev.windows || []).map((w) => {
        if (w.id === id) {
          return {
            ...w,
            width: w.height,
            height: w.width,
            rotation: ((w.rotation || 0) + 90) % 360,
          };
        }
        return w;
      }),
    }));
  };

  const deleteWindow = (id) => {
    setStructure((prev) => ({
      ...prev,
      windows: (prev.windows || []).filter((w) => w.id !== id),
    }));
    if (selectedStructureItem?.id === id) setSelectedStructureItem(null);
  };

  // Arredi Fissi & Blocchi
  const addFixture = (fixData) => {
    const newFix = {
      id: 'fix_' + Date.now().toString().slice(-4),
      name: fixData?.name || 'Nuovo Elemento',
      type: fixData?.type || 'counter',
      x: fixData?.x || 500,
      y: fixData?.y || 400,
      width: fixData?.width || 150,
      height: fixData?.height || 50,
      rotation: fixData?.rotation || 0,
    };
    setStructure((prev) => ({
      ...prev,
      fixtures: [...(prev.fixtures || []), newFix],
    }));
    setSelectedStructureItem({ type: 'fixture', id: newFix.id, data: newFix });
    return newFix;
  };

  const updateFixture = (id, newProps) => {
    setStructure((prev) => ({
      ...prev,
      fixtures: (prev.fixtures || []).map((f) => (f.id === id ? { ...f, ...newProps } : f)),
    }));
    if (selectedStructureItem?.id === id) {
      setSelectedStructureItem((prev) => ({ ...prev, data: { ...prev.data, ...newProps } }));
    }
  };

  const rotateFixture = (id) => {
    setStructure((prev) => ({
      ...prev,
      fixtures: (prev.fixtures || []).map((f) =>
        f.id === id ? { ...f, rotation: ((f.rotation || 0) + 90) % 360 } : f
      ),
    }));
  };

  const deleteFixture = (id) => {
    setStructure((prev) => ({
      ...prev,
      fixtures: (prev.fixtures || []).filter((f) => f.id !== id),
    }));
    if (selectedStructureItem?.id === id) setSelectedStructureItem(null);
  };

  // Svuota completamente la piantina
  const clearAllLayout = (includeStructure = false) => {
    setTables([]);
    setZoneLabels([]);
    setSelectedTable(null);
    if (includeStructure) {
      setStructure({
        perimeter: {
          x: 120,
          y: 80,
          width: 880,
          height: 880,
          strokeWidth: 9,
          fill: '#151515',
          borderColor: '#404040',
        },
        walls: [],
        doors: [],
        windows: [],
        fixtures: [],
      });
      setSelectedStructureItem(null);
    }
  };

  // Reset a stato iniziale (default image template)
  const resetTables = () => {
    setTables(INITIAL_TABLES);
    setZoneLabels(INITIAL_ZONE_LABELS);
    setStructure(INITIAL_STRUCTURE);
    setSelectedTable(null);
    setSelectedStructureItem(null);
    saveLayout();
  };

  // ============================================================
  // OPENING HOURS & HOLIDAYS MANAGEMENT HANDLERS
  // ============================================================
  const updateDayHours = (dayKey, dayData) => {
    setOpeningHours((prev) => {
      const updated = {
        ...prev,
        [dayKey]: {
          ...(prev[dayKey] || {}),
          ...dayData,
        },
      };
      return updated;
    });
    setSaveSuccessMessage('Orari di apertura aggiornati con successo!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const updateAllOpeningHours = (newHours) => {
    setOpeningHours(newHours);
    setSaveSuccessMessage('Tutti gli orari settimanali sono stati salvati!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const resetOpeningHours = () => {
    setOpeningHours(DEFAULT_OPENING_HOURS);
    setSaveSuccessMessage('Orari ripristinati alla configurazione predefinita!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const addHoliday = (holidayData) => {
    const newHoliday = {
      id: 'hol_' + Date.now().toString().slice(-6),
      name: holidayData.name || 'Nuovo Periodo Chiusura',
      type: holidayData.type || 'ferie',
      startDate: holidayData.startDate || getTodayDateString(),
      endDate: holidayData.endDate || holidayData.startDate || getTodayDateString(),
      notes: holidayData.notes || '',
      bannerActive: holidayData.bannerActive !== undefined ? holidayData.bannerActive : true,
      createdAt: new Date().toISOString(),
    };
    setHolidays((prev) => {
      const updated = [newHoliday, ...prev];
      return updated;
    });
    setSaveSuccessMessage(`Periodo "${newHoliday.name}" aggiunto con successo!`);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
    return newHoliday;
  };

  const updateHoliday = (id, holidayData) => {
    setHolidays((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, ...holidayData } : h));
      return updated;
    });
    setSaveSuccessMessage('Periodo di chiusura/ferie aggiornato!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const deleteHoliday = (id) => {
    setHolidays((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      return updated;
    });
    setSaveSuccessMessage('Periodo rimosso.');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const toggleHolidayBanner = (id) => {
    setHolidays((prev) => {
      const updated = prev.map((h) =>
        h.id === id ? { ...h, bannerActive: !h.bannerActive } : h
      );
      return updated;
    });
  };

  const isDateInHoliday = (dateStr) => {
    if (!dateStr || !holidays || holidays.length === 0) return { isHoliday: false, holiday: null };
    const target = dateStr;
    const match = holidays.find((h) => target >= h.startDate && target <= h.endDate);
    if (match) {
      return { isHoliday: true, holiday: match };
    }
    return { isHoliday: false, holiday: null };
  };

  const isRestaurantOpenOnDate = (dateStr, shift = 'cena') => {
    const holCheck = isDateInHoliday(dateStr);
    if (holCheck.isHoliday) {
      return {
        isOpen: false,
        reason: `Chiuso per ${holCheck.holiday.name} (${holCheck.holiday.notes || 'Ferie / Chiusura programmata'})`,
        isHoliday: true,
        holiday: holCheck.holiday,
      };
    }
    if (!dateStr) return { isOpen: true };
    const parts = dateStr.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dayIndex = dateObj.getDay();
    const daysKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = daysKeys[dayIndex];
    const dayConfig = openingHours[dayKey];

    if (!dayConfig || dayConfig.closed) {
      return {
        isOpen: false,
        reason: `${dayConfig?.label || 'Questo giorno'} è il giorno di chiusura settimanale.`,
        isWeeklyClosed: true,
      };
    }

    if (shift === 'pranzo' && !dayConfig.lunch?.enabled) {
      return {
        isOpen: false,
        reason: `Siamo chiusi a pranzo il ${dayConfig.label}. Servizio attivo solo a cena.`,
        isShiftClosed: true,
      };
    }

    if (shift === 'cena' && !dayConfig.dinner?.enabled) {
      return {
        isOpen: false,
        reason: `Siamo chiusi a cena il ${dayConfig.label}. Servizio attivo solo a pranzo.`,
        isShiftClosed: true,
      };
    }

    return {
      isOpen: true,
      dayConfig,
      shiftHours: shift === 'pranzo' ? dayConfig.lunch : dayConfig.dinner,
    };
  };

  // Fasce orarie prenotabili per data e turno (stessa regola del server)
  const getBookingSlots = (dateStr, shift = 'cena') => {
    const check = isRestaurantOpenOnDate(dateStr, shift);
    if (!check.isOpen) return [];
    return buildSlots(check.shiftHours);
  };

  // Statistiche calcolate in tempo reale
  const totalTablesCount = tables.length;
  const occupiedTablesCount = tables.filter((t) => t.status !== 'disponibile').length;
  const availableTablesCount = tables.filter((t) => t.status === 'disponibile').length;
  const totalGuestsCount = tables.reduce((acc, t) => acc + (t.reservation?.guests || 0), 0);
  const totalCapacity = tables.reduce((acc, t) => acc + (t.seats || 4), 0);

  return (
    <AdminContext.Provider
      value={{
        isAdminView,
        setIsAdminView,
        isAuthenticated,
        isLoginOpen,
        setIsLoginOpen,
        login,
        logout,
        getBookingSlots,
        activeTab,
        setActiveTab,
        isStructureEditMode,
        setIsStructureEditMode,
        selectedStructureItem,
        setSelectedStructureItem,
        tables,
        zoneLabels,
        structure,
        selectedTable,
        setSelectedTable,
        isModalOpen,
        setIsModalOpen,
        activeShift,
        setActiveShift,
        selectedDate,
        setSelectedDate,
        isCalendarOpen,
        setIsCalendarOpen,
        dailyConfigs,
        getSummaryForDate,
        copyLayoutFromDate,
        saveSuccessMessage,
        saveLayout,
        createClientReservation,
        getAvailableSlotsForDate,
        isBookingModalOpen,
        setIsBookingModalOpen,
        newReservationToast,
        setNewReservationToast,
        findBestFreeTable,
        saveReservation,
        clearTable,
        updateTablePosition,
        rotateTable,
        deleteTable,
        mergeTables,
        splitTable,
        addTable,
        addZoneLabel,
        updateZonePosition,
        updateZoneLabel,
        deleteZoneLabel,
        // Structural functions
        updatePerimeter,
        addWall,
        updateWall,
        rotateWall,
        deleteWall,
        addDoor,
        updateDoor,
        rotateDoor,
        deleteDoor,
        addWindow,
        updateWindow,
        rotateWindow,
        deleteWindow,
        addFixture,
        updateFixture,
        rotateFixture,
        deleteFixture,
        clearAllLayout,
        resetTables,
        // Opening hours & Holidays management
        openingHours,
        holidays,
        updateDayHours,
        updateAllOpeningHours,
        resetOpeningHours,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        toggleHolidayBanner,
        isDateInHoliday,
        isRestaurantOpenOnDate,
        stats: {
          totalTables: totalTablesCount,
          occupiedTables: occupiedTablesCount,
          availableTables: availableTablesCount,
          totalGuests: totalGuestsCount,
          totalCapacity,
          occupancyRate: Math.round((occupiedTablesCount / (totalTablesCount || 1)) * 100),
        },
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

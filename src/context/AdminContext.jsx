import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_TABLES } from '../data/defaultLayout';
import { DEFAULT_OPENING_HOURS, DEFAULT_HOLIDAYS } from '../data/defaultSchedule';
import { api } from '../services/api';
import { buildSlots } from '../utils/schedule';

const AdminContext = createContext();

export { INITIAL_TABLES, DEFAULT_OPENING_HOURS, DEFAULT_HOLIDAYS };

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
  // Finché gli orari non arrivano dal server non si salva nulla: si sovrascriverebbero con i valori predefiniti
  const scheduleLoadedRef = useRef(false);
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
        scheduleLoadedRef.current = true;
      })
      .catch((err) => console.warn('Orari: uso i valori predefiniti, server non raggiungibile.', err.message));
  }, []);

  useEffect(() => {
    if (!scheduleDirtyRef.current.hours) return;
    if (!scheduleLoadedRef.current) {
      flashMessage('⚠️ Orari NON salvati: dati del server non caricati. Ricarica la pagina e riprova.', 6000);
      return;
    }
    scheduleDirtyRef.current.hours = false;
    api.put('state.php', { key: 'opening_hours', value: openingHours }).catch((err) => {
      scheduleDirtyRef.current.hours = true;
      setSaveSuccessMessage(`⚠️ Orari NON salvati sul server: ${err.message}`);
      setTimeout(() => setSaveSuccessMessage(''), 5000);
    });
  }, [openingHours]);

  useEffect(() => {
    if (!scheduleDirtyRef.current.holidays) return;
    if (!scheduleLoadedRef.current) {
      flashMessage('⚠️ Ferie NON salvate: dati del server non caricati. Ricarica la pagina e riprova.', 6000);
      return;
    }
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
  // Mappa "YYYY-MM-DD_turno" -> { tables }
  const [dailyConfigs, setDailyConfigs] = useState(() => {
    const today = getTodayDateString();
    return {
      [`${today}_cena`]: {
        tables: INITIAL_TABLES,
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

  // Tavoli del giorno/turno selezionato
  const currentKey = `${selectedDate}_${activeShift}`;
  const [tables, setTables] = useState(() => dailyConfigs[currentKey]?.tables || INITIAL_TABLES);

  // Ultimo stato caricato (dal server o dal cambio data): se tables è ancora questo
  // oggetto, non c'è nessuna modifica dell'admin da salvare.
  const loadedSnapshotRef = useRef({ key: currentKey, tables });
  const skipNextSaveRef = useRef(true);

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
    loadedSnapshotRef.current = { key, tables: nextTables };
    setTables(nextTables);
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
    // Le configurazioni con una modifica dell'admin in attesa di salvataggio restano alla versione
    // vecchia: così il salvataggio riceve 409 e non cancella una prenotazione online appena arrivata.
    const changedKeys = Object.keys(incoming).filter(
      (key) => incoming[key].version !== versionsRef.current[key] && pendingSaveRef.current?.key !== key
    );
    // Le chiavi saltate vanno ricontrollate al prossimo giro anche se il server non le cambia più
    if (Object.keys(incoming).some((key) => pendingSaveRef.current?.key === key)) {
      lastSyncRef.current = since;
    }
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
        data: { tables: data.tables },
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
      loadedSnapshotRef.current = { key: targetKey, tables: existing.tables };
      setTables(existing.tables);
    } else {
      // New date / shift: create clean default template ready for booking & planning
      const freshTables = INITIAL_TABLES.map((t) => ({
        ...t,
        status: 'disponibile',
        reservation: null,
        colorOverride: null,
      }));
      loadedSnapshotRef.current = { key: targetKey, tables: freshTables };
      setTables(freshTables);

      setDailyConfigs((prev) => {
        const updated = {
          ...prev,
          [targetKey]: {
            tables: freshTables,
            updatedAt: new Date().toISOString(),
          },
        };
        return cleanupOldDailyConfigs(updated);
      });
    }
  }, [selectedDate, activeShift]);

  // Auto-save: ogni modifica dell'admin alle prenotazioni del giorno/turno attivo viene salvata sul server
  useEffect(() => {
    if (skipNextSaveRef.current) {
      // render del cambio data/turno: tables contiene ancora i dati del giorno precedente
      skipNextSaveRef.current = false;
      return;
    }
    const targetKey = `${selectedDate}_${activeShift}`;
    const snap = loadedSnapshotRef.current;
    if (snap.key === targetKey && snap.tables === tables) {
      return; // nessuna modifica rispetto a quanto caricato
    }

    const data = { tables, updatedAt: new Date().toISOString() };
    setDailyConfigs((prev) => cleanupOldDailyConfigs({ ...prev, [targetKey]: data }));
    loadedSnapshotRef.current = { key: targetKey, tables };

    if (!isAuthenticated) return;
    if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current.timer);
    const timer = setTimeout(() => {
      pendingSaveRef.current = null;
      putConfig(targetKey, data);
    }, 700);
    pendingSaveRef.current = { key: targetKey, timer, data };
  }, [tables, selectedDate, activeShift]);

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
        // ordine "naturale" (T6 prima di T10), come strnatcasecmp sul server
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' });
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

    // Il tavolo scelto può essere stato preso nel frattempo da una prenotazione online
    // (arrivata con l'aggiornamento automatico): mai sovrascriverla.
    const isTakenByOther = (t) =>
      t && t.reservation && t.id !== sourceTableId && t.reservation.code !== resData.code;
    const target = tables.find((t) => t.id === targetTableId);
    if (isTakenByOther(target)) {
      alert(
        `Il tavolo ${target.name} è appena stato occupato da "${target.reservation.name || target.reservation.clientName || 'un altro cliente'}". Scegli un altro tavolo.`
      );
      return false;
    }

    setTables((prev) => {
      if (isTakenByOther(prev.find((t) => t.id === targetTableId))) return prev;
      return prev.map((t) => {
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
            // il colore segue lo stato (una prenotazione online nasce gialla e diventa rossa quando si siedono)
            colorOverride: resData.status === 'Seduti' ? '#d2401e' : '#f59e0b',
            reservation: {
              ...resData,
              color: undefined,
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          };
        }
        return t;
      });
    });
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
        tables,
        activeShift,
        setActiveShift,
        selectedDate,
        setSelectedDate,
        isCalendarOpen,
        setIsCalendarOpen,
        dailyConfigs,
        getSummaryForDate,
        saveSuccessMessage,
        createClientReservation,
        getAvailableSlotsForDate,
        isBookingModalOpen,
        setIsBookingModalOpen,
        newReservationToast,
        setNewReservationToast,
        findBestFreeTable,
        saveReservation,
        clearTable,
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

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

// ============================================================
// DEFAULT TEMPLATE (EXACT REPLICA OF USER REFERENCE IMAGE)
// ============================================================
export const INITIAL_TABLES = [
  // --- SALA SINISTRA ---
  // 1. T10 in alto a sinistra (4 posti quadrato)
  {
    id: 'T10_TOP_LEFT',
    name: 'T10',
    room: 'left',
    type: 'square',
    seats: 4,
    x: 115,
    y: 205,
    width: 48,
    height: 48,
    status: 'disponibile',
    reservation: null,
  },
  // 2. T6 a centro-sinistra (2 posti)
  {
    id: 'T6_MID_LEFT',
    name: 'T6',
    room: 'left',
    type: 'rect',
    seats: 2,
    x: 180,
    y: 320,
    width: 48,
    height: 44,
    status: 'disponibile',
    reservation: null,
  },
  // 3. T4+T4+T4 al centro-sinistra inferiore (6 posti orizzontale)
  {
    id: 'T4_MERGED_LEFT',
    name: 'T4+T4+T4',
    room: 'left',
    type: 'rect',
    seats: 6,
    isModular: true,
    x: 208,
    y: 525,
    width: 128,
    height: 60,
    status: 'disponibile',
    reservation: null,
  },
  // 4. T10 in basso a sinistra (4 posti quadrato)
  {
    id: 'T10_BOTTOM_LEFT',
    name: 'T10',
    room: 'left',
    type: 'square',
    seats: 4,
    x: 112,
    y: 655,
    width: 48,
    height: 48,
    status: 'disponibile',
    reservation: null,
  },
  // 5. T5+T5+T5+T5 in basso al centro (8 posti orizzontale)
  {
    id: 'T5_MERGED_CENTER',
    name: 'T5+T5+T5+T5',
    room: 'left',
    type: 'rect',
    seats: 8,
    isModular: true,
    x: 320,
    y: 660,
    width: 215,
    height: 65,
    status: 'disponibile',
    reservation: null,
  },

  // --- COLONNA CENTRALE ---
  // 6. T10 in alto al centro (6 posti orizzontale)
  {
    id: 'T10_CENTER_TOP',
    name: 'T10',
    room: 'main',
    type: 'rect',
    seats: 6,
    x: 408,
    y: 220,
    width: 125,
    height: 55,
    status: 'disponibile',
    reservation: null,
  },
  // 7. T10 al centro (4 posti orizzontale)
  {
    id: 'T10_CENTER_MID',
    name: 'T10',
    room: 'main',
    type: 'rect',
    seats: 4,
    x: 448,
    y: 395,
    width: 85,
    height: 55,
    status: 'disponibile',
    reservation: null,
  },
  // 8. T10 al centro-basso (PRENOTATO da "czz (3p)", 4 posti orizzontale, arancione)
  {
    id: 'T10_CENTER_BOOKED',
    name: 'T10',
    room: 'main',
    type: 'rect',
    seats: 4,
    x: 442,
    y: 525,
    width: 88,
    height: 55,
    status: 'in_corso',
    colorOverride: '#f59e0b',
    reservation: {
      name: 'czz',
      clientName: 'czz',
      guests: 3,
      time: '20:30',
      status: 'In Attesa',
      color: '#f59e0b',
      code: 'SV-7821',
      phone: '+39 333 4567890',
      notes: '',
    },
  },

  // --- SALA DESTRA ---
  // 9. T6 rotondo al centro (4 posti rotondo)
  {
    id: 'T6_RIGHT_ROUND_MID',
    name: 'T6',
    room: 'main',
    type: 'round',
    seats: 4,
    x: 635,
    y: 422,
    radius: 30,
    status: 'disponibile',
    reservation: null,
  },
  // 10. T13 in alto a destra (4 posti orizzontale)
  {
    id: 'T13_TOP_RIGHT',
    name: 'T13',
    room: 'main',
    type: 'rect',
    seats: 4,
    x: 850,
    y: 285,
    width: 85,
    height: 50,
    status: 'disponibile',
    reservation: null,
  },
  // 11. T13 al centro a destra (4 posti orizzontale)
  {
    id: 'T13_MID_RIGHT',
    name: 'T13',
    room: 'main',
    type: 'rect',
    seats: 4,
    x: 850,
    y: 395,
    width: 85,
    height: 50,
    status: 'disponibile',
    reservation: null,
  },
  // 12. T13 al centro sotto T6 rotondo (4 posti orizzontale)
  {
    id: 'T13_CENTER_RIGHT',
    name: 'T13',
    room: 'main',
    type: 'rect',
    seats: 4,
    x: 595,
    y: 525,
    width: 85,
    height: 50,
    status: 'disponibile',
    reservation: null,
  },
  // 13. T13 al centro-basso a destra (4 posti orizzontale)
  {
    id: 'T13_LOWER_RIGHT',
    name: 'T13',
    room: 'main',
    type: 'rect',
    seats: 4,
    x: 846,
    y: 532,
    width: 85,
    height: 50,
    status: 'disponibile',
    reservation: null,
  },
  // 14. T6+T13 in basso a sinistra della sala destra (4 posti orizzontale modulare)
  {
    id: 'T6_T13_MERGED_BOTTOM',
    name: 'T6+T13',
    room: 'main',
    type: 'rect',
    seats: 4,
    isModular: true,
    x: 600,
    y: 670,
    width: 85,
    height: 50,
    status: 'disponibile',
    reservation: null,
  },
  // 15. T6 rotondo in basso a destra sopra il bagno (4 posti rotondo)
  {
    id: 'T6_RIGHT_ROUND_BOTTOM',
    name: 'T6',
    room: 'main',
    type: 'round',
    seats: 4,
    x: 868,
    y: 686,
    radius: 32,
    status: 'disponibile',
    reservation: null,
  },
];

export const INITIAL_ZONE_LABELS = [
  {
    id: 'zone_fumatori',
    name: 'AREA FUMATORI',
    subtitle: 'Zona Riservata',
    x: 302,
    y: 895,
    color: '#c084fc',
  },
];

export const INITIAL_STRUCTURE = {
  perimeter: {
    x: 60,
    y: 20,
    width: 880,
    height: 940,
    strokeWidth: 9,
    fill: '#151515',
    borderColor: '#404040',
  },
  walls: [
    // Muro divisorio superiore tra Pass e Bar
    {
      id: 'wall_top_div',
      name: 'Muro Superiore Divisorio',
      x: 565,
      y: 20,
      width: 10,
      height: 60,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Muro orizzontale cucina (in alto a sinistra)
    {
      id: 'wall_cucina_left',
      name: 'Muro Cucina Sinistra',
      x: 65,
      y: 165,
      width: 210,
      height: 10,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Muro orizzontale centro (di fronte alla porta cucina)
    {
      id: 'wall_cucina_mid',
      name: 'Muro Orizzontale Centro',
      x: 350,
      y: 170,
      width: 215,
      height: 10,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete divisoria verticale Nord (sopra porta 1)
    {
      id: 'wall_div_top',
      name: 'Muro Divisorio Nord',
      x: 565,
      y: 170,
      width: 10,
      height: 160,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete divisoria verticale Centro 1
    {
      id: 'wall_div_mid1',
      name: 'Muro Divisorio Centro 1',
      x: 565,
      y: 390,
      width: 10,
      height: 65,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete divisoria verticale Centro 2
    {
      id: 'wall_div_mid2',
      name: 'Muro Divisorio Centro 2',
      x: 565,
      y: 518,
      width: 10,
      height: 65,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete divisoria verticale Sud
    {
      id: 'wall_div_bottom',
      name: 'Muro Divisorio Sud',
      x: 565,
      y: 655,
      width: 10,
      height: 75,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete sinistra del bagno in basso a destra
    {
      id: 'wall_bath_left',
      name: 'Muro Bagno Sinistra',
      x: 565,
      y: 805,
      width: 10,
      height: 165,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete orizzontale sopra il bagno in basso a destra
    {
      id: 'wall_bath_top',
      name: 'Muro Bagno Superiore',
      x: 565,
      y: 805,
      width: 330,
      height: 10,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete verticale interna bagno destra
    {
      id: 'wall_bath_inner_div',
      name: 'Muro Bagno Destra',
      x: 870,
      y: 875,
      width: 10,
      height: 95,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
    // Parete orizzontale in alto a destra sotto ingresso
    {
      id: 'wall_top_right_short',
      name: 'Muro Ingresso Orizzontale',
      x: 850,
      y: 195,
      width: 110,
      height: 10,
      rotation: 0,
      type: 'wall',
      color: '#555555',
    },
  ],
  doors: [
    // Porta battente cucina sinistra
    {
      id: 'door_cucina',
      name: 'Porta Cucina',
      x: 280,
      y: 165,
      width: 55,
      rotation: 0,
      swing: 'left',
    },
    // Porta ingresso destra 1
    {
      id: 'door_top_right_1',
      name: 'Porta Ingresso 1',
      x: 820,
      y: 130,
      width: 55,
      rotation: 180,
      swing: 'left',
    },
    // Porta ingresso destra 2
    {
      id: 'door_top_right_2',
      name: 'Porta Ingresso 2',
      x: 910,
      y: 130,
      width: 55,
      rotation: 180,
      swing: 'left',
    },
    // Porta bagno
    {
      id: 'door_bath',
      name: 'Porta Bagno',
      x: 870,
      y: 810,
      width: 55,
      rotation: 0,
      swing: 'left',
    },
  ],
  windows: [
    // Vetrata Panoramica in basso a sinistra
    {
      id: 'win_vetrata_bottom',
      name: 'Vetrata Panoramica',
      x: 65,
      y: 820,
      width: 495,
      height: 14,
      rotation: 0,
    },
  ],
  fixtures: [
    // Pass Cucina (in alto a sinistra)
    {
      id: 'fix_pass_cucina',
      name: 'Pass Cucina',
      type: 'kitchen_pass',
      x: 165,
      y: 40,
      width: 285,
      height: 44,
      rotation: 0,
    },
    // Bancone Bar con Sgabelli (in alto a destra)
    {
      id: 'fix_bar_topright',
      name: 'Bancone Bar con Sgabelli',
      type: 'bar',
      x: 640,
      y: 40,
      width: 165,
      height: 35,
      rotation: 0,
    },
    // Cassa & Reception (verticale, sotto il bar)
    {
      id: 'fix_cassa_reception',
      name: 'Cassa & Reception',
      type: 'counter',
      x: 618,
      y: 182,
      width: 40,
      height: 125,
      rotation: 0,
    },
    // Bagno Singolo (in basso a destra)
    {
      id: 'fix_bagno_singolo',
      name: 'Bagno Singolo',
      type: 'restroom_single',
      x: 610,
      y: 840,
      width: 175,
      height: 100,
      rotation: 0,
    },
  ],
};

// Helper: Determina se un tavolo è modulare da 2 persone (o unito da tavoli da 2)
export const isModularTable = (table) => {
  if (!table) return false;
  if (table.type === 'round') return false;
  if (table.isModular === true) return true;
  if (table.mergedFrom && table.mergedFrom.length > 0) return true;
  if (table.type === 'square' && table.seats === 2) return true;
  return false;
};

export const getTodayDateString = () => {
  const d = new Date();
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

// ============================================================
// DEFAULT OPENING HOURS & HOLIDAYS CONFIGURATIONS
// ============================================================
export const DEFAULT_OPENING_HOURS = {
  monday: {
    key: 'monday',
    label: 'Lunedì',
    closed: true,
    lunch: { open: '12:00', close: '14:30', enabled: false },
    dinner: { open: '19:00', close: '23:30', enabled: false },
  },
  tuesday: {
    key: 'tuesday',
    label: 'Martedì',
    closed: false,
    lunch: { open: '12:00', close: '14:30', enabled: true },
    dinner: { open: '19:00', close: '23:30', enabled: true },
  },
  wednesday: {
    key: 'wednesday',
    label: 'Mercoledì',
    closed: false,
    lunch: { open: '12:00', close: '14:30', enabled: true },
    dinner: { open: '19:00', close: '23:30', enabled: true },
  },
  thursday: {
    key: 'thursday',
    label: 'Giovedì',
    closed: false,
    lunch: { open: '12:00', close: '14:30', enabled: true },
    dinner: { open: '19:00', close: '23:30', enabled: true },
  },
  friday: {
    key: 'friday',
    label: 'Venerdì',
    closed: false,
    lunch: { open: '12:00', close: '14:30', enabled: true },
    dinner: { open: '19:00', close: '00:00', enabled: true },
  },
  saturday: {
    key: 'saturday',
    label: 'Sabato',
    closed: false,
    lunch: { open: '12:00', close: '15:00', enabled: true },
    dinner: { open: '19:00', close: '00:30', enabled: true },
  },
  sunday: {
    key: 'sunday',
    label: 'Domenica',
    closed: false,
    lunch: { open: '12:00', close: '15:00', enabled: true },
    dinner: { open: '19:00', close: '23:30', enabled: true },
  },
};

export const DEFAULT_HOLIDAYS = [
  {
    id: 'hol_ferie_estive',
    name: 'Ferie Estive di Ferragosto',
    type: 'ferie',
    startDate: '2026-08-10',
    endDate: '2026-08-24',
    notes: 'Riapertura regolare martedì 25 Agosto con il consueto menù estivo.',
    bannerActive: true,
  },
  {
    id: 'hol_natale',
    name: 'Festività Natalizie & Santo Stefano',
    type: 'festivita',
    startDate: '2026-12-25',
    endDate: '2026-12-26',
    notes: 'Chiusura per le festività di Natale e Santo Stefano.',
    bannerActive: false,
  },
];

export const AdminProvider = ({ children }) => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeTab, setActiveTab] = useState('tavoli');
  const [isStructureEditMode, setIsStructureEditMode] = useState(false);
  const [selectedStructureItem, setSelectedStructureItem] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [activeShift, setActiveShift] = useState('cena');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // ============================================================
  // OPENING HOURS & HOLIDAYS / VACATION STATE
  // ============================================================
  const [openingHours, setOpeningHours] = useState(() => {
    try {
      const saved = localStorage.getItem('sapore_verace_opening_hours_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading opening hours:', e);
    }
    return DEFAULT_OPENING_HOURS;
  });

  const [holidays, setHolidays] = useState(() => {
    try {
      const saved = localStorage.getItem('sapore_verace_holidays_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading holidays:', e);
    }
    return DEFAULT_HOLIDAYS;
  });


  // Daily multi-day table configurations map (keyed by YYYY-MM-DD_shift)
  const [dailyConfigs, setDailyConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem('sapore_verace_daily_configs_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        return cleanupOldDailyConfigs(parsed);
      }
    } catch (e) {
      console.error('Error loading daily configs:', e);
    }
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

  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newReservationToast, setNewReservationToast] = useState(null);

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

  // Real-time synchronization across browser tabs and components via Storage & CustomEvent
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sapore_verace_daily_configs_v6' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setDailyConfigs(parsed);
          const currentKey = `${selectedDate}_${activeShift}`;
          if (parsed[currentKey] && parsed[currentKey].tables) {
            setTables(parsed[currentKey].tables);
          }
        } catch (err) {
          console.error('Error syncing daily configs from storage:', err);
        }
      }
    };

    const handleCustomNewReservation = (e) => {
      const detail = e.detail || {};
      playNotificationChime();
      setNewReservationToast({
        id: Date.now(),
        reservation: detail.reservation,
        table: detail.table,
        date: detail.date,
        shift: detail.shift,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sapore_verace_new_reservation', handleCustomNewReservation);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sapore_verace_new_reservation', handleCustomNewReservation);
    };
  }, [selectedDate, activeShift]);

  // When selectedDate or activeShift changes, load that day's setup or create a fresh standard setup
  useEffect(() => {
    const targetKey = `${selectedDate}_${activeShift}`;
    const existing = dailyConfigs[targetKey];

    if (existing && existing.tables) {
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

  // Auto-save active day's layout & reservations into dailyConfigs and localStorage
  useEffect(() => {
    const targetKey = `${selectedDate}_${activeShift}`;
    setDailyConfigs((prev) => {
      const updated = {
        ...prev,
        [targetKey]: {
          tables,
          zoneLabels,
          structure,
          updatedAt: new Date().toISOString(),
        },
      };
      const cleaned = cleanupOldDailyConfigs(updated);
      try {
        localStorage.setItem('sapore_verace_daily_configs_v6', JSON.stringify(cleaned));
      } catch (e) {
        console.error('Error saving daily configs:', e);
      }
      return cleaned;
    });
  }, [tables, zoneLabels, structure, selectedDate, activeShift]);

  // Esplicito salvataggio manuale del layout con feedback toast
  const saveLayout = () => {
    try {
      const targetKey = `${selectedDate}_${activeShift}`;
      const updated = {
        ...dailyConfigs,
        [targetKey]: {
          tables,
          zoneLabels,
          structure,
          updatedAt: new Date().toISOString(),
        },
      };
      const cleaned = cleanupOldDailyConfigs(updated);
      localStorage.setItem('sapore_verace_daily_configs_v6', JSON.stringify(cleaned));
      setSaveSuccessMessage(`Configurazione salvata per ${selectedDate} (${activeShift})!`);
      setTimeout(() => setSaveSuccessMessage(''), 3500);
      return true;
    } catch (e) {
      console.error('Errore durante il salvataggio:', e);
      return false;
    }
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

    // Clona i tavoli azzerando le prenotazioni passate
    const clonedTables = sourceConfig.tables.map((t) => ({
      ...t,
      status: 'disponibile',
      reservation: null,
      colorOverride: null,
    }));

    const targetKey = `${targetDate}_${shift}`;
    const updated = {
      ...dailyConfigs,
      [targetKey]: {
        tables: clonedTables,
        zoneLabels: sourceConfig.zoneLabels || INITIAL_ZONE_LABELS,
        structure: sourceConfig.structure || INITIAL_STRUCTURE,
        updatedAt: new Date().toISOString(),
      },
    };

    const cleaned = cleanupOldDailyConfigs(updated);
    setDailyConfigs(cleaned);
    try {
      localStorage.setItem('sapore_verace_daily_configs_v6', JSON.stringify(cleaned));
    } catch (e) {
      console.error(e);
    }

    if (targetDate === selectedDate && shift === activeShift) {
      setTables(clonedTables);
      setZoneLabels(sourceConfig.zoneLabels || INITIAL_ZONE_LABELS);
      setStructure(sourceConfig.structure || INITIAL_STRUCTURE);
    }

    setSaveSuccessMessage(`Disposizione copiata da ${sourceDate} al ${targetDate}!`);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
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

  // Helper: verifica disponibilità e crea prenotazione lato cliente online con auto-assegnazione e real-time sync
  const createClientReservation = (data) => {
    const {
      name,
      phone,
      email = '',
      date,
      time,
      guests,
      notes = '',
      tablePreference = 'any',
    } = data;

    const numGuests = Number(guests) || 2;
    const hour = parseInt((time || '20:00').split(':')[0], 10);
    const shift = hour < 16 ? 'pranzo' : 'cena';
    const targetKey = `${date}_${shift}`;

    // 1. Carica la configurazione del giorno/turno target
    let targetConfig = dailyConfigs[targetKey];
    let targetTables;
    if (targetConfig && targetConfig.tables) {
      targetTables = targetConfig.tables;
    } else {
      targetTables = INITIAL_TABLES.map((t) => ({
        ...t,
        status: 'disponibile',
        reservation: null,
        colorOverride: null,
      }));
    }

    // 2. Trova il miglior tavolo libero
    const bestTable = findBestFreeTable(numGuests, null, targetTables);
    if (!bestTable) {
      return {
        success: false,
        message: `Siamo spiacenti, non ci sono tavoli disponibili per ${numGuests} persone per il turno di ${shift} (${time}) del ${date}. Prova un altro orario o un'altra data.`,
      };
    }

    // 3. Genera codice prenotazione univoco
    const bookingCode = 'SV-' + Math.floor(1000 + Math.random() * 9000);

    const newResObj = {
      name: (name || 'Ospite').trim(),
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      time,
      guests: numGuests,
      status: 'In Attesa',
      notes: (notes || '').trim(),
      color: '#f59e0b',
      code: bookingCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'online_client',
    };

    // 4. Assegna la prenotazione al tavolo
    const updatedTables = targetTables.map((t) =>
      t.id === bestTable.id
        ? {
            ...t,
            status: 'in_corso',
            colorOverride: '#f59e0b',
            reservation: newResObj,
          }
        : t
    );

    // 5. Salva in dailyConfigs e localStorage
    const updatedDailyConfigs = {
      ...dailyConfigs,
      [targetKey]: {
        tables: updatedTables,
        zoneLabels: targetConfig?.zoneLabels || INITIAL_ZONE_LABELS,
        structure: targetConfig?.structure || INITIAL_STRUCTURE,
        updatedAt: new Date().toISOString(),
      },
    };

    setDailyConfigs(updatedDailyConfigs);
    try {
      localStorage.setItem('sapore_verace_daily_configs_v3', JSON.stringify(updatedDailyConfigs));
    } catch (e) {
      console.error('Error saving new client reservation:', e);
    }

    // 6. Se l'admin sta guardando la stessa data e turno, aggiorna lo stato tavoli istantaneamente
    if (selectedDate === date && activeShift === shift) {
      setTables(updatedTables);
    }

    // 7. Notifica sonora e toast real-time per la dashboard admin
    playNotificationChime();
    setNewReservationToast({
      id: Date.now(),
      reservation: newResObj,
      table: bestTable,
      date,
      shift,
    });

    // 8. Trigger custom event per altre schede aperte
    try {
      window.dispatchEvent(
        new CustomEvent('sapore_verace_new_reservation', {
          detail: {
            reservation: newResObj,
            table: bestTable,
            date,
            shift,
          },
        })
      );
    } catch (e) {}

    return {
      success: true,
      bookingCode,
      table: bestTable,
      reservation: newResObj,
      date,
      shift,
      time,
    };
  };

  // Helper: ottieni disponibilità fasce orarie e turni per una data
  const getAvailableSlotsForDate = (date, guests = 2) => {
    const numGuests = Number(guests) || 2;
    const pranzoKey = `${date}_pranzo`;
    const cenaKey = `${date}_cena`;

    const getFreeCount = (key) => {
      const cfg = dailyConfigs[key];
      const tableList = cfg?.tables || INITIAL_TABLES;
      const fitting = tableList.filter((t) => t.reservation === null && (t.seats || 4) >= numGuests);
      return fitting.length;
    };

    return {
      pranzoAvailable: getFreeCount(pranzoKey) > 0,
      cenaAvailable: getFreeCount(cenaKey) > 0,
      pranzoTablesFree: getFreeCount(pranzoKey),
      cenaTablesFree: getFreeCount(cenaKey),
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
      try {
        localStorage.setItem('sapore_verace_opening_hours_v2', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving opening hours:', e);
      }
      return updated;
    });
    setSaveSuccessMessage('Orari di apertura aggiornati con successo!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const updateAllOpeningHours = (newHours) => {
    setOpeningHours(newHours);
    try {
      localStorage.setItem('sapore_verace_opening_hours_v2', JSON.stringify(newHours));
    } catch (e) {
      console.error('Error saving opening hours:', e);
    }
    setSaveSuccessMessage('Tutti gli orari settimanali sono stati salvati!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const resetOpeningHours = () => {
    setOpeningHours(DEFAULT_OPENING_HOURS);
    try {
      localStorage.setItem('sapore_verace_opening_hours_v2', JSON.stringify(DEFAULT_OPENING_HOURS));
    } catch (e) {
      console.error(e);
    }
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
      try {
        localStorage.setItem('sapore_verace_holidays_v2', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving holidays:', e);
      }
      return updated;
    });
    setSaveSuccessMessage(`Periodo "${newHoliday.name}" aggiunto con successo!`);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
    return newHoliday;
  };

  const updateHoliday = (id, holidayData) => {
    setHolidays((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, ...holidayData } : h));
      try {
        localStorage.setItem('sapore_verace_holidays_v2', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setSaveSuccessMessage('Periodo di chiusura/ferie aggiornato!');
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const deleteHoliday = (id) => {
    setHolidays((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem('sapore_verace_holidays_v2', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
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
      try {
        localStorage.setItem('sapore_verace_holidays_v2', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
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

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

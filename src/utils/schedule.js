// Fasce orarie prenotabili calcolate dagli orari impostati in admin.
// Stessa regola del backend (api/lib/schedule.php): da apertura a chiusura - 30 minuti, ogni 30 minuti.

export const SLOT_MINUTES = 30;
export const LAST_SLOT_BEFORE_CLOSE = 30;

export const timeToMinutes = (hhmm) => {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm || '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

export const minutesToTime = (min) =>
  `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

export const buildSlots = (hours, step = SLOT_MINUTES, lastBeforeClose = LAST_SLOT_BEFORE_CLOSE) => {
  const open = timeToMinutes(hours?.open);
  let close = timeToMinutes(hours?.close);
  if (open === null || close === null) return [];
  if (close <= open) close += 24 * 60;
  const slots = [];
  for (let m = open; m <= close - lastBeforeClose; m += step) slots.push(minutesToTime(m));
  return slots;
};

// Minuti di un orario del turno dalla mezzanotte del giorno del turno
// (in un turno 19:00-00:30 "00:00" vale 1440, non 0). Come shift_minutes() in PHP.
export const shiftMinutes = (hhmm, shiftOpen) => {
  const t = timeToMinutes(hhmm);
  const open = timeToMinutes(shiftOpen);
  if (t === null) return null;
  return open !== null && t < open ? t + 24 * 60 : t;
};

// Riassunto leggibile degli orari, es. "Mar - Dom" / "12:00 - 14:30"
const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const summarizeOpeningHours = (openingHours, locale = 'it') => {
  if (!openingHours) return { lunch: [], dinner: [], closedDays: [] };
  const groups = { lunch: new Map(), dinner: new Map() };
  const closedDays = [];
  DAY_ORDER.forEach((key) => {
    const d = openingHours[key];
    if (!d || d.closed) {
      if (d) closedDays.push({ label: d.label, idx: DAY_ORDER.indexOf(key) });
      return;
    }
    ['lunch', 'dinner'].forEach((shift) => {
      const h = d[shift];
      if (!h?.enabled) return;
      const range = `${h.open} - ${h.close}`;
      if (!groups[shift].has(range)) groups[shift].set(range, []);
      groups[shift].get(range).push({ label: d.label, idx: DAY_ORDER.indexOf(key) });
    });
  });
  // Nomi brevi dei giorni nella lingua del sito (2024-01-01 era un lunedì)
  const short = (d) => {
    try {
      const name = new Date(2024, 0, 1 + d.idx).toLocaleDateString(locale, { weekday: 'short' }).replace('.', '');
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return d.label.slice(0, 3);
    }
  };
  const toList = (map) =>
    Array.from(map.entries()).map(([range, days]) => {
      const consecutive = days.every((d, i) => i === 0 || d.idx === days[i - 1].idx + 1);
      return {
        range,
        days:
          consecutive && days.length > 2
            ? `${short(days[0])} - ${short(days[days.length - 1])}`
            : days.map(short).join(', '),
      };
    });
  return {
    lunch: toList(groups.lunch),
    dinner: toList(groups.dinner),
    closedDays: closedDays.map((d) => {
      try {
        const name = new Date(2024, 0, 1 + d.idx).toLocaleDateString(locale, { weekday: 'long' });
        return name.charAt(0).toUpperCase() + name.slice(1);
      } catch {
        return d.label;
      }
    }),
  };
};

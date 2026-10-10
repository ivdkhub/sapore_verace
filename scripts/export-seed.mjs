// Genera api/seed.json dai dati di default del frontend, così il backend PHP
// parte esattamente dagli stessi valori (menu, prodotti della settimana, orari, ferie, sala).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MENU_ITEMS } from '../src/data/menuData.js';
import { DEFAULT_WEEKLY_PRODUCTS } from '../src/data/weeklyData.js';
import { DEFAULT_OPENING_HOURS, DEFAULT_HOLIDAYS } from '../src/data/defaultSchedule.js';
import { INITIAL_TABLES, INITIAL_ZONE_LABELS, INITIAL_STRUCTURE } from '../src/data/defaultLayout.js';

const seed = {
  menu_items: MENU_ITEMS,
  weekly_products: DEFAULT_WEEKLY_PRODUCTS,
  opening_hours: DEFAULT_OPENING_HOURS,
  holidays: DEFAULT_HOLIDAYS,
  default_layout: {
    tables: INITIAL_TABLES,
    zoneLabels: INITIAL_ZONE_LABELS,
    structure: INITIAL_STRUCTURE,
  },
};

const out = fileURLToPath(new URL('../api/seed.json', import.meta.url));
writeFileSync(out, JSON.stringify(seed));
console.log('api/seed.json generato');

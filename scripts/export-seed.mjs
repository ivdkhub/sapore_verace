// Genera api/seed.json dai dati di default del frontend, così il backend PHP
// parte esattamente dagli stessi valori (menu, prodotti della settimana, orari, ferie, tavoli).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MENU_ITEMS } from '../src/data/menuData.js';
import { DEFAULT_WEEKLY_PRODUCTS } from '../src/data/weeklyData.js';
import { DEFAULT_OPENING_HOURS, DEFAULT_HOLIDAYS } from '../src/data/defaultSchedule.js';
import { INITIAL_TABLES } from '../src/data/defaultLayout.js';
import { DEFAULT_EVENTS } from '../src/data/eventsData.js';

const seed = {
  menu_items: MENU_ITEMS,
  weekly_products: DEFAULT_WEEKLY_PRODUCTS,
  opening_hours: DEFAULT_OPENING_HOURS,
  holidays: DEFAULT_HOLIDAYS,
  events: DEFAULT_EVENTS,
  default_layout: {
    tables: INITIAL_TABLES,
  },
};

const out = fileURLToPath(new URL('../api/seed.json', import.meta.url));
writeFileSync(out, JSON.stringify(seed));
console.log('api/seed.json generato');

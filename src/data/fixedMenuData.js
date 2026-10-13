// Menù fisso (pranzo lavoro): struttura modificabile dall'area admin (chiave "fixed_menu" sul server).
// Finché l'admin non lo modifica, il sito mostra questi contenuti tradotti nella lingua scelta
// (testi in LanguageContext → fixedLunch); dopo la modifica mostra quelli salvati dall'admin.

// Icone disponibili per le categorie (nomi usati nei dati salvati)
export const FIXED_MENU_ICONS = [
  { id: 'utensils', label: '🍝 Posate (primi)' },
  { id: 'pizza', label: '🍕 Pizza' },
  { id: 'check', label: '✅ Spunta (secondi)' },
  { id: 'coffee', label: '☕ Caffè / bevande' },
  { id: 'wine', label: '🍷 Vino' },
  { id: 'sparkles', label: '✨ Speciale' },
];

// Costruisce il menù fisso dai testi tradotti (fl = t.fixedLunch); i valori di riserva sono quelli italiani
export const fixedMenuFromTranslations = (fl = {}) => ({
  active: true,
  tag: fl.tag || 'DAL LUNEDÌ AL VENERDÌ • ORE 12:00 – 14:30',
  title: fl.title || 'MENÙ FISSO',
  subtitle: fl.subtitle || 'PRANZO LAVORO',
  ribbon: fl.ribbon || 'FORMULA BUSINESS LUNCH',
  desc:
    fl.desc ||
    'La pausa pranzo perfetta a Castellanza: ingredienti freschissimi, rapidità di servizio e l’autentica qualità della tradizione napoletana a un prezzo imbattibile.',
  price: 14,
  priceNote: fl.priceNote || 'Primo o Pizza + Secondo/Contorno + Bevanda + Caffè & Coperto',
  features: [
    { title: fl.feat1_title || 'SERVIZIO RAPIDO (15 MIN)', desc: fl.feat1_desc || 'Ideale per la pausa pranzo di lavoro.' },
    { title: fl.feat2_title || 'INGREDIENTI FRESCHI DI GIORNATA', desc: fl.feat2_desc || 'Pasta fresca fatta a mano e lievitazione 48h.' },
    { title: fl.feat3_title || 'NESSUN COSTO NASCOSTO', desc: fl.feat3_desc || 'Pane, coperto e caffè inclusi nei 14€.' },
  ],
  bottomNote: fl.bottomNote1 || 'Formula valida solo a pranzo dal lunedì al venerdì (escluso festivi).',
  sections: [
    {
      id: 'primi',
      label: fl.tabPrimi || '1. Primi Piatti',
      icon: 'utensils',
      items: [
        {
          name: fl.itemScialatielli || 'Scialatielli ai Frutti di Mare',
          desc: fl.descScialatielli || 'Pasta fresca con cozze, vongole veraci, gamberi e pomodorini del Vesuvio.',
          tag: 'MARE',
        },
        {
          name: fl.itemGnocchi || 'Gnocchi alla Sorrentina nel Coccio',
          desc: fl.descGnocchi || 'Gnocchi di patate con salsa San Marzano DOP, mozzarella filante e basilico fresco.',
          tag: 'TRADIZIONE',
        },
        {
          name: fl.itemPastaRagù || 'Mezze Maniche al Ragù Napoletano',
          desc: fl.descPastaRagù || 'Cottura lenta di 6 ore secondo l’antica ricetta napoletana con spolverata di pecorino.',
          tag: 'GOLOSO',
        },
      ],
    },
    {
      id: 'pizze',
      label: fl.tabPizze || 'Oppure Pizza a Scelta',
      icon: 'pizza',
      items: [
        {
          name: fl.itemMargherita || 'Margherita Verace DOCG',
          desc: fl.descMargherita || 'Pomodoro San Marzano, fior di latte del Matese, basilico e olio EVO.',
          tag: 'CLASSICA',
        },
        {
          name: fl.itemDiavola || 'Diavola Piccante',
          desc: fl.descDiavola || 'Pomodoro, fior di latte, spianata calabrese piccante e basilico.',
          tag: 'PICCANTE',
        },
        {
          name: fl.itemCotto || 'Cotto & Funghi Champignon',
          desc: fl.descCotto || 'Pomodoro San Marzano, fior di latte, prosciutto cotto alta qualità e funghi.',
          tag: 'AMATA',
        },
        {
          name: fl.itemVegetariana || 'Ortolana / Vegetariana',
          desc: fl.descVegetariana || 'Fior di latte, melanzane, zucchine e peperoni grigliati al forno.',
          tag: 'VEGETARIANA',
        },
      ],
    },
    {
      id: 'secondi',
      label: fl.tabSecondi || '2. Secondi & Contorni',
      icon: 'check',
      items: [
        {
          name: fl.itemFrittura || 'Frittura di Calamari & Paranza',
          desc: fl.descFrittura || 'Pescato del giorno fritto ad arte, croccante e dorato con spicchio di limone.',
          tag: 'PESCE',
        },
        {
          name: fl.itemTagliata || 'Tagliata di Manzo con Rucola & Grana',
          desc: fl.descTagliata || 'Carne tenera scottata su piastra con pomodorini e scaglie di Parmigiano 24 mesi.',
          tag: 'CARNE',
        },
        {
          name: fl.itemInsalatona || 'Insalatona Verace con Bufala Campana',
          desc: fl.descInsalatona || 'Misticanza fresca, bocconcini di bufala DOP, datterini e olive taggiasche.',
          tag: 'LIGHT',
        },
        {
          name: fl.itemPatatine || 'Patatine Fritte o Verdure Grigliate',
          desc: fl.descPatatine || 'Contorno caldo e saporito preparato fresco sul momento.',
          tag: 'CONTORNO',
        },
      ],
    },
    {
      id: 'bevande',
      label: fl.tabBevande || '3. Bevanda, Caffè & Coperto',
      icon: 'coffee',
      items: [
        {
          name: fl.itemAcqua || 'Acqua Minerale (50 cl) Naturale o Frizzante',
          desc: fl.descAcqua || 'Servita fredda al tavolo.',
          tag: 'INCLUSA',
        },
        {
          name: fl.itemVinoBibita || 'Calice di Vino della Casa o Bibita in Lattina',
          desc: fl.descVinoBibita || 'A scelta tra vino bianco, rosso campano o bibita (Coca-Cola, Fanta, Sprite).',
          tag: 'INCLUSO',
        },
        {
          name: fl.itemCaffe || 'Caffè Espresso Napoletano & Coperto',
          desc: fl.descCaffe || 'Autentico caffè espresso servito bollente e coperto sempre incluso a 0€.',
          tag: '0€ EXTRA',
        },
      ],
    },
  ],
});

// Versione italiana: punto di partenza dell'editor admin
export const DEFAULT_FIXED_MENU = fixedMenuFromTranslations();

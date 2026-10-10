// Eventi e serate a tema mostrati nella sezione "Eventi" del sito.
// Sono i valori iniziali: l'admin li modifica dalla scheda Eventi e il server salva la versione aggiornata.

export const EVENT_CATEGORIES = [
  { id: 'degustazioni', label: 'Degustazione & Gourmet' },
  { id: 'musica', label: 'Musica & Spettacolo' },
  { id: 'feste', label: 'Feste & Ricorrenze' },
];

export const EVENT_IMAGES = ['/images/ev1.jpg', '/images/ev2.jpg', '/images/ev3.jpg', '/images/ev4.jpg', '/images/ev5.jpg', '/images/ev6.jpg', '/images/ev7.jpg', '/images/ev8.jpg', '/images/ev9.jpg'];

export const DEFAULT_EVENTS = [
  {
    id: 'ev-1',
    title: 'Serata Pizza Gourmet & Vini del Vesuvio',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Tutti i Mercoledì',
    time: '20:30',
    price: '28 € a persona',
    image: '/images/ev1.jpg',
    shortDesc: 'Degustazione di 4 impasti speciali napoletani a lunga lievitazione abbinati a vini selezionati delle pendici del Vesuvio con sommelier in sala.',
    fullDesc: 'Un viaggio sensoriale attraverso l\'eccellenza partenopea. Il nostro Mastro Pizzaiolo presenterà 4 creazioni gourmet esclusive fuori menù, accompagnate da un calice di vino campano DOP selezionato per esaltare i sapori di ogni morso.',
    highlights: ['4 Tranci Gourmet esclusivi', 'Abbinamento 3 Vini DOP Campani', 'Dolce tipico napoletano & Caffè', 'Coperto & Acqua inclusi'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-2',
    title: 'Live Music & Canzoni Tradizionali Napoletane',
    category: 'musica',
    categoryLabel: 'Musica & Spettacolo',
    date: 'Venerdì Sera',
    time: '21:00',
    price: 'Menù alla carta',
    image: '/images/ev2.jpg',
    shortDesc: 'Atmosfera calda e coinvolgente con chitarra, mandolino e i più celebri classici della tradizione musicale napoletana e d\'autore.',
    fullDesc: 'Goditi una serata indimenticabile al calore del nostro forno a legna. I maestri della canzone napoletana vi accompagneranno durante la cena con melodie intramontabili da "O Sole Mio" a "Torna a Surriento" fino ai classici di Pino Daniele.',
    highlights: ['Musica dal vivo in sala', 'Atmosfera intima e suggestiva', 'Menù alla carta senza supplementi', 'Prenotazione consigliata'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-3',
    title: 'Pizza & Bollicine d\'Autore',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Sabato a Pranzo & Cena',
    time: '12:30 / 20:00',
    price: 'Menù alla carta',
    image: '/images/ev3.jpg',
    shortDesc: 'L\'incontro raffinato tra la veracità della pizza cotta a legna e le migliori bollicine italiane, dal Franciacorta al Prosecco di Valdobbiadene.',
    fullDesc: 'Scopri come il perlage fine ed elegante delle bollicine metodo classico sgrassa il palato e sublima la morbidezza del fiordilatte di Agerola e della mozzarella di bufala campana DOP.',
    highlights: ['Carta bollicine al calice e bottiglia', 'Pizze con ingredienti presidio Slow Food', 'Consulenza abbinamento in sala', 'Disponibile sia a pranzo che a cena'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-4',
    title: 'Feste di Compleanno & Ricorrenze Private',
    category: 'feste',
    categoryLabel: 'Feste & Ricorrenze',
    date: 'Su Prenotazione',
    time: 'Personalizzabile',
    price: 'Menù personalizzati da 20 €',
    image: '/images/ev4.jpg',
    shortDesc: 'Festeggia il tuo compleanno o anniversario nella nostra sala riservata con menù pizza illimitato, sfizi fritti e torta personalizzata.',
    fullDesc: 'Mettiamo a tua disposizione spazi accoglienti, allestimenti dedicati e pacchetti menù completi (giro pizza, fritti della tradizione, bevande e dolce) per rendere la tua festa impeccabile e spensierata.',
    highlights: ['Sala o area riservata', 'Giro pizza + Fritti napoletani', 'Torta e spumante su richiesta', 'Assistenza dedicata'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-5',
    title: 'Masterclass: Pizzaiolo per un Giorno',
    category: 'degustazioni',
    categoryLabel: 'Laboratorio & Corsi',
    date: 'Domenica Pomeriggio',
    time: '16:00 - 18:30',
    price: '35 € (con cena inclusa)',
    image: '/images/ev5.jpg',
    shortDesc: 'Impara tutti i segreti della pizza napoletana: idratazione, lievitazione a 48 ore, stesura a schiaffo e cottura nel forno a legna.',
    fullDesc: 'Un laboratorio pratico e divertente guidato dal nostro primo pizzaiolo. Riceverai il tuo grembiule personalizzato, imparerai le tecniche di impasto a mano e infornerai la tua creazione che gusterai a cena insieme!',
    highlights: ['Grembiule e ricettario in omaggio', 'Preparazione del proprio panetto', 'Cottura nel forno a legna', 'Cena degustazione + bibita inclusa'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-6',
    title: 'Cene Aziendali & Team Building Gastronomico',
    category: 'feste',
    categoryLabel: 'Feste & Ricorrenze',
    date: 'Dal Lunedì al Giovedì',
    time: '20:00',
    price: 'Menù fisso concordato',
    image: '/images/ev6.jpg',
    shortDesc: 'Spazi accoglienti e soluzioni chiavi in mano per cene aziendali, auguri natalizi e meeting con la genuinità dei sapori campani.',
    fullDesc: 'Coniuga la convivialità della vera tavola italiana con l\'organizzazione professionale del tuo evento aziendale. Fatturazione elettronica rapida e possibilità di menù per celiaci, vegetariani e intolleranti.',
    highlights: ['Fatturazione aziendale immediata', 'Menù completi flessibili', 'Opzioni vegetariane e senza glutine', 'Possibilità di sala esclusiva'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-7',
    title: 'Giro Pizza No Stop del Giovedì',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Tutti i Giovedì Sera',
    time: 'Dalle 19:30',
    price: '16 € a persona',
    image: '/images/ev7.jpg',
    shortDesc: 'Giro pizza no stop a spicchi: prova tutte le nostre specialità classiche e gourmet sfornate calde di continuo fino a quando non dici basta!',
    fullDesc: 'Il format ideale per compagnie di amici e famiglie. Al centro tavola arriveranno a ripetizione vassoi di pizze fumanti dalle margherite alle creazioni più ricche con bufala, tartufo, salsiccia e friarielli, con dolce alla Nutella finale.',
    highlights: ['Pizza a volontà a spicchi', 'Bibita media o birra inclusa', 'Fritturina mista di benvenuto', 'Pizza dolce alla Nutella di chiusura'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-8',
    title: 'Notte dei Sapori d\'Autunno & Castagnata',
    category: 'degustazioni',
    categoryLabel: 'Degustazione & Gourmet',
    date: 'Eventi Stagionali',
    time: '20:00',
    price: 'Menù speciale 25 €',
    image: '/images/ev8.jpg',
    shortDesc: 'Serata a tema autunnale con pizze ai porcini freschi, zucca campana, caldarroste fumanti e vino novello da cantine locali.',
    fullDesc: 'Celebriamo i profumi del bosco e dell\'autunno con ricette esclusive a base di funghi porcini, vellutata di zucca mantovana, lardo di Colonnata e provola affumicata campana.',
    highlights: ['Pizze gourmet ai funghi e zucca', 'Vino novello illimitato ai pasti', 'Caldarroste calde al forno', 'Dessert autunnale dello chef'],
    active: true,
    endDate: ''
  },
  {
    id: 'ev-9',
    title: 'Battesimi, Comunioni & Piccoli Ricevimenti',
    category: 'feste',
    categoryLabel: 'Feste & Ricorrenze',
    date: 'Weekend a Pranzo',
    time: '12:30',
    price: 'Menù cerimonia personalizzato',
    image: '/images/ev9.jpg',
    shortDesc: 'L\'ospitalità verace e calorosa per condividere i momenti più importanti con la tua famiglia in totale relax e allegria.',
    fullDesc: 'Dagli antipasti ricchi di mare e di terra ai primi della tradizione partenopea (come gli scialatielli e gli gnocchi alla sorrentina), fino alle nostre iconiche pizze e al servizio torta cerimonia.',
    highlights: ['Allestimento floreale su richiesta', 'Menù ricchi con primi e pizze', 'Servizio taglio torta e brindisi', 'Parcheggio comodo per tutti gli ospiti'],
    active: true,
    endDate: ''
  }
];

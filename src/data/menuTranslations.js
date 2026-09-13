// Full multilingual translations for all menu items and categories
// Languages: Italian (it), English (en), German (de), Albanian (sq)

export const MENU_CATEGORIES_TRANSLATIONS = {
  it: {
    all: 'Tutti i Prodotti',
    classiche: 'Pizze Classiche',
    gourmet: 'Le Veraci Gourmet',
    ripieni: 'I Ripieni & Panuozzi',
    cucina: 'Dalla Cucina',
    bevande: 'Bevande & Birre',
  },
  en: {
    all: 'All Products',
    classiche: 'Classic Pizzas',
    gourmet: 'Veraci Gourmet',
    ripieni: 'Calzones & Panuozzi',
    cucina: 'From the Kitchen',
    bevande: 'Drinks & Beers',
  },
  de: {
    all: 'Alle Produkte',
    classiche: 'Klassische Pizzen',
    gourmet: 'Veraci Gourmet',
    ripieni: 'Gefüllte Pizzen & Panuozzi',
    cucina: 'Aus der Küche',
    bevande: 'Getränke & Bier',
  },
  sq: {
    all: 'Të gjitha Produktet',
    classiche: 'Pica Klasike',
    gourmet: 'Veraci Gourmet',
    ripieni: 'Pica të Mbushura & Panuozzi',
    cucina: 'Nga Kuzhina',
    bevande: 'Pije & Birra',
  },
};

export const MENU_ITEMS_TRANSLATIONS = {
  it: {
    // 1. Pizze Classiche
    'pc-1': {
      name: 'Regina',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella di bufala Campana DOCG, spolverata di parmigiano, basilico e olio extravergine d'oliva.",
      badge: 'DOCG',
    },
    'pc-2': {
      name: 'Wurstel e Patatine',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, wurstel, patatine fritte, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-3': {
      name: 'Diavola',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, spianata piccante di San Pietro, basilico e olio extravergine d'oliva.",
      badge: 'PICCANTE',
    },
    'pc-4': {
      name: 'Margherita',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, spolverata di parmigiano, basilico e olio extravergine d'oliva.",
      badge: 'CLASSICA',
    },
    'pc-5': {
      name: 'Salsiccia e Patatine',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, salsiccia del Nero Casertano, patatine fritte, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-6': {
      name: 'Parmigiana',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, melanzane fritte, spolverata di parmigiano, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-7': {
      name: 'Vegetariana',
      ingredients: "Mozzarella fiordilatte del Matese, fantasia di verdure cotte in forno, basilico e olio extravergine d'oliva.",
      badge: 'VEG',
    },
    'pc-8': {
      name: 'Quattro Formaggi',
      ingredients: 'Mozzarella fiordilatte del Matese, fantasia di formaggi e basilico.',
      badge: null,
    },
    'pc-9': {
      name: 'Rustica',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte, spianata piccante, gorgonzola e olive taggiasche.",
      badge: null,
    },
    'pc-10': {
      name: 'Dop',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, caciocavallo dell'Irpinia stagionata in grotta, pomodorino infornato, basilico e olio extravergine d'oliva.",
      badge: 'DOP',
    },
    'pc-11': {
      name: 'Napoli',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, acciughe di Cetara, origano, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-12': {
      name: 'Stamm Lontan',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, cipolla rossa di Tropea, tonno al naturale, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-13': {
      name: 'Quattro Stagioni',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, prosciutto cotto di alta qualità, carciofino alla romana, funghi champignon freschi, olive taggiasche, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-14': {
      name: 'Romana',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, acciughe di Cetara, cappero di Pantelleria, olive taggiasche, origano, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-15': {
      name: 'Ardita',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, salsiccia del Nero Casertano, olive taggiasche, filetto di peperoni, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-16': {
      name: 'Capricciosa',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, prosciutto cotto di alta qualità, carciofino alla romana, funghi champignon freschi, olive taggiasche, acciughe di Cetara, cappero di Pantelleria, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-17': {
      name: 'Marinara',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, aglio, origano, basilico e olio extravergine d'oliva.",
      badge: 'TRADIZIONE',
    },
    'pc-18': {
      name: 'Cotto',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte del Matese, prosciutto cotto di alta qualità, basilico e olio extravergine d'oliva.",
      badge: null,
    },
    'pc-19': {
      name: 'Cotto e Funghi',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, mozzarella fiordilatte, prosciutto cotto di alta qualità e funghi champignon freschi.",
      badge: null,
    },
    'pc-20': {
      name: 'Cosacca',
      ingredients: "Pomodoro San Marzano dell'Agro Sarnese Nocerino, pecorino Romano IGP, spolverata di parmigiano, basilico e olio extravergine d'oliva.",
      badge: 'ANTICA RICETTA',
    },

    // 2. Gourmet
    'pv-1': {
      name: 'Casertana',
      ingredients: 'Fiordilatte, provola affumicata in paglia, patate al forno, salsiccia del Nero Casertano, pepe nero.',
      badge: 'GOURMET',
    },
    'pv-2': {
      name: 'Friarielli & Co',
      ingredients: 'Fiordilatte, provola affumicata, salsiccia del Nero Casertano, friarielli napoletani saltati.',
      badge: 'VERACE',
    },
    'pv-3': {
      name: 'Al Quadrato',
      ingredients: "Bordo ripieno di ricotta di bufala e n'duja, fiordilatte, salsiccia di maiale nero, olive taggiasche, pesto fatto in casa, n'duja di Spilinga.",
      badge: 'BORDO RIPIENO',
    },
    'pv-4': {
      name: 'La Crocchè',
      ingredients: 'Fiordilatte, cotto, provola affumicata, crocchè di patate sbriciolato, pepe.',
      badge: null,
    },
    'pv-5': {
      name: 'Spianata & Co',
      ingredients: "Fiordilatte, n'duja di Spilinga IGP, cipolla rossa di Tropea stufata, spianata piccante, taggiasche, burrata di Murgia IGP.",
      badge: 'SPECIALE',
    },
    'pv-6': {
      name: "O' Sole Mio",
      ingredients: 'Salsa di pomodoro giallo Vesuviano, acciughe di Cetara, pesto, datterino infornato, mousse di ricotta di Bufala IGP.',
      badge: 'POMODORO GIALLO',
    },
    'pv-7': {
      name: 'Primavera',
      ingredients: 'Fiordilatte, crudo di Parma 24 mesi, rughetta croccante, datterino, bocconcini di bufala, scaglie di Parmigiano 18 mesi.',
      badge: 'PARMA 24M',
    },
    'pv-8': {
      name: 'Vesuviana',
      ingredients: "Salsa di pomodoro giallo Vesuviano, crudo di Parma 24 mesi, caciocavallo dell'Irpinia stagionato, gocce di stracciatella Pugliese.",
      badge: 'STRACCIATELLA',
    },
    'pv-9': {
      name: 'Ionica',
      ingredients: "Fiordilatte, carciofi alla romana, pancetta del maiale nero, n'duja di Spilinga, gocce di stracciatella DOCG.",
      badge: null,
    },
    'pv-10': {
      name: 'Mortazza',
      ingredients: 'Fiordilatte, mortadella paesana, mousse di ricotta di Bufala DOP, pistacchio di Bronte, zeste di limone.',
      badge: 'TOP SELLER',
    },
    'pv-11': {
      name: 'Bronte',
      ingredients: 'Fiordilatte, mortadella paesana, burrata di Murgia IGP, pistacchio di Bronte.',
      badge: 'PISTACCHIO',
    },
    'pv-12': {
      name: 'Mimosa',
      ingredients: 'Fiordilatte, petali di prosciutto cotto, panna e mais.',
      badge: null,
    },

    // 3. Ripieni
    'pr-1': {
      name: 'Pizza Fritta Completa',
      ingredients: 'Fiordilatte del Matese, provola di Agerola affumicata in paglia, salame napoletano di Mugnano del Cardinale, ricotta di bufala IGP.',
      badge: 'FRITTA',
    },
    'pr-2': {
      name: 'Pizza Fritta Semplice',
      ingredients: 'Pomodoro S. Marzano, fiordilatte, Parmigiano Reggiano, basilico.',
      badge: 'FRITTA',
    },
    'pr-3': {
      name: 'Calzone Classico (Al Forno)',
      ingredients: 'Pomodoro S. Marzano, fiordilatte, prosciutto cotto di alta qualità, basilico.',
      badge: 'CALZONE',
    },
    'pr-4': {
      name: 'Tronchetto Napoletano',
      ingredients: 'Fiordilatte, provola, prosciutto cotto, panna, mozzarella di bufala.',
      badge: 'SPECIALITÀ',
    },

    // 4. Panuozzo
    'pn-1': {
      name: 'Panuozzo Campano',
      ingredients: 'Fiordilatte, provola affumicata, friarielli e salsiccia del Nero Casertano.',
      badge: 'PANUOZZO',
    },

    // 5. Dalla Cucina
    'cu-1': {
      name: 'Patatine Fritte',
      ingredients: 'Porzione abbondante di patatine fritte dorate e croccanti.',
      badge: 'SFIZIO',
    },
    'cu-2': {
      name: 'Patatine Vertigo',
      ingredients: 'Patatine con caratteristico taglio a spirale speziate e super croccanti.',
      badge: 'SPECIAL',
    },
    'cu-3': {
      name: 'Fritto misto di pesce',
      ingredients: 'Misto di pescato del giorno fritto ad arte con calamari, gamberi e tocchetti di mare croccanti.',
      badge: 'MARE',
    },
    'cu-4': {
      name: 'Crudo e Bufala',
      ingredients: 'Prosciutto crudo di Parma e mozzarella di bufala Campana DOP fresca.',
      badge: 'TAGLIERE',
    },
    'cu-5': {
      name: 'Crudo e Burrata',
      ingredients: 'Prosciutto crudo di Parma affettato fresco e cremosa burrata Pugliese.',
      badge: 'TAGLIERE',
    },
    'cu-6': {
      name: 'Prosciutto Crudo e Gnocco fritto',
      ingredients: 'Prosciutto crudo nostrano servito caldo con soffici nuvole di gnocco fritto.',
      badge: 'TRADIZIONE',
    },

    // 6. Bevande
    'bev-1': {
      name: 'Coca-Cola / Coca-Cola Zero',
      ingredients: 'Lattina da 33cl servita fresca con ghiaccio e limone a piacere.',
      badge: 'BIBITA 33CL',
    },
    'bev-2': {
      name: 'Birra Moretti (66 cl)',
      ingredients: 'Bottiglia da 66 cl, ricetta originale italiana, gusto bilanciato e rinfrescante.',
      badge: 'BIRRA 66CL',
    },
    'bev-3': {
      name: 'Vino Bianco della Casa',
      ingredients: 'Vino bianco fresco e minerale della nostra cantina, ideale con pizze e fritti.',
      badge: 'CANTINA',
    },
    'bev-4': {
      name: 'Vino Rosso della Casa',
      ingredients: 'Vino rosso campano corposo ed armonico, perfetto con pizze tradizionali e gourmet.',
      badge: 'CANTINA',
    },
    'bev-5': {
      name: 'Acqua Naturale / Frizzante',
      ingredients: 'Bottiglia da 33cl minerale naturale o frizzante.',
      badge: 'ACQUA 33CL',
    },
  },

  en: {
    // 1. Classic Pizzas
    'pc-1': {
      name: 'Regina',
      ingredients: 'San Marzano DOP tomatoes, Campania buffalo mozzarella DOCG, grated Parmesan, fresh basil, and extra virgin olive oil.',
      badge: 'DOCG',
    },
    'pc-2': {
      name: 'Wurstel & Fries',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte mozzarella, sliced sausage, crispy fries, fresh basil, and extra virgin olive oil.',
      badge: null,
    },
    'pc-3': {
      name: 'Diavola (Spicy Salami)',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte mozzarella, spicy artisan salami, fresh basil, and extra virgin olive oil.',
      badge: 'SPICY',
    },
    'pc-4': {
      name: 'Margherita',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte mozzarella, grated Parmesan, fresh basil, and extra virgin olive oil.',
      badge: 'CLASSIC',
    },
    'pc-5': {
      name: 'Sausage & Fries',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte mozzarella, artisanal Casertano black pig sausage, crispy fries, basil, and EVO oil.',
      badge: null,
    },
    'pc-6': {
      name: 'Parmigiana',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte mozzarella, golden fried eggplants, grated Parmesan, basil, and EVO oil.',
      badge: null,
    },
    'pc-7': {
      name: 'Vegetariana',
      ingredients: 'Matese fior di latte mozzarella, assortment of oven-roasted vegetables, fresh basil, and extra virgin olive oil.',
      badge: 'VEG',
    },
    'pc-8': {
      name: 'Four Cheeses',
      ingredients: 'Matese fior di latte mozzarella, selection of premium melted Italian cheeses, and fresh basil.',
      badge: null,
    },
    'pc-9': {
      name: 'Rustica',
      ingredients: 'San Marzano DOP tomatoes, fior di latte mozzarella, spicy Italian salami, creamy Gorgonzola, and Taggiasca olives.',
      badge: null,
    },
    'pc-10': {
      name: 'DOP Special',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte, cave-aged Irpinia Caciocavallo, oven-roasted cherry tomatoes, basil, and EVO oil.',
      badge: 'DOP',
    },
    'pc-11': {
      name: 'Napoli',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte, Cetara anchovies, wild oregano, fresh basil, and EVO oil.',
      badge: null,
    },
    'pc-12': {
      name: 'Tuna & Red Onions',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte, sweet Tropea red onions, tender natural tuna, basil, and EVO oil.',
      badge: null,
    },
    'pc-13': {
      name: 'Four Seasons',
      ingredients: 'San Marzano tomatoes, fior di latte, premium cooked ham, Roman artichokes, fresh mushrooms, Taggiasca olives, and basil.',
      badge: null,
    },
    'pc-14': {
      name: 'Romana',
      ingredients: 'San Marzano tomatoes, fior di latte, Cetara anchovies, Pantelleria capers, Taggiasca olives, oregano, and basil.',
      badge: null,
    },
    'pc-15': {
      name: 'Ardita',
      ingredients: 'San Marzano tomatoes, fior di latte, Nero Casertano sausage, Taggiasca olives, sweet roasted bell peppers, and basil.',
      badge: null,
    },
    'pc-16': {
      name: 'Capricciosa',
      ingredients: 'San Marzano tomatoes, fior di latte, ham, Roman artichokes, fresh mushrooms, olives, Cetara anchovies, capers, and basil.',
      badge: null,
    },
    'pc-17': {
      name: 'Marinara',
      ingredients: 'San Marzano DOP tomatoes, fresh garlic, wild oregano, fresh basil, and extra virgin olive oil.',
      badge: 'TRADITION',
    },
    'pc-18': {
      name: 'Ham & Mozzarella',
      ingredients: 'San Marzano DOP tomatoes, Matese fior di latte mozzarella, high-quality cooked ham, fresh basil, and EVO oil.',
      badge: null,
    },
    'pc-19': {
      name: 'Ham & Mushrooms',
      ingredients: 'San Marzano DOP tomatoes, fior di latte mozzarella, premium Italian cooked ham, and fresh champignon mushrooms.',
      badge: null,
    },
    'pc-20': {
      name: 'Cosacca',
      ingredients: 'San Marzano DOP tomatoes, Roman Pecorino IGP, grated Parmigiano Reggiano, fresh basil, and extra virgin olive oil.',
      badge: 'ANCIENT RECIPE',
    },

    // 2. Gourmet
    'pv-1': {
      name: 'Casertana',
      ingredients: 'Fior di latte, smoked straw provola cheese, roasted potatoes, Nero Casertano artisan pork sausage, black pepper.',
      badge: 'GOURMET',
    },
    'pv-2': {
      name: 'Friarielli & Co',
      ingredients: 'Fior di latte, smoked provola cheese, Nero Casertano pork sausage, sautéed Neapolitan friarielli broccoli rabe.',
      badge: 'VERACE',
    },
    'pv-3': {
      name: 'Al Quadrato',
      ingredients: "Crust stuffed with buffalo ricotta & spicy 'nduja, fior di latte, black pork sausage, Taggiasca olives, homemade pesto.",
      badge: 'STUFFED CRUST',
    },
    'pv-4': {
      name: 'La Crocchè',
      ingredients: 'Fior di latte, premium ham, smoked provola, crumbled golden potato croquettes, cracked black pepper.',
      badge: null,
    },
    'pv-5': {
      name: 'Spianata & Co',
      ingredients: "Fior di latte, Spilinga 'nduja IGP, stewed Tropea red onions, spicy salami, olives, creamy Pugliese burrata IGP.",
      badge: 'SPECIAL',
    },
    'pv-6': {
      name: "O' Sole Mio",
      ingredients: 'Sweet yellow Vesuvian tomato sauce, Cetara anchovies, basil pesto, confit cherry tomatoes, buffalo ricotta mousse IGP.',
      badge: 'YELLOW TOMATO',
    },
    'pv-7': {
      name: 'Primavera',
      ingredients: 'Fior di latte, 24-month aged Parma prosciutto, wild arugula, cherry tomatoes, fresh buffalo bocconcini, Parmigiano shavings.',
      badge: 'PARMA 24M',
    },
    'pv-8': {
      name: 'Vesuviana',
      ingredients: 'Sweet yellow Vesuvian tomato sauce, 24-month Parma prosciutto, cave-aged Caciocavallo, creamy stracciatella cheese.',
      badge: 'STRACCIATELLA',
    },
    'pv-9': {
      name: 'Ionica',
      ingredients: "Fior di latte, Roman artichokes, black pork pancetta bacon, spicy 'nduja, Pugliese stracciatella cheese DOCG.",
      badge: null,
    },
    'pv-10': {
      name: 'Mortazza',
      ingredients: 'Fior di latte, artisan mortadella, buffalo ricotta mousse DOP, Bronte crushed pistachios, fresh lemon zest.',
      badge: 'TOP SELLER',
    },
    'pv-11': {
      name: 'Bronte',
      ingredients: 'Fior di latte, artisan mortadella, whole creamy Murgia burrata IGP, Bronte Sicilian pistachios.',
      badge: 'PISTACHIO',
    },
    'pv-12': {
      name: 'Mimosa',
      ingredients: 'Fior di latte mozzarella, delicate cooked ham ribbons, cream, and sweet corn.',
      badge: null,
    },

    // 3. Ripieni
    'pr-1': {
      name: 'Fried Stuffed Pizza Deluxe',
      ingredients: 'Matese fior di latte, smoked provola cheese, Neapolitan salami from Mugnano, creamy buffalo ricotta IGP.',
      badge: 'DEEP FRIED',
    },
    'pr-2': {
      name: 'Simple Fried Pizza',
      ingredients: 'San Marzano tomatoes, fior di latte mozzarella, aged Parmigiano Reggiano, fresh basil.',
      badge: 'DEEP FRIED',
    },
    'pr-3': {
      name: 'Classic Baked Calzone',
      ingredients: 'San Marzano tomatoes, fior di latte mozzarella, high quality cooked ham, and fresh basil.',
      badge: 'CALZONE',
    },
    'pr-4': {
      name: 'Neapolitan Tronchetto',
      ingredients: 'Fior di latte, smoked provola, prosciutto cotto, velvety cream, fresh buffalo mozzarella.',
      badge: 'SPECIALTY',
    },

    // 4. Panuozzo
    'pn-1': {
      name: 'Campanian Panuozzo',
      ingredients: 'Fior di latte, smoked provola cheese, sautéed broccoli rabe (friarielli), and Nero Casertano pork sausage.',
      badge: 'PANUOZZO',
    },

    // 5. Kitchen
    'cu-1': {
      name: 'French Fries',
      ingredients: 'Generous portion of golden, crispy seasoned potato fries.',
      badge: 'SNACK',
    },
    'cu-2': {
      name: 'Vertigo Twister Fries',
      ingredients: 'Spiral-cut seasoned crispy potato twisters with a savory crunch.',
      badge: 'SPECIAL',
    },
    'cu-3': {
      name: 'Crispy Seafood Fritto Misto',
      ingredients: 'Crisp artisan mixed seafood fry with tender calamari, wild prawns, and daily fresh catch with lemon.',
      badge: 'SEAFOOD',
    },
    'cu-4': {
      name: 'Parma Ham & Buffalo Mozzarella',
      ingredients: 'Thinly sliced 24-month aged Parma prosciutto with fresh Campania buffalo mozzarella DOP.',
      badge: 'PLATTER',
    },
    'cu-5': {
      name: 'Parma Ham & Burrata',
      ingredients: 'Freshly sliced artisan Parma ham paired with creamy whole Pugliese burrata.',
      badge: 'PLATTER',
    },
    'cu-6': {
      name: 'Parma Ham with Gnocco Fritto',
      ingredients: 'Warm savory Parma prosciutto accompanied by freshly fried, fluffy Italian puff pastries (gnocco fritto).',
      badge: 'TRADITION',
    },

    // 6. Drinks
    'bev-1': {
      name: 'Coca-Cola / Coca-Cola Zero',
      ingredients: '33cl chilled can served with fresh ice and lemon slice upon request.',
      badge: 'SODA 33CL',
    },
    'bev-2': {
      name: 'Birra Moretti (66 cl)',
      ingredients: '66 cl bottle, original Italian recipe, balanced malty flavor and crisp refreshing finish.',
      badge: 'BEER 66CL',
    },
    'bev-3': {
      name: 'House White Wine',
      ingredients: 'Crisp, refreshing, and mineral white wine from our Italian cellar, ideal with pizza and seafood.',
      badge: 'CELLAR',
    },
    'bev-4': {
      name: 'House Red Wine',
      ingredients: 'Full-bodied and harmonious Campanian red wine, perfect with traditional and gourmet pizzas.',
      badge: 'CELLAR',
    },
    'bev-5': {
      name: 'Still / Sparkling Mineral Water',
      ingredients: '33cl cold glass bottle of pure still or sparkling mineral water.',
      badge: 'WATER 33CL',
    },
  },

  de: {
    // 1. Klassische Pizzen
    'pc-1': {
      name: 'Regina',
      ingredients: 'San-Marzano-Tomaten DOP, Büffelmozzarella aus Kampanien DOCG, geriebener Parmesan, Basilikum und natives Olivenöl extra.',
      badge: 'DOCG',
    },
    'pc-2': {
      name: 'Würstchen & Pommes',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, feine Würstchen, knusprige Pommes frites, Basilikum und Olivenöl.',
      badge: null,
    },
    'pc-3': {
      name: 'Diavola (Scharfe Salami)',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, pikante italienische Salami, frisches Basilikum und Olivenöl extra vergine.',
      badge: 'SCHARF',
    },
    'pc-4': {
      name: 'Margherita',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, geriebener Parmesan, frisches Basilikum und Olivenöl extra vergine.',
      badge: 'KLASSIKER',
    },
    'pc-5': {
      name: 'Salsiccia & Pommes',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, handwerkliche Casertano-Wurst, Pommes frites, Basilikum und Olivenöl.',
      badge: null,
    },
    'pc-6': {
      name: 'Parmigiana',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, gebratene Auberginen, geriebener Parmesan, Basilikum und Olivenöl.',
      badge: null,
    },
    'pc-7': {
      name: 'Vegetariana',
      ingredients: 'Fior di Latte Mozzarella, buntes ofengeröstetes Gemüse, frisches Basilikum und natives Olivenöl extra.',
      badge: 'VEG',
    },
    'pc-8': {
      name: 'Vier Käse (Quattro Formaggi)',
      ingredients: 'Fior di Latte Mozzarella, ausgewählte feine italienische Käsesorten und frisches Basilikum.',
      badge: null,
    },
    'pc-9': {
      name: 'Rustica',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte, scharfe Salami, Gorgonzola-Käse und feine Taggiasca-Oliven.',
      badge: null,
    },
    'pc-10': {
      name: 'DOP Spezial',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte, höhlengereifter Caciocavallo aus Irpinia, geschmorte Kirschtomaten, Basilikum.',
      badge: 'DOP',
    },
    'pc-11': {
      name: 'Napoli',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, Cetara-Sardellen, aromatischer Oregano, Basilikum und Olivenöl.',
      badge: null,
    },
    'pc-12': {
      name: 'Thunfisch & Rote Zwiebeln',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte, rote Tropea-Zwiebeln, zarter Thunfisch, frisches Basilikum und Olivenöl.',
      badge: null,
    },
    'pc-13': {
      name: 'Vier Jahreszeiten (Quattro Stagioni)',
      ingredients: 'San-Marzano-Tomaten, Fior di Latte, Premium-Kochschinken, römische Artischocken, frische Champignons, Taggiasca-Oliven, Basilikum.',
      badge: null,
    },
    'pc-14': {
      name: 'Romana',
      ingredients: 'San-Marzano-Tomaten, Fior di Latte, Cetara-Sardellen, Pantelleria-Kapern, Taggiasca-Oliven, Oregano und Basilikum.',
      badge: null,
    },
    'pc-15': {
      name: 'Ardita',
      ingredients: 'San-Marzano-Tomaten, Fior di Latte, Nero-Casertano-Wurst, Taggiasca-Oliven, geröstete Paprikastreifen und Basilikum.',
      badge: null,
    },
    'pc-16': {
      name: 'Capricciosa',
      ingredients: 'San-Marzano-Tomaten, Fior di Latte, Kochschinken, Artischocken, frische Pilze, Oliven, Cetara-Sardellen, Kapern und Basilikum.',
      badge: null,
    },
    'pc-17': {
      name: 'Marinara',
      ingredients: 'San-Marzano-Tomaten DOP, frischer Knoblauch, Berg-Oregano, Basilikum und feinstes natives Olivenöl extra.',
      badge: 'TRADITION',
    },
    'pc-18': {
      name: 'Kochschinken (Cotto)',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, erstklassiger Kochschinken, Basilikum und Olivenöl extra vergine.',
      badge: null,
    },
    'pc-19': {
      name: 'Schinken & Pilze',
      ingredients: 'San-Marzano-Tomaten DOP, Fior di Latte Mozzarella, feiner Kochschinken und frische Champignons.',
      badge: null,
    },
    'pc-20': {
      name: 'Cosacca',
      ingredients: 'San-Marzano-Tomaten DOP, Pecorino Romano IGP, geriebener Parmesan, Basilikum und natives Olivenöl extra.',
      badge: 'HISTORISCHES REZEPT',
    },

    // 2. Gourmet
    'pv-1': {
      name: 'Casertana',
      ingredients: 'Fior di Latte, geräucherter Provola-Käse, Ofenkartoffeln, Nero-Casertano-Wurst, schwarzer Pfeffer.',
      badge: 'GOURMET',
    },
    'pv-2': {
      name: 'Friarielli & Co',
      ingredients: 'Fior di Latte, geräucherte Provola, Nero-Casertano-Wurst, geschmorter neapolitanischer Stängelkohl (Friarielli).',
      badge: 'VERACE',
    },
    'pv-3': {
      name: 'Al Quadrato',
      ingredients: 'Krustenrand gefüllt mit Büffelricotta & pikantem Nduja, Fior di Latte, Landschwein-Wurst, Oliven, hausgemachtes Pesto.',
      badge: 'GEFÜLLTER RAND',
    },
    'pv-4': {
      name: 'La Crocchè',
      ingredients: 'Fior di Latte, Kochschinken, geräucherte Provola, zerkrümelte Kartoffelkrokette, frisch gemahlener Pfeffer.',
      badge: null,
    },
    'pv-5': {
      name: 'Spianata & Co',
      ingredients: 'Fior di Latte, Spilinga Nduja IGP, geschmorte Tropea-Zwiebeln, scharfe Salami, Oliven, cremige Burrata aus Apulien.',
      badge: 'SPEZIAL',
    },
    'pv-6': {
      name: "O'基礎 Mio",
      ingredients: 'Sauce aus gelben Vesuv-Tomaten, Cetara-Sardellen, Basilikumpesto, geschmorte Datteltomaten, Büffelricotta-Mousse IGP.',
      badge: 'GELBE TOMATE',
    },
    'pv-7': {
      name: 'Primavera',
      ingredients: 'Fior di Latte, 24 Monate gereifter Parmaschinken, Rucola, Datteltomaten, Büffelmozzarella-Bällchen, Parmesanspäne.',
      badge: 'PARMA 24M',
    },
    'pv-8': {
      name: 'Vesuviana',
      ingredients: 'Sauce aus gelben Vesuv-Tomaten, 24M Parmaschinken, gereifter Caciocavallo-Käse, feinste Stracciatella-Creme.',
      badge: 'STRACCIATELLA',
    },
    'pv-9': {
      name: 'Ionica',
      ingredients: 'Fior di Latte, römische Artischocken, Landschwein-Pancetta, pikante Nduja, feine Stracciatella DOCG.',
      badge: null,
    },
    'pv-10': {
      name: 'Mortazza',
      ingredients: 'Fior di Latte, handwerkliche Mortadella, Büffelricotta-Mousse DOP, Bronte-Pistazien, frischer Zitronenabrieb.',
      badge: 'TOP SELLER',
    },
    'pv-11': {
      name: 'Bronte',
      ingredients: 'Fior di Latte, Mortadella, ganze cremige Murgia-Burrata IGP, feine Bronte-Pistazien aus Sizilien.',
      badge: 'PISTAZIE',
    },
    'pv-12': {
      name: 'Mimosa',
      ingredients: 'Fior di Latte Mozzarella, zarter Schinken, feine Sahne und süßer Mais.',
      badge: null,
    },

    // 3. Ripieni
    'pr-1': {
      name: 'Frittierte Pizza Komplett',
      ingredients: 'Matese Fior di Latte, geräucherte Agerola-Provola, neapolitanische Mugnano-Salami, Büffelricotta IGP.',
      badge: 'FRITTIERT',
    },
    'pr-2': {
      name: 'Frittierte Pizza Schlicht',
      ingredients: 'San-Marzano-Tomaten, Fior di Latte Mozzarella, Parmigiano Reggiano, frisches Basilikum.',
      badge: 'FRITTIERT',
    },
    'pr-3': {
      name: 'Klassische Calzone (Ofen)',
      ingredients: 'San-Marzano-Tomaten, Fior di Latte Mozzarella, Premium-Kochschinken, Basilikum.',
      badge: 'CALZONE',
    },
    'pr-4': {
      name: 'Neapolitanischer Tronchetto',
      ingredients: 'Fior di Latte, Provola, Kochschinken, feine Sahne, frischer Büffelmozzarella.',
      badge: 'SPEZIALITÄT',
    },

    // 4. Panuozzo
    'pn-1': {
      name: 'Campanischer Panuozzo',
      ingredients: 'Fior di Latte, geräucherte Provola, neapolitanischer Stängelkohl (Friarielli) und Nero-Casertano-Wurst.',
      badge: 'PANUOZZO',
    },

    // 5. Aus der Küche
    'cu-1': {
      name: 'Pommes Frites',
      ingredients: 'Große Portion goldbraune und extra knusprige Pommes frites.',
      badge: 'SNACK',
    },
    'cu-2': {
      name: 'Vertigo Spiral-Pommes',
      ingredients: 'Würzig gewürzte Pommes frites im Spiral-Schnitt, extra kross gebacken.',
      badge: 'SPEZIAL',
    },
    'cu-3': {
      name: 'Meeresfrüchte Fritto Misto',
      ingredients: 'Frittierte Meeresfrüchte nach Art des Hauses mit Calamari, Garnelen und Fisch des Tages, serviert mit Zitrone.',
      badge: 'MEERESFRÜCHTE',
    },
    'cu-4': {
      name: 'Parmaschinken & Büffelmozzarella',
      ingredients: '24 Monate gereifter Parmaschinken mit frischem Büffelmozzarella aus Kampanien DOP.',
      badge: 'PLATTE',
    },
    'cu-5': {
      name: 'Parmaschinken & Burrata',
      ingredients: 'Frisch aufgeschnittener Parmaschinken kombiniert mit herrlich cremiger apulischer Burrata.',
      badge: 'PLATTE',
    },
    'cu-6': {
      name: 'Parmaschinken mit Gnocco Fritto',
      ingredients: 'Aromatischer Parmaschinken serviert mit warmen, luftig frittierten Teigkissen (Gnocco fritto).',
      badge: 'TRADITION',
    },

    // 6. Getränke
    'bev-1': {
      name: 'Coca-Cola / Coca-Cola Zero',
      ingredients: '33cl Dose eisgekühlt serviert mit Eiswürfeln und Zitrone.',
      badge: 'GETRÄNK 33CL',
    },
    'bev-2': {
      name: 'Moretti Bier (66 cl)',
      ingredients: '66 cl Flasche, traditionelles italienisches Rezept, ausgewogen und erfrischend herb.',
      badge: 'BIER 66CL',
    },
    'bev-3': {
      name: 'Haus-Weißwein',
      ingredients: 'Frischer und mineralischer Weißwein aus unserem Weinkeller, ideal zu Pizza und Meeresfrüchten.',
      badge: 'WEINKELLER',
    },
    'bev-4': {
      name: 'Haus-Rotwein',
      ingredients: 'Vollmundiger und harmonischer kampanischer Rotwein, passend zu traditionellen und Gourmet-Pizzen.',
      badge: 'WEINKELLER',
    },
    'bev-5': {
      name: 'Mineralwasser Still / Sprudel',
      ingredients: '33cl Glasflasche natürliches stilles oder kohlensäurehaltiges Mineralwasser.',
      badge: 'WASSER 33CL',
    },
  },

  sq: {
    // 1. Pica Klasike
    'pc-1': {
      name: 'Regina',
      ingredients: 'Domate San Marzano DOP, mocarela bujalle nga Campania DOCG, djathë parmigiano, borzilok dhe vaj ulliri ekstra i virgjër.',
      badge: 'DOCG',
    },
    'pc-2': {
      name: 'Salçiçe & Patate të Skuqura',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, salçiçe, patate të skuqura krokante, borzilok dhe vaj ulliri.',
      badge: null,
    },
    'pc-3': {
      name: 'Diavola (Sallam Pikant)',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, sallam pikant artizanal italian, borzilok dhe vaj ulliri ekstra i virgjër.',
      badge: 'PIKANTE',
    },
    'pc-4': {
      name: 'Margherita',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, djathë parmigiano i grirë, borzilok i freskët dhe vaj ulliri.',
      badge: 'KLASIKE',
    },
    'pc-5': {
      name: 'Salçiçe Fshati & Patate',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, salçiçe e derrit të zi Casertano, patate të skuqura, borzilok dhe vaj ulliri.',
      badge: null,
    },
    'pc-6': {
      name: 'Parmigiana',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, patëllxhanë të skuqur, parmigiano, borzilok dhe vaj ulliri.',
      badge: null,
    },
    'pc-7': {
      name: 'Vegetariana',
      ingredients: 'Mocarela fiordilatte, perime të freskëta të pjekura në furrë, borzilok i freskët dhe vaj ulliri ekstra i virgjër.',
      badge: 'VEGJETARIANE',
    },
    'pc-8': {
      name: 'Katër Djathërat (Quattro Formaggi)',
      ingredients: 'Mocarela fiordilatte, përzgjedhje e katër djathërave italianë cilësorë dhe borzilok i freskët.',
      badge: null,
    },
    'pc-9': {
      name: 'Rustica',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, sallam pikant, djathë gorgonzola dhe ullinj taggiasche.',
      badge: null,
    },
    'pc-10': {
      name: 'DOP Speciale',
      ingredients: 'Domate San Marzano DOP, fiordilatte, djathë Caciocavallo i vjetëruar në shpellë, domate qershi të pjekura, borzilok.',
      badge: 'DOP',
    },
    'pc-11': {
      name: 'Napoli',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, açuge të Cetaras, rigon i egër, borzilok dhe vaj ulliri.',
      badge: null,
    },
    'pc-12': {
      name: 'Ton & Qepë të Kuqe',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, qepë e kuqe e ëmbël Tropea, peshk ton natyral, borzilok.',
      badge: null,
    },
    'pc-13': {
      name: 'Katër Stinët (Quattro Stagioni)',
      ingredients: 'Domate San Marzano, fiordilatte, proshutë e zier e cilësisë së lartë, karçof, kërpudha të freskëta, ullinj taggiasche, borzilok.',
      badge: null,
    },
    'pc-14': {
      name: 'Romana',
      ingredients: 'Domate San Marzano, fiordilatte, açuge Cetara, kaperi Pantelleria, ullinj taggiasche, rigon dhe borzilok.',
      badge: null,
    },
    'pc-15': {
      name: 'Ardita',
      ingredients: 'Domate San Marzano, fiordilatte, salçiçe Nero Casertano, ullinj taggiasche, speca të pjekur dhe borzilok.',
      badge: null,
    },
    'pc-16': {
      name: 'Capricciosa',
      ingredients: 'Domate San Marzano, fiordilatte, proshutë e zier, karçof, kërpudha, ullinj, açuge, kaperi dhe borzilok.',
      badge: null,
    },
    'pc-17': {
      name: 'Marinara',
      ingredients: 'Domate San Marzano DOP, hudhër e freskët, rigon mali, borzilok i freskët dhe vaj ulliri ekstra i virgjër.',
      badge: 'TRADITË',
    },
    'pc-18': {
      name: 'Proshutë e Zier (Cotto)',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, proshutë e zier italiane e cilësisë së lartë, borzilok dhe vaj ulliri.',
      badge: null,
    },
    'pc-19': {
      name: 'Proshutë & Kërpudha',
      ingredients: 'Domate San Marzano DOP, mocarela fiordilatte, proshutë e zier e shijshme dhe kërpudha champignon të freskëta.',
      badge: null,
    },
    'pc-20': {
      name: 'Cosacca',
      ingredients: 'Domate San Marzano DOP, djathë Pecorino Romano IGP, parmigiano, borzilok dhe vaj ulliri ekstra i virgjër.',
      badge: 'RECETË E LASHTË',
    },

    // 2. Gourmet
    'pv-1': {
      name: 'Casertana',
      ingredients: 'Fiordilatte, provola e tymosur, patate të pjekura në furrë, salçiçe Nero Casertano, piper i zi.',
      badge: 'GOURMET',
    },
    'pv-2': {
      name: 'Friarielli & Co',
      ingredients: 'Fiordilatte, provola e tymosur, salçiçe e derrit të zi, friarielli napolitane të kërcitura në tigan.',
      badge: 'VERACE',
    },
    'pv-3': {
      name: 'Al Quadrato',
      ingredients: "Buzë e mbushur me rikotë bujalle & n'duja pikante, fiordilatte, salçiçe fshati, ullinj taggiasche, pesto shtëpie.",
      badge: 'BUZË E MBUSHUR',
    },
    'pv-4': {
      name: 'La Crocchè',
      ingredients: 'Fiordilatte, proshutë e zier, provola e tymosur, kroketa patatesh të thërmuara, piper i zi.',
      badge: null,
    },
    'pv-5': {
      name: 'Spianata & Co',
      ingredients: "Fiordilatte, n'duja pikante Spilinga IGP, qepë e kuqe Tropea, sallam pikant, ullinj, burrata kremoze nga Murgia.",
      badge: 'SPECIALE',
    },
    'pv-6': {
      name: "O' Sole Mio",
      ingredients: 'Salcë domatesh të verdha të Vezuvit, açuge Cetara, pesto borziloku, domate qershi konfit, shkumë rikote bujalle.',
      badge: 'DOMATE E VERDHË',
    },
    'pv-7': {
      name: 'Primavera',
      ingredients: 'Fiordilatte, proshutë Parma e vjetëruar 24 muaj, rukola e freskët, domate qershi, copa mocarele bujalle, thela parmigiano.',
      badge: 'PARMA 24M',
    },
    'pv-8': {
      name: 'Vesuviana',
      ingredients: 'Salcë domatesh të verdha të Vezuvit, proshutë Parma 24 muaj, djathë Caciocavallo i pjekur, krem stracciatella.',
      badge: 'STRACCIATELLA',
    },
    'pv-9': {
      name: 'Ionica',
      ingredients: "Fiordilatte, karçof romak, pançetë derri të zi, n'duja pikante, pika stracciatella DOCG.",
      badge: null,
    },
    'pv-10': {
      name: 'Mortazza',
      ingredients: 'Fiordilatte, mortadela artizanale, shkumë rikote bujalle DOP, stika pishe nga Bronte, lëkurë limoni e freskët.',
      badge: 'MË E SHITURA',
    },
    'pv-11': {
      name: 'Bronte',
      ingredients: 'Fiordilatte, mortadela, burrata e plotë kremoze Murgia IGP, stika pishe Bronte nga Sicilia.',
      badge: 'STIKA PISHE',
    },
    'pv-12': {
      name: 'Mimosa',
      ingredients: 'Fiordilatte, rripa të hollë proshute të zier, krem i freskët qumështi dhe misër i ëmbël.',
      badge: null,
    },

    // 3. Ripieni
    'pr-1': {
      name: 'Pica e Skuqur Komplet',
      ingredients: 'Mocarela fiordilatte, provola e tymosur Agerola, sallam napolitan Mugnano, rikotë bujalle IGP.',
      badge: 'E SKUQUR',
    },
    'pr-2': {
      name: 'Pica e Skuqur e Thjeshtë',
      ingredients: 'Domate San Marzano, fiordilatte, Parmigiano Reggiano, borzilok i freskët.',
      badge: 'E SKUQUR',
    },
    'pr-3': {
      name: 'Calzone Klasike (Në Furrë)',
      ingredients: 'Domate San Marzano, fiordilatte, proshutë e zier e cilësisë së lartë, borzilok.',
      badge: 'CALZONE',
    },
    'pr-4': {
      name: 'Tronchetto Napolitan',
      ingredients: 'Fiordilatte, provola e tymosur, proshutë e zier, krem, mocarela bujalle e freskët.',
      badge: 'SPECIALITET',
    },

    // 4. Panuozzo
    'pn-1': {
      name: 'Panuozzo nga Campania',
      ingredients: 'Fiordilatte, provola e tymosur, perime friarielli dhe salçiçe e derrit të zi Casertano.',
      badge: 'PANUOZZO',
    },

    // 5. Nga Kuzhina
    'cu-1': {
      name: 'Patate të Skuqura',
      ingredients: 'Porsion i bollshëm me patate të skuqura të arta dhe krokante.',
      badge: 'MEZE',
    },
    'cu-2': {
      name: 'Patate Spirale Vertigo',
      ingredients: 'Patate krokante me prerje karakteristike spirale dhe erëza të veçanta.',
      badge: 'SPECIALE',
    },
    'cu-3': {
      name: 'Përzierje Frutash Deti të Skuqura',
      ingredients: 'Peshk i ditës dhe fruta deti të skuqura artizanalisht: kallamarë, karkaleca dhe limon i freskët.',
      badge: 'DETI',
    },
    'cu-4': {
      name: 'Proshutë Parma & Mocarela Bujalle',
      ingredients: 'Proshutë Parma e prerë hollë me mocarela bujalle të freskët nga Campania DOP.',
      badge: 'PJATË E FTOHTË',
    },
    'cu-5': {
      name: 'Proshutë Parma & Burrata',
      ingredients: 'Proshutë e freskët Parma e kombinuar me burrata super kremoze nga Pulia.',
      badge: 'PJATË E FTOHTË',
    },
    'cu-6': {
      name: 'Proshutë Parma me Gnocco Fritto',
      ingredients: 'Proshutë e ngrohtë vendi e shoqëruar me brumëra të skuqura të buta e të fryra (gnocco fritto).',
      badge: 'TRADITË',
    },

    // 6. Pije
    'bev-1': {
      name: 'Coca-Cola / Coca-Cola Zero',
      ingredients: 'Kanoçe 33cl e ftohtë e shërbyer me akull dhe limon sipas dëshirës.',
      badge: 'PIJE 33CL',
    },
    'bev-2': {
      name: 'Birrë Moretti (66 cl)',
      ingredients: 'Shishe 66 cl, recetë origjinale italiane, shije e ekuilibruar dhe freskuese.',
      badge: 'BIRRË 66CL',
    },
    'bev-3': {
      name: 'Verë e Bardhë e Shtëpisë',
      ingredients: 'Verë e bardhë e freskët dhe minerale nga kantina jonë, ideale për pica dhe të skuqura.',
      badge: 'KANTINA',
    },
    'bev-4': {
      name: 'Verë e Kuqe e Shtëpisë',
      ingredients: 'Verë e kuqe e plotë dhe harmonike nga Campania, perfekte me pica tradicionale dhe gourmet.',
      badge: 'KANTINA',
    },
    'bev-5': {
      name: 'Ujë Pa Gaz / Me Gaz',
      ingredients: 'Shishe 33cl ujë mineral natyral ose me gaz.',
      badge: 'UJË 33CL',
    },
  },
};

/**
 * Helper to get a translated menu item for a given language code
 */
export const getLocalizedItem = (item, lang = 'it') => {
  if (!item) return item;
  const langKey = MENU_ITEMS_TRANSLATIONS[lang] ? lang : 'it';
  const localized = MENU_ITEMS_TRANSLATIONS[langKey]?.[item.id];
  if (!localized) return item;

  return {
    ...item,
    name: localized.name || item.name,
    ingredients: localized.ingredients || item.ingredients,
    badge: localized.badge !== undefined ? localized.badge : item.badge,
  };
};

/**
 * Helper to get a translated category for a given language code
 */
export const getLocalizedCategories = (categories, lang = 'it') => {
  const langKey = MENU_CATEGORIES_TRANSLATIONS[lang] ? lang : 'it';
  const catNames = MENU_CATEGORIES_TRANSLATIONS[langKey] || MENU_CATEGORIES_TRANSLATIONS.it;

  return categories.map((cat) => ({
    ...cat,
    name: catNames[cat.id] || cat.name,
  }));
};

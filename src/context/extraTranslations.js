// Testi aggiuntivi uniti a TRANSLATIONS (LanguageContext): privacy, orari dinamici,
// nuovi messaggi di ordini/prenotazioni e le sezioni tedesche che mancavano.

export const EXTRA_TRANSLATIONS = {
  it: {
    legal: {
      consentPrefix: 'Ho letto l’',
      privacyLink: 'informativa privacy',
      consentSuffix: ' e acconsento al trattamento dei miei dati per gestire la richiesta.',
      consentRequired: 'Per continuare accetta l’informativa privacy.',
      privacyTitle: 'Privacy policy',
      cookieLink: 'Cookie policy',
    },
    checkout: {
      deliveryTimeLabel: 'ORARIO DI CONSEGNA',
      pickupTimeLabel: 'ORARIO DI RITIRO',
      asap: 'Prima possibile',
      closedToday: 'Per oggi gli ordini online sono chiusi. Puoi prenotare un tavolo o chiamarci.',
      sending: 'INVIO IN CORSO...',
      submitDelivery: 'CONFERMA E INVIA ORDINE',
      submitPickup: 'CONFERMA ORDINE RITIRO',
      alertAddress: 'Per favore inserisci l’indirizzo di consegna con il numero civico.',
    },
    reservation: {
      closedShort: 'chiuso',
      noSlots: 'Nessun orario prenotabile per questo turno: scegli un altro giorno o turno.',
      errorSlot: 'Scegli uno degli orari disponibili.',
    },
    findUs: {
      lunchLabel: 'Pranzo',
      dinnerLabel: 'Cena',
      closedLabel: 'Chiuso',
      mapConsentText: 'La mappa è fornita da Google Maps, che può impostare cookie di terze parti.',
      mapConsentBtn: 'Mostra mappa',
      geoUnsupported: 'La geolocalizzazione non è supportata dal tuo browser: inserisci la partenza a mano.',
    },
    events: {
      errorContact: 'Per favore compila il tuo nome e recapito telefonico.',
      sending: 'INVIO IN CORSO...',
      submitInquiry: 'INVIA RICHIESTA PREVENTIVO',
    },
  },

  en: {
    legal: {
      consentPrefix: 'I have read the ',
      privacyLink: 'privacy policy',
      consentSuffix: ' and agree to the processing of my data to handle this request.',
      consentRequired: 'Please accept the privacy policy to continue.',
      privacyTitle: 'Privacy policy',
      cookieLink: 'Cookie policy',
    },
    checkout: {
      deliveryTimeLabel: 'DELIVERY TIME',
      pickupTimeLabel: 'PICKUP TIME',
      asap: 'As soon as possible',
      closedToday: 'Online orders are closed for today. You can book a table or call us.',
      sending: 'SENDING...',
      submitDelivery: 'CONFIRM AND SEND ORDER',
      submitPickup: 'CONFIRM PICKUP ORDER',
      alertAddress: 'Please enter the delivery address including the street number.',
    },
    reservation: {
      closedShort: 'closed',
      noSlots: 'No bookable times for this shift: choose another day or shift.',
      errorSlot: 'Please choose one of the available times.',
    },
    findUs: {
      lunchLabel: 'Lunch',
      dinnerLabel: 'Dinner',
      closedLabel: 'Closed',
      mapConsentText: 'The map is provided by Google Maps, which may set third-party cookies.',
      mapConsentBtn: 'Show map',
      geoUnsupported: 'Geolocation is not supported by your browser: please type your starting point.',
    },
    events: {
      errorContact: 'Please fill in your name and phone number.',
      sending: 'SENDING...',
      submitInquiry: 'SEND QUOTE REQUEST',
    },
  },

  de: {
    legal: {
      consentPrefix: 'Ich habe die ',
      privacyLink: 'Datenschutzerklärung',
      consentSuffix: ' gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung der Anfrage zu.',
      consentRequired: 'Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.',
      privacyTitle: 'Datenschutz',
      cookieLink: 'Cookie-Richtlinie',
    },
    instagram: {
      tag: 'INSTAGRAM FEED',
      title: 'FOLGE UNS AUF',
      desc: 'Tägliche Fotos aus unserem Holzofen, neue Spezialteige und exklusive Events in Castellanza.',
    },
    cart: {
      title: 'DEIN WARENKORB',
      delivery: 'LIEFERUNG NACH HAUSE',
      pickup: 'ABHOLUNG IN DER PIZZERIA',
      deliveryTab: '🛵 Lieferung',
      pickupTab: '🛍️ Abholung (gratis)',
      emptyTitle: 'DER WARENKORB IST LEER',
      emptyDesc: 'Wähle deine Lieblingspizzen aus unserer handwerklichen Holzofen-Speisekarte.',
      exploreMenu: 'SPEISEKARTE ANSEHEN',
      subtotal: 'Zwischensumme:',
      deliveryFee: 'Liefergebühr:',
      pickupFee: 'Abholung vor Ort:',
      free: 'GRATIS',
      total: 'GESAMT:',
      orderDelivery: 'LIEFERUNG BESTELLEN',
      orderPickup: 'ZUR ABHOLUNG BESTELLEN',
    },
    checkout: {
      deliveryTitle: 'LIEFERBESTELLUNG BESTÄTIGEN',
      pickupTitle: 'ABHOLBESTELLUNG BESTÄTIGEN',
      deliverySubtitle: 'SCHNELLE LIEFERUNG AUS DEM HOLZOFEN',
      pickupSubtitle: 'ABHOLUNG IN DER PIZZERIA OHNE WARTEZEIT',
      deliveryTab: 'Lieferung (+2,50 €)',
      pickupTab: 'Abholung (gratis)',
      nameLabel: 'VOR- UND NACHNAME *',
      phoneLabel: 'TELEFONNUMMER *',
      addressLabel: 'STRASSE UND HAUSNUMMER *',
      cityLabel: 'ORT',
      capLabel: 'PLZ',
      pickupPointTitle: 'ABHOLPUNKT PIZZERIA',
      pickupPointDesc: 'Sapore Verace Pizzeria — Via Borsano 44, 21053 Castellanza (VA). Deine Bestellung ist zur gewählten Uhrzeit heiß und frisch bereit.',
      notesDeliveryLabel: 'HINWEISE ZUR LIEFERUNG (KLINGEL, ALLERGIEN, STOCKWERK...)',
      notesPickupLabel: 'HINWEISE ODER SONDERWÜNSCHE (ALLERGIEN...)',
      notesDeliveryPlaceholder: 'z. B. bei Rossi klingeln, 2. Stock...',
      notesPickupPlaceholder: 'z. B. Teig gut durchgebacken...',
      paymentLabel: 'ZAHLUNGSART',
      cashDelivery: 'BAR BEIM FAHRER',
      cashPickup: 'BAR AN DER KASSE',
      cardDelivery: 'KARTE / EC BEI LIEFERUNG',
      cardPickup: 'KARTE / EC AN DER KASSE',
      subtotalDelivery: 'Zwischensumme + Lieferung (2,50 €)',
      subtotalPickup: 'Zwischensumme (Abholung gratis)',
      totalToPay: 'ZU ZAHLENDER BETRAG:',
      confirmDeliveryBtn: 'BESTELLUNG BESTÄTIGEN',
      confirmPickupBtn: 'ABHOLBESTELLUNG BESTÄTIGEN',
      alertContact: 'Bitte gib deinen Namen und deine Telefonnummer ein.',
      alertAddress: 'Bitte gib die Lieferadresse mit Hausnummer ein.',
      deliveryTimeLabel: 'LIEFERZEIT',
      pickupTimeLabel: 'ABHOLZEIT',
      asap: 'So schnell wie möglich',
      closedToday: 'Online-Bestellungen sind für heute geschlossen. Du kannst einen Tisch reservieren oder uns anrufen.',
      sending: 'WIRD GESENDET...',
      submitDelivery: 'BESTELLUNG BESTÄTIGEN UND SENDEN',
      submitPickup: 'ABHOLBESTELLUNG BESTÄTIGEN',
    },
    reservation: {
      closedShort: 'geschlossen',
      noSlots: 'Für diese Schicht sind keine Uhrzeiten buchbar: wähle einen anderen Tag oder eine andere Schicht.',
      errorSlot: 'Bitte wähle eine der verfügbaren Uhrzeiten.',
    },
    findUs: {
      lunchLabel: 'Mittag',
      dinnerLabel: 'Abend',
      closedLabel: 'Geschlossen',
      mapConsentText: 'Die Karte wird von Google Maps bereitgestellt, das Cookies von Drittanbietern setzen kann.',
      mapConsentBtn: 'Karte anzeigen',
      geoUnsupported: 'Dein Browser unterstützt keine Standortbestimmung: gib den Startort bitte manuell ein.',
    },
    events: {
      errorContact: 'Bitte gib deinen Namen und deine Telefonnummer ein.',
      sending: 'WIRD GESENDET...',
      submitInquiry: 'ANGEBOTSANFRAGE SENDEN',
    },
  },

  sq: {
    legal: {
      consentPrefix: 'Kam lexuar ',
      privacyLink: 'politikën e privatësisë',
      consentSuffix: ' dhe pranoj përpunimin e të dhënave të mia për të menaxhuar kërkesën.',
      consentRequired: 'Për të vazhduar prano politikën e privatësisë.',
      privacyTitle: 'Privatësia',
      cookieLink: 'Politika e cookie-ve',
    },
    checkout: {
      deliveryTimeLabel: 'ORARI I DORËZIMIT',
      pickupTimeLabel: 'ORARI I MARRJES',
      asap: 'Sa më shpejt',
      closedToday: 'Për sot porositë online janë të mbyllura. Mund të rezervosh një tavolinë ose të na telefonosh.',
      sending: 'PO DËRGOHET...',
      submitDelivery: 'KONFIRMO DHE DËRGO POROSINË',
      submitPickup: 'KONFIRMO POROSINË PËR MARRJE',
      alertAddress: 'Të lutem shkruaj adresën e dorëzimit me numrin e shtëpisë.',
    },
    reservation: {
      closedShort: 'mbyllur',
      noSlots: 'Nuk ka orare të rezervueshme për këtë turn: zgjidh një ditë ose turn tjetër.',
      errorSlot: 'Zgjidh një nga oraret e disponueshme.',
    },
    findUs: {
      lunchLabel: 'Drekë',
      dinnerLabel: 'Darkë',
      closedLabel: 'Mbyllur',
      mapConsentText: 'Harta ofrohet nga Google Maps, që mund të vendosë cookie të palëve të treta.',
      mapConsentBtn: 'Shfaq hartën',
      geoUnsupported: 'Shfletuesi yt nuk mbështet vendndodhjen: shkruaj nisjen manualisht.',
    },
    events: {
      errorContact: 'Të lutem plotëso emrin dhe numrin e telefonit.',
      sending: 'PO DËRGOHET...',
      submitInquiry: 'DËRGO KËRKESËN PËR OFERTË',
    },
  },
};

// Unione profonda: le chiavi aggiuntive completano le sezioni esistenti senza sostituirle
export const mergeTranslations = (base, extra) => {
  if (!extra) return base;
  const out = { ...base };
  const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
  Object.entries(extra).forEach(([key, value]) => {
    out[key] = isObject(value) && isObject(base?.[key]) ? mergeTranslations(base[key], value) : value;
  });
  return out;
};

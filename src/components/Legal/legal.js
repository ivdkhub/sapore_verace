// Apertura delle pagine legali da qualsiasi componente (footer, moduli, mappa)
export const LEGAL_EVENT = 'sv:open-legal';

export const openLegal = (page = 'privacy') => {
  window.dispatchEvent(new CustomEvent(LEGAL_EVENT, { detail: page }));
};

// Consenso al caricamento dei contenuti di terze parti (Google Maps)
const MAPS_CONSENT_KEY = 'sv_maps_consent';

export const hasMapsConsent = () => {
  try {
    return localStorage.getItem(MAPS_CONSENT_KEY) === '1';
  } catch {
    return false;
  }
};

export const setMapsConsent = (value) => {
  try {
    if (value) localStorage.setItem(MAPS_CONSENT_KEY, '1');
    else localStorage.removeItem(MAPS_CONSENT_KEY);
  } catch {
    // archiviazione non disponibile: il consenso vale solo per questa visita
  }
};

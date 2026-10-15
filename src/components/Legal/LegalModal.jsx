import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BUSINESS } from '../../config/business';
import { LEGAL_EVENT, setMapsConsent, hasMapsConsent } from './legal';

const Placeholder = ({ value, label }) =>
  value ? <>{value}</> : <span className="text-rose-300">[{label} da completare]</span>;

const address = `${BUSINESS.address.street}, ${BUSINESS.address.postalCode} ${BUSINESS.address.city} (${BUSINESS.address.province})`;

const PrivacyPolicy = () => (
  <>
    <h2>Informativa privacy</h2>
    <p className="text-xs text-white/50">ai sensi degli artt. 13-14 del Regolamento UE 2016/679 (GDPR)</p>

    <h3>Titolare del trattamento</h3>
    <p>
      <Placeholder value={BUSINESS.legalName} label="Ragione sociale" /> — {address} — P.IVA{' '}
      <Placeholder value={BUSINESS.vatNumber} label="P.IVA" /> — Tel. {BUSINESS.phone} — Email{' '}
      <Placeholder value={BUSINESS.privacyEmail} label="email privacy" />.
    </p>

    <h3>Quali dati raccogliamo e perché</h3>
    <ul>
      <li>
        <b>Prenotazione di un tavolo</b>: nome, telefono, email (facoltativa), data, orario, numero di persone e note. Servono a
        gestire la prenotazione e a contattarti in caso di variazioni (base giuridica: esecuzione di misure precontrattuali su tua
        richiesta, art. 6.1.b GDPR).
      </li>
      <li>
        <b>Ordine a domicilio o da asporto</b>: nome, telefono, indirizzo di consegna, note e prodotti ordinati, per preparare e
        consegnare l’ordine (art. 6.1.b GDPR).
      </li>
      <li>
        <b>Richiesta per eventi</b>: nome, telefono, email, tipo di evento, data, ospiti e note, per risponderti con una proposta
        (art. 6.1.b GDPR).
      </li>
    </ul>
    <p>
      Le eventuali note su allergie o intolleranze vengono usate solo per preparare in sicurezza ciò che hai richiesto. Non usiamo i
      tuoi dati per marketing e non li cediamo a terzi.
    </p>

    <h3>Dove sono conservati e per quanto</h3>
    <p>
      I dati sono salvati sul server del nostro hosting (GoDaddy) e inviati al personale del ristorante tramite i canali di notifica
      configurati (email, Telegram e/o WhatsApp), che agiscono come fornitori tecnici. I dati di prenotazioni, ordini e richieste
      vengono cancellati automaticamente dopo 30 giorni, salvo obblighi di legge (es. fiscali).
    </p>

    <h3>I tuoi diritti</h3>
    <p>
      Puoi chiedere in ogni momento accesso, rettifica, cancellazione, limitazione od opposizione al trattamento scrivendo a{' '}
      <Placeholder value={BUSINESS.privacyEmail} label="email privacy" /> o chiamando il {BUSINESS.phone}. Puoi anche proporre
      reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).
    </p>
  </>
);

const CookiePolicy = () => {
  const [maps, setMaps] = useState(hasMapsConsent());
  return (
    <>
      <h2>Cookie policy</h2>
      <h3>Cookie tecnici</h3>
      <p>
        Il sito non usa cookie di profilazione né strumenti di statistica. Usa solo:
      </p>
      <ul>
        <li>
          <b>sv_admin</b>: cookie tecnico di sessione, creato solo quando il personale accede all’area riservata.
        </li>
        <li>
          <b>Memoria locale del browser</b>: ricorda la lingua scelta e se hai acconsentito a caricare la mappa.
        </li>
      </ul>
      <h3>Contenuti di terze parti</h3>
      <p>
        La mappa di <b>Google Maps</b> viene caricata solo se clicchi su “Mostra mappa”. In quel momento Google può impostare propri
        cookie e ricevere il tuo indirizzo IP (informativa: policies.google.com/privacy). I link a Instagram, WhatsApp e ai
        navigatori aprono servizi esterni con le loro informative.
      </p>
      <p className="mt-3">
        Consenso mappa attuale: <b>{maps ? 'accettato' : 'non dato'}</b>{' '}
        {maps && (
          <button
            type="button"
            className="underline text-[#ffa323] cursor-pointer"
            onClick={() => {
              setMapsConsent(false);
              setMaps(false);
            }}
          >
            revoca
          </button>
        )}
      </p>
    </>
  );
};

// Finestra con informativa privacy e cookie policy (aperta con openLegal())
export const LegalModal = () => {
  const [page, setPage] = useState(null);

  useEffect(() => {
    const open = (e) => setPage(e.detail || 'privacy');
    window.addEventListener(LEGAL_EVENT, open);
    return () => window.removeEventListener(LEGAL_EVENT, open);
  }, []);

  useEffect(() => {
    if (!page) return;
    const onKey = (e) => e.key === 'Escape' && setPage(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page]);

  if (!page) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => setPage(null)}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 sm:p-8 text-sm text-white/80 leading-relaxed [&_h2]:font-oswald [&_h2]:text-2xl [&_h2]:text-white [&_h2]:uppercase [&_h3]:font-oswald [&_h3]:text-[#ffa323] [&_h3]:uppercase [&_h3]:mt-5 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setPage(null)}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 cursor-pointer"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex gap-2 mb-4 text-xs font-oswald uppercase tracking-wider">
          <button type="button" onClick={() => setPage('privacy')} className={`px-3 py-1.5 rounded-lg cursor-pointer ${page === 'privacy' ? 'bg-[#d2401e] text-white' : 'bg-white/5'}`}>
            Privacy
          </button>
          <button type="button" onClick={() => setPage('cookie')} className={`px-3 py-1.5 rounded-lg cursor-pointer ${page === 'cookie' ? 'bg-[#d2401e] text-white' : 'bg-white/5'}`}>
            Cookie
          </button>
        </div>
        {page === 'cookie' ? <CookiePolicy /> : <PrivacyPolicy />}
      </div>
    </div>
  );
};

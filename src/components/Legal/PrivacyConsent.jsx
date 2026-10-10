import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { openLegal } from './legal';

// Casella obbligatoria di presa visione dell'informativa privacy nei moduli
export const PrivacyConsent = ({ checked, onChange, id = 'privacy-consent' }) => {
  const { t } = useLanguage();
  const l = t.legal || {};
  return (
    <div className="flex items-start gap-2.5 text-xs text-white/70">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-[#d2401e] cursor-pointer shrink-0"
        required
      />
      <label htmlFor={id} className="leading-relaxed cursor-pointer">
        {l.consentPrefix || 'Ho letto l’'}
        <button
          type="button"
          onClick={() => openLegal('privacy')}
          className="underline text-[#ffa323] hover:text-white cursor-pointer"
        >
          {l.privacyLink || 'informativa privacy'}
        </button>
        {l.consentSuffix || ' e acconsento al trattamento dei miei dati per gestire la richiesta.'}
      </label>
    </div>
  );
};

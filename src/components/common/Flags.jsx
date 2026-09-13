import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Italy Flag (IT)
export const ItalyFlag = ({ className = 'w-6 h-4', ...props }) => (
  <svg
    viewBox="0 0 30 20"
    className={`rounded-[3px] overflow-hidden shadow-sm shrink-0 ${className}`}
    {...props}
  >
    <rect width="10" height="20" fill="#009246" />
    <rect x="10" width="10" height="20" fill="#FFFFFF" />
    <rect x="20" width="10" height="20" fill="#CE2B37" />
  </svg>
);

// UK Flag (EN)
export const UKFlag = ({ className = 'w-6 h-4', ...props }) => (
  <svg
    viewBox="0 0 30 20"
    className={`rounded-[3px] overflow-hidden shadow-sm shrink-0 ${className}`}
    {...props}
  >
    <clipPath id="uk-clip">
      <rect width="30" height="20" />
    </clipPath>
    <g clipPath="url(#uk-clip)">
      <rect width="30" height="20" fill="#012169" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2.5" />
      <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.6" />
    </g>
  </svg>
);

// Germany Flag (DE)
export const GermanyFlag = ({ className = 'w-6 h-4', ...props }) => (
  <svg
    viewBox="0 0 30 20"
    className={`rounded-[3px] overflow-hidden shadow-sm shrink-0 ${className}`}
    {...props}
  >
    <rect width="30" height="6.66" fill="#000000" />
    <rect y="6.66" width="30" height="6.66" fill="#DD0000" />
    <rect y="13.33" width="30" height="6.67" fill="#FFCC00" />
  </svg>
);

// Albania Flag (SQ)
export const AlbaniaFlag = ({ className = 'w-6 h-4', ...props }) => (
  <svg
    viewBox="0 0 30 20"
    className={`rounded-[3px] overflow-hidden shadow-sm shrink-0 ${className}`}
    {...props}
  >
    <rect width="30" height="20" fill="#E41E20" />
    {/* Stylized Double-Headed Eagle */}
    <g fill="#000000">
      <ellipse cx="15" cy="11" rx="2.8" ry="4.5" />
      {/* Left Wing */}
      <path d="M14 9 C11 6, 8 7, 7 11 C9 10, 11 11, 13 13 Z" />
      <path d="M13 11 C10 9, 8 11, 8 14 C10 13, 12 13, 13.5 14 Z" />
      {/* Right Wing */}
      <path d="M16 9 C19 6, 22 7, 23 11 C21 10, 19 11, 17 13 Z" />
      <path d="M17 11 C20 9, 22 11, 22 14 C20 13, 18 13, 16.5 14 Z" />
      {/* Heads */}
      <circle cx="13.5" cy="6.8" r="1.1" />
      <path d="M13.5 6.2 L11.8 6.5 L13 7.5 Z" />
      <circle cx="16.5" cy="6.8" r="1.1" />
      <path d="M16.5 6.2 L18.2 6.5 L17 7.5 Z" />
      {/* Tail */}
      <path d="M13.5 15 L15 18 L16.5 15 Z" />
    </g>
  </svg>
);

export const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  const flags = [
    { code: 'it', name: 'Italiano', Component: ItalyFlag },
    { code: 'en', name: 'English', Component: UKFlag },
    { code: 'de', name: 'Deutsch', Component: GermanyFlag },
    { code: 'sq', name: 'Shqip', Component: AlbaniaFlag },
  ];

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 ${className}`}>
      {flags.map(({ code, name, Component }) => {
        const isActive = lang === code;
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            title={name}
            type="button"
            className={`relative p-0.5 rounded-[4px] transition-all duration-300 cursor-pointer ${
              isActive
                ? 'ring-2 ring-[#ffa323] ring-offset-1 ring-offset-[#121212] opacity-100 scale-110 shadow-lg shadow-[#ffa323]/30'
                : 'opacity-50 hover:opacity-100 hover:scale-105 filter grayscale-[25%] hover:grayscale-0'
            }`}
          >
            <Component className="w-6 h-4 sm:w-7 sm:h-4.5 block" />
          </button>
        );
      })}
    </div>
  );
};

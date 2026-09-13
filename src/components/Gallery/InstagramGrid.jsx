import React from 'react';
import { InstagramIcon, MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';

const GALLERY_ITEMS = [
  {
    id: 1,
    image: '/images/1.jpg',
    title: 'La Nostra Pizza Artigianale',
    handle: '@sapore_verace',
  },
  {
    id: 2,
    image: '/images/2.jpg',
    title: 'Tradizione Napoletana a Castellanza',
    handle: '@sapore_verace',
  },
  {
    id: 3,
    image: '/images/3.jpg',
    title: 'Specialità Forno a Legna',
    handle: '@sapore_verace',
  },
  {
    id: 4,
    image: '/images/4.jpg',
    title: 'Ingredienti Selezionati DOP',
    handle: '@sapore_verace',
  },
  {
    id: 5,
    image: '/images/5.jpg',
    title: 'Impasto a Lunga Lievitazione',
    handle: '@sapore_verace',
  },
  {
    id: 6,
    image: '/images/6.jpg',
    title: 'Momenti Veraci in Sala',
    handle: '@sapore_verace',
  },
];

export const InstagramGrid = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#121212] overflow-hidden border-t border-white/5 pt-12">
      {/* Header Banner */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
          <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-bold">
            {t.instagram?.tag || 'INSTAGRAM FEED'}
          </span>
        </div>
        <h3 className="font-oswald text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
          {t.instagram?.title || 'SEGUICI SU'}{' '}
          <a
            href="https://www.instagram.com/sapore_verace/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d2401e] hover:underline"
          >
            @SAPORE_VERACE
          </a>
        </h3>
        <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
          {t.instagram?.desc || 'Foto quotidiane dal nostro forno a legna, nuovi impasti speciali ed eventi esclusivi a Castellanza.'}
        </p>
      </div>

      {/* 6-Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-white/5">
        {GALLERY_ITEMS.map((item) => (
          <a
            key={item.id}
            href="https://www.instagram.com/sapore_verace/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-[#181818] overflow-hidden flex items-center justify-center border-r border-b lg:border-b-0 border-white/5"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />

            {/* Hover Dark Overlay with Instagram Icon */}
            <div className="absolute inset-0 bg-[#d2401e]/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
              <InstagramIcon className="w-8 h-8 mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
              <span className="font-oswald text-xs tracking-widest uppercase font-bold">
                {item.handle}
              </span>
              <span className="text-[10px] font-sans opacity-80 mt-1 line-clamp-1">
                {item.title}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Torna in cima"
      className={`fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#181818]/90 hover:bg-[#d2401e] border border-white/15 hover:border-[#d2401e] backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center shadow-2xl shadow-black/70 hover:shadow-[#d2401e]/30 transition-all duration-300 active:scale-90 cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
      }`}
      title="Torna all'inizio"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.2]" />
    </button>
  );
};

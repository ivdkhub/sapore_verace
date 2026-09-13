import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { useLanguage } from '../../context/LanguageContext';

export const LocationNewsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="relative py-20 lg:py-24 bg-[#141414] border-b border-white/5 overflow-hidden bg-wood-pattern">
      {/* Decorative Radial Lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <MoustacheIcon className="w-5 h-2.5 text-[#d2401e]" />
          <span className="text-xs font-oswald tracking-[0.25em] text-[#ffa323] uppercase font-semibold">
            {t.newsletter.tag}
          </span>
        </div>

        <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight max-w-2xl mx-auto mb-4 leading-tight">
          {t.newsletter.title}
        </h2>

        <p className="text-white/70 text-sm sm:text-base font-sans max-w-xl mx-auto mb-8 leading-relaxed">
          {t.newsletter.desc}
        </p>

        {/* Newsletter Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          {submitted ? (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#d2401e]/20 border border-[#d2401e] rounded-lg text-white font-oswald tracking-wide animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-[#d2401e]" />
              <span>{t.newsletter.success}</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="email"
                required
                placeholder={t.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 bg-[#1e1e1e] text-white border border-white/20 font-oswald text-sm tracking-wider uppercase placeholder:text-white/40 focus:outline-none focus:border-[#d2401e] transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#d2401e] hover:bg-[#b83314] text-white font-oswald text-sm tracking-[0.2em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-[#d2401e]/30"
              >
                <span>{t.newsletter.btn}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

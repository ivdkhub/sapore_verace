import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ChevronDown, Phone, Bike, Calendar } from 'lucide-react';
import { MoustacheIcon } from '../common/Icons';
import { SideDrawer } from './SideDrawer';
import { LanguageSwitcher } from '../common/Flags';
import { AnimatedLogoSvg } from '../common/AnimatedLogoSvg';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';

export const Header = () => {
  const { t } = useLanguage();
  const { totalItemsCount, setIsCartOpen, activeOrder, setIsTrackingOpen } = useCart();
  const { setIsBookingModalOpen } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('HOME');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_ITEMS_LEFT = [
    { label: t.nav?.home || 'HOME', href: '#', active: true, hasSub: true, key: 'HOME' },
    { label: t.nav?.pages || 'PAGINE', href: '#pages', hasSub: true, key: 'PAGES' },
    { label: t.nav?.menu || 'MENÙ', href: '#menu', hasSub: true, key: 'MENU' },
  ];

  const NAV_ITEMS_RIGHT = [
    { label: t.nav?.fixedMenu || t.fixedMenu || 'MENÙ FISSO', href: '#menu-fisso', hasSub: false, key: 'MENU_FISSO' },
    { label: t.nav?.event || 'EVENTI', href: '#event', hasSub: true, key: 'EVENT' },
    { label: t.nav?.findUs || 'COME TROVARCI', href: '#come-trovarci', hasSub: false, key: 'FIND_US' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-[#121212]/95 backdrop-blur-md shadow-2xl py-2.5 border-b border-white/10'
            : 'bg-gradient-to-b from-[#0d0d0d]/90 via-[#0d0d0d]/70 to-transparent backdrop-blur-[2px] py-3.5 lg:py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT WIDGET: ORDER IN NOW / PHONE */}
            <div className="hidden xl:flex items-center gap-3 w-[260px]">
              <div className="w-10 h-10 rounded-full bg-[#d2401e] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#d2401e]/30">
                <Phone className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="block text-[10px] font-oswald text-white/80 tracking-[0.2em] uppercase leading-none mb-1">
                  {t.orderInNow || 'ORDINA ORA'}
                </span>
                <a
                  href="tel:03311081917"
                  className="font-oswald text-lg text-white font-semibold hover:text-[#d2401e] transition-colors leading-none tracking-wide"
                >
                  0331 108 1917
                </a>
              </div>
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <div className="flex items-center lg:hidden py-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#d2401e] transition-colors p-1.5 rounded-lg hover:bg-white/5 shrink-0 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>

            {/* CENTER: DIVIDED NAVIGATION BAR WITH CENTRAL LOGO */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              {/* Left Menu Items */}
              <ul className="flex items-center gap-6 lg:gap-8">
                {NAV_ITEMS_LEFT.map((item) => {
                  const isActive = activeItem === item.key;
                  return (
                    <li key={item.key} className="relative group">
                      <a
                        href={item.href}
                        onClick={() => setActiveItem(item.key)}
                        className={`flex flex-col items-center py-2 transition-colors duration-200 relative ${
                          isActive ? 'text-[#d2401e]' : 'text-white hover:text-[#d2401e]'
                        }`}
                      >
                        <span className="font-oswald text-xs lg:text-[13px] tracking-[0.18em] font-medium flex items-center gap-1">
                          {item.label}
                          {item.hasSub && (
                            <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                          )}
                        </span>
                        {/* Clean Underline indicator on active/hover */}
                        <span
                          className={`h-0.5 bg-[#d2401e] rounded-full transition-all duration-300 ${
                            isActive ? 'w-full opacity-100 mt-1' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100 mt-1'
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Central Logo (Animated SVG) */}
              <div className="mx-6 xl:mx-8 shrink-0 py-1">
                <a href="#" className="flex flex-col items-center group">
                  <AnimatedLogoSvg
                    className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                      isScrolled ? 'h-16 lg:h-20' : 'h-20 sm:h-24 lg:h-28 xl:h-32'
                    }`}
                    strokeWidth={2.5}
                  />
                </a>
              </div>

              {/* Right Menu Items */}
              <ul className="flex items-center gap-6 lg:gap-8">
                {NAV_ITEMS_RIGHT.map((item) => {
                  const isActive = activeItem === item.key;
                  return (
                    <li key={item.key} className="relative group">
                      <a
                        href={item.href}
                        onClick={() => setActiveItem(item.key)}
                        className={`flex flex-col items-center py-2 transition-colors duration-200 relative ${
                          isActive ? 'text-[#d2401e]' : 'text-white hover:text-[#d2401e]'
                        }`}
                      >
                        <span className="font-oswald text-xs lg:text-[13px] tracking-[0.18em] font-medium flex items-center gap-1">
                          {item.label}
                          {item.hasSub && (
                            <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                          )}
                        </span>
                        {/* Clean Underline indicator on active/hover */}
                        <span
                          className={`h-0.5 bg-[#d2401e] rounded-full transition-all duration-300 ${
                            isActive ? 'w-full opacity-100 mt-1' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100 mt-1'
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* RIGHT WIDGET: BOOKING, TRACKING, CART, SIDE MENU */}
            <div className="flex items-center gap-2.5 sm:gap-3 justify-end xl:w-[280px]">

              {/* Quick Table Reservation Trigger */}
              <a
                href="#reservation"
                onClick={() => setActiveItem('RESERVATION')}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d2401e] to-[#ffa323] hover:from-[#b83314] hover:to-[#d2401e] text-white font-oswald text-xs tracking-wider uppercase font-semibold transition-all shadow-md shadow-[#d2401e]/30 hover:scale-105 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.bookNow || 'PRENOTA ORA'}</span>
              </a>

              {/* Active Order Live Tracking Badge (if order exists) */}
              {activeOrder && (
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#d2401e] hover:bg-[#b83314] text-white rounded-full font-oswald text-xs tracking-wider uppercase animate-bounce cursor-pointer shadow-lg shadow-[#d2401e]/40"
                  title="Vedi stato ordine in tempo reale"
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>{t.trackingBadge || 'TRACKING'}</span>
                </button>
              )}

              {/* Cart Trigger with Dynamic Counter Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white/90 hover:text-[#d2401e] transition-colors cursor-pointer p-1"
                aria-label={t.cart?.title || 'Carrello'}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d2401e] text-white text-[10px] font-oswald font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Side Drawer Trigger */}
              <button
                onClick={() => setIsSideDrawerOpen(true)}
                className="text-white/90 hover:text-[#d2401e] transition-colors cursor-pointer p-1"
                aria-label="Open side drawer"
              >
                <div className="flex flex-col gap-1.5 items-end">
                  <span className="w-6 h-[2px] bg-current rounded-full" />
                  <span className="w-4 h-[2px] bg-current rounded-full" />
                  <span className="w-5 h-[2px] bg-current rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU ACCORDION */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#181818] border-b border-white/10 px-6 py-6 mt-4 animate-in slide-in-from-top-4">
            <div className="mb-4 pb-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-oswald text-white/60 uppercase tracking-widest">
                LINGUA / LANGUAGE:
              </span>
              <LanguageSwitcher />
            </div>

            {/* Quick Table Reservation Trigger for Mobile */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBookingModalOpen(true);
              }}
              className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-[#d2401e] to-[#ffa323] text-white font-oswald text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d2401e]/30 cursor-pointer active:scale-95 transition-transform"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookNow || 'PRENOTA UN TAVOLO ORA'}</span>
            </button>

            {/* Mobile Tracking Shortcut */}
            {activeOrder && (
              <button
                onClick={() => {
                  setIsTrackingOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mb-3 py-2.5 bg-[#d2401e] text-white rounded-xl font-oswald text-xs tracking-wider uppercase flex items-center justify-center gap-2 animate-bounce"
              >
                <Bike className="w-4 h-4" />
                <span>{t.tracking?.tag || 'LIVE ORDER TRACKING'}</span>
              </button>
            )}

            <ul className="space-y-3 pt-2">
              {[...NAV_ITEMS_LEFT, ...NAV_ITEMS_RIGHT].map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-oswald text-base tracking-widest text-white hover:text-[#d2401e] block py-1.5 border-b border-white/5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d2401e] flex items-center justify-center text-white shrink-0 shadow-md">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-oswald text-white/70 tracking-widest uppercase">
                    {t.orderInNow || 'ORDINA ORA'}
                  </span>
                  <a href="tel:03311081917" className="font-oswald text-lg text-white font-bold hover:text-[#d2401e] transition-colors">
                    0331 108 1917
                  </a>
                </div>
              </div>

              <a
                href="https://wa.me/3903311081917"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-oswald text-xs uppercase tracking-wider font-semibold hover:bg-emerald-600 hover:text-white transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* SIDE DRAWER */}
      <SideDrawer isOpen={isSideDrawerOpen} onClose={() => setIsSideDrawerOpen(false)} />
    </>
  );
};

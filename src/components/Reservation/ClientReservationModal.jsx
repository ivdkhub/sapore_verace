import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ReservationSection } from './ReservationSection';

export const ClientReservationModal = () => {
  const { isBookingModalOpen, setIsBookingModalOpen } = useAdmin();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsBookingModalOpen(false);
      }
    };
    if (isBookingModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingModalOpen, setIsBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in"
      onClick={() => setIsBookingModalOpen(false)}
    >
      <div
        className="relative w-full max-w-4xl bg-[#141414] border border-white/15 rounded-3xl shadow-2xl my-4 sm:my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d2401e]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsBookingModalOpen(false);
          }}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#d2401e] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Embedded Reservation Content */}
        <div className="w-full">
          <ReservationSection isModal={true} />
        </div>
      </div>
    </div>
  );
};

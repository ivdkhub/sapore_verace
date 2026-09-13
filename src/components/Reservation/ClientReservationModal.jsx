import React from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ReservationSection } from './ReservationSection';

export const ClientReservationModal = () => {
  const { isBookingModalOpen, setIsBookingModalOpen } = useAdmin();

  if (!isBookingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#141414] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsBookingModalOpen(false)}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-[#d2401e] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Embedded Reservation Content */}
        <div className="pt-6">
          <ReservationSection />
        </div>
      </div>
    </div>
  );
};

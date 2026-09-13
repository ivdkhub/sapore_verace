import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShieldCheck, LayoutGrid } from 'lucide-react';

export const AdminToggleFloating = () => {
  const { isAdminView, setIsAdminView } = useAdmin();

  if (isAdminView) return null;

  return (
    <button
      onClick={() => setIsAdminView(true)}
      className="fixed bottom-6 left-6 z-40 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full border border-white/20 shadow-2xl flex items-center gap-2 font-oswald text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 backdrop-blur-md cursor-pointer group"
      title="Accedi all'Area Amministratore Gestione Tavoli"
    >
      <div className="w-6 h-6 rounded-full bg-[#d2401e] text-white flex items-center justify-center group-hover:rotate-12 transition-transform">
        <ShieldCheck className="w-3.5 h-3.5" />
      </div>
      <span className="font-semibold text-white/90 group-hover:text-white">
        Area Admin Tavoli
      </span>
    </button>
  );
};

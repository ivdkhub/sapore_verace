import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { TrendingUp, Users, Utensils, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

export const AdminReports = () => {
  const { stats, tables } = useAdmin();

  const estimatedRevenue = stats.totalGuests * 28.5; // Average spend per guest

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Rapporti & Statistiche Locale</h2>
        <p className="text-xs text-slate-500">Analisi occupazione tavoli, coperti e andamento serata</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasso Occupazione</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{stats.occupancyRate}%</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              {stats.occupiedTables}/{stats.totalTables} Tavoli
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.occupancyRate}%` }} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coperti Totali Serviti</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{stats.totalGuests}</span>
            <span className="text-xs text-slate-500 font-medium">Max {stats.totalCapacity} posti</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            Media {(stats.totalGuests / (stats.occupiedTables || 1)).toFixed(1)} persone per tavolo
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stima Incasso Serata</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-emerald-600">€{estimatedRevenue.toFixed(0)}</span>
            <span className="text-xs text-slate-400 font-medium">Scontrino medio €28.5</span>
          </div>
          <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            +18% rispetto al giovedì scorso
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tavoli Disponibili</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{stats.availableTables}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              Pronti all'uso
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Sala Sinistra: {tables.filter((t) => t.room === 'left' && t.status === 'disponibile').length} • Sala Centrale: {tables.filter((t) => t.room === 'main' && t.status === 'disponibile').length}
          </p>
        </div>
      </div>
    </div>
  );
};

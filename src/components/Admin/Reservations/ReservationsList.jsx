import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Users, Clock, Phone, FileText, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

export const ReservationsList = ({ onSelectTable }) => {
  const { tables, clearTable, setIsModalOpen, setSelectedTable, findBestFreeTable } = useAdmin();

  const reservedTables = tables.filter((t) => t.reservation !== null);
  const freeTables = tables.filter((t) => t.reservation === null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Elenco Prenotazioni</h2>
          <p className="text-xs text-slate-500">Gestisci e assegna i tavoli per il servizio in corso</p>
        </div>

        <button
          onClick={() => {
            const best = findBestFreeTable ? findBestFreeTable(4, null, tables) : (freeTables[0] || null);
            if (best) {
              setSelectedTable(best);
              setIsModalOpen(true);
            } else {
              alert('Tutti i tavoli sono attualmente occupati!');
            }
          }}
          className="px-4 py-2 bg-[#d2401e] hover:bg-[#b83314] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Prenotazione</span>
        </button>
      </div>

      {/* Booked Tables List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Tavoli Prenotati / Occupati ({reservedTables.length})
          </h3>
        </div>

        {reservedTables.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Nessuna prenotazione attiva per questo turno. Clicca su un tavolo libero per prenotare.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reservedTables.map((t) => (
              <div key={t.id} className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex flex-col items-center justify-center text-xs">
                    <span className="text-[10px] text-slate-400">TAVOLO</span>
                    <span className="text-base leading-none">{t.name}</span>
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{t.reservation.clientName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.reservation.status === 'Seduti'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.reservation.status || 'Confermata'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {t.reservation.guests} Persone
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Ore {t.reservation.time}
                      </span>
                      {t.reservation.phone && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {t.reservation.phone}
                        </span>
                      )}
                    </div>

                    {t.reservation.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        Note: {t.reservation.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTable(t);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Modifica"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => clearTable(t.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Libera Tavolo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Tables Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 mb-4">
          Tavoli Liberi per Assegnazione Immediata ({freeTables.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {freeTables.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTable(t);
                setIsModalOpen(true);
              }}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                {t.name}
              </div>
              <span className="block text-xs font-bold text-emerald-900">
                {t.seats} Posti
              </span>
              <span className="block text-[10px] text-emerald-700 font-medium">
                {t.room === 'left' ? 'Sala Sinistra' : 'Sala Centrale'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Player, AvailabilityStatus } from '../../types';

interface SquadTableProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  onEditClick?: (e: React.MouseEvent, player: Player) => void;
  onDeleteClick?: (e: React.MouseEvent, player: Player) => void;
}

const SquadTable: React.FC<SquadTableProps> = ({ players, onPlayerClick, onEditClick, onDeleteClick }) => {
  
  const getPositionColor = (position: string) => {
    const p = (position || '').toUpperCase();
    if (p.includes('PORTERO')) return 'text-orange-400';
    if (p.includes('DEFENSA') || p.includes('LATERAL') || p.includes('CENTRAL')) return 'text-blue-400';
    if (p.includes('CENTRO') || p.includes('MEDIA') || p.includes('PIVOTE')) return 'text-green-400';
    if (p.includes('DELANTERO') || p.includes('EXTREMO') || p.includes('PUNTA')) return 'text-[#EE2523]';
    return 'text-white/80';
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      [AvailabilityStatus.AVAILABLE]: 'bg-green-500/10 text-green-500 border-green-500/20',
      [AvailabilityStatus.DOUBT]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      [AvailabilityStatus.INJURED]: 'bg-red-500/10 text-red-500 border-red-500/20',
      [AvailabilityStatus.UNAVAILABLE]: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };
    const style = colors[status as AvailabilityStatus] || 'bg-white/5 text-white/40 border-white/10';
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style}`}>
            {status}
        </span>
    );
  };

  const getYear = (date?: string) => {
    if (!date) return '-';
    const parts = date.split('-');
    // Si el formato es DD-MM-YYYY
    if (parts.length === 3 && parts[2].length === 4) return parts[2];
    // Si el formato es YYYY-MM-DD
    if (parts.length === 3 && parts[0].length === 4) return parts[0];
    return '-';
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left">
        <thead className="bg-[#0f0f0f] text-white/40 text-[9px] font-black uppercase tracking-widest border-b border-white/5">
          <tr>
            <th className="px-8 py-5">Nombre</th>
            <th className="px-4 py-5 text-center">Disponible</th>
            <th className="px-4 py-5">Demarcación</th>
            <th className="px-4 py-5 text-center">Lateralidad</th>
            <th className="px-4 py-5 text-center">F. Nacimiento</th>
            <th className="px-4 py-5 text-center">Año</th>
            <th className="px-8 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {players.length > 0 ? (
            players.map((player) => (
              <tr 
                key={player.id} 
                onClick={() => onPlayerClick && onPlayerClick(player)}
                className="hover:bg-white/[0.05] transition-colors group cursor-pointer"
              >
                <td className="px-8 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#EE2523]/50 transition-colors bg-black/20 shrink-0 shadow-lg">
                      <img 
                        src={player.photoUrl || player.photo_url || 'https://via.placeholder.com/150'} 
                        alt={player.name} 
                        className="w-full h-full object-contain object-bottom grayscale group-hover:grayscale-0 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-black text-sm group-hover:text-[#EE2523] transition-colors truncate uppercase tracking-tight">
                        {player.apodo || player.name}
                      </span>
                      <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Lezama Digital ID</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                   <StatusBadge status={player.status} />
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${getPositionColor(player.position)}`}>
                    {player.position}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                   <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        {player.laterality || 'Diestro'}
                   </span>
                </td>
                <td className="px-4 py-4 text-center font-mono text-[11px] text-white/50 tabular-nums">
                   {player.birth_date || player.birthDate || '-'}
                </td>
                <td className="px-4 py-4 text-center">
                   <span className="text-white font-black text-xs px-2 py-0.5 rounded bg-[#EE2523]/10 border border-[#EE2523]/20">
                        {getYear(player.birth_date || player.birthDate)}
                   </span>
                </td>
                <td className="px-8 py-4 text-right space-x-1">
                    <button 
                      onClick={(e) => onEditClick && onEditClick(e, player)}
                      className="text-white/10 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button 
                      onClick={(e) => onDeleteClick && onDeleteClick(e, player)}
                      className="text-white/10 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center text-white/20 italic text-[11px] uppercase tracking-[0.4em]">
                No se han encontrado activos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SquadTable;

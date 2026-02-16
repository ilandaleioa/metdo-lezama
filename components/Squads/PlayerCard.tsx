
import React from 'react';
import { Player, AvailabilityStatus } from '../../types';

interface PlayerCardProps {
  player: Player;
  onClick: (player: Player) => void;
  onEditClick?: (e: React.MouseEvent, player: Player) => void;
  onDeleteClick?: (e: React.MouseEvent, player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick, onEditClick, onDeleteClick }) => {
  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE: return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
      case AvailabilityStatus.DOUBT: return 'bg-yellow-500 shadow-[0_0_10px_#eab308]';
      case AvailabilityStatus.INJURED: return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
      case AvailabilityStatus.UNAVAILABLE: return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const matches = player.matches_played || player.matchesPlayed || 0;
  const started = player.matches_started || player.matchesStarted || 0;
  const mins = player.minutes || 0;
  const goals = player.goals || 0;
  const photo = player.photoUrl || player.photo_url || 'https://via.placeholder.com/150';
  const participation = player.participation || 0;
  
  const birthDateStr = player.birth_date || player.birthDate;
  const age = birthDateStr 
    ? new Date().getFullYear() - new Date(birthDateStr).getFullYear()
    : null;

  return (
    <div 
      onClick={() => onClick(player)}
      className="bg-[#161616] border border-white/5 rounded-[24px] overflow-hidden group hover:border-[#EE2523]/30 transition-all duration-500 cursor-pointer relative shadow-2xl flex flex-col h-full"
    >
      {/* Indicador de Disponibilidad */}
      <div className={`absolute top-4 right-4 z-30 w-1.5 h-1.5 rounded-full ${getStatusColor(player.status)}`}></div>

      {/* Dorsal Fantasma de Fondo */}
      <span className="absolute top-0 left-3 text-[8rem] font-black text-white/[0.02] z-0 leading-none select-none tracking-tighter transition-all duration-700 group-hover:text-white/[0.04]">
        {player.dorsal}
      </span>

      {/* Contenedor de Imagen */}
      <div className="relative h-40 w-full flex items-end justify-center pt-2 overflow-hidden">
        <img 
          src={photo} 
          alt={player.name}
          className="h-[110%] w-full object-contain object-bottom relative z-10 transition-all duration-700 transform group-hover:scale-105 origin-bottom grayscale-[0.1] group-hover:grayscale-0"
        />
      </div>

      {/* Placa de Nombre (ESTILO DARK REFINADO) */}
      <div className="relative z-20 px-3 py-1">
        <div className="flex bg-black/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-[#EE2523]/50 transition-colors">
           <div className="flex-1 px-3 py-2 min-w-0">
              <h3 className="text-white font-black text-[12px] leading-none uppercase tracking-tight truncate">
                {player.apodo || player.name}
              </h3>
              <p className="text-white/30 text-[7px] font-black uppercase tracking-widest mt-1.5">{player.position}</p>
           </div>
           <div className="bg-[#EE2523]/10 px-3 flex items-center justify-center border-l border-white/10 min-w-[36px]">
              <span className="text-[#EE2523] font-black text-[15px]">{player.dorsal}</span>
           </div>
        </div>
      </div>

      {/* Etiquetas Técnicas */}
      <div className="px-4 pb-2 flex flex-wrap gap-2 z-20">
         <div className="bg-black/40 border border-white/5 px-2 py-0.5 rounded-md">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">
               {player.laterality || 'DIESTRO'}
            </span>
         </div>
         {age && (
            <div className="bg-black/40 border border-white/5 px-2 py-0.5 rounded-md">
               <span className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">
                  {age}A
               </span>
            </div>
         )}
         {participation > 0 && (
            <div className="bg-green-500/5 border border-green-500/10 px-2 py-0.5 rounded-md">
               <span className="text-[7px] font-black text-green-500 uppercase tracking-widest leading-none">
                  • {participation}%
               </span>
            </div>
         )}
      </div>

      {/* Grid de Estadísticas Inferior */}
      <div className="mt-auto bg-black/40 grid grid-cols-4 gap-0 py-4 px-1 z-20 transition-colors border-t border-white/5">
        <div className="text-center">
          <p className="text-[14px] font-black text-white tabular-nums leading-none mb-1">{matches}</p>
          <p className="text-[7px] text-white/20 font-black uppercase tracking-widest">PJ</p>
        </div>
        <div className="text-center border-l border-white/5">
          <p className="text-[14px] font-black text-white tabular-nums leading-none mb-1">{started}</p>
          <p className="text-[7px] text-white/20 font-black uppercase tracking-widest">TIT</p>
        </div>
        <div className="text-center border-l border-white/5">
          <p className="text-[14px] font-black text-[#EE2523] tabular-nums leading-none mb-1">{goals}</p>
          <p className="text-[7px] text-white/20 font-black uppercase tracking-widest">GOL</p>
        </div>
        <div className="text-center border-l border-white/5">
          <p className="text-[14px] font-black text-white tabular-nums leading-none mb-1">{mins}</p>
          <p className="text-[7px] text-white/20 font-black uppercase tracking-widest">MIN</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

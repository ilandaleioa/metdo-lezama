
import React, { useState, useEffect } from 'react';
import { Match, Player } from '../../types';
import { supabase } from '../../lib/supabase';

const MatchSheet: React.FC<{ match: Match }> = ({ match }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  
  useEffect(() => {
    supabase.from('players').select('*').in('id', [
        ...(match.starters || []), 
        ...(match.substitutes || []), 
        ...(match.nonCalled || [])
    ]).then(({ data }) => {
        if (data) setPlayers(data);
    });
  }, [match]);

  const calculateMinutes = (playerId: string) => {
    let total = 0;
    const isStarter = match.starters.includes(playerId);
    
    // Si fue titular
    if (isStarter) {
        const subOut = match.substitutions.find(s => s.playerOutId === playerId);
        total = subOut ? subOut.minute : 90;
    } else {
        const subIn = match.substitutions.find(s => s.playerInId === playerId);
        if (subIn) {
            const subOut = match.substitutions.find(s => s.playerOutId === playerId);
            total = subOut ? subOut.minute - subIn.minute : 90 - subIn.minute;
        }
    }
    return total;
  };

  const getPlayerPositionLabel = (playerId: string) => {
      if (!match.player_positions) return null;
      const pos = Object.entries(match.player_positions).find(([label, id]) => id === playerId);
      return pos ? pos[0] : null;
  };

  return (
    <div className="bg-[#0a0a0a] rounded-[48px] border border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
      {/* HEADER SCORE */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-12 border-b border-white/5 relative">
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
           <span className="text-[20rem] font-black italic tracking-tighter">VS</span>
        </div>

        <div className="flex flex-col items-center gap-10 relative z-10">
            <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-8 h-auto" alt="" />
                <div className="h-6 w-[1px] bg-white/10"></div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">{match.competition}</span>
            </div>

            <div className="flex items-center justify-center gap-12 md:gap-20 w-full">
                {/* LOCAL */}
                <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-3xl p-4 border border-white/10 shadow-2xl mb-6 transform -rotate-3">
                       <img src={match.localLogo || 'https://via.placeholder.com/100'} className="w-full h-full object-contain" alt="Local Logo" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-2">{match.localTeam}</h2>
                    <p className="text-[#EE2523] text-[9px] font-black uppercase tracking-widest">LOCAL</p>
                </div>

                {/* SCORE */}
                <div className="flex items-center gap-8 bg-black/40 px-10 py-6 rounded-[40px] border border-white/5 shadow-inner">
                    <span className="text-7xl md:text-9xl font-black text-white tabular-nums drop-shadow-[0_0_30px_rgba(238,37,35,0.3)]">{match.localGoals}</span>
                    <span className="text-white/10 text-4xl md:text-6xl italic">-</span>
                    <span className="text-7xl md:text-9xl font-black text-white tabular-nums">{match.visitorGoals}</span>
                </div>

                {/* VISITANTE */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-3xl p-4 border border-white/10 shadow-2xl mb-6 transform rotate-3">
                       <img src={match.visitorLogo || 'https://via.placeholder.com/100'} className="w-full h-full object-contain" alt="Visitor Logo" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-2">{match.visitorTeam}</h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">VISITANTE</p>
                </div>
            </div>

            <div className="flex gap-10 mt-4">
                <div className="flex flex-col items-center">
                    <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">SISTEMA</span>
                    <span className="text-white font-black text-lg">{match.system}</span>
                </div>
                <div className="w-px h-10 bg-white/5"></div>
                <div className="flex flex-col items-center">
                    <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">FECHA</span>
                    <span className="text-white font-black text-lg">{new Date(match.date).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* TITULARES */}
        <div className="space-y-6">
            <div className="flex justify-between items-center border-l-2 border-[#EE2523] pl-3">
                <h3 className="text-[10px] font-black text-[#EE2523] uppercase tracking-[0.3em]">XI INICIAL</h3>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">T&Aacute;CTICO</span>
            </div>
            <div className="space-y-2">
                {match.starters.map(id => {
                    const p = players.find(x => x.id === id);
                    const mins = calculateMinutes(id);
                    const tacticalPos = getPlayerPositionLabel(id);
                    return (
                        <div key={id} className="bg-white/[0.02] p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center shrink-0">
                                    <span className="w-7 h-7 rounded-lg bg-black flex items-center justify-center font-black text-[10px] text-[#EE2523] border border-white/5">{p?.dorsal}</span>
                                    {tacticalPos && <span className="text-[7px] font-black text-white/30 mt-1 uppercase tracking-tighter">{tacticalPos}</span>}
                                </div>
                                <span className="text-xs font-bold text-white uppercase">{p?.name}</span>
                            </div>
                            <span className={`text-[10px] font-black ${mins === 90 ? 'text-white/40' : 'text-[#EE2523]'}`}>{mins}'</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* SUPLENTES / CAMBIOS */}
        <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] border-l-2 border-white/20 pl-3">PARTICIPACI&Oacute;N SUPLENTES</h3>
            <div className="space-y-2">
                {match.substitutes.map(id => {
                    const p = players.find(x => x.id === id);
                    const mins = calculateMinutes(id);
                    if (mins === 0) return null;
                    return (
                        <div key={id} className="bg-white/[0.02] p-4 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <span className="w-7 h-7 rounded-lg bg-black flex items-center justify-center font-black text-[10px] text-white/30">{p?.dorsal}</span>
                                <span className="text-xs font-bold text-white uppercase">{p?.name}</span>
                            </div>
                            <span className="text-green-500 font-black text-[10px]">{mins}'</span>
                        </div>
                    );
                })}
                {match.substitutes.every(id => calculateMinutes(id) === 0) && <p className="text-white/10 italic text-[10px] text-center py-4 uppercase font-bold tracking-widest">Sin cambios realizados</p>}
            </div>

            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] border-l-2 border-white/5 pl-3 mt-10">SIN MINUTOS</h3>
            <div className="flex flex-wrap gap-2">
                {match.substitutes.map(id => {
                     const mins = calculateMinutes(id);
                     if (mins > 0) return null;
                     return <span key={id} className="bg-white/5 border border-white/5 text-white/30 text-[8px] font-bold px-2 py-1 rounded uppercase">{players.find(x=>x.id===id)?.name}</span>;
                })}
                {match.nonCalled.map(id => (
                    <span key={id} className="bg-black border border-white/5 text-white/10 text-[8px] font-bold px-2 py-1 rounded uppercase">{players.find(x=>x.id===id)?.name}</span>
                ))}
            </div>
        </div>

        {/* RESUMEN ESTRATÉGICO */}
        <div className="space-y-6">
            <div className="bg-[#1a1a1a] p-8 rounded-[40px] border border-white/5 shadow-inner">
                <h4 className="text-[9px] font-black text-[#EE2523] uppercase tracking-[0.3em] mb-6">L&Iacute;NEA TEMPORAL CAMBIOS</h4>
                <div className="space-y-6 relative">
                    <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/5"></div>
                    {match.substitutions.sort((a,b)=>a.minute-b.minute).map(s => (
                        <div key={s.id} className="flex gap-4 items-start relative z-10">
                            <div className="w-7 h-7 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-[8px] font-black text-white shrink-0 shadow-lg">{s.minute}'</div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" transform="rotate(45 12 12)"/></svg>
                                    <span className="text-[10px] font-black text-white/80 uppercase">{players.find(x=>x.id===s.playerOutId)?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                    <span className="text-[10px] font-black text-white/80 uppercase">{players.find(x=>x.id===s.playerInId)?.name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {match.substitutions.length === 0 && <p className="text-white/10 italic text-[10px] uppercase font-bold tracking-widest pl-10 py-10">Sin incidencias registradas</p>}
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#EE2523] to-[#801312] p-8 rounded-[40px] shadow-2xl group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-20 h-auto" alt="" />
                </div>
                <h4 className="text-white font-black text-xl italic uppercase tracking-tighter mb-2 relative z-10">Reporte IA</h4>
                <p className="text-white/80 text-xs leading-relaxed relative z-10">Basado en los minutos jugados y el sistema t&aacute;ctico, el equipo mantuvo un bloque medio compacto. Las sustituciones en el min {match.substitutions[0]?.minute || '--'} refrescaron la presi&oacute;n tras p&eacute;rdida.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSheet;

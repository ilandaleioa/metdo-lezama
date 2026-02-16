
import React, { useState, useMemo, useEffect } from 'react';
import { TEAMS, MOCK_PLAYERS } from '../../constants';

const PhysicalTestsView: React.FC<{ playerId?: string }> = ({ playerId }) => {
  const defaultTeamId = TEAMS[0]?.id || '2';
  const [selectedTeam, setSelectedTeam] = useState(defaultTeamId);
  const currentTeamPlayers = useMemo(() => MOCK_PLAYERS[selectedTeam] || [], [selectedTeam]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerId || (currentTeamPlayers.length > 0 ? currentTeamPlayers[0].id : ''));

  useEffect(() => {
    if (playerId) setSelectedPlayerId(playerId);
  }, [playerId]);

  const MOCK_TABLE_DATA = [
    { metric: 'SALTO CMJ (cm)', current: 42.5, target: 45.0, diff: -2.5, status: 'warning' },
    { metric: 'SPRINT 30m (s)', current: 4.12, target: 4.05, diff: +0.07, status: 'bad' },
    { metric: 'VO2 MAX (ml/kg)', current: 62.4, target: 60.0, diff: +2.4, status: 'good' },
    { metric: 'ASIMETRÍA (%)', current: 3.2, target: 5.0, diff: -1.8, status: 'good' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 bg-[#1a1a1a] p-2 rounded-2xl border border-white/5 w-fit">
            <select className="bg-[#0a0a0a] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select className="bg-[#0a0a0a] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none min-w-[150px]" value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)}>
                {currentTeamPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button className="bg-white/5 hover:bg-white hover:text-black text-white/40 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Exportar Datos Biomecánicos</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#0a0a0a] rounded-[32px] border border-white/10 p-8 shadow-2xl">
            <h3 className="text-[#EE2523] text-[11px] font-black uppercase tracking-[0.2em] mb-8">Sprint & Acceleration Profile</h3>
            <div className="relative h-56 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M 10,80 L 30,60 L 60,30 L 90,10" fill="none" stroke="#EE2523" strokeWidth="4" />
                 <circle cx="10" cy="80" r="3" fill="#EE2523" /><circle cx="30" cy="60" r="3" fill="#EE2523" />
                 <circle cx="60" cy="30" r="3" fill="#EE2523" /><circle cx="90" cy="10" r="3" fill="#EE2523" />
              </svg>
              <div className="flex justify-between mt-4 text-[9px] font-black text-white/20 uppercase tracking-widest"><span>Start</span><span>10m</span><span>20m</span><span>30m</span></div>
            </div>
         </div>

         <div className="bg-[#111111] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-black/40"><h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Benchmarks de Rendimiento</h4></div>
            <table className="w-full text-left">
               <thead className="bg-black/20 text-[9px] font-black text-white/20 uppercase tracking-widest"><tr className="border-b border-white/5"><th className="p-4">Métrica</th><th className="p-4 text-center">Actual</th><th className="p-4 text-center">Objetivo</th><th className="p-4 text-right">Estatus</th></tr></thead>
               <tbody className="divide-y divide-white/5">
                  {MOCK_TABLE_DATA.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.01]">
                       <td className="p-4 text-[11px] font-black text-white uppercase">{row.metric}</td>
                       <td className="p-4 text-center font-mono text-xs text-white/80">{row.current}</td>
                       <td className="p-4 text-center font-mono text-xs text-white/30">{row.target}</td>
                       <td className="p-4 text-right">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${row.status === 'good' ? 'bg-green-500/10 text-green-500' : row.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>{row.status}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default PhysicalTestsView;

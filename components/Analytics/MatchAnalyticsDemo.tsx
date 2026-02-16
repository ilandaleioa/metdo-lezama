
import React, { useState, useMemo } from 'react';
import { TEAMS } from '../../constants';

// MOCK DATA ampliado para alimentar las nuevas gráficas
const ANALYTICS_DATA_RAW = [
  { id: '1', teamId: '2', playerId: 'J101', playerName: 'Adama Boiro', role: 'TITULAR', minutes: 1850, goals: 2, yellow: 3 },
  { id: '2', teamId: '2', playerId: 'J102', playerName: 'Mikel Jauregizar', role: 'TITULAR', minutes: 2100, goals: 4, yellow: 2 },
  { id: '3', teamId: '2', playerId: 'J103', playerName: 'Aingeru Olabarrieta', role: 'SUPLENTE', minutes: 650, goals: 3, yellow: 0 },
  { id: '4', teamId: '2', playerId: 'J104', playerName: 'Hugo Rincón', role: 'TITULAR', minutes: 1420, goals: 1, yellow: 5 },
  { id: '5', teamId: '2', playerId: 'J105', playerName: 'Eneko Ebro', role: 'SUPLENTE', minutes: 480, goals: 0, yellow: 1 },
  { id: '6', teamId: '2', playerId: 'J106', playerName: 'Peio Canales', role: 'TITULAR', minutes: 1200, goals: 2, yellow: 2 },
  { id: '7', teamId: '2', playerId: 'J107', playerName: 'Unai Egiluz', role: 'TITULAR', minutes: 1580, goals: 0, yellow: 4 },
  { id: '8', teamId: '2', playerId: 'J108', playerName: 'Ibon Sánchez', role: 'SUPLENTE', minutes: 920, goals: 1, yellow: 0 },
  { id: '9', teamId: '2', playerId: 'J109', playerName: 'Carlos Mattheus', role: 'SUPLENTE', minutes: 310, goals: 0, yellow: 1 },
];

const MatchAnalyticsDemo: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);

  // Procesamiento de datos para el ranking
  const playerStats = useMemo(() => {
    return ANALYTICS_DATA_RAW
      .filter(d => d.teamId === selectedTeamId)
      .sort((a, b) => b.minutes - a.minutes);
  }, [selectedTeamId]);

  const maxMinutes = Math.max(...playerStats.map(p => p.minutes), 2800);

  const FilterSelect = ({ label, options }: { label: string, options: string[] }) => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
      <label className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>
      <select className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] font-bold uppercase outline-none focus:border-[#EE2523] transition-all cursor-pointer appearance-none">
        <option>Todos</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* 1. BARRA DE FILTROS SUPERIOR (ESTILO BI) */}
      <div className="bg-[#111111] border border-white/5 p-5 rounded-[24px] shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <FilterSelect label="Género" options={['Masculino', 'Femenino']} />
          <FilterSelect label="Estado" options={['Disponible', 'Baja', 'Duda']} />
          <FilterSelect label="Contexto" options={['Local', 'Visitante']} />
          <FilterSelect label="Tipo Partido" options={['Oficial', 'Amistoso']} />
          <FilterSelect label="Competición" options={['Liga', 'Copa', 'Torneo']} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
          <FilterSelect label="Equipo" options={TEAMS.map(t => t.name)} />
          <FilterSelect label="Jornada" options={['J21', 'J22', 'J23']} />
          <FilterSelect label="Partido" options={['Barakaldo', 'Real Unión']} />
          <FilterSelect label="ID Jugador" options={playerStats.map(p => p.playerName)} />
        </div>
      </div>

      {/* 2. GRÁFICA DE MINUTOS (HORIZONTAL RANKING) */}
      <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-6 bg-[#EE2523] rounded-full shadow-[0_0_10px_#EE2523]"></div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Ranking de Minutos Jugados</h3>
        </div>

        <div className="space-y-3 relative">
          {/* Eje de fondo */}
          <div className="absolute inset-y-0 left-[140px] right-0 flex justify-between pointer-events-none opacity-5">
            {[0, 700, 1400, 2100, 2800].map(val => (
              <div key={val} className="h-full w-px bg-white relative">
                <span className="absolute -bottom-6 -translate-x-1/2 text-[8px] font-black">{val}</span>
              </div>
            ))}
          </div>

          {playerStats.map((p, i) => (
            <div key={p.id} className="flex items-center group">
              <div className="w-[140px] text-right pr-4 shrink-0">
                <span className="text-[10px] font-black text-white/40 uppercase group-hover:text-white transition-colors truncate block">
                  {p.playerName}
                </span>
              </div>
              <div className="flex-1 h-4 bg-white/5 rounded-r-sm overflow-hidden relative">
                <div 
                  style={{ width: `${(p.minutes / maxMinutes) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#6b1211] via-[#EE2523] to-[#ff4d4b] transition-all duration-1000 shadow-lg relative"
                >
                  <div className="absolute right-2 inset-y-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-white tabular-nums">{p.minutes}'</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GRÁFICA DE DISTRIBUCIÓN DE ROLES (STACKED BARS) */}
      <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Distribución de Participación</h3>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
                <span className="text-[9px] font-black text-white/40 uppercase">Titular</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                <span className="text-[9px] font-black text-white/40 uppercase">Suplente</span>
             </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
          {/* Rejilla horizontal */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] px-4">
            {[36, 27, 18, 9, 0].map(v => (
              <div key={v} className="w-full border-t border-white flex justify-between">
                <span className="text-[8px] -ml-6 mt-[-4px] font-black">{v}</span>
              </div>
            ))}
          </div>

          {playerStats.map((p, i) => {
            // Lógica ficticia para la barra apilada basada en el mock
            const isTitular = p.role === 'TITULAR';
            const heightA = isTitular ? 70 + Math.random() * 20 : 10 + Math.random() * 20;
            const heightB = 100 - heightA;

            return (
              <div key={p.id} className="flex-1 flex flex-col justify-end group/stack h-full max-w-[40px]">
                <div className="w-full h-full flex flex-col justify-end rounded-t-sm overflow-hidden border border-white/5 group-hover/stack:border-white/20 transition-all">
                  <div style={{ height: `${heightB}%` }} className="w-full bg-orange-500/80 hover:brightness-125 transition-all"></div>
                  <div style={{ height: `${heightA}%` }} className="w-full bg-blue-500/80 hover:brightness-125 transition-all"></div>
                </div>
                <div className="h-12 flex items-center justify-center overflow-hidden">
                   <p className="text-[7px] text-white/20 font-black uppercase rotate-45 origin-left whitespace-nowrap mt-4">
                      {p.playerName.split(' ')[1] || p.playerName}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TABLA DE REGISTROS (MANTENIDA PERO ESTILIZADA) */}
      <div className="bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl mt-8">
         <div className="p-6 bg-black/40 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Registros Detallados de Actividad</h3>
            <span className="text-[9px] font-black text-white/20 uppercase">Total: {playerStats.length} Activos</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#0a0a0a] text-white/30 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                  <tr>
                     <th className="px-8 py-5">Jugador</th>
                     <th className="px-6 py-5 text-center">Rol Predominante</th>
                     <th className="px-6 py-5 text-center">Minutos Totales</th>
                     <th className="px-6 py-5 text-center">Goles</th>
                     <th className="px-6 py-5 text-center">Disciplina</th>
                     <th className="px-8 py-5 text-right">Estatus</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {playerStats.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-5">
                          <span className="text-white font-black text-[11px] uppercase tracking-tighter group-hover:text-[#EE2523] transition-colors">{p.playerName}</span>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${p.role === 'TITULAR' ? 'text-blue-400' : 'text-orange-400'}`}>{p.role}</span>
                       </td>
                       <td className="px-6 py-5 text-center font-mono text-xs text-white/60">{p.minutes}'</td>
                       <td className="px-6 py-5 text-center">
                          <span className="font-black text-[#EE2523]">{p.goals}</span>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <div className="flex justify-center gap-1">
                             {Array.from({length: p.yellow}).map((_, i) => <div key={i} className="w-2 h-3 bg-yellow-400 rounded-sm"></div>)}
                             {p.yellow === 0 && <span className="text-white/5">-</span>}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="inline-flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                             <span className="text-[9px] font-black text-white/30 uppercase">Activo</span>
                          </div>
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

export default MatchAnalyticsDemo;

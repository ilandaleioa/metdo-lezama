
import React, { useState } from 'react';

interface StandingRow {
  pos: number;
  name: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}

const MOCK_STANDINGS: Record<string, StandingRow[]> = {
  'bilbao-athletic': [
    { pos: 1, name: 'Bilbao Athletic', pj: 24, g: 15, e: 6, p: 3, gf: 42, gc: 18, pts: 51, form: ['W', 'W', 'D', 'W', 'W'] },
    { pos: 2, name: 'Cultural Leonesa', pj: 24, g: 13, e: 7, p: 4, gf: 32, gc: 15, pts: 46, form: ['W', 'D', 'W', 'L', 'D'] },
    { pos: 3, name: 'Ponferradina', pj: 24, g: 12, e: 8, p: 4, gf: 29, gc: 17, pts: 44, form: ['D', 'W', 'L', 'W', 'W'] },
    { pos: 4, name: 'Barakaldo CF', pj: 24, g: 11, e: 9, p: 4, gf: 28, gc: 19, pts: 42, form: ['D', 'D', 'W', 'W', 'D'] },
    { pos: 5, name: 'Gimnástic', pj: 24, g: 12, e: 6, p: 6, gf: 30, gc: 22, pts: 42, form: ['L', 'W', 'W', 'D', 'L'] },
  ],
  'basconia': [
    { pos: 1, name: 'Sestao River', pj: 21, g: 14, e: 4, p: 3, gf: 40, gc: 12, pts: 46, form: ['W', 'W', 'L', 'W', 'W'] },
    { pos: 2, name: 'Basconia', pj: 21, g: 13, e: 5, p: 3, gf: 38, gc: 16, pts: 44, form: ['W', 'D', 'W', 'W', 'W'] },
    { pos: 3, name: 'Portugalete', pj: 21, g: 11, e: 7, p: 3, gf: 30, gc: 15, pts: 40, form: ['D', 'W', 'D', 'L', 'W'] },
    { pos: 4, name: 'Vitoria', pj: 21, g: 10, e: 6, p: 5, gf: 28, gc: 20, pts: 36, form: ['W', 'L', 'W', 'D', 'L'] },
  ],
  'juvenil-a': [
    { pos: 1, name: 'Athletic Club', pj: 19, g: 16, e: 2, p: 1, gf: 55, gc: 10, pts: 50, form: ['W', 'W', 'W', 'W', 'W'] },
    { pos: 2, name: 'Real Sociedad', pj: 19, g: 14, e: 3, p: 2, gf: 42, gc: 14, pts: 45, form: ['W', 'D', 'W', 'W', 'L'] },
    { pos: 3, name: 'Osasuna', pj: 19, g: 12, e: 4, p: 3, gf: 35, gc: 18, pts: 40, form: ['W', 'W', 'L', 'D', 'W'] },
    { pos: 4, name: 'Antiguoko', pj: 19, g: 10, e: 5, p: 4, gf: 28, gc: 21, pts: 35, form: ['D', 'L', 'W', 'W', 'D'] },
  ]
};

const TEAMS_INFO = [
  { id: 'bilbao-athletic', name: 'Bilbao Athletic', category: '1ª RFEF' },
  { id: 'basconia', name: 'CD Basconia', category: '3ª RFEF' },
  { id: 'juvenil-a', name: 'Juvenil A', category: 'Div. Honor' }
];

const CompetitionsContainer: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState('bilbao-athletic');
  const [viewMode, setViewMode] = useState<'NATIVE' | 'OFFICIAL'>('NATIVE');

  const currentStandings = MOCK_STANDINGS[selectedTeamId] || [];

  // Fix: Explicitly type FormDot as React.FC to handle the key prop correctly in the map loop
  const FormDot: React.FC<{ result: 'W' | 'D' | 'L' }> = ({ result }) => {
    const colors = {
      W: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
      D: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]',
      L: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
    };
    return (
      <div className={`w-2 h-2 rounded-full ${colors[result]} shrink-0`} title={result === 'W' ? 'Victoria' : result === 'D' ? 'Empate' : 'Derrota'}></div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
            CENTRO DE <span className="text-[#EE2523]">COMPETICIÓN</span>
          </h2>
          <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">Seguimiento de Ligas y Rendimiento Colectivo</p>
        </div>
        
        <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/10 shadow-xl">
           <button 
             onClick={() => setViewMode('NATIVE')}
             className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'NATIVE' ? 'bg-[#EE2523] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             Nativo
           </button>
           <button 
             onClick={() => setViewMode('OFFICIAL')}
             className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'OFFICIAL' ? 'bg-[#EE2523] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             Web Oficial
           </button>
        </div>
      </div>

      {/* Team Selection Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
        {TEAMS_INFO.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeamId(team.id)}
            className={`whitespace-nowrap px-8 py-4 rounded-t-2xl text-[11px] font-black transition-all border-b-2 uppercase tracking-[0.2em] ${
              selectedTeamId === team.id
                ? 'bg-white/5 text-[#EE2523] border-[#EE2523]'
                : 'text-white/20 border-transparent hover:text-white/40'
            }`}
          >
            {team.name}
            <span className="block text-[8px] opacity-40 font-bold mt-1 tracking-widest">{team.category}</span>
          </button>
        ))}
      </div>

      {viewMode === 'NATIVE' ? (
        <div className="bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 bg-black/20 border-b border-white/5 flex justify-between items-center">
             <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Tabla de Clasificación</h3>
                <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] mt-1">Temporada 2024-2025 • Grupo 1</p>
             </div>
             <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                   <div className="w-1.5 h-1.5 bg-[#EE2523] rounded-full animate-pulse"></div>
                   <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">LIVE DATA</span>
                </div>
             </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-[#0a0a0a] text-white/30 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="px-8 py-6 text-center w-20">Pos</th>
                  <th className="px-4 py-6">Equipo</th>
                  <th className="px-4 py-6 text-center">PJ</th>
                  <th className="px-2 py-6 text-center">G</th>
                  <th className="px-2 py-6 text-center">E</th>
                  <th className="px-2 py-6 text-center">P</th>
                  <th className="px-4 py-6 text-center bg-white/[0.01]">GF</th>
                  <th className="px-4 py-6 text-center bg-white/[0.01]">GC</th>
                  <th className="px-4 py-6 text-center bg-white/[0.01]">DG</th>
                  <th className="px-8 py-6 text-center">Forma</th>
                  <th className="px-10 py-6 text-center font-black text-[#EE2523]">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentStandings.map((row) => {
                  const isAthletic = row.name.toLowerCase().includes('athletic') || row.name.toLowerCase().includes('basconia');
                  return (
                    <tr 
                      key={row.pos} 
                      className={`group hover:bg-white/[0.03] transition-colors ${isAthletic ? 'bg-[#EE2523]/5' : ''}`}
                    >
                      <td className={`px-8 py-6 text-center font-black text-sm ${isAthletic ? 'text-[#EE2523]' : 'text-white/40 group-hover:text-white'}`}>
                        {row.pos}
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-black border p-2 flex items-center justify-center shrink-0 ${isAthletic ? 'border-[#EE2523] shadow-[0_0_15px_rgba(238,37,35,0.2)]' : 'border-white/10 opacity-60'}`}>
                             <img 
                               src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" 
                               className={`w-full h-full object-contain ${!isAthletic ? 'grayscale' : ''}`} 
                               alt="" 
                             />
                          </div>
                          <span className={`text-sm font-bold uppercase tracking-tight ${isAthletic ? 'text-white' : 'text-white/60'}`}>{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center text-xs font-bold text-white/40">{row.pj}</td>
                      <td className="px-2 py-6 text-center text-xs text-white/40">{row.g}</td>
                      <td className="px-2 py-6 text-center text-xs text-white/40">{row.e}</td>
                      <td className="px-2 py-6 text-center text-xs text-white/40">{row.p}</td>
                      <td className="px-4 py-6 text-center text-xs text-white/30 bg-white/[0.005]">{row.gf}</td>
                      <td className="px-4 py-6 text-center text-xs text-white/30 bg-white/[0.005]">{row.gc}</td>
                      <td className={`px-4 py-6 text-center text-xs font-bold bg-white/[0.005] ${row.gf - row.gc > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {row.gf - row.gc > 0 ? `+${row.gf - row.gc}` : row.gf - row.gc}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-1.5">
                          {row.form.map((res, i) => <FormDot key={i} result={res} />)}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                         <span className={`text-lg font-black ${isAthletic ? 'text-[#EE2523] drop-shadow-[0_0_10px_rgba(238,37,35,0.4)]' : 'text-white'}`}>
                           {row.pts}
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-black/40 border-t border-white/5 text-center">
             <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.5em]">Lezama Data Intelligence Hub • Actualizado: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      ) : (
        /* VISTA IFRAME ORIGINAL - MANTENIDA COMO OPCIÓN "OFICIAL" */
        <div className="bg-black border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[700px] shadow-2xl relative">
          <iframe 
            src={`https://www.athletic-club.eus/equipos/${selectedTeamId === 'juvenil-a' ? 'athletic-juvenil-division-de-honor' : selectedTeamId}/2024-25/clasificacion/`}
            className="w-full h-[calc(100%+200px)] border-none -mt-[190px] opacity-80"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
          <div className="absolute top-0 left-0 right-0 bg-[#EE2523]/10 p-3 flex justify-center backdrop-blur-sm">
             <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Navegando en sitio oficial del Athletic Club</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionsContainer;

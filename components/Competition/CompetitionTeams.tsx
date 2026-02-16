
import React, { useState, useMemo } from 'react';

const COMPETITION_TEAMS = [
  { id: '1', name: 'Bilbao Athletic', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png', stadium: 'Lezama', coach: 'Jokin Aranbarri', category: '1ª RFEF', pos: '1º', points: 42, goals_for: 35, goals_against: 12 },
  { id: '2', name: 'Barakaldo CF', logo: 'https://via.placeholder.com/200', stadium: 'Lasesarre', coach: 'Imanol de la Sota', category: '1ª RFEF', pos: '3º', points: 38, goals_for: 28, goals_against: 15 },
  { id: '3', name: 'Real Unión', logo: 'https://via.placeholder.com/200', stadium: 'Gal', coach: 'Fran Justo', category: '1ª RFEF', pos: '5º', points: 35, goals_for: 24, goals_against: 20 },
  { id: '4', name: 'SD Amorebieta', logo: 'https://via.placeholder.com/200', stadium: 'Urritxe', coach: 'Julen Guerrero', category: '1ª RFEF', pos: '8º', points: 31, goals_for: 22, goals_against: 22 },
  { id: '5', name: 'Gimnástica Segoviana', logo: 'https://via.placeholder.com/200', stadium: 'La Albuera', coach: 'Ramsés Gil', category: '1ª RFEF', pos: '10º', points: 28, goals_for: 19, goals_against: 25 },
  { id: '6', name: 'Cultural Leonesa', logo: 'https://via.placeholder.com/200', stadium: 'Reino de León', coach: 'Raúl Llona', category: '1ª RFEF', pos: '2º', points: 40, goals_for: 30, goals_against: 14 },
  { id: '7', name: 'SD Ponferradina', logo: 'https://via.placeholder.com/200', stadium: 'El Toralín', coach: 'Javi Rey', category: '1ª RFEF', pos: '4º', points: 37, goals_for: 26, goals_against: 18 },
  { id: '8', name: 'UD Logroñés', logo: 'https://via.placeholder.com/200', stadium: 'Las Gaunas', coach: 'Miguel Flaño', category: '1ª RFEF', pos: '6º', points: 33, goals_for: 21, goals_against: 19 },
];

const CompetitionTeams: React.FC = () => {
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = useMemo(() => {
    return COMPETITION_TEAMS.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const CATEGORIES = ['1ª RFEF']; // En este caso agrupamos por liga/categoría
  
  const groupedTeams = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = filteredTeams.filter(t => t.category === cat);
      return acc;
    }, {} as Record<string, typeof COMPETITION_TEAMS>);
  }, [filteredTeams]);

  const StatusDot = ({ status }: { status: 'green' | 'yellow' | 'red' }) => {
    const colors = {
      green: 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]',
      yellow: 'bg-[#EAB308] shadow-[0_0_8px_#EAB308]',
      red: 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'
    };
    return <div className={`w-2.5 h-2.5 rounded-full mx-auto ${colors[status]}`}></div>;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* HEADER IDÉNTICO A PLANTILLAS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight italic">
            EQUIPOS <span className="text-[#EE2523]">RIVALES</span>
          </h2>
          <p className="text-white/50 text-[10px] md:text-sm mt-1 uppercase tracking-widest font-medium">Análisis de Competencia • Lezama Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/10">
            <button onClick={() => setViewMode('TABLE')} className={`p-2 rounded-lg transition-all ${viewMode === 'TABLE' ? 'bg-white/10 text-white' : 'text-white/20'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2.5"/></svg>
            </button>
            <button onClick={() => setViewMode('GRID')} className={`p-2 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-white/10 text-white' : 'text-white/20'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h2v2H4zM14 6h2v2h-2zM4 16h2v2H4zM14 16h2v2H4z" strokeWidth="2.5"/></svg>
            </button>
          </div>
          <div className="relative">
             <input 
                type="text" 
                placeholder="BUSCAR CLUB..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-[10px] font-black uppercase text-white outline-none focus:border-[#525252] transition-all w-48 md:w-64"
             />
             <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full mb-6"></div>

      {viewMode === 'GRID' ? (
        <div className="space-y-10">
          {CATEGORIES.map((category) => (
            groupedTeams[category]?.length > 0 && (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                   <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border bg-[#1a1a1a] text-[#EE2523] border-white/10`}>
                      {category} <span className="text-white/40 ml-2">{groupedTeams[category].length}</span>
                   </h3>
                   <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {groupedTeams[category].map(team => (
                    <div 
                      key={team.id}
                      className="bg-[#1a1a1a] border border-white/5 rounded-[20px] overflow-hidden group hover:border-[#EE2523]/50 transition-all duration-300 cursor-pointer relative shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-black/80 z-10 pointer-events-none"></div>
                      
                      {/* Posición Badge */}
                      <div className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-xl">
                        <span className="text-[9px] font-black text-white">{team.pos}</span>
                      </div>

                      {/* Logo Area */}
                      <div className="relative h-44 w-full flex items-center justify-center pt-2 overflow-hidden bg-[#161616]">
                        <span className="absolute top-1 left-3 text-[4rem] font-black text-white/5 z-0 leading-none select-none tracking-tighter group-hover:text-[#EE2523]/10 transition-colors duration-500">
                          {team.pos.replace('º', '')}
                        </span>

                        <img 
                          src={team.logo} 
                          alt={team.name}
                          className="h-28 w-28 object-contain relative z-20 drop-shadow-2xl transition-all duration-700 transform group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                      </div>

                      <div className="p-4 relative z-20 bg-[#111111] flex-1 flex flex-col justify-between border-t border-white/5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-2 min-w-0">
                            <h3 className="text-white font-black text-[12px] leading-tight group-hover:text-[#EE2523] transition-colors uppercase tracking-tight truncate w-full" title={team.name}>
                              {team.name}
                            </h3>
                            <p className="text-[#EE2523] text-[8px] font-black uppercase tracking-[0.15em] mt-1">{team.stadium}</p>
                          </div>
                          
                          <div className="bg-[#1a1a1a] text-white font-black text-[10px] w-8 h-8 flex items-center justify-center rounded-lg shadow-md border border-white/10 shrink-0">
                            {team.points}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                <span className="text-[8px] font-bold text-white/40 uppercase truncate">{team.coach}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-0 border-t border-white/5 pt-3 bg-white/[0.01] rounded-lg p-1">
                          <div className="text-center group/stat">
                            <p className="text-[11px] font-black text-white group-hover/stat:text-[#EE2523] transition-colors">{team.points}</p>
                            <p className="text-[7px] text-white/20 uppercase font-black tracking-widest">PTS</p>
                          </div>
                          <div className="text-center border-l border-white/5 group/stat">
                            <p className="text-[11px] font-black text-white group-hover/stat:text-[#EE2523] transition-colors">{team.goals_for}</p>
                            <p className="text-[7px] text-white/20 uppercase font-black tracking-widest">GF</p>
                          </div>
                          <div className="text-center border-l border-white/5 group/stat">
                            <p className="text-[11px] font-black text-white group-hover/stat:text-[#EE2523] transition-colors">{team.goals_against}</p>
                            <p className="text-[7px] text-white/20 uppercase font-black tracking-widest">GC</p>
                          </div>
                        </div>

                        <button className="mt-4 w-full bg-white/5 hover:bg-[#EE2523] hover:text-white text-white/20 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">
                            VER EXPEDIENTE RIVAL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead className="bg-[#0f0f0f] text-white/40 text-[9px] font-black uppercase tracking-widest border-b border-white/5">
                 <tr>
                    <th className="px-8 py-5">Club</th>
                    <th className="px-4 py-5 text-center">Posición</th>
                    <th className="px-4 py-5 text-center">Puntos</th>
                    <th className="px-4 py-5 text-center bg-white/[0.02]">GF</th>
                    <th className="px-4 py-5 text-center bg-white/[0.02]">GC</th>
                    <th className="px-4 py-5 text-center bg-white/[0.02]">DIF</th>
                    <th className="px-4 py-5">Estadio</th>
                    <th className="px-8 py-5 text-right">Acción</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {filteredTeams.map((team, idx) => (
                    <tr key={team.id} className="hover:bg-white/[0.05] transition-colors group cursor-pointer">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                             <img src={team.logo} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all" alt="" />
                             <span className="text-white font-black text-xs group-hover:text-[#EE2523] transition-colors uppercase tracking-tight">{team.name}</span>
                          </div>
                       </td>
                       <td className="px-4 py-5 text-center">
                          <span className="text-white font-black text-xs bg-white/5 px-3 py-1 rounded border border-white/10">{team.pos}</span>
                       </td>
                       <td className="px-4 py-5 text-center">
                          <span className="text-white font-black text-xs">{team.points}</span>
                       </td>
                       <td className="px-4 py-5 text-center bg-white/[0.01]">
                          <span className="text-white/60 text-xs">{team.goals_for}</span>
                       </td>
                       <td className="px-4 py-5 text-center bg-white/[0.01]">
                          <span className="text-white/60 text-xs">{team.goals_against}</span>
                       </td>
                       <td className="px-4 py-5 text-center bg-white/[0.01]">
                          <span className="text-green-500 font-bold text-xs">{team.goals_for - team.goals_against}</span>
                       </td>
                       <td className="px-4 py-5">
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{team.stadium}</span>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <button className="bg-white/5 hover:bg-white hover:text-black px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Ver Más</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {filteredTeams.length === 0 && (
         <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em]">No se han encontrado clubes que coincidan con la búsqueda</p>
         </div>
      )}
    </div>
  );
};

export default CompetitionTeams;

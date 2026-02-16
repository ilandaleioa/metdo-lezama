
import React, { useState } from 'react';
import { TEAMS } from '../../constants';

// Datos Demo enriquecidos para "vestir" la UI
const DEMO_ACTIVE_INJURIES = [
  { 
    id: 'p-inj-1', 
    name: 'NICO WILLIAMS', 
    photo: 'https://img.a.transfermarkt.technology/portrait/header/709187-1709545224.jpg?lm=1',
    injury: 'Sobrecarga Isquiotibiales', 
    diagnosisDate: '24 OCT', 
    estimatedReturn: '02 NOV', 
    severity: 'Leve', 
    progress: 85,
    status: 'Readaptación Campo',
    dr: 'Dr. Lekue'
  },
  { 
    id: 'p-inj-2', 
    name: 'YERAY ÁLVAREZ', 
    photo: 'https://img.a.transfermarkt.technology/portrait/header/255488-1669282223.jpg?lm=1',
    injury: 'Esguince LLI Rodilla Der.', 
    diagnosisDate: '15 OCT', 
    estimatedReturn: '15 NOV', 
    severity: 'Media', 
    progress: 45,
    status: 'Fisioterapia / Gym',
    dr: 'Dr. Angulo'
  },
  { 
    id: 'p-inj-3', 
    name: 'UNAI SIMÓN', 
    photo: 'https://img.a.transfermarkt.technology/portrait/header/262396-1709544717.jpg?lm=1',
    injury: 'Post-Op Muñeca', 
    diagnosisDate: '20 SEP', 
    estimatedReturn: 'ENERO 26', 
    severity: 'Alta', 
    progress: 60,
    status: 'Trabajo Específico Portería',
    dr: 'Cirugía Externa'
  }
];

const HISTORY_LOG = [
  { id: 1, injury: 'Distensión isquiotibial', area: 'Muslo Posterior', duration: '12 días', date: '10 SEP' },
  { id: 2, injury: 'Esfuerzo cuádric. grado I', area: 'Muslo Anterior', duration: '9 días', date: '22 AGO' },
  { id: 3, injury: 'Contusión costal', area: 'Parrilla Costal', duration: '7 días', date: '15 AGO' },
  { id: 4, injury: 'Micro-rotura Sóleo', area: 'Pantorrilla', duration: '14 días', date: '02 AGO' },
  { id: 5, injury: 'Torcedura Tobillo', area: 'Ligamento Lateral', duration: '5 días', date: '20 JUL' },
];

const RISK_MATRIX = [
  { name: 'Iñaki Williams', acwr: 1.1, asym: '4%', well: 85, risk: 'low' },
  { name: 'Oihan Sancet', acwr: 1.25, asym: '8%', well: 75, risk: 'medium' },
  { name: 'Dani Vivian', acwr: 0.9, asym: '2%', well: 90, risk: 'low' },
  { name: 'Yuri Berchiche', acwr: 1.45, asym: '12%', well: 60, risk: 'high' },
  { name: 'Gorka Guruzeta', acwr: 1.05, asym: '3%', well: 88, risk: 'low' },
];

/* Fix: Added playerId to props to satisfy parent component call and future filtering */
const InjuriesView: React.FC<{ playerId?: string }> = ({ playerId }) => {
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0].id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER DE SECCIÓN */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
         <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Departamento Médico</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Control de Lesiones y Readaptación</p>
         </div>
         <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/10">
            {TEAMS.map(t => (
               <button 
                  key={t.id}
                  onClick={() => setSelectedTeam(t.id)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedTeam === t.id ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
               >
                  {t.name}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* PANEL IZQUIERDO: LISTADO DE BAJAS */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 shadow-2xl min-h-[400px]">
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                     <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Parte Médico Activo</h3>
                  </div>
                  <div className="flex gap-2">
                     <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/20">
                        {DEMO_ACTIVE_INJURIES.length} Bajas
                     </span>
                     <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/20">
                        2 Dudas
                     </span>
                  </div>
               </div>

               <div className="space-y-4">
                  {DEMO_ACTIVE_INJURIES.map((player) => (
                     <div key={player.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5 hover:border-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EE2523]"></div>
                        <div className="relative shrink-0">
                           <img src={player.photo} className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-[#EE2523] transition-colors bg-[#1a1a1a]" alt="" />
                        </div>
                        
                        <div className="flex-1 w-full">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h4 className="text-white font-bold text-sm uppercase tracking-tight">{player.name}</h4>
                                 <p className="text-[#EE2523] text-[10px] font-black uppercase tracking-widest mt-0.5">{player.injury}</p>
                              </div>
                              <div className="text-right">
                                 <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border mb-1 inline-block ${player.severity === 'Alta' ? 'bg-red-900/20 border-red-500/50 text-red-500' : 'bg-yellow-900/20 border-yellow-500/50 text-yellow-500'}`}>
                                    {player.severity}
                                 </span>
                                 <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">{player.dr}</p>
                              </div>
                           </div>
                           
                           {/* Gantt Chart Miniatura para RTP */}
                           <div className="mt-4 pt-4 border-t border-white/5">
                              <div className="flex justify-between text-[8px] text-white/30 font-black uppercase tracking-widest mb-2">
                                 <span>{player.diagnosisDate}</span>
                                 <span className="text-white/60">{player.status}</span>
                                 <span className="text-[#EE2523]">{player.estimatedReturn}</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                                 <div className="absolute inset-0 bg-white/5 w-full"></div>
                                 <div 
                                    className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-green-500 rounded-full transition-all duration-1000 relative" 
                                    style={{ width: `${player.progress}%` }}
                                 >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* PANEL DERECHO: HISTORIAL Y ESTADÍSTICAS */}
         <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                  <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>
               </div>

               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 relative z-10">Incidencia por Zona</h3>
               
               <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Muscular (Isquios)', val: 45, color: 'bg-[#EE2523]' },
                    { label: 'Articular (Rodilla)', val: 25, color: 'bg-orange-500' },
                    { label: 'Articular (Tobillo)', val: 15, color: 'bg-yellow-500' },
                    { label: 'Traumática', val: 10, color: 'bg-blue-500' }
                  ].map((stat, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">
                           <span>{stat.label}</span>
                           <span>{stat.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                           <div className={`h-full ${stat.color}`} style={{ width: `${stat.val}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* LISTA HISTÓRICA */}
            <div className="bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group h-full max-h-[400px] overflow-y-auto scrollbar-hide">
                <div className="sticky top-0 bg-[#1a1a1a] z-10 pb-4 border-b border-white/5 mb-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#EE2523] rounded-full"></span>
                        HISTORIAL
                    </h3>
                </div>
                
                <div className="space-y-6">
                    {HISTORY_LOG.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0 relative z-0">
                            <div className="w-8 h-8 rounded-full border border-[#EE2523]/30 flex items-center justify-center shrink-0 bg-[#EE2523]/10">
                                <span className="text-[10px] font-black text-[#EE2523]">{item.id}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-white font-bold text-xs leading-tight mb-1">{item.injury}</h4>
                                    <span className="text-[8px] text-white/30 font-mono">{item.date}</span>
                                </div>
                                <p className="text-white/50 text-[10px] font-medium tracking-wide flex justify-between">
                                    <span>{item.area}</span>
                                    <span className="text-[#EE2523]">{item.duration}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* SECCIÓN INFERIOR: MATRIZ DE RIESGO DE LESIÓN */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-[32px] p-8 shadow-2xl">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
               <span className="w-2 h-8 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316]"></span>
               MATRIZ DE RIESGO INDIVIDUAL (IA)
            </h3>
            <div className="flex gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[9px] font-black text-white/40 uppercase">Bajo</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-[9px] font-black text-white/40 uppercase">Medio</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[9px] font-black text-white/40 uppercase">Alto</span></div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/20 text-white/30 text-[9px] font-black uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-4 rounded-l-xl">Jugador</th>
                     <th className="px-6 py-4 text-center">Carga Aguda/Crónica</th>
                     <th className="px-6 py-4 text-center">Asimetría Fuerza</th>
                     <th className="px-6 py-4 text-center">Wellness Semanal</th>
                     <th className="px-6 py-4 text-center rounded-r-xl">Probabilidad IA</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {RISK_MATRIX.map((row, i) => (
                     <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-white text-sm uppercase">{row.name}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col items-center">
                              <span className={`text-xs font-black ${row.acwr > 1.3 ? 'text-red-500' : 'text-white'}`}>{row.acwr}</span>
                              <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                 <div className={`h-full ${row.acwr > 1.3 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(row.acwr/2)*100}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-mono text-white/70">{row.asym}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-1 rounded text-[10px] font-black ${row.well < 70 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>{row.well}/100</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className={`w-3 h-3 rounded-full mx-auto ${row.risk === 'high' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : row.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
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

export default InjuriesView;

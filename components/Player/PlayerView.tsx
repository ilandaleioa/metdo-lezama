
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Player, AvailabilityStatus } from '../../types';
import PerformanceContainer from '../Performance/PerformanceContainer';
import TrackingContainer from '../Tracking/TrackingContainer';
import ReportsContainer from '../Reports/ReportsContainer';
import MatchAnalyticsDemo from '../Analytics/MatchAnalyticsDemo';
import VideotecaContainer from '../Videoteca/VideotecaContainer';
import PlayerCard from '../Squads/PlayerCard';
import { TEAMS, MOCK_PLAYERS } from '../../constants';

// Tipos para Valoraciones de Potencial y Rendimiento
type PotentialGrade = 'A+' | 'A' | 'B' | 'B-';
type PerformanceScore = 1 | 2 | 3 | 4 | 5;

interface MatchRating {
  id: number;
  match: string;
  date: string;
  potential: PotentialGrade;
  performance: PerformanceScore;
  mins: number;
  comment: string;
}

// Datos Mock
const MOCK_POTENTIAL_RATINGS: MatchRating[] = [
  { id: 1, match: 'BILBAO ATHLETIC vs BARAKALDO', date: '09 FEB', potential: 'A+', performance: 5, mins: 90, comment: 'Dominio absoluto del área técnica y toma de decisiones elite.' },
  { id: 2, match: 'CULTURAL LEONESA vs BILBAO ATHLETIC', date: '02 FEB', potential: 'A', performance: 4, mins: 75, comment: 'Ritmo profesional sostenido. Buen despliegue táctico.' },
  { id: 3, match: 'BILBAO ATHLETIC vs PONFERRADINA', date: '26 ENE', potential: 'A+', performance: 5, mins: 90, comment: 'Diferencial en el último tercio. Potencial de primer equipo claro.' },
  { id: 4, match: 'GIMNÀSTIC vs BILBAO ATHLETIC', date: '19 ENE', potential: 'B', performance: 2, mins: 60, comment: 'Participación irregular. Debe mejorar la continuidad en esfuerzos.' },
  { id: 5, match: 'BILBAO ATHLETIC vs REAL UNIÓN', date: '12 ENE', potential: 'A', performance: 4, mins: 82, comment: 'Sólido en duelos. Proyección ascendente.' },
  { id: 6, match: 'ARENAS CLUB vs BILBAO ATHLETIC', date: '05 ENE', potential: 'B-', performance: 2, mins: 45, comment: 'Dificultades en la lectura de transiciones defensivas.' },
  { id: 7, match: 'BILBAO ATHLETIC vs SESTAO RIVER', date: '22 DIC', potential: 'A', performance: 3, mins: 90, comment: 'Excelente capacidad de asociación bajo presión.' },
];

const PlayerView: React.FC<{ playerId?: string; onBack?: () => void }> = ({ playerId, onBack }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeSection, setActiveSection] = useState<string>('VALORACION');
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  
  const [tempDescription, setTempDescription] = useState('');
  const [isSavingDesc, setIsSavingDesc] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: playersList } = await supabase.from('players').select('*').order('name');
      if (playersList && playersList.length > 0) {
        setAllPlayers(playersList);
      } else {
        const allMock = Object.values(MOCK_PLAYERS).flat() as Player[];
        setAllPlayers(allMock);
      }

      if (playerId) {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single();

        if (!error && data) {
          setSelectedPlayer(data as Player);
          setTempDescription(data.description || '');
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [playerId]);

  const jumpToSection = (sectionId: string) => {
    if (sectionId === 'BACK_TO_HOME') {
      if (onBack) onBack();
      setSelectedPlayer(null);
      return;
    }
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDescription = async () => {
    if (!selectedPlayer) return;
    setIsSavingDesc(true);
    try {
      const { error } = await supabase.from('players').update({ description: tempDescription }).eq('id', selectedPlayer.id);
      if (error) throw error;
      setSelectedPlayer({ ...selectedPlayer, description: tempDescription });
      alert("Descripción técnica actualizada.");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSavingDesc(false);
    }
  };

  const handleGeneratePDF = () => { window.print(); };

  // Componente de Valoración de Partidos Reestructurado según imagen
  const MatchRatingsContent = () => {
    const stats = useMemo(() => {
      const potCounts = { 'A+': 0, 'A': 0, 'B': 0, 'B-': 0 };
      const perfCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalPerf = 0;

      MOCK_POTENTIAL_RATINGS.forEach(r => {
        potCounts[r.potential]++;
        perfCounts[r.performance]++;
        totalPerf += r.performance;
      });

      return { 
        pot: potCounts, 
        perf: perfCounts, 
        avg: (totalPerf / MOCK_POTENTIAL_RATINGS.length).toFixed(1) 
      };
    }, []);

    const getGradeColor = (grade: PotentialGrade) => {
      switch (grade) {
        case 'A+': return 'text-[#EE2523]';
        case 'A': return 'text-white';
        case 'B': return 'text-amber-400';
        case 'B-': return 'text-gray-500';
      }
    };

    // Cálculos para el Donut de Continuidad basado en participación real del jugador
    const participation = selectedPlayer?.participation || 75;
    const circumference = 2 * Math.PI * 40; // ~251.2
    const strokeDash = (participation / 100) * circumference;

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* LAYOUT DE DOS COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* COLUMNA IZQUIERDA: POTENCIAL */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 px-2">
                <div className="w-1.5 h-7 bg-[#EE2523] rounded-full"></div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">ANÁLISIS DE POTENCIAL</h3>
             </div>

             {/* Histograma Potencial (Tarjetas de totales eliminadas por petición de usuario) */}
             <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                   <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">FRECUENCIA DE EVALUACIÓN DE POTENCIAL</h4>
                </div>
                <div className="space-y-6">
                    {(['A+', 'A', 'B', 'B-'] as PotentialGrade[]).map(grade => {
                    const percentage = (stats.pot[grade] / MOCK_POTENTIAL_RATINGS.length) * 100;
                    return (
                        <div key={grade} className="group">
                           <div className="flex justify-between items-end mb-2 px-1">
                               <span className={`text-lg font-black italic ${getGradeColor(grade)}`}>{grade}</span>
                               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stats.pot[grade]} P.</span>
                           </div>
                           <div className="h-2.5 w-full bg-black rounded-full overflow-hidden border border-white/5 relative">
                               <div 
                                 className={`h-full transition-all duration-1000 ease-out rounded-full ${grade === 'A+' ? 'bg-[#EE2523] shadow-[0_0_15px_rgba(238,37,35,0.4)]' : 'bg-white/40'}`} 
                                 style={{ width: `${percentage}%` }}
                               ></div>
                           </div>
                        </div>
                    );
                    })}
                </div>
             </div>
          </div>

          {/* COLUMNA DERECHA: RENDIMIENTO */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-white rounded-full"></div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">ANÁLISIS DE RENDIMIENTO</h3>
                </div>
                <div className="bg-black/60 px-6 py-2.5 rounded-full border border-[#EE2523]/30 shadow-[0_0_20px_rgba(238,37,35,0.1)]">
                    <span className="text-[10px] font-black text-[#EE2523] uppercase tracking-widest mr-3">MEDIA REND:</span>
                    <span className="text-xl font-[1000] italic text-white">{stats.avg}</span>
                </div>
             </div>

             {/* Gráfica Consistencia & Continuidad (Tarjetas KPI eliminadas por petición de usuario) */}
             <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 shadow-2xl relative">
                <div className="flex justify-between items-start mb-10">
                   <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">CONSISTENCIA DE RENDIMIENTO (1-5)</h4>
                </div>
                
                <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                    {/* Barras de Rendimiento */}
                    <div className="flex-1 flex items-end justify-between h-48 px-2 gap-4 w-full">
                        {[5, 4, 3, 2, 1].map(score => {
                            const count = stats.perf[score as 1|2|3|4|5];
                            const height = (count / MOCK_POTENTIAL_RATINGS.length) * 100;
                            return (
                                <div key={score} className="flex flex-col items-center gap-3 flex-1 h-full">
                                    <div className="w-full bg-black/40 rounded-t-xl border border-white/5 relative flex flex-col justify-end h-full overflow-hidden group/bar">
                                        <div 
                                            className={`w-full transition-all duration-1000 ease-out ${score >= 4 ? 'bg-[#EE2523]' : 'bg-white/20'}`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className={`text-sm font-black italic ${score >= 4 ? 'text-[#EE2523]' : 'text-white/40'}`}>{score}</span>
                                        <span className="text-[8px] font-bold text-white/10 uppercase">{count}P</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tarjeta de Continuidad */}
                    <div className="w-64 bg-[#1a1a1a] border border-white/5 rounded-[40px] p-8 flex flex-col items-center shadow-2xl shrink-0 self-center">
                        <h5 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">CONTINUIDAD</h5>
                        
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(238,37,35,0.1)]">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#262626" strokeWidth="14" />
                                <circle 
                                    cx="50" cy="50" r="40" 
                                    fill="transparent" 
                                    stroke="#EE2523" 
                                    strokeWidth="14" 
                                    strokeDasharray={`${strokeDash} ${circumference}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black text-white italic">{participation}%</span>
                                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">ACTIVO</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 w-full">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#EE2523] rounded-full shadow-[0_0_8px_#EE2523]"></div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">SÍ</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#262626] rounded-full"></div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">NO</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">T3</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500/40 rounded-full"></div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">4º Trim</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* TABLA DE VALORACIÓN DETALLADA */}
        <div className="bg-[#111111] border border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">VALORACIÓN TÉCNICA DETALLADA</h3>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Temporada 24/25</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="px-8 py-6">Fecha / Encuentro</th>
                  <th className="px-6 py-6 text-center">Rendimiento (1-5)</th>
                  <th className="px-6 py-6 text-center">Grado Potencial</th>
                  <th className="px-6 py-6 text-center">Minutos</th>
                  <th className="px-8 py-6">Observaciones Técnicas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_POTENTIAL_RATINGS.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="px-8 py-6">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{item.date}</p>
                      <h4 className="text-sm font-black text-white uppercase leading-tight group-hover:text-[#EE2523] transition-colors">{item.match}</h4>
                    </td>
                    <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-full border transition-all ${i <= item.performance ? (item.performance >= 4 ? 'bg-[#EE2523] border-[#EE2523]' : 'bg-white border-white') : 'bg-transparent border-white/10'}`}></div>
                            ))}
                            <span className={`ml-2 text-sm font-[1000] italic ${item.performance >= 4 ? 'text-[#EE2523]' : 'text-white/40'}`}>{item.performance}</span>
                        </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-block px-4 py-1.5 rounded-xl text-sm font-[1000] border shadow-lg italic ${getGradeColor(item.potential)} border-current/10 bg-current/5`}>
                        {item.potential}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-xs font-black text-white/40 tabular-nums">{item.mins}'</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white/40 text-[13px] font-medium leading-relaxed italic line-clamp-2">"{item.comment}"</p>
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

  // Definición de las Secciones del Expediente
  const SECTIONS = [
    { 
      id: 'PERFIL', 
      label: 'DESCRIPCIÓN', 
      component: (
        <div className="bg-[#161616] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">DESCRIPCIÓN</h3>
             <span className="text-[8px] font-black text-[#EE2523] uppercase tracking-[0.2em]">EDICIÓN TÉCNICA</span>
          </div>
          <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              placeholder="Escribe la descripción técnica cualitativa del jugador..."
              className="w-full min-h-[200px] bg-black/40 border border-white/10 rounded-[24px] p-6 text-white/80 text-base leading-relaxed focus:outline-none transition-all resize-none italic font-light scrollbar-hide"
          ></textarea>
          <div className="flex justify-end mt-4">
              <button onClick={handleSaveDescription} disabled={isSavingDesc} className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50">
                {isSavingDesc ? 'GUARDANDO...' : 'ACTUALIZAR NUBE'}
              </button>
          </div>
        </div>
      )
    },
    { id: 'VIDEO', label: 'VIDEO DESCRIPTIVO', component: (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="aspect-video bg-black rounded-[24px] overflow-hidden border border-white/10 shadow-2xl relative">
                <iframe src="https://player.vimeo.com/video/1156434639?badge=0" className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen"></iframe>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Resumen Audiovisual</p>
                <p className="text-white/60 text-xs mt-1 italic font-light leading-relaxed">"Análisis audiovisual de capacidades técnicas destacadas."</p>
            </div>
        </div>
    )},
    { id: 'VALORACION', label: 'VALORACIÓN PARTIDOS', component: <MatchRatingsContent /> },
    { id: 'INFORMES', label: 'INFORMES 360', component: <div className="animate-in fade-in duration-500"><ReportsContainer playerId={selectedPlayer?.id} teamId={selectedPlayer?.team_id} /></div> },
    { id: 'SEGUIMIENTO', label: 'TRANSVERSAL', component: <div className="animate-in fade-in duration-500"><TrackingContainer playerId={selectedPlayer?.id} /></div> },
    { id: 'RENDIMIENTO', label: 'FÍSICO & GPS', component: <div className="animate-in fade-in duration-500"><PerformanceContainer playerId={selectedPlayer?.id} initialTab="FISICO" /></div> },
    { id: 'LESIONES', label: 'MÉDICO & RTP', component: <div className="animate-in fade-in duration-500"><PerformanceContainer playerId={selectedPlayer?.id} initialTab="MEDICO" /></div> },
    { id: 'STATS', label: 'ESTADÍSTICAS', component: <div className="animate-in fade-in duration-500"><MatchAnalyticsDemo /></div> },
    { id: 'VIDEOTECA', label: 'VIDEOTECA', component: <div className="animate-in fade-in duration-500"><VideotecaContainer /></div> },
    { id: 'PDF', label: 'INFORME PDF', component: (
        <div className="space-y-6 py-6 bg-black -m-6 p-6 rounded-[32px] animate-in fade-in duration-500">
            <div className="bg-[#0a0a0a] text-white border border-white/10 p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-48 h-auto" alt="" /></div>
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6 relative z-10">
                    <div>
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{selectedPlayer?.name}</h3>
                        <p className="text-[#EE2523] font-black uppercase tracking-[0.4em] text-[9px] mt-2">Expediente Oficial • Lezama Digital</p>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-xl">DORSAL #{selectedPlayer?.dorsal}</p>
                        <p className="text-white/40 font-bold uppercase text-[8px] mt-1 tracking-widest">TEMPORADA 24/25</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-6">
                        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px]">
                            <p className="font-black text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3">EVALUACIÓN IA SISTEMATIZADA</p>
                            <p className="text-lg italic font-light leading-relaxed">"{selectedPlayer?.description || 'Jugador con alta proyección táctica.'}"</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-6 bg-[#1a1a1a] text-white p-8 rounded-[24px] border border-white/5">
                        <button onClick={handleGeneratePDF} className="w-full bg-[#EE2523] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 active:scale-95 transition-all">DESCARGAR PDF</button>
                    </div>
                </div>
            </div>
        </div>
    )}
  ];

  const NAV_TABS = [
    { id: 'BACK_TO_HOME', label: 'INICIO' },
    ...SECTIONS.map(s => ({ id: s.id, label: s.label }))
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
       <div className="w-12 h-12 border-4 border-[#EE2523] border-t-transparent rounded-full animate-spin"></div>
       <p className="text-center uppercase font-black text-white/20 tracking-[0.5em]">Accediendo a Lezama Data...</p>
    </div>
  );

  if (!selectedPlayer) {
    return <div className="text-center py-20 uppercase font-black text-white/20 tracking-[0.5em]">Cargando directorio...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 w-full max-w-[1920px] mx-auto print:m-0 print:p-0">
      <div className="sticky top-0 z-[60] bg-[#0d0d0d]/90 backdrop-blur-2xl border-b border-white/10 px-4 py-2 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 shadow-xl flex items-center justify-between print:hidden">
        <div className="w-1/4 flex justify-start">
           <button onClick={() => jumpToSection('BACK_TO_HOME')} className="p-2 bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-[#EE2523] rounded-xl transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg>
           </button>
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#EE2523] overflow-hidden bg-black shrink-0 shadow-lg">
                   <img src={selectedPlayer.photo_url || selectedPlayer.photoUrl} className="w-full h-full object-contain object-bottom" alt="" />
                </div>
                <h2 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                    {selectedPlayer.apodo || selectedPlayer.name} <span className="text-[#EE2523]">#{selectedPlayer.dorsal}</span>
                </h2>
             </div>
        </div>
        <div className="w-1/4 flex justify-end">
           <button onClick={handleGeneratePDF} className="p-2 bg-white/5 border border-white/5 text-white/40 hover:text-white rounded-xl transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
           </button>
        </div>
      </div>

      <div className="sticky top-[58px] md:top-[60px] z-50 py-3 mb-6 print:hidden overflow-x-auto scrollbar-hide">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl p-1 rounded-2xl border border-white/5 shadow-2xl w-full max-w-[1750px] mx-auto flex gap-1 overflow-x-auto scrollbar-hide">
              {NAV_TABS.map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => jumpToSection(tab.id)} 
                    className={`flex-1 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all whitespace-nowrap active:scale-95 ${
                      activeSection === tab.id 
                        ? 'bg-[#EE2523] text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[600px]">
          {SECTIONS.find(s => s.id === activeSection)?.component}
      </div>
    </div>
  );
};

export default PlayerView;

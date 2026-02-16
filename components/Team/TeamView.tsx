
import React, { useState, useEffect, useMemo } from 'react';
import { TEAMS, MOCK_PLAYERS } from '../../constants';
import { Player } from '../../types';
import { supabase } from '../../lib/supabase';
import ReportsContainer from '../Reports/ReportsContainer';
import TrackingContainer from '../Tracking/TrackingContainer';
import VideotecaContainer from '../Videoteca/VideotecaContainer';
import DataHubContainer from '../DataHub/DataHubContainer';
import SquadsContainer from '../Squads/SquadsContainer';
import CampogramasContainer from '../Campogramas/CampogramasContainer';
import PerformanceContainer from '../Performance/PerformanceContainer';
import MatchAnalyticsDemo from '../Analytics/MatchAnalyticsDemo';

type TeamSubTab = 'PLANTILLAS' | 'CAMPOGRAMAS' | 'PERFORMANCE' | 'COMPETICION' | 'ESTADISTICAS' | 'NUTRICION' | 'EVALUACIONES' | 'DATAHUB' | 'VIDEOTECA';
type CompInnerTab = 'CLASIFICACION' | 'PARTIDOS' | 'RESULTADOS' | 'CALENDARIO';

const STANDINGS_DATA: Record<string, any[]> = {
  '2': [ 
    { pos: 1, name: 'Bilbao Athletic', pj: 24, g: 14, e: 6, p: 4, gf: 38, gc: 18, pts: 48, form: ['W', 'W', 'D', 'W', 'L'] },
    { pos: 2, name: 'Cultural Leonesa', pj: 24, g: 13, e: 7, p: 4, gf: 32, gc: 15, pts: 46, form: ['W', 'D', 'W', 'W', 'D'] },
    { pos: 3, name: 'Ponferradina', pj: 24, g: 12, e: 8, p: 4, gf: 29, gc: 17, pts: 44, form: ['D', 'W', 'L', 'W', 'W'] },
  ],
  '3': [ 
    { pos: 1, name: 'Sestao River', pj: 20, g: 13, e: 4, p: 3, gf: 40, gc: 12, pts: 43, form: ['W', 'W', 'L', 'W', 'W'] },
    { pos: 2, name: 'Basconia', pj: 20, g: 12, e: 5, p: 3, gf: 35, gc: 15, pts: 41, form: ['W', 'D', 'W', 'W', 'D'] },
  ]
};

const TeamView: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]?.id || '2');
  const [activeSubTab, setActiveSubTab] = useState<TeamSubTab>('PLANTILLAS');
  const [activeCompTab, setActiveCompTab] = useState<CompInnerTab>('CLASIFICACION');
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const { data } = await supabase.from('players').select('*').eq('team_id', selectedTeam).order('dorsal', { ascending: true });
      if (data && data.length > 0) setPlayers(data);
      else setPlayers(MOCK_PLAYERS[selectedTeam] || []);
      setLoading(false);
    };
    fetchPlayers();
  }, [selectedTeam]);

  const CompetitionView = () => {
    const standings = STANDINGS_DATA[selectedTeam] || [];
    const teamName = TEAMS.find(t => t.id === selectedTeam)?.name || '';

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-full md:w-fit overflow-x-auto scrollbar-hide">
            {[
              { id: 'CLASIFICACION', label: 'CLASIFICACIÓN' },
              { id: 'PARTIDOS', label: 'PARTIDOS' },
              { id: 'RESULTADOS', label: 'RESULTADOS' },
              { id: 'CALENDARIO', label: 'CALENDARIO' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCompTab(tab.id as CompInnerTab)}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCompTab === tab.id ? 'bg-[#EE2523] text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
             <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Temporada Actual</span>
             <div className="h-4 w-px bg-white/10 mx-1"></div>
             <span className="text-[10px] font-black text-[#EE2523] uppercase">2024 / 2025</span>
          </div>
        </div>

        {activeCompTab === 'CLASIFICACION' ? (
          <div className="bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-black/20 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Tabla de Clasificación</h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">{teamName} • {TEAMS.find(t => t.id === selectedTeam)?.category}</p>
               </div>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead className="bg-[#0a0a0a] text-white/30 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-center w-20">#</th>
                    <th className="px-2 py-5">Equipo</th>
                    <th className="px-4 py-5 text-center">PJ</th>
                    <th className="px-2 py-5 text-center">G</th>
                    <th className="px-2 py-5 text-center">E</th>
                    <th className="px-2 py-5 text-center">P</th>
                    <th className="px-6 py-5 text-center">Forma</th>
                    <th className="px-8 py-5 text-center font-black text-[#EE2523]">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {standings.map((team, idx) => {
                    const isOurTeam = team.name.includes('Athletic') || team.name.includes('Basconia');
                    return (
                      <tr key={idx} className={`group hover:bg-white/[0.02] transition-colors ${isOurTeam ? 'bg-[#EE2523]/5' : ''}`}>
                        <td className="px-8 py-5 text-center font-black text-xs text-white/40 group-hover:text-white">{team.pos}</td>
                        <td className="px-2 py-5">
                          <div className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-lg bg-black border border-white/10 p-1.5 flex items-center justify-center ${isOurTeam ? 'border-[#EE2523]' : ''}`}>
                                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className={`w-full h-full object-contain ${!isOurTeam ? 'grayscale' : ''}`} alt="" />
                             </div>
                             <span className={`text-sm font-bold uppercase tracking-tight ${isOurTeam ? 'text-white' : 'text-white/60'}`}>{team.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center text-xs font-bold text-white/40">{team.pj}</td>
                        <td className="px-2 py-5 text-center text-xs text-white/40">{team.g}</td>
                        <td className="px-2 py-5 text-center text-xs text-white/40">{team.e}</td>
                        <td className="px-2 py-5 text-center text-xs text-white/40">{team.p}</td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center gap-1">
                             {team.form.map((r: string, i: number) => (
                               <div key={i} className={`w-2 h-2 rounded-full ${r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-yellow-500' : 'bg-red-500'} opacity-60`}></div>
                             ))}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center"><span className={`text-base font-black ${isOurTeam ? 'text-[#EE2523]' : 'text-white'}`}>{team.pts}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/5 rounded-[40px] flex flex-col items-center justify-center p-24 shadow-2xl">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
             <h4 className="text-white/40 font-black text-xs uppercase tracking-[0.5em]">Módulo {activeCompTab}</h4>
             <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">Consultando registros históricos en Lezama Cloud...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">GESTIÓN <span className="text-[#EE2523]">EQUIPO</span></h2>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">Dossier Técnico y Control de Activos</p>
          </div>
          <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/10 shadow-xl">
             <div className="px-4 py-2 flex items-center gap-3">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Activo:</span>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="bg-transparent text-white text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                   {TEAMS.map(t => <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.name}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="flex bg-[#1a1a1a] p-1.5 rounded-[24px] border border-white/5 shadow-2xl w-full overflow-x-auto scrollbar-hide">
            {[
                { id: 'PLANTILLAS', label: 'PLANTILLAS' },
                { id: 'CAMPOGRAMAS', label: 'CAMPOGRAMAS' },
                { id: 'PERFORMANCE', label: 'RENDIMIENTO' },
                { id: 'COMPETICION', label: 'COMPETICIÓN' },
                { id: 'ESTADISTICAS', label: 'ESTADÍSTICAS' },
                { id: 'NUTRICION', label: 'NUTRICIÓN' },
                { id: 'EVALUACIONES', label: 'EVALUACIONES' },
                { id: 'DATAHUB', label: 'DATAHUB VIDEO' },
                { id: 'VIDEOTECA', label: 'VIDEOTECA' }
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => { setActiveSubTab(tab.id as TeamSubTab); setSelectedPlayerId(null); }}
                    className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all min-w-[140px] whitespace-nowrap ${activeSubTab === tab.id ? 'bg-white text-black shadow-2xl scale-[1.01]' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="mt-4">
          {activeSubTab === 'PLANTILLAS' && <SquadsContainer onNavigateToPlayer={(id) => { setSelectedPlayerId(id); setActiveSubTab('EVALUACIONES'); }} />}
          {activeSubTab === 'CAMPOGRAMAS' && <CampogramasContainer />}
          {activeSubTab === 'ESTADISTICAS' && <MatchAnalyticsDemo />}
          {activeSubTab === 'COMPETICION' && <CompetitionView />}
          {activeSubTab === 'PERFORMANCE' && <PerformanceContainer initialTab="FISICO" />}
          {activeSubTab === 'EVALUACIONES' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {selectedPlayerId ? <TrackingContainer playerId={selectedPlayerId} teamId={selectedTeam} /> : (
                      <div className="text-center py-20 bg-[#111] rounded-[32px] border border-white/5">
                        <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Selecciona un jugador en Plantillas para evaluar</p>
                      </div>
                  )}
              </div>
          )}
          {activeSubTab === 'DATAHUB' && <DataHubContainer />}
          {activeSubTab === 'VIDEOTECA' && <VideotecaContainer />}
      </div>
    </div>
  );
};

export default TeamView;

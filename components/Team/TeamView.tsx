
import React, { useState, useEffect, useMemo } from 'react';
import { TEAMS, MOCK_PLAYERS } from '../../constants';
import { Player } from '../../types';
import { supabase } from '../../lib/supabase';
import { translations } from '../../translations';
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

const MOCK_TEAM_MATCHES = [
  { id: 'm1', date: '09 FEB', time: '12:00', local: 'Bilbao Athletic', visitor: 'Barakaldo CF', score: '2-1', stadium: 'Lezama (C2)', status: 'FINALIZADO', type: 'LIGA', system: '1-4-3-3' },
  { id: 'm2', date: '02 FEB', time: '18:00', local: 'Cultural Leonesa', visitor: 'Bilbao Athletic', score: '0-0', stadium: 'Reino de León', status: 'FINALIZADO', type: 'LIGA', system: '1-4-2-3-1' },
];

const TeamView: React.FC<{ language?: string }> = ({ language = 'ES' }) => {
  const t = translations[language] || translations['ES'];
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]?.id || '2');
  const [activeSubTab, setActiveSubTab] = useState<TeamSubTab>('PLANTILLAS');
  const [activeCompTab, setActiveCompTab] = useState<CompInnerTab>('CLASIFICACION');
  const [players, setPlayers] = useState<Player[]>([]);
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
              { id: 'CLASIFICACION', label: language === 'EU' ? 'SAILKAPENA' : 'CLASIFICACIÓN' },
              { id: 'PARTIDOS', label: language === 'EU' ? 'HURRENGOAK' : 'PRÓXIMOS' },
              { id: 'RESULTADOS', label: language === 'EU' ? 'EMAITZAK' : 'RESULTADOS' },
              { id: 'CALENDARIO', label: language === 'EU' ? 'EGUTEGIA' : 'CALENDARIO' }
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
        </div>

        {activeCompTab === 'CLASIFICACION' && (
          <div className="bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-black/20 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{language === 'EU' ? 'Sailkapen Taula' : 'Tabla de Clasificación'}</h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">{teamName} • {TEAMS.find(t => t.id === selectedTeam)?.category}</p>
               </div>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead className="bg-[#0a0a0a] text-white/30 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-center w-20">#</th>
                    <th className="px-2 py-5">{language === 'EU' ? 'TALDEA' : 'EQUIPO'}</th>
                    <th className="px-4 py-5 text-center">PJ</th>
                    <th className="px-2 py-5 text-center">G</th>
                    <th className="px-2 py-5 text-center">E</th>
                    <th className="px-2 py-5 text-center">P</th>
                    <th className="px-8 py-5 text-center font-black text-[#EE2523]">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {standings.map((team, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 text-center font-black text-xs text-white/40 group-hover:text-white">{team.pos}</td>
                      <td className="px-2 py-5">
                         <span className="text-sm font-bold uppercase tracking-tight text-white/60">{team.name}</span>
                      </td>
                      <td className="px-4 py-5 text-center text-xs font-bold text-white/40">{team.pj}</td>
                      <td className="px-2 py-5 text-center text-xs text-white/40">{team.g}</td>
                      <td className="px-2 py-5 text-center text-xs text-white/40">{team.e}</td>
                      <td className="px-2 py-5 text-center text-xs text-white/40">{team.p}</td>
                      <td className="px-8 py-5 text-center"><span className="text-base font-black text-white">{team.pts}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              {language === 'EU' ? 'TALDEAREN' : 'GESTIÓN'} <span className="text-[#EE2523]">{language === 'EU' ? 'KUDEAKETA' : 'EQUIPO'}</span>
            </h2>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">{language === 'EU' ? 'Dossier Teknikoa eta Aktiboen Kontrola' : 'Dossier Técnico y Control de Activos'}</p>
          </div>
          <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/10 shadow-xl">
             <div className="px-4 py-2 flex items-center gap-3">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.team_active}:</span>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="bg-transparent text-white text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                   {TEAMS.map(t => <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.name}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="flex bg-[#1a1a1a] p-1.5 rounded-[24px] border border-white/5 shadow-2xl w-full overflow-x-auto scrollbar-hide">
            {[
                { id: 'PLANTILLAS', label: t.team_tab_squads },
                { id: 'CAMPOGRAMAS', label: t.team_tab_campogramas },
                { id: 'PERFORMANCE', label: t.team_tab_performance },
                { id: 'COMPETICION', label: t.team_tab_competition },
                { id: 'ESTADISTICAS', label: t.team_tab_stats },
                { id: 'NUTRICION', label: t.team_tab_nutrition },
                { id: 'EVALUACIONES', label: t.team_tab_evaluations },
                { id: 'DATAHUB', label: t.team_tab_datahub },
                { id: 'VIDEOTECA', label: t.team_tab_videoteca }
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
          {activeSubTab === 'PLANTILLAS' && <SquadsContainer onNavigateToPlayer={(id) => { setSelectedPlayerId(id); setActiveSubTab('EVALUACIONES'); }} language={language} />}
          {activeSubTab === 'CAMPOGRAMAS' && <CampogramasContainer />}
          {activeSubTab === 'ESTADISTICAS' && <MatchAnalyticsDemo language={language} />}
          {activeSubTab === 'COMPETICION' && <CompetitionView />}
          {activeSubTab === 'PERFORMANCE' && <PerformanceContainer playerId={undefined} initialTab="FISICO" />}
          {activeSubTab === 'EVALUACIONES' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {selectedPlayerId ? <TrackingContainer playerId={selectedPlayerId} teamId={selectedTeam} /> : (
                      <div className="text-center py-20 bg-[#111] rounded-[32px] border border-white/5">
                        <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">{language === 'EU' ? 'Aukeratu jokalari bat Plantillan ebaluatzeko' : 'Selecciona un jugador en Plantillas para evaluar'}</p>
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

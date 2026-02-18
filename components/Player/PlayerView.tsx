
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Player, AvailabilityStatus } from '../../types';
import { translations } from '../../translations';
import PerformanceContainer from '../Performance/PerformanceContainer';
import TrackingContainer from '../Tracking/TrackingContainer';
import ReportsContainer from '../Reports/ReportsContainer';
import MatchAnalyticsDemo from '../Analytics/MatchAnalyticsDemo';
import VideotecaContainer from '../Videoteca/VideotecaContainer';
import { TEAMS, MOCK_PLAYERS } from '../../constants';

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

const MOCK_POTENTIAL_RATINGS: MatchRating[] = [
  { id: 1, match: 'BILBAO ATHLETIC vs BARAKALDO', date: '09 FEB', potential: 'A+', performance: 5, mins: 90, comment: 'Dominio absoluto del área técnica y toma de decisiones elite.' },
  { id: 2, match: 'CULTURAL LEONESA vs BILBAO ATHLETIC', date: '02 FEB', potential: 'A', performance: 4, mins: 75, comment: 'Ritmo profesional sostenido. Buen despliegue táctico.' },
];

const PlayerView: React.FC<{ playerId?: string; onBack?: () => void; language?: string }> = ({ playerId, onBack, language = 'ES' }) => {
  const t = translations[language] || translations['ES'];
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
      if (playersList && playersList.length > 0) setAllPlayers(playersList);
      else setAllPlayers(Object.values(MOCK_PLAYERS).flat() as Player[]);

      if (playerId) {
        const { data, error } = await supabase.from('players').select('*').eq('id', playerId).single();
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
      alert(language === 'EU' ? "Deskribapen teknikoa eguneratuta." : "Descripción técnica actualizada.");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSavingDesc(false);
    }
  };

  const MatchRatingsContent = () => {
    const stats = useMemo(() => {
      const potCounts = { 'A+': 0, 'A': 0, 'B': 0, 'B-': 0 };
      const perfCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalPerf = 0;
      MOCK_POTENTIAL_RATINGS.forEach(r => { potCounts[r.potential]++; perfCounts[r.performance]++; totalPerf += r.performance; });
      return { pot: potCounts, perf: perfCounts, avg: (totalPerf / MOCK_POTENTIAL_RATINGS.length).toFixed(1) };
    }, []);

    const participation = selectedPlayer?.participation || 75;
    const circumference = 2 * Math.PI * 40;
    const strokeDash = (participation / 100) * circumference;

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
             <div className="flex items-center gap-3 px-2">
                <div className="w-1.5 h-7 bg-[#EE2523] rounded-full"></div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{t.player_potential_title}</h3>
             </div>
             <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-10">{language === 'EU' ? 'POTENTZIALAREN EBALUAZIO MAIZTASUNA' : 'FRECUENCIA DE EVALUACIÓN DE POTENCIAL'}</h4>
                <div className="space-y-6">
                    {(['A+', 'A', 'B', 'B-'] as PotentialGrade[]).map(grade => (
                        <div key={grade}>
                           <div className="flex justify-between items-end mb-2 px-1">
                               <span className={`text-lg font-black italic ${grade === 'A+' ? 'text-[#EE2523]' : 'text-white'}`}>{grade}</span>
                           </div>
                           <div className="h-2.5 w-full bg-black rounded-full border border-white/5 relative">
                               <div className={`h-full rounded-full ${grade === 'A+' ? 'bg-[#EE2523]' : 'bg-white/40'}`} style={{ width: `${(stats.pot[grade] / MOCK_POTENTIAL_RATINGS.length) * 100}%` }}></div>
                           </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-white rounded-full"></div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{t.player_performance_title}</h3>
                </div>
             </div>
             <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 shadow-2xl relative">
                <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                    <div className="w-64 bg-[#1a1a1a] border border-white/5 rounded-[40px] p-8 flex flex-col items-center shadow-2xl shrink-0">
                        <h5 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">{t.player_continuity}</h5>
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#262626" strokeWidth="14" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EE2523" strokeWidth="14" strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black text-white italic">{participation}%</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const SECTIONS = [
    { id: 'PERFIL', label: t.player_tab_desc, component: (
        <div className="bg-[#161616] border border-white/5 rounded-[32px] p-6">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">{t.player_tab_desc}</h3>
          </div>
          <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="w-full min-h-[200px] bg-black/40 border border-white/10 rounded-[24px] p-6 text-white/80 text-base leading-relaxed focus:outline-none transition-all resize-none italic font-light scrollbar-hide"
          ></textarea>
          <div className="flex justify-end mt-4">
              <button onClick={handleSaveDescription} disabled={isSavingDesc} className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50">
                {t.player_btn_save}
              </button>
          </div>
        </div>
    )},
    { id: 'VIDEO', label: t.player_tab_video, component: <div className="aspect-video bg-black rounded-[24px] overflow-hidden border border-white/10 shadow-2xl relative"><iframe src="https://player.vimeo.com/video/1156434639?badge=0" className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen"></iframe></div> },
    { id: 'VALORACION', label: t.player_tab_rating, component: <MatchRatingsContent /> },
    { id: 'INFORMES', label: t.player_tab_360, component: <ReportsContainer playerId={selectedPlayer?.id} teamId={selectedPlayer?.team_id} /> },
    { id: 'SEGUIMIENTO', label: t.player_tab_transversal, component: <TrackingContainer playerId={selectedPlayer?.id} /> },
    { id: 'RENDIMIENTO', label: t.player_tab_gps, component: <PerformanceContainer playerId={selectedPlayer?.id} initialTab="FISICO" /> },
    { id: 'LESIONES', label: t.player_tab_medical, component: <PerformanceContainer playerId={selectedPlayer?.id} initialTab="MEDICO" /> },
    { id: 'STATS', label: t.player_tab_stats, component: <MatchAnalyticsDemo language={language} /> },
    { id: 'VIDEOTECA', label: 'VIDEOTECA', component: <VideotecaContainer /> },
    { id: 'PDF', label: t.player_tab_pdf, component: (
        <div className="bg-[#0a0a0a] text-white border border-white/10 p-8 rounded-[32px] shadow-2xl text-center">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">{selectedPlayer?.name}</h3>
            <button onClick={() => window.print()} className="bg-[#EE2523] text-white py-4 px-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">{t.player_btn_pdf}</button>
        </div>
    )}
  ];

  const NAV_TABS = [{ id: 'BACK_TO_HOME', label: t.player_tab_intro }, ...SECTIONS.map(s => ({ id: s.id, label: s.label }))];

  if (loading) return <div className="flex flex-col items-center justify-center h-[60vh] space-y-6"><div className="w-12 h-12 border-4 border-[#EE2523] border-t-transparent rounded-full animate-spin"></div><p className="uppercase font-black text-white/20 tracking-[0.5em]">{t.ui_loading}</p></div>;

  return (
    <div className="animate-in fade-in duration-500 pb-20 w-full max-w-[1920px] mx-auto print:m-0 print:p-0">
      <div className="sticky top-0 z-[60] bg-[#0d0d0d]/90 backdrop-blur-2xl border-b border-white/10 px-4 py-2 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 shadow-xl flex items-center justify-between print:hidden">
        <button onClick={() => jumpToSection('BACK_TO_HOME')} className="p-2 bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-[#EE2523] rounded-xl transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase italic leading-none">
          {selectedPlayer?.apodo || selectedPlayer?.name} <span className="text-[#EE2523]">#{selectedPlayer?.dorsal}</span>
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="sticky top-[58px] z-50 py-3 mb-6 print:hidden overflow-x-auto scrollbar-hide">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl p-1 rounded-2xl border border-white/5 flex gap-1 overflow-x-auto scrollbar-hide">
              {NAV_TABS.map(tab => (
                  <button key={tab.id} onClick={() => jumpToSection(tab.id)} className={`flex-1 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${activeSection === tab.id ? 'bg-[#EE2523] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{tab.label}</button>
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


import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SquadsContainer from './components/Squads/SquadsContainer';
import PlayerView from './components/Player/PlayerView'; 
import CoachView from './components/Coach/CoachView'; 
import TeamView from './components/Team/TeamView'; 
import MatchesContainer from './components/Matches/MatchesContainer';
import VideotecaContainer from './components/Videoteca/VideotecaContainer'; 
import VideoLabContainer from './components/VideoLab/VideoLabContainer';
import PerformanceContainer from './components/Performance/PerformanceContainer';
import MatchAnalyticsDemo from './components/Analytics/MatchAnalyticsDemo';
import CompetitionTeams from './components/Competition/CompetitionTeams';
import CompetitionsContainer from './components/Competitions/CompetitionsContainer';
import ActivitiesCalendar from './components/Activities/ActivitiesCalendar';
import DesignerContainer from './components/Designer/DesignerContainer';
import ABPContainer from './components/ABP/ABPContainer';
import LiveTaggingContainer from './components/LiveTagging/LiveTaggingContainer';
import IntegralContainer from './components/Integral/IntegralContainer';
import TechnicalEvaluation from './components/Evaluation/TechnicalEvaluation';
import ClothingForm from './components/Forms/ClothingForm';
import { ViewType } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="h-full flex items-center justify-center animate-in fade-in duration-700">
    <div className="bg-[#1a1a1a] border border-white/5 rounded-[48px] p-20 text-center max-w-2xl shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#EE2523]/5 via-transparent to-transparent"></div>
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
        <svg className="w-10 h-10 text-[#EE2523]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h2>
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-8 bg-[#EE2523]"></div>
        <span className="text-[#EE2523] text-[10px] font-black uppercase tracking-[0.5em]">Próximamente</span>
        <div className="h-px w-8 bg-[#EE2523]"></div>
      </div>
      <p className="text-white/40 text-sm leading-relaxed font-medium">
        Estamos integrando este módulo con la base de datos central de Lezama 25/26. <br/>Estará disponible en la próxima actualización de la Suite Técnica.
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const initApp = async () => {
      const isDemo = localStorage.getItem('lezama_demo_mode') === 'true';
      if (isDemo || (!isSupabaseConfigured)) {
         setSession({ user: { email: 'invitado@lezama.demo' } });
      } else {
         const { data: { session: s } } = await supabase.auth.getSession();
         setSession(s);
      }
    };
    initApp();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'HOME': return <Dashboard onNavigate={setCurrentView} />;
      case 'PLANTILLAS': return <SquadsContainer onNavigateToPlayer={(id) => { setSelectedPlayerId(id); setCurrentView('JUGADOR'); }} />;
      case 'JUGADOR': return <PlayerView playerId={selectedPlayerId} onBack={() => setCurrentView('HOME')} />;
      case 'ENTRENADOR': return <CoachView />;
      case 'EQUIPO': return <TeamView />;
      case 'VIDEOTECA': return <VideotecaContainer />;
      case 'VIDEOLAB': return <VideoLabContainer />;
      case 'CAN_TECNICOS': return <CoachView />;
      case 'CAN_INTERVENCIONES': return <ComingSoon title="DESARROLLO CAN: INTERVENCIONES" />;
      case 'RENDIMIENTO_TESTS': return <PerformanceContainer initialTab="FISICO" />;
      case 'RENDIMIENTO_NUTRICION': return <PerformanceContainer initialTab="NUTRICION" />;
      case 'LESIONES': return <PerformanceContainer initialTab="MEDICO" />;
      case 'SESIONES': return <ActivitiesCalendar />;
      case 'TAREAS': return <ComingSoon title="GESTIÓN DE TAREAS" />;
      case 'PARTIDOS': return <MatchesContainer />;
      case 'COMP_PARTIDOS': return <MatchesContainer />;
      case 'COMP_STATS': return <MatchAnalyticsDemo />;
      case 'COMP_EQUIPOS': return <CompetitionTeams />;
      case 'COMPETICIONES': return <CompetitionsContainer />;
      case 'DESIGNER': return <DesignerContainer />;
      case 'ABP': return <ABPContainer />;
      case 'LIVE_TAGGING': return <LiveTaggingContainer />;
      case 'EVALUACIONES': return <ComingSoon title="EVALUACIONES GENERALES" />;
      case 'EVALUACION_TECNICA': return <TechnicalEvaluation playerId={selectedPlayerId} />;
      case 'TALLAJE_FORM': return <ClothingForm />;
      case 'ATENCION_ACADEMICO': return <IntegralContainer view="ATENCION_ACADEMICO" />;
      case 'ATENCION_RESIDENCIA': return <IntegralContainer view="ATENCION_RESIDENCIA" />;
      case 'ATENCION_BASERRI': return <IntegralContainer view="ATENCION_BASERRI" />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#121212]">
      <Layout 
        currentView={currentView}
        setView={setCurrentView}
        onLogoClick={() => setCurrentView('HOME')}
      >
        {renderContent()}
      </Layout>
    </div>
  );
};

export default App;


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
import Login from './components/Auth/Login';
import { ViewType } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLightMode, setIsLightMode] = useState(localStorage.getItem('lezama-theme') === 'light');
  const [language, setLanguage] = useState(localStorage.getItem('lezama-lang') || 'ES');

  useEffect(() => {
    // Sincronizar clase global con el body para overrides de CSS
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  useEffect(() => {
    if (!localStorage.getItem('sb-cplqwpcyhrploarxgyxj-auth-token')) {
        localStorage.removeItem('lezama_demo_mode');
    }

    const checkAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          setSession(null);
          setIsInitializing(false);
          return;
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(currentSession);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
          if (!newSession) localStorage.clear();
        });

        setIsInitializing(false);
        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Security Fault:", err);
        setSession(null);
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    localStorage.setItem('lezama-theme', newMode ? 'light' : 'dark');
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('lezama-lang', lang);
  };

  if (isInitializing) {
    return (
      <div className={`h-screen w-screen flex items-center justify-center transition-colors duration-500 ${isLightMode ? 'bg-[#f3f4f6]' : 'bg-[#0a0a0a]'}`}>
        <div className="flex flex-col items-center gap-6">
          <div className={`w-10 h-10 border-2 border-t-[#EE2523] rounded-full animate-spin ${isLightMode ? 'border-gray-200' : 'border-white/5'}`}></div>
          <div className="text-center">
            <p className={`${isLightMode ? 'text-gray-400' : 'text-white/40'} font-black text-[9px] uppercase tracking-[0.4em]`}>
              {language === 'EU' ? 'Lezama Clouden Autentikatzen' : 
               language === 'EN' ? 'Authenticating Lezama Cloud' : 
               language === 'FR' ? 'Authentification Lezama Cloud' : 
               'Autenticando en Lezama Cloud'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'HOME': return <Dashboard onNavigate={setCurrentView} language={language} />;
      case 'PLANTILLAS': return <SquadsContainer onNavigateToPlayer={(id) => { setSelectedPlayerId(id); setCurrentView('JUGADOR'); }} language={language} />;
      case 'JUGADOR': return <PlayerView playerId={selectedPlayerId} onBack={() => setCurrentView('HOME')} />;
      case 'ENTRENADOR': return <CoachView />;
      case 'EQUIPO': return <TeamView />;
      case 'VIDEOTECA': return <VideotecaContainer />;
      case 'VIDEOLAB': return <VideoLabContainer />;
      case 'RENDIMIENTO_TESTS': return <PerformanceContainer initialTab="FISICO" />;
      case 'RENDIMIENTO_NUTRICION': return <PerformanceContainer initialTab="NUTRICION" />;
      case 'LESIONES': return <PerformanceContainer initialTab="MEDICO" />;
      case 'ACTIVIDADES': return <ActivitiesCalendar />;
      case 'PARTIDOS': return <MatchesContainer />;
      case 'COMP_PARTIDOS': return <MatchesContainer />;
      case 'COMP_STATS': return <MatchAnalyticsDemo />;
      case 'COMP_EQUIPOS': return <CompetitionTeams />;
      case 'COMPETICIONES': return <CompetitionsContainer />;
      case 'DESIGNER': return <DesignerContainer />;
      case 'ABP': return <ABPContainer />;
      case 'LIVE_TAGGING': return <LiveTaggingContainer />;
      case 'EVALUACION_TECNICA': return <TechnicalEvaluation playerId={selectedPlayerId} />;
      case 'TALLAJE_FORM': return <ClothingForm />;
      case 'ATENCION_ACADEMICO': return <IntegralContainer view="ATENCION_ACADEMICO" />;
      case 'ATENCION_RESIDENCIA': return <IntegralContainer view="ATENCION_RESIDENCIA" />;
      case 'ATENCION_BASERRI': return <IntegralContainer view="ATENCION_BASERRI" />;
      default: return <Dashboard onNavigate={setCurrentView} language={language} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500`}>
      <Layout 
        currentView={currentView}
        setView={setCurrentView}
        onLogoClick={() => setCurrentView('HOME')}
        isLightMode={isLightMode}
        onToggleTheme={toggleTheme}
        language={language}
        onLanguageChange={changeLanguage}
      >
        {renderContent()}
      </Layout>
    </div>
  );
};

export default App;

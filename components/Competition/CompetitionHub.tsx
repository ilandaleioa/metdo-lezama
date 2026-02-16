
import React, { useState } from 'react';
import { ViewType } from '../../types';
import MatchesContainer from '../Matches/MatchesContainer';
import MatchAnalyticsDemo from '../Analytics/MatchAnalyticsDemo';
import CompetitionTeams from './CompetitionTeams';

interface CompetitionHubProps {
  onNavigate?: (view: ViewType) => void;
}

type CompetitionTab = 'STATS' | 'PARTIDOS' | 'RIVALES';

const CompetitionHub: React.FC<CompetitionHubProps> = () => {
  const [activeTab, setActiveTab] = useState<CompetitionTab>('STATS');

  const tabs = [
    { id: 'STATS', label: 'ESTADÍSTICAS', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
    { id: 'PARTIDOS', label: 'PARTIDOS / ACTAS', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    { id: 'RIVALES', label: 'EQUIPOS RIVALES', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER DE SECCIÓN */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#EE2523] rounded-full shadow-[0_0_15px_#EE2523]"></div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">ÁREA <span className="text-[#EE2523]">COMPETICIÓN</span></h2>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.5em] mt-2">Inteligencia de Datos y Análisis Táctico</p>
          </div>
        </div>
      </div>

      {/* SELECTOR DE PESTAÑAS (ESTILO LEZAMA PREMIUM) */}
      <div className="flex bg-[#1a1a1a] p-1.5 rounded-[24px] border border-white/5 shadow-2xl w-full overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CompetitionTab)}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all min-w-[200px] whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-black shadow-2xl scale-[1.01]' 
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            <div className={`${activeTab === tab.id ? 'text-[#EE2523]' : 'text-current opacity-40'}`}>
                {tab.icon}
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENEDOR DE CONTENIDO DINÁMICO */}
      <div className="mt-8">
        {activeTab === 'STATS' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <MatchAnalyticsDemo />
          </div>
        )}
        {activeTab === 'PARTIDOS' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <MatchesContainer />
          </div>
        )}
        {activeTab === 'RIVALES' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <CompetitionTeams />
          </div>
        )}
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="bg-[#111111] border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 mt-12">
          <div className="flex items-center gap-6">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <div>
                <h4 className="text-white font-black text-[10px] uppercase tracking-widest leading-none">Actualización en tiempo real</h4>
                <p className="text-white/30 text-[8px] uppercase mt-1.5 tracking-wider">Los datos se sincronizan con los servidores centrales de Lezama cada 15 minutos.</p>
             </div>
          </div>
          <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10 shrink-0">
             <span className="text-green-500 text-[8px] font-black uppercase tracking-widest animate-pulse">Servidor Redundante Activo</span>
          </div>
      </div>
    </div>
  );
};

export default CompetitionHub;

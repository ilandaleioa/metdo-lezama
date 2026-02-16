
import React, { useState, useEffect } from 'react';
import PhysicalTestsView from './PhysicalTestsView';
import StressTestView from './StressTestView';
import WellnessBorgView from './WellnessBorgView';
import InjuriesView from '../Injuries/InjuriesView';
import AnthropometryView from './AnthropometryView';

interface PerformanceContainerProps {
  playerId?: string;
  initialTab?: 'FISICO' | 'MEDICO' | 'WELLNESS' | 'ESFUERZO' | 'ANTROPOMETRIA' | 'PSICOLOGIA' | 'NUTRICION';
}

const PerformanceContainer: React.FC<PerformanceContainerProps> = ({ playerId, initialTab = 'FISICO' }) => {
  const [activeTab, setActiveTab] = useState<'FISICO' | 'MEDICO' | 'WELLNESS' | 'ESFUERZO' | 'ANTROPOMETRIA' | 'PSICOLOGIA' | 'NUTRICION'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'FISICO', label: 'Condicional & GPS' },
    { id: 'ANTROPOMETRIA', label: 'Antropometría' },
    { id: 'MEDICO', label: 'Lesiones & RTP' },
    { id: 'WELLNESS', label: 'Wellness & Carga' },
    { id: 'ESFUERZO', label: 'Pruebas Esfuerzo' },
    { id: 'PSICOLOGIA', label: 'Psicología' },
    { id: 'NUTRICION', label: 'Nutrición' }
  ];

  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="flex-1 flex items-center justify-center p-20 opacity-30">
        <div className="text-center">
            <svg className="w-20 h-20 mx-auto mb-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <h3 className="text-xl font-black uppercase tracking-widest">{title}</h3>
            <p className="text-xs mt-2 uppercase font-bold tracking-widest">Sección en desarrollo técnico</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-4 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            CONDICIONAL <span className="text-[#EE2523]">&</span> SALUD
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
            Department of Performance & Medical Services
          </p>
        </div>
        
        <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full mt-4 md:mt-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#EE2523] text-white shadow-lg shadow-red-900/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {activeTab === 'FISICO' && <PhysicalTestsView playerId={playerId} />}
        {activeTab === 'MEDICO' && <InjuriesView playerId={playerId} />}
        {activeTab === 'WELLNESS' && <WellnessBorgView playerId={playerId} />}
        {activeTab === 'ESFUERZO' && <StressTestView playerId={playerId} />}
        {activeTab === 'ANTROPOMETRIA' && <AnthropometryView playerId={playerId} />}
        {activeTab === 'PSICOLOGIA' && <PlaceholderView title="Departamento de Psicología" />}
        {activeTab === 'NUTRICION' && <PlaceholderView title="Área de Nutrición" />}
      </div>
    </div>
  );
};

export default PerformanceContainer;

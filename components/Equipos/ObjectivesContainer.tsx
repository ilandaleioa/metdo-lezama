
import React from 'react';
import { TEAMS } from '../../constants';

const ObjectivesContainer: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Objetivos Grupales</h2>
        <p className="text-white/50 text-sm">Planificación estratégica de metas colectivas para cada equipo de Lezama.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {TEAMS.map((team) => (
          <div key={team.id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-[#EE2523]/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#EE2523]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#EE2523]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">{team.name}</h3>
                  <p className="text-[10px] text-white/40 font-black tracking-widest uppercase">{team.category}</p>
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#EE2523] bg-[#EE2523]/10 px-3 py-1.5 rounded-lg hover:bg-[#EE2523] hover:text-white transition-all">
                Gestionar Objetivos
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Objetivo Principal T1</p>
                  <p className="text-sm text-white/80">Consolidación del bloque defensivo y transiciones rápidas post-robo.</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Estado de Cumplimiento</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[65%]"></div>
                    </div>
                    <span className="text-xs font-bold text-green-500">65%</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectivesContainer;


import React from 'react';

const OkrContainer: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Objetivos Grupales OKR</h2>
        <p className="text-white/50 text-sm">Key Results y métricas críticas de rendimiento para el staff técnico de cada categoría.</p>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
           <div className="w-16 h-16 bg-[#EE2523]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#EE2523]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
           </div>
           <h3 className="text-lg font-bold text-white uppercase tracking-widest text-center px-4">Configuración de OKRs Colectivos</h3>
           <p className="text-white/40 text-sm mt-2 max-w-sm text-center font-medium">Define los indicadores clave para este trimestre. No hay OKRs activos en este periodo.</p>
           <button className="mt-8 bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 transition-all shadow-xl">
              Crear Nuevo OKR Grupal
           </button>
        </div>
      </div>
    </div>
  );
};

export default OkrContainer;

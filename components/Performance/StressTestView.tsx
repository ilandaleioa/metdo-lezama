
import React from 'react';

/* Fix: Added playerId to props to satisfy parent component call */
const StressTestView: React.FC<{ playerId?: string }> = ({ playerId }) => {
  const ZONES = [
    { id: 'Z1', label: 'Recuperación', color: 'bg-gray-500/20', border: 'border-gray-500/50' },
    { id: 'Z2', label: 'Aeróbico Ligero', color: 'bg-green-500/20', border: 'border-green-500/50' },
    { id: 'Z3', label: 'Aeróbico Medio', color: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
    { id: 'Z4', label: 'Umbral Anaeróbico', color: 'bg-orange-500/20', border: 'border-orange-500/50' },
    { id: 'Z5', label: 'Máximo Esfuerzo', color: 'bg-red-500/20', border: 'border-red-500/50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
            CURVA DE <span className="text-[#EE2523]">METABOLISMO</span>
          </h2>
          <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">Telemetría de Gases e Intercambio Gaseoso</p>
        </div>
        
        <div className="flex gap-8">
            <div className="flex items-center gap-3">
                <div className="w-6 h-1.5 bg-[#EE2523] rounded-full shadow-[0_0_10px_#EE2523]"></div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">HR (bpm)</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-6 h-1.5 border-b-2 border-blue-500 border-dashed opacity-80"></div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">VE (L/min)</span>
            </div>
        </div>
      </div>

      {/* GRÁFICA PRINCIPAL */}
      <div className="relative bg-[#050505] border border-white/10 rounded-[48px] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* REJILLA DE FONDO */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" className="opacity-[0.03]">
            <defs>
              <pattern id="micro-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#micro-grid)" />
          </svg>
        </div>

        {/* LÍNEAS DE UMBRAL VERTICALES */}
        <div className="absolute inset-0 px-8 md:px-12 pointer-events-none flex justify-between">
           <div className="h-full w-px bg-white/5 relative left-[40%]">
              <span className="absolute top-4 -translate-x-1/2 text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Umbral Aeróbico</span>
           </div>
           <div className="h-full w-px bg-white/5 relative right-[25%]">
              <span className="absolute top-4 -translate-x-1/2 text-[8px] font-black text-[#EE2523] uppercase tracking-[0.3em]">Umbral Anaeróbico</span>
           </div>
        </div>

        {/* CONTENEDOR SVG DE CURVAS */}
        <div className="relative h-[400px] w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <defs>
              <filter id="glow-red">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-blue">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* CURVA VENTILACIÓN (AZUL DASHED) */}
            <path 
              d="M 0,380 Q 200,380 400,340 T 750,220 T 1000,40" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeDasharray="25 15"
              className="opacity-70"
              filter="url(#glow-blue)"
            />

            {/* CURVA HR (ROJA SÓLIDA) */}
            <path 
              d="M 0,320 L 1000,60" 
              fill="none" 
              stroke="#EE2523" 
              strokeWidth="14" 
              strokeLinecap="round"
              filter="url(#glow-red)"
            />

            {/* PUNTOS DE INTERSECCIÓN (VT1 y VT2) */}
            {/* VT1 Marker - Blanco/Neutral */}
            <circle cx="410" cy="212" r="28" fill="white" className="opacity-10" />
            <circle cx="410" cy="212" r="18" fill="black" stroke="white" strokeWidth="8" />
            <circle cx="410" cy="212" r="5" fill="white" />

            {/* VT2 Marker - Rojo/Crítico */}
            <circle cx="760" cy="122" r="32" fill="#EE2523" className="opacity-10" />
            <circle cx="760" cy="122" r="18" fill="black" stroke="#EE2523" strokeWidth="10" />
            <circle cx="760" cy="122" r="5" fill="#EE2523" />
          </svg>
        </div>

        {/* EJE INFERIOR */}
        <div className="mt-10 flex justify-between items-center px-4">
           <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Reposo</span>
           <div className="flex-1 mx-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
           <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Intensidad Máxima</span>
        </div>
      </div>

      {/* FOOTER: ZONAS DE ENTRENAMIENTO */}
      <div className="bg-[#111111] border border-white/5 rounded-[32px] p-10 shadow-2xl">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-6 bg-[#EE2523] rounded-full"></div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Programación por Zonas de Potencia</h4>
         </div>
         
         <div className="grid grid-cols-5 gap-4">
            {ZONES.map((zone) => (
               <div key={zone.id} className="space-y-4 group">
                  <div className={`h-1.5 w-full rounded-full ${zone.color} border ${zone.border} transition-all group-hover:scale-y-150 group-hover:opacity-100 opacity-60`}></div>
                  <div className="text-center">
                     <p className="text-white font-black text-xs mb-1">{zone.id}</p>
                     <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest leading-tight">{zone.label}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* METRICAS RAPIDAS AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex flex-col items-center group hover:bg-[#EE2523]/5 transition-all">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">VO2 Máximo</span>
            <span className="text-4xl font-black text-white group-hover:text-[#EE2523] transition-colors">64.2</span>
            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1">ml/kg/min</span>
         </div>
         <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex flex-col items-center group hover:bg-[#EE2523]/5 transition-all">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Punto de Inflexión</span>
            <span className="text-4xl font-black text-white group-hover:text-[#EE2523] transition-colors">172</span>
            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1">BPM (VT2)</span>
         </div>
         <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex flex-col items-center group hover:bg-[#EE2523]/5 transition-all">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Eficiencia VE</span>
            <span className="text-4xl font-black text-white group-hover:text-[#EE2523] transition-colors">94%</span>
            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1">Óptimo Funcional</span>
         </div>
      </div>
    </div>
  );
};

export default StressTestView;

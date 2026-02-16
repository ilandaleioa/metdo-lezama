
import React from 'react';
import { ViewType } from '../../types';

interface IntegralContainerProps {
  view: ViewType;
}

const IntegralContainer: React.FC<IntegralContainerProps> = ({ view }) => {
  const getConfig = () => {
    switch (view) {
      case 'ATENCION_ACADEMICO':
        return {
          title: 'Seguimiento Académico',
          subtitle: 'Evolución Escolar y Formativa',
          icon: <path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M8 16.5v-7.5l4-2.222" />,
          color: 'text-blue-400',
          bg: 'bg-blue-400/10'
        };
      case 'ATENCION_RESIDENCIA':
        return {
          title: 'Residencia Lezama',
          subtitle: 'Gestión de Jugadores Internos',
          icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
          color: 'text-orange-400',
          bg: 'bg-orange-400/10'
        };
      case 'ATENCION_BASERRI':
        return {
          title: 'Baserri - Desarrollo Personal',
          subtitle: 'Programa de Vida y Valores',
          icon: <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
          color: 'text-green-400',
          bg: 'bg-green-400/10'
        };
      default:
        return { title: '', subtitle: '', icon: null, color: '', bg: '' };
    }
  };

  const config = getConfig();

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            {config.title}
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{config.subtitle}</p>
        </div>
        <div className={`px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 ${config.bg}`}>
           <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${config.color}`}></span>
           <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${config.color}`}>Departamento Integral</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-12 border border-white/5 rounded-[40px] bg-[#1a1a1a] max-w-2xl w-full shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                 {config.icon}
              </svg>
           </div>
           <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Panel en Construcción</h3>
           <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
              El módulo de <strong>{config.title}</strong> está siendo implementado. Próximamente podrás gestionar expedientes, incidencias y planes personalizados desde esta vista.
           </p>
           <button className="mt-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
              Volver al Inicio
           </button>
        </div>
      </div>
    </div>
  );
};

export default IntegralContainer;


import React from 'react';
import { ViewType } from '../types';

const HeroHeader = () => (
  <div className="mb-6 w-full text-center">
    <h1 className="text-white font-[1000] text-5xl md:text-7xl uppercase italic tracking-tighter leading-none inline-block">
      LEZAMA <span className="text-[#EE2523]">25/26</span>
    </h1>
  </div>
);

// Estilo para cajones estándar (Pilares, Métodos, Recursos) - COMPACTADO
const STANDARD_CARD_STYLE = "bg-[#121212] border border-white/5 rounded-[24px] p-5 flex items-center gap-5 hover:bg-[#181818] hover:border-white/10 transition-all group shadow-xl w-full min-h-[110px] text-left relative overflow-hidden";

// Diseño para Noticias - COMPACTADO
const NewsCard = ({ title, category, description, icon, iconColor, badgeStyle, button, onClick }: any) => (
  <div className="bg-[#121212] border border-white/5 rounded-[32px] p-6 flex flex-col justify-between hover:bg-[#151515] hover:border-white/10 transition-all group shadow-2xl w-full min-h-[240px] text-left relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-14 h-14 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform shadow-lg`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7 stroke-[2.5]" }) : icon}
      </div>
      <div className={`${badgeStyle} px-3 py-1.5 rounded-lg text-[8px] font-[900] uppercase tracking-[0.2em] border border-white/5 shadow-inner`}>
        {category}
      </div>
    </div>
    
    <div className="flex-1 mt-2">
      <h4 className="text-white font-[1000] text-2xl uppercase italic tracking-tight mb-2 group-hover:text-[#EE2523] transition-colors leading-none">
        {title}
      </h4>
      <p className="text-white/30 text-[13px] font-medium leading-tight max-w-[95%]">
        {description}
      </p>
    </div>

    {button && (
      <button 
        onClick={onClick}
        className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        {button}
        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    )}
  </div>
);

const PillarCard = ({ label, sub, icon, iconColor, onNavigate, id }: any) => (
  <button onClick={() => onNavigate(id)} className={STANDARD_CARD_STYLE}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
    <div className={`w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 ${iconColor} group-hover:scale-110 transition-transform shadow-inner relative z-10 shrink-0`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7 stroke-[2.5]" }) : icon}
    </div>
    <div className="relative z-10 min-w-0">
      <h4 className="text-white font-[1000] text-xl uppercase tracking-tight leading-none italic truncate">{label}</h4>
      <p className="text-white/25 text-[10px] font-black uppercase tracking-[0.15em] mt-2 truncate">{sub}</p>
    </div>
  </button>
);

const ActionAccessCard = ({ label, sub, icon, iconColor, onNavigate, id }: any) => (
  <button onClick={() => onNavigate(id)} className={STANDARD_CARD_STYLE}>
    <div className={`w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 ${iconColor} group-hover:scale-110 transition-transform shrink-0`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7 stroke-[2.5]" }) : icon}
    </div>
    <div className="min-w-0 text-left">
      <h4 className="text-white font-[1000] text-xl uppercase tracking-tight leading-none italic truncate">{label}</h4>
      <p className="text-white/25 text-[10px] font-black uppercase tracking-[0.15em] mt-2 truncate">{sub}</p>
    </div>
  </button>
);

const Dashboard: React.FC<{ onNavigate?: (view: ViewType) => void }> = ({ onNavigate = (_v: ViewType) => {} }) => {
  return (
    <div className="animate-in fade-in duration-1000 pb-24 w-full max-w-[1700px] mx-auto">
      <HeroHeader />
      
      <div className="grid grid-cols-1 gap-8 w-full">
        
        {/* SECCIÓN NOTICIAS */}
        <section className="w-full">
          <div className="mb-4 flex items-center gap-6">
            <h3 className="text-white/30 font-black text-[10px] uppercase tracking-[0.4em] shrink-0">NOTICIAS DESTACADAS</h3>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <NewsCard 
              title="REVISIONES MÉDICAS" category="SERVICIOS MÉDICOS" badgeStyle="bg-blue-900/20 text-blue-400"
              iconColor="text-sky-400"
              description="Programación activa para los equipos filiales en Lezama."
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
            />
            <NewsCard 
              title="EVALUACIÓN TÉCNICA" category="METODOLOGÍA" badgeStyle="bg-yellow-900/20 text-yellow-500"
              iconColor="text-amber-400"
              description="Nuevas métricas de rendimiento y potencial habilitadas."
              button="REALIZAR EVALUACIÓN"
              onClick={() => onNavigate('EVALUACION_TECNICA')}
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <NewsCard 
              title="ENTREGA ROPA DEL CLUB" category="LOGÍSTICA" badgeStyle="bg-red-900/20 text-red-500"
              iconColor="text-rose-500"
              description="Proceso abierto de tallaje oficial temporada 25/26."
              button="RELLENAR FORMULARIO"
              onClick={() => onNavigate('TALLAJE_FORM')}
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>}
            />
          </div>
        </section>

        {/* SECCIÓN LOS 3 PILARES */}
        <section className="w-full">
          <div className="mb-4 flex items-center gap-6">
            <h3 className="text-white/30 font-black text-[10px] uppercase tracking-[0.4em] shrink-0">LOS 3 PILARES</h3>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <PillarCard id="EQUIPO" label="EQUIPO" sub="DOSSIER COLECTIVO" iconColor="text-cyan-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857"/></svg>} />
            <PillarCard id="PLANTILLAS" label="JUGADOR" sub="EXPEDIENTE INDIVIDUAL" iconColor="text-rose-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14"/></svg>} />
            <PillarCard id="ENTRENADOR" label="ENTRENADOR" sub="STAFF TÉCNICO" iconColor="text-amber-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7"/></svg>} />
          </div>
        </section>

        {/* SECCIÓN EL MÉTODO */}
        <section className="w-full">
          <div className="mb-4 flex items-center gap-6">
            <h3 className="text-white/30 font-black text-[10px] uppercase tracking-[0.4em] shrink-0">EL MÉTODO</h3>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <ActionAccessCard id="TAREAS" label="TAREAS" sub="DISEÑO TÉCNICO" iconColor="text-emerald-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} />
            <ActionAccessCard id="SESIONES" label="SESIONES" sub="PLANIFICACIÓN" iconColor="text-amber-500" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7"/></svg>} />
            <ActionAccessCard id="PARTIDOS" label="PARTIDOS" sub="ACTAS OFICIALES" iconColor="text-orange-500" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7"/></svg>} />
            <ActionAccessCard id="VIDEOTECA" label="VIDEOTECA" sub="ANÁLISIS DE VIDEO" iconColor="text-indigo-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/></svg>} />
          </div>
        </section>

        {/* SECCIÓN RECURSOS */}
        <section className="w-full">
          <div className="mb-4 flex items-center gap-6">
            <h3 className="text-white/30 font-black text-[10px] uppercase tracking-[0.4em] shrink-0">RECURSOS</h3>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <ActionAccessCard id="DESIGNER" label="DISEÑADOR TAREAS" sub="SESIONES" iconColor="text-orange-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} />
            <ActionAccessCard id="ABP" label="PIZARRA ABP" sub="ESTRATEGIA" iconColor="text-yellow-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
            <ActionAccessCard id="VIDEOLAB" label="VIDEO LAB IA" sub="ANÁLISIS IA" iconColor="text-violet-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.395L2 18v3h15v-1.659a2 2 0 00-.572-1.414l-2.269-2.269M12 11c.884 0 1.6-.582 1.6-1.3s-.716-1.3-1.6-1.3-1.6.582-1.6 1.3.716 1.3 1.6 1.3z" /><path d="M15 3h4a2 2 0 012 2v2M4 7V5a2 2 0 012-2h4M21 17v2a2 2 0 01-2 2h-4M9 21H6a2 2 0 01-2-2v-2" /></svg>} />
            <ActionAccessCard id="LIVE_TAGGING" label="EVENTOS TÁCTICOS" sub="TIEMPO REAL" iconColor="text-lime-400" onNavigate={onNavigate} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

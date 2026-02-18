
import { ViewType } from '../types';
import React from 'react';
import { signOutGlobally } from '../lib/supabase';
import { translations } from '../translations';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  isStatic?: boolean;
  language?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose, isStatic = false, language = 'ES' }) => {
  const t = translations[language] || translations['ES'];

  const handleLogout = async () => {
    if (confirm("¿Cerrar sesión en todos tus dispositivos? / Saioa itxi nahi duzu gailu guztietan?")) {
      await signOutGlobally();
    }
  };

  const NavButton = ({ id, label, icon, colorClass }: { id: ViewType, label: string, icon: React.ReactNode, colorClass: string }) => {
    const isActive = currentView === id;
    return (
      <button
        onClick={() => { setView(id); if(!isStatic) onClose(); }}
        className={`w-full flex items-center px-5 py-3 transition-all duration-300 group gap-4 rounded-xl border ${
          isActive 
            ? 'bg-[#EE2523] text-white shadow-[0_8px_25px_rgba(238,37,35,0.25)] border-transparent scale-[1.01]' 
            : 'bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/[0.08] border-white/5 hover:border-white/10'
        }`}
      >
        <div className={`shrink-0 transition-all duration-300 ${isActive ? 'text-white' : `${colorClass} opacity-70 group-hover:opacity-100 group-hover:scale-110`}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5 stroke-[2.5]" }) : icon}
        </div>
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="font-[900] tracking-tight text-[15px] uppercase truncate leading-none">
            {label}
          </span>
          {id === 'SESIONES' && (
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[7px] font-black border uppercase tracking-tighter shrink-0 ${isActive ? 'bg-white/20 border-white/20 text-white' : 'bg-black/40 border-white/5 text-white/20'}`}>
              {t.nav_soon}
            </span>
          )}
        </div>
      </button>
    );
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="mt-7 mb-3 px-5 flex items-center gap-3">
      <h3 className="text-[#EE2523] text-[12px] font-black uppercase tracking-[0.25em]">
        {label}
      </h3>
      <div className="h-px flex-1 bg-[#EE2523]/10"></div>
    </div>
  );

  return (
    <div className="h-full bg-[#080808] border-r border-white/5 flex flex-col">
      <button 
        onClick={() => setView('HOME')}
        className="p-8 flex flex-col items-center border-b border-white/5 min-h-[260px] justify-center group hover:bg-white/[0.01] transition-all cursor-pointer w-full text-center"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" 
          className="w-32 h-auto drop-shadow-[0_0_40px_rgba(238,37,35,0.5)] mb-6 group-hover:scale-110 transition-all duration-500" 
          alt="Athletic Club"
        />
        <div className="text-center">
          <p className="text-white font-black text-[18px] uppercase tracking-[0.1em] leading-none italic">{t.nav_tech_dir}</p>
          <p className="text-[#EE2523] text-[13px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Athletic Club</p>
        </div>
      </button>

      <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide space-y-1.5">
        <SectionHeader label={t.nav_methodology} />
        <NavButton 
          id="SESIONES" label={t.nav_sessions} colorClass="text-blue-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} 
        />
        <NavButton 
          id="ACTIVIDADES" label={t.nav_activities} colorClass="text-emerald-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7" /></svg>} 
        />
        <NavButton 
          id="LIVE_TAGGING" label={t.nav_tagging} colorClass="text-red-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        <NavButton 
          id="EVALUACION_TECNICA" label={t.nav_evaluation} colorClass="text-amber-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        <NavButton 
          id="COMPETICIONES" label={t.nav_competitions} colorClass="text-emerald-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>} 
        />

        <SectionHeader label={t.nav_performance_health} />
        <NavButton 
          id="LESIONES" label={t.nav_medical} colorClass="text-rose-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} 
        />
        <NavButton 
          id="RENDIMIENTO_TESTS" label={t.nav_conditional} colorClass="text-indigo-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />

        <SectionHeader label={t.nav_integral_attention} />
        <NavButton 
          id="ATENCION_ACADEMICO" label={t.nav_academic} colorClass="text-sky-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} 
        />
      </nav>

      <div className="p-4 bg-black border-t border-white/5 space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-500 border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          {t.nav_logout}
        </button>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lezama Node v2.6.S</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

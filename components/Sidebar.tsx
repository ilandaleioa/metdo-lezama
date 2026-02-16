
import { ViewType } from '../types';
import React from 'react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  isStatic?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose, isStatic = false }) => {
  
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
        <span className="font-[900] tracking-tight text-[15px] uppercase truncate leading-none">
          {label}
        </span>
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
          <p className="text-white font-black text-[18px] uppercase tracking-[0.1em] leading-none italic">Dirección Técnica</p>
          <p className="text-[#EE2523] text-[13px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Athletic Club</p>
        </div>
      </button>

      <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide space-y-1.5">
        <SectionHeader label="METODOLOGÍA" />
        <NavButton 
          id="EVALUACION_TECNICA" label="EVAL. TÉCNICA" colorClass="text-red-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        <NavButton 
          id="SESIONES" label="ACTIVIDADES" colorClass="text-blue-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>} 
        />
        <NavButton 
          id="COMPETICIONES" label="COMPETICIONES" colorClass="text-amber-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>} 
        />

        <SectionHeader label="RENDIMIENTO & SALUD" />
        <NavButton 
          id="LESIONES" label="SERVICIO MÉDICO" colorClass="text-rose-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} 
        />
        <NavButton 
          id="RENDIMIENTO_TESTS" label="ÁREA CONDICIONAL" colorClass="text-indigo-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        <NavButton 
          id="RENDIMIENTO_NUTRICION" label="NUTRICIÓN" colorClass="text-orange-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18H3z M7 2l10 0M10 2l0 4M14 2l0 4" /></svg>} 
        />

        <SectionHeader label="DESARROLLO DE CAN" />
        <NavButton 
          id="CAN_TECNICOS" label="TÉCNICOS" colorClass="text-teal-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857"/></svg>} 
        />

        <SectionHeader label="ATENCION INTEGRAL" />
        <NavButton 
          id="ATENCION_ACADEMICO" label="AREA ACADEMICA" colorClass="text-sky-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} 
        />
        <NavButton 
          id="ATENCION_RESIDENCIA" label="RESIDENCIA" colorClass="text-lime-400"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
        />
      </nav>

      <div className="p-6 bg-black border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Conexión Estable</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

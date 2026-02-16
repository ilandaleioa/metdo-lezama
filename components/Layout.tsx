
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogoClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onLogoClick }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(currentView === 'HOME');

  // Auto-ocultar al cambiar de vista si no es HOME
  useEffect(() => {
    if (currentView === 'HOME') {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [currentView]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080808]">
      {/* Sidebar con transición suave de anchura */}
      <aside 
        className={`shrink-0 transition-all duration-500 ease-in-out border-r border-white/5 z-[50] ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
        }`}
      >
        <div className="w-80 h-full">
          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            isStatic={true} 
          />
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0d0d0d] relative">
        {/* Barra de Herramientas Superior */}
        <div className="flex items-center justify-between py-3 px-6 bg-[#0a0a0a] border-b border-white/5 shrink-0 z-[40]">
          <div className="flex items-center gap-4">
            {/* Botón para forzar la apertura del menú en cualquier vista */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all hover:bg-[#EE2523]/10 hover:border-[#EE2523]/30"
              title="Abrir Navegación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {!isSidebarOpen && currentView !== 'HOME' && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-500">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" 
                  className="w-10 h-auto cursor-pointer drop-shadow-[0_0_10px_rgba(238,37,35,0.3)] hover:scale-110 transition-transform" 
                  onClick={() => setView('HOME')}
                  alt="Athletic" 
                />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Suite Técnica</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/30 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Área de Contenido Principal - Máxima resolución y paddings ajustados */}
        <div className="flex-1 overflow-y-auto relative scrollbar-hide">
          <div className="w-full min-h-full p-4 md:p-6 lg:p-8 relative z-10 mx-auto max-w-[1920px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

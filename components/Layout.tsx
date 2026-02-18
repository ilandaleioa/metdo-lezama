
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogoClick?: () => void;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setView, 
  onLogoClick, 
  isLightMode, 
  onToggleTheme,
  language = 'ES',
  onLanguageChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(currentView === 'HOME');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

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

  const languages = [
    { 
      code: 'EU', 
      label: 'EUSKERA', 
      flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_the_Basque_Country.svg' 
    },
    { 
      code: 'ES', 
      label: 'ESPAÑOL', 
      flag: '😌' 
    },
    { 
      code: 'EN', 
      label: 'ENGLISH', 
      flag: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg' 
    },
    { 
      code: 'FR', 
      label: 'FRANÇAIS', 
      flag: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg' 
    }
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[1];

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar con transición suave de anchura */}
      <aside 
        className={`shrink-0 transition-all duration-500 ease-in-out border-r z-[50] ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
        } ${isLightMode ? 'border-black/5' : 'border-white/5'}`}
      >
        <div className="w-80 h-full">
          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            isStatic={true} 
            language={language}
          />
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col overflow-hidden relative transition-colors duration-300">
        {/* Barra de Herramientas Superior */}
        <div className={`flex items-center justify-between py-3 px-6 border-b shrink-0 z-[40] transition-colors duration-300 ${isLightMode ? 'bg-white border-black/5' : 'bg-[#0a0a0a] border-white/5'}`}>
          <div className="flex items-center gap-4">
            {/* Botón para forzar la apertura del menú en cualquier vista */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 border rounded-lg transition-all ${isLightMode ? 'bg-black/5 border-black/10 text-black/40 hover:text-black hover:bg-black/10' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-[#EE2523]/10 hover:border-[#EE2523]/30'}`}
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
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isLightMode ? 'text-black/20' : 'text-white/20'}`}>Suite Técnica</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de Idioma con Banderas */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`p-1 border rounded-xl transition-all flex items-center justify-center gap-2 px-3 ${isLightMode ? 'bg-black/5 border-black/10 text-black hover:bg-black/10 shadow-sm' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'}`}
                title="Cambiar Idioma"
              >
                <div className="w-9 h-9 overflow-visible flex items-center justify-center shrink-0">
                  {currentLangObj.flag.startsWith('http') ? (
                    <img 
                      src={currentLangObj.flag} 
                      className="w-6 h-4 object-cover object-center rounded-sm shadow-sm border border-white/10" 
                      alt={currentLangObj.label} 
                    />
                  ) : (
                    <span className="text-[28px] leading-none select-none drop-shadow-sm">{currentLangObj.flag}</span>
                  )}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest pr-1">
                  {language}
                </span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-2xl z-[100] overflow-hidden animate-in zoom-in-95 duration-200 ${isLightMode ? 'bg-white border-black/5' : 'bg-[#1a1a1a] border-white/10'}`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange?.(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-5 py-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                          language === lang.code 
                            ? 'bg-[#EE2523] text-white' 
                            : isLightMode ? 'hover:bg-black/5 text-black/60' : 'hover:bg-white/5 text-white/40'
                        }`}
                      >
                        <div className="w-10 h-10 overflow-visible shrink-0 flex items-center justify-center">
                          {lang.flag.startsWith('http') ? (
                            <img 
                              src={lang.flag} 
                              className="w-8 h-5.5 object-cover object-center rounded-sm shadow-md border border-white/10" 
                              alt="" 
                            />
                          ) : (
                            <span className="text-[32px] leading-none select-none">{lang.flag}</span>
                          )}
                        </div>
                        <span className="flex-1 text-[11px] tracking-[0.1em]">{lang.label}</span>
                        {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Botón de Modo Claro/Oscuro */}
            <button
              onClick={onToggleTheme}
              className={`p-2 border rounded-xl transition-all flex items-center justify-center gap-2 px-4 ${isLightMode ? 'bg-black/5 border-black/10 text-black hover:bg-black/10 shadow-sm' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'}`}
              title={isLightMode ? "Activar Modo Oscuro" : "Activar Modo Claro"}
            >
              {isLightMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )}
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                {isLightMode ? 'DARK' : 'LIGHT'}
              </span>
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-2 border rounded-xl transition-all ${isLightMode ? 'bg-black/5 border-black/10 text-black/30 hover:text-black shadow-sm' : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Área de Contenido Principal */}
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

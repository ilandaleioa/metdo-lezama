
import React, { useState, useRef, useEffect } from 'react';

type FieldView = 'FULL' | 'ATAQUE' | 'DEFENSA' | 'LIBRE';
type ToolType = 'SELECT' | 'PLACE_PLAYER' | 'PLACE_MATERIAL';
type DesignerMode = 'INICIO' | 'FINAL';

interface DesignerElement {
  id: string;
  type: 'PLAYER' | 'MATERIAL';
  x: number; 
  y: number; 
  targetX?: number;
  targetY?: number;
  content?: string | React.ReactNode;
  color?: string;
  label?: string;
}

const DesignerContainer: React.FC = () => {
  const [fieldView, setFieldView] = useState<FieldView>('FULL');
  const [elements, setElements] = useState<DesignerElement[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('SELECT');
  const [designerMode, setDesignerMode] = useState<DesignerMode>('INICIO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [pendingItem, setPendingItem] = useState<{content: any, label?: string, color?: string} | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const getCoords = (clientX: number, clientY: number) => {
    if (!fieldRef.current) return { x: 0, y: 0 };
    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPlaying) return;
    const { x, y } = getCoords(e.clientX, e.clientY);
    if (activeTool === 'PLACE_PLAYER' && pendingItem) {
        setElements(prev => [...prev, {
            id: `p-${Date.now()}`,
            type: 'PLAYER',
            x, y,
            targetX: x,
            targetY: y,
            color: pendingItem.color,
            content: pendingItem.content
        }]);
    } else if (activeTool === 'PLACE_MATERIAL' && pendingItem) {
        setElements(prev => [...prev, {
            id: `m-${Date.now()}`,
            type: 'MATERIAL',
            x, y,
            targetX: x,
            targetY: y,
            content: pendingItem.content,
            label: pendingItem.label
        }]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId && !isPlaying) {
        const { x, y } = getCoords(e.clientX, e.clientY);
        setElements(prev => prev.map(el => {
          if (el.id !== draggingId) return el;
          if (designerMode === 'INICIO') {
            return { ...el, x, y, targetX: el.targetX ?? x, targetY: el.targetY ?? y };
          } else {
            return { ...el, targetX: x, targetY: y };
          }
        }));
    }
  };

  const handlePointerUp = () => setDraggingId(null);

  const handleElementPointerDown = (e: React.PointerEvent, id: string) => {
    if (isPlaying) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(id);
  };

  const clearBoard = () => {
    setElements([]);
    setIsPlaying(false);
  };

  const addFormation = (type: '4-3-3' | '4-4-2') => {
    if (fieldView === 'LIBRE') setFieldView('FULL');
    const newElements: DesignerElement[] = [];
    const teamColor = '#EE2523';
    const formationCoords = type === '4-3-3' 
      ? [ {x:50,y:85}, {x:20,y:70}, {x:40,y:75}, {x:60,y:75}, {x:80,y:70}, {x:50,y:55}, {x:35,y:45}, {x:65,y:45}, {x:20,y:25}, {x:50,y:20}, {x:80,y:25} ]
      : [ {x:50,y:85}, {x:20,y:75}, {x:40,y:75}, {x:60,y:75}, {x:80,y:75}, {x:20,y:50}, {x:40,y:50}, {x:60,y:50}, {x:80,y:50}, {x:40,y:25}, {x:60,y:25} ];

    formationCoords.forEach((p, i) => {
      newElements.push({ 
        id: `p-${i}-${Date.now()}`, 
        type: 'PLAYER', 
        x: p.x, 
        y: p.y, 
        targetX: p.x, 
        targetY: p.y, 
        color: teamColor, 
        content: 'J' 
      });
    });
    setElements(prev => [...prev, ...newElements]);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-full bg-[#F3F4F6] rounded-[32px] overflow-hidden shadow-2xl animate-fade-in touch-none">
      {/* SIDEBAR TÉCNICO (BLANCO) */}
      <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col p-6 space-y-8 shrink-0 select-none overflow-y-auto scrollbar-hide">
        
        {/* SISTEMAS */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[#5D6F88] text-[11px] font-black uppercase tracking-widest">Sistemas</h3>
            <button 
              onClick={clearBoard} 
              className="text-[#EE2523] text-[10px] font-black uppercase hover:opacity-70 transition-opacity tracking-wider"
            >
              LIMPIAR
            </button>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => addFormation('4-3-3')} 
              className="w-full bg-white text-[#1a1a1a] py-5 rounded-2xl font-black text-[12px] uppercase shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#EE2523]/20 transition-all active:scale-95"
            >
              AÑADIR 4-3-3
            </button>
            <button 
              onClick={() => addFormation('4-4-2')} 
              className="w-full bg-white text-[#1a1a1a] py-5 rounded-2xl font-black text-[12px] uppercase shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#EE2523]/20 transition-all active:scale-95"
            >
              AÑADIR 4-4-2
            </button>
          </div>
        </section>

        {/* DISEÑO DE ANIMACIÓN */}
        <section className="space-y-3">
          <h3 className="text-[#5D6F88] text-[11px] font-black uppercase tracking-widest px-1">Diseño de Animación</h3>
          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
            <button 
              onClick={() => { setDesignerMode('INICIO'); setIsPlaying(false); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${designerMode === 'INICIO' ? 'bg-[#1E293B] text-white shadow-lg' : 'text-[#5D6F88] hover:bg-gray-200'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { setDesignerMode('FINAL'); setIsPlaying(false); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${designerMode === 'FINAL' ? 'bg-[#1E293B] text-white shadow-lg' : 'text-[#5D6F88] hover:bg-gray-200'}`}
            >
              Final
            </button>
          </div>
        </section>

        {/* VISTAS */}
        <section className="space-y-2">
          <h3 className="text-[#5D6F88] text-[11px] font-black uppercase tracking-widest px-1 mb-3">Vistas</h3>
          <div className="space-y-2">
            {(['FULL', 'ATAQUE', 'DEFENSA', 'LIBRE'] as FieldView[]).map(v => (
              <button 
                key={v}
                onClick={() => setFieldView(v)}
                className={`w-full text-left px-5 py-4 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border ${fieldView === v ? 'bg-[#1E293B] text-white border-transparent shadow-xl' : 'bg-white text-[#1a1a1a] border-gray-100 hover:bg-gray-50'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* JUGADORES */}
        <section className="space-y-4">
          <h3 className="text-[#5D6F88] text-[11px] font-black uppercase tracking-widest px-1">Jugadores</h3>
          <div className="flex gap-4 px-1">
             {[ {c:'#5D6F88', l:'J'}, {c:'#EE2523', l:'J'}, {c:'#D4B86A', l:'J'} ].map((p, i) => (
                <button 
                  key={i}
                  onClick={() => { setActiveTool('PLACE_PLAYER'); setPendingItem({content: p.l, color: p.c}); }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl transition-all active:scale-90 hover:scale-110 ${activeTool === 'PLACE_PLAYER' && pendingItem?.color === p.c ? 'ring-4 ring-[#EE2523]/20 border-2 border-white' : 'border-2 border-transparent'}`}
                  style={{ backgroundColor: p.c }}
                >
                  {p.l}
                </button>
             ))}
          </div>
        </section>

        {/* MATERIAL */}
        <section className="space-y-4">
          <h3 className="text-[#5D6F88] text-[11px] font-black uppercase tracking-widest px-1">Material</h3>
          <div className="grid grid-cols-2 gap-3">
            {[ 
              { l: 'Balón', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> },
              { l: 'Escalera', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v18M15 3v18M7 7h10M7 12h10M7 17h10"/></svg> },
              { l: 'Valla', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 18v-8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 14h16M8 8v6M12 8v6M16 8v6"/></svg> },
              { l: 'Portería', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 20V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14M3 10h18M3 15h18"/></svg> },
              { l: 'Zona', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="4" y="4" width="16" height="16" rx="3"/></svg> }
            ].map((m, i) => (
              <button 
                key={i}
                onClick={() => { setActiveTool('PLACE_MATERIAL'); setPendingItem({content: m.icon, label: m.l}); }}
                className={`flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border transition-all active:scale-95 ${activeTool === 'PLACE_MATERIAL' && pendingItem?.label === m.l ? 'border-[#EE2523] bg-red-50/50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="text-[#1E293B] mb-3 opacity-70">{m.icon}</div>
                <span className="text-[10px] font-black uppercase text-[#1E293B] tracking-tighter">{m.l}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ÁREA DEL CAMPO (LIENZO) */}
      <div className="flex-1 bg-white relative p-10 flex flex-col items-center justify-center">
        <div 
          ref={fieldRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full bg-[#11301d] rounded-[60px] relative shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] overflow-hidden border-[15px] border-[#0a1f13] select-none"
        >
           {/* GRÁFICOS DEL CAMPO */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,#fff_0%,transparent_100%)]"></div>

           {fieldView !== 'LIBRE' && (
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 opacity-40 pointer-events-none px-6 py-4">
                <g stroke="white" strokeWidth="0.6" fill="none">
                   {fieldView === 'FULL' && (
                     <>
                        <rect x="5" y="5" width="90" height="90" />
                        <line x1="5" y1="50" x2="95" y2="50" />
                        <circle cx="50" cy="50" r="14" />
                        <circle cx="50" cy="50" r="0.8" fill="white" />
                        <rect x="25" y="5" width="50" height="18" />
                        <rect x="25" y="77" width="50" height="18" />
                        <rect x="38" y="5" width="24" height="7" />
                        <rect x="38" y="88" width="24" height="7" />
                     </>
                   )}
                   {fieldView === 'ATAQUE' && (
                     <>
                        <rect x="5" y="5" width="90" height="45" />
                        <rect x="25" y="5" width="50" height="18" />
                        <rect x="38" y="5" width="24" height="7" />
                        <path d="M 38 50 A 12 12 0 0 0 62 50" strokeDasharray="3 3" />
                     </>
                   )}
                   {fieldView === 'DEFENSA' && (
                     <>
                        <rect x="5" y="50" width="90" height="45" />
                        <rect x="25" y="77" width="50" height="18" />
                        <rect x="38" y="88" width="24" height="7" />
                        <path d="M 38 50 A 12 12 0 0 1 62 50" strokeDasharray="3 3" />
                     </>
                   )}
                </g>
             </svg>
           )}

           {elements.map(el => {
             const showGhost = designerMode === 'FINAL' && !isPlaying;
             const posX = isPlaying ? (el.targetX ?? el.x) : (designerMode === 'FINAL' ? (el.targetX ?? el.x) : el.x);
             const posY = isPlaying ? (el.targetY ?? el.y) : (designerMode === 'FINAL' ? (el.targetY ?? el.y) : el.y);

             return (
               <React.Fragment key={el.id}>
                 {/* Ghost start position */}
                 {showGhost && (
                    <div 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
                      style={{ left: `${el.x}%`, top: `${el.y}%` }}
                    >
                        {el.type === 'PLAYER' ? (
                          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm border-2 border-white/60" style={{ backgroundColor: el.color }}>J</div>
                        ) : (
                          <div className="text-white scale-[2.2]">{el.content}</div>
                        )}
                        <svg className="absolute top-1/2 left-1/2 overflow-visible w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2">
                           <line 
                            x1="250" y1="250" 
                            x2={`${250 + ((el.targetX ?? el.x) - el.x) * 5}`} 
                            y2={`${250 + ((el.targetY ?? el.y) - el.y) * 5}`} 
                            stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="5 3" 
                           />
                        </svg>
                    </div>
                 )}

                 {/* Active Element (TAMAÑO AUMENTADO) */}
                 <div 
                   onPointerDown={(e) => handleElementPointerDown(e, el.id)}
                   className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-move transition-all ${isPlaying ? 'duration-[2000ms] ease-in-out' : 'duration-0'} active:scale-125`}
                   style={{ left: `${posX}%`, top: `${posY}%` }}
                 >
                    {el.type === 'PLAYER' ? (
                      <div 
                        className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white font-black text-base shadow-2xl border-2 border-white/40" 
                        style={{ backgroundColor: el.color }}
                      >
                        J
                      </div>
                    ) : (
                      <div className="text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] scale-[2.5]">
                        {el.content}
                      </div>
                    )}
                 </div>
               </React.Fragment>
             );
           })}
        </div>

        {/* BARRA DE CONTROL FLOTANTE */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#1E2530] rounded-full p-3 flex items-center gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 z-[100] min-w-[350px] justify-between">
          <button 
            onClick={togglePlay}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all ${isPlaying ? 'bg-[#EE2523] animate-pulse' : 'bg-[#EE2523]'}`}
          >
             {isPlaying ? (
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
             ) : (
               <svg className="w-9 h-9 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             )}
          </button>
          
          <div className="bg-[#2D3544] px-14 py-4 rounded-[28px] border border-white/5 flex items-center justify-center min-w-[120px]">
             <span className="text-white font-black text-lg uppercase tracking-[0.3em]">2 S</span>
          </div>
          
          <button 
            onClick={() => { setActiveTool('SELECT'); setPendingItem(null); }}
            className="w-16 h-16 bg-[#3F4756] rounded-full flex items-center justify-center text-white border border-white/5 hover:bg-white/20 active:scale-95 transition-all"
          >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignerContainer;

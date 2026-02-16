
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

type EditMode = 'INICIO' | 'FINAL';
type PlayerRole = 'ATT' | 'DEF' | 'BALL' | 'TEXT';

interface Position {
  id: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  label: string;
  role: PlayerRole;
}

interface SavedPlay {
  id: string;
  name: string;
  type: string;
  phase: string;
  positions: Position[];
}

const ABPContainer: React.FC = () => {
  const [designerMode, setDesignerMode] = useState<EditMode>('INICIO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [elements, setElements] = useState<Position[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const [playName, setPlayName] = useState('Saque de Esquina A1');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [savedLibrary] = useState<SavedPlay[]>([
    { id: '1', name: 'TRENZA PRIMER PALO', type: 'CORNER_IZQ', phase: 'Ataque', positions: [] },
    { id: '2', name: 'ACLARADO SEGUNDO PALO', type: 'CORNER_DER', phase: 'Ataque', positions: [] },
  ]);

  const getCoords = (clientX: number, clientY: number) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    };
  };

  const generateFullSetup = () => {
    const newElements: Position[] = [];
    const timestamp = Date.now();
    
    const attPositions = [
        {x:5, y:8, l:'L'},    
        {x:42, y:20, l:'9'},  
        {x:48, y:22, l:'8'},  
        {x:55, y:18, l:'4'},  
        {x:62, y:25, l:'5'},  
        {x:35, y:30, l:'10'}, 
        {x:25, y:45, l:'7'},  
        {x:75, y:45, l:'11'}, 
        {x:50, y:65, l:'6'},  
        {x:20, y:75, l:'3'},  
        {x:80, y:75, l:'2'}   
    ];
    attPositions.forEach((p, i) => newElements.push({ 
        id: `att-${timestamp}-${i}`, 
        x: p.x, y: p.y, 
        targetX: p.x, targetY: p.y, 
        label: p.l, role: 'ATT' 
    }));

    const defPositions = [
        {x:50, y:10, l:'GK'},  
        {x:40, y:12, l:'4'},   
        {x:45, y:12, l:'5'},   
        {x:55, y:12, l:'2'},   
        {x:60, y:12, l:'3'},   
        {x:42, y:18, l:'8'},   
        {x:52, y:18, l:'6'},   
        {x:15, y:15, l:'11'},  
        {x:35, y:35, l:'10'},  
        {x:65, y:35, l:'7'},   
        {x:50, y:50, l:'9'}    
    ];
    defPositions.forEach((p, i) => newElements.push({ 
        id: `def-${timestamp}-${i}`, 
        x: p.x, y: p.y, 
        targetX: p.x, targetY: p.y, 
        label: p.l, role: 'DEF' 
    }));

    newElements.push({ 
        id: `ball-${timestamp}`, 
        x: 6.5, y: 6.5, 
        targetX: 50, targetY: 20, 
        label: '', role: 'BALL' 
    });

    return newElements;
  };

  useEffect(() => {
    setElements(generateFullSetup());
  }, []);

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

  const handleElementDown = (e: React.PointerEvent, id: string) => {
    if (isPlaying) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(id);
  };

  const handleNewPlay = () => {
    setElements(generateFullSetup());
    setPlayName("Nueva Acción Táctica");
    setIsPlaying(false);
    setDesignerMode('INICIO');
    setAiAnalysis(null);
  };

  const addElement = (role: PlayerRole) => {
    const id = `${role.toLowerCase()}-${Date.now()}`;
    const newEl: Position = {
        id,
        x: 50,
        y: 50,
        targetX: 50,
        targetY: 50,
        label: role === 'TEXT' ? 'TEXTO' : 'J',
        role
    };
    setElements([...elements, newEl]);
  };

  const runAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Actúa como un experto analista táctico de Lezama. Analiza esta jugada de ABP "${playName}".`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiAnalysis(response.text);
    } catch (e) {
      setAiAnalysis("Error de IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white animate-in fade-in duration-500 overflow-hidden select-none touch-none" onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
      
      <div className="flex flex-col md:flex-row justify-between items-start px-8 py-6 shrink-0 border-b border-white/5 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none italic">PIZARRA <span className="text-[#EE2523]">ABP</span></h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">ÁREA DE ATAQUE • PROPORCIONES OPTIMIZADAS</p>
        </div>
        <button onClick={handleNewPlay} className="bg-[#EE2523] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-red-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
          NUEVA JUGADA
        </button>
      </div>

      <div className="flex flex-1 gap-6 px-6 py-6 overflow-hidden min-h-0">
        
        <div className="w-72 bg-[#141414] border border-white/5 rounded-[40px] p-8 flex flex-col gap-8 shrink-0 shadow-2xl overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/60">BIBLIOTECA</h2>
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
            {savedLibrary.map(item => (
              <div key={item.id} onClick={() => { setPlayName(item.name); setIsPlaying(false); }} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer group">
                <p className="text-[12px] font-black uppercase text-white group-hover:text-[#EE2523] transition-colors truncate">{item.name}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase mt-2 tracking-widest">{item.type}</p>
              </div>
            ))}
          </div>
          
          {aiAnalysis && (
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-3xl overflow-y-auto max-h-48 scrollbar-hide text-[11px] text-white/80 leading-relaxed italic prose-invert">
              {aiAnalysis}
            </div>
          )}
        </div>

        <div className="flex-1 bg-[#1a1a1a] rounded-[64px] border-[16px] border-[#262626] relative overflow-hidden shadow-2xl flex items-center justify-center">
          <div ref={boardRef} className="w-full h-full relative bg-[#11301d] rounded-[32px] overflow-hidden touch-none">
            
            <svg width="100%" height="100%" viewBox="0 0 100 85" preserveAspectRatio="none" className="absolute inset-0 pointer-events-none opacity-40 px-6 py-4">
              <g stroke="white" strokeWidth="0.8" fill="none">
                <path d="M 5 85 L 5 5 L 95 5 L 95 85" />
                <rect x="20" y="5" width="60" height="22" /> 
                <rect x="36" y="5" width="28" height="8" />   
                <rect x="42" y="3" width="16" height="2.5" strokeOpacity="0.8" />
                <circle cx="50" cy="18" r="0.6" fill="white" />
                <path d="M 40 27 A 10 10 0 0 0 60 27" />
                <path d="M 5 13 A 8 8 0 0 1 13 5" />
                <path d="M 87 5 A 8 8 0 0 1 95 13" />
                <line x1="5" y1="80" x2="95" y2="80" strokeDasharray="5 5" strokeOpacity="0.4" />
              </g>
            </svg>

            {elements.map(el => {
              const isBall = el.role === 'BALL';
              const isAtt = el.role === 'ATT';
              const isText = el.role === 'TEXT';
              
              const showGhost = designerMode === 'FINAL' && !isPlaying && !isBall && !isText;
              const posX = isPlaying ? (el.targetX ?? el.x) : (designerMode === 'FINAL' ? (el.targetX ?? el.x) : el.x);
              const posY = isPlaying ? (el.targetY ?? el.y) : (designerMode === 'FINAL' ? (el.targetY ?? el.y) : el.y);

              return (
                <React.Fragment key={el.id}>
                  {showGhost && (
                    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" style={{ left: `${el.x}%`, top: `${el.y}%` }}>
                      <div className={`w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center font-black text-xs ${isAtt ? 'bg-[#EE2523]' : 'bg-blue-600'}`}>{el.label}</div>
                      <svg className="absolute top-1/2 left-1/2 overflow-visible w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                         <line x1="200" y1="200" x2={`${200 + ((el.targetX ?? el.x) - el.x) * 4}`} y2={`${200 + ((el.targetY ?? el.y) - el.y) * 4}`} stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="8 5" />
                      </svg>
                    </div>
                  )}

                  <div 
                    onPointerDown={(e) => handleElementDown(e, el.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-move flex items-center justify-center transition-all ${isPlaying ? 'duration-[2000ms] ease-in-out' : 'duration-0'} active:scale-125`}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                  >
                    {isBall ? (
                       <div className="w-7 h-7 bg-black rounded-full border-2 border-white/80 shadow-2xl relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full blur-[1px]"></div>
                       </div>
                    ) : isText ? (
                       <div className="text-[12px] font-black uppercase text-white bg-black/80 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                          {el.label}
                       </div>
                    ) : (
                       <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/80 text-white font-black text-sm shadow-2xl flex items-center justify-center transition-transform ${isAtt ? 'bg-[#EE2523]' : 'bg-blue-600 hover:brightness-110'}`}>
                          {el.label}
                       </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="w-80 bg-[#14141d] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6 shrink-0 shadow-2xl overflow-y-auto scrollbar-hide">
          
          <div className="flex p-2 bg-[#1a1a23] rounded-2xl gap-2">
             <button onClick={() => { setDesignerMode('INICIO'); setIsPlaying(false); }} className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${designerMode === 'INICIO' ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-white/20 hover:text-white/40'}`}>COLOCACIÓN</button>
             <button onClick={() => { setDesignerMode('FINAL'); setIsPlaying(false); }} className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${designerMode === 'FINAL' ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-white/20 hover:text-white/40'}`}>MOVIMIENTO</button>
          </div>

          <button onClick={togglePlay} className={`w-full ${isPlaying ? 'bg-red-500' : 'bg-[#2ecc71] hover:bg-[#27ae60]'} text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95`}>
             {isPlaying ? <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
             {isPlaying ? 'DETENER' : 'ANIMAR ABP'}
          </button>

          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => addElement('ATT')} className="bg-[#e74c3c] hover:bg-[#c0392b] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">+ ATAQUE</button>
             <button onClick={() => addElement('DEF')} className="bg-[#3498db] hover:bg-[#2980b9] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">+ DEFENSA</button>
          </div>

          <button onClick={runAiAnalysis} disabled={isAiLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50">
             {isAiLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
             ANÁLISIS IA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ABPContainer;

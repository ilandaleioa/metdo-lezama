
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const VideoLabContainer: React.FC = () => {
  const [vimeoUrl, setVimeoUrl] = useState('https://vimeo.com/1156434639');
  const [vimeoId, setVimeoId] = useState('1156434639');
  const [context, setContext] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProAnalyzing, setIsProAnalyzing] = useState(false);

  const extractVimeoId = (url: string) => {
    const regExp = /(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVimeoUrl(url);
    const id = extractVimeoId(url);
    if (id) setVimeoId(id);
  };

  const handleAnalysis = async (type: 'GENERAL' | 'PRO' = 'GENERAL') => {
    if (!vimeoId) return alert("URL no válida.");
    
    if (type === 'PRO') setIsProAnalyzing(true);
    else setIsAnalyzing(true);
    
    setAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = '';
      
      if (type === 'PRO') {
        prompt = `Actúa como un experto analista táctico del Athletic Club con visión de primer nivel. 
        Analiza la jugada descrita: "${context || 'Acción táctica del Bilbao Athletic'}". 
        Genera un INFORME TÁCTICO DETALLADO en formato Markdown con las siguientes secciones:
        1. **Fortalezas de la Jugada**: Describe lo que se ejecutó correctamente según el modelo de juego de Lezama.
        2. **Debilidades Detectadas**: Identifica errores de posicionamiento, toma de decisiones o ejecución.
        3. **Consejos de Mejora**: Proporciona 3 puntos clave para optimizar esta acción en el futuro.
        Usa un lenguaje profesional y motivacional.`;
      } else {
        prompt = `Actúa como un experto analista táctico del Athletic Club. Describe la jugada: "${context || 'Análisis táctico general'}". Genera un INFORME estructurado en Markdown.`;
      }

      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      setAnalysis(response.text || "Sin respuesta.");
      
      if (window.innerWidth < 1024) {
         setTimeout(() => {
            const el = document.getElementById('ai-report-container');
            el?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
    } catch (e) {
      setAnalysis("Error de conexión IA.");
    } finally {
      setIsAnalyzing(false);
      setIsProAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 pb-20 md:pb-10 overflow-y-auto lg:overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">VIDEO LAB <span className="text-[#EE2523]">IA</span></h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Inteligencia Táctica Lezama</p>
        </div>
        <div className="bg-indigo-600/20 px-4 py-2 rounded-xl border border-indigo-500/30 flex items-center gap-3">
           <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_#818cf8]"></div>
           <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">Gemini 3.0 Pro Active</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-visible lg:overflow-hidden">
        
        {/* Left: Input */}
        <div className="w-full lg:w-3/5 flex flex-col space-y-6">
           <div className="aspect-video bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative">
              {vimeoId ? (
                 <iframe 
                    src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0`} 
                    className="absolute inset-0 w-full h-full" 
                    allowFullScreen
                 ></iframe>
              ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-black uppercase">Sin Señal</div>
              )}
           </div>

           <div className="bg-[#1a1a1a] p-6 rounded-[28px] border border-white/5 space-y-4 shadow-xl">
              <div>
                 <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Source URL</label>
                 <input 
                    type="text" value={vimeoUrl} onChange={handleUrlChange}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-xs focus:border-[#EE2523] outline-none"
                    placeholder="https://vimeo.com/..."
                 />
              </div>
              <div>
                 <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Contexto de la Jugada (Prompt IA)</label>
                 <textarea 
                    value={context} onChange={(e) => setContext(e.target.value)}
                    className="w-full h-28 bg-black/60 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#EE2523] outline-none resize-none"
                    placeholder="Describe los movimientos clave de la acción..."
                 ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={() => handleAnalysis('GENERAL')} disabled={isAnalyzing || isProAnalyzing}
                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {isAnalyzing ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> PROCESANDO...</>
                    ) : (
                        <>RESUMEN GENERAL</>
                    )}
                </button>

                <button 
                    onClick={() => handleAnalysis('PRO')} disabled={isAnalyzing || isProAnalyzing}
                    className="w-full bg-[#EE2523] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {isProAnalyzing ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> ANALIZANDO PRO...</>
                    ) : (
                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> ANÁLISIS TÁCTICO PRO</>
                    )}
                </button>
              </div>
           </div>
        </div>

        {/* Right: Output */}
        <div id="ai-report-container" className="w-full lg:w-2/5 flex flex-col h-auto lg:h-full bg-[#111111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl min-h-[500px]">
           <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Resultado del Análisis</h3>
              {analysis && <button onClick={() => setAnalysis(null)} className="text-[8px] font-black text-[#EE2523] uppercase">Limpiar</button>}
           </div>
           
           <div className="flex-1 p-6 md:p-8 overflow-visible lg:overflow-y-auto scrollbar-hide">
              {analysis ? (
                 <div className="prose prose-invert prose-sm max-w-none">
                    <div className="text-white/80 leading-relaxed font-light text-sm">
                       {analysis.split('\n').map((line, i) => {
                          if (line.trim() === '') return <div key={i} className="h-4"></div>;
                          
                          const isHeading = line.startsWith('**') || line.startsWith('#') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.');
                          
                          return (
                            <p key={i} className={`mb-3 ${isHeading ? 'text-[#EE2523] font-black not-italic mt-6 uppercase text-xs border-l-2 border-[#EE2523] pl-3' : 'italic'}`}>
                               {line.replace(/\*|#/g, '')}
                            </p>
                          );
                       })}
                    </div>
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Motor de Análisis en Reposo</p>
                    <p className="text-[9px] mt-2 font-medium">Define el contexto a la izquierda y elige el nivel de análisis para iniciar la IA.</p>
                 </div>
              )}
           </div>
           
           <div className="p-4 bg-black/60 border-t border-white/5 text-center">
              <p className="text-[7px] text-white/20 font-black uppercase tracking-[0.4em]">Lezama AI Engine • Secure Node</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLabContainer;

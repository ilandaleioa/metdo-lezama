
import React, { useState, useEffect } from 'react';

interface VideoEvent {
  id: string;
  time: number;
  label: string;
  rawTime: string;
  part: string;
}

const DataHubContainer: React.FC = () => {
  const [vimeoUrl, setVimeoUrl] = useState('https://vimeo.com/1156434639');
  const [vimeoId, setVimeoId] = useState('1156434639');
  const [rawData, setRawData] = useState<string>(
    `PARTE\tMINUTO\tSEG\tEVENTO
1\t5\t12\tGOL
1\t10\t34\tOCASION
2\t60\t13\tOCASION
2\t70\t56\tCORNER`
  );
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [filterPart, setFilterPart] = useState<'ALL' | '1' | '2'>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isDataLinked, setIsDataLinked] = useState(false);

  useEffect(() => { 
    handleParseData(); 
  }, []);

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

  const handleParseData = () => {
    const lines = rawData.split('\n');
    const parsedEvents: VideoEvent[] = [];
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || /^(PARTE|PART|MITAD|MINUTO)/i.test(trimmed)) return;
      const cols = trimmed.split(/[\t\s]+/);
      if (cols.length >= 4) {
        const part = cols[0];
        const min = parseInt(cols[1].replace(/[^0-9]/g, ''));
        const sec = parseInt(cols[2].replace(/[^0-9]/g, ''));
        if (!isNaN(min) && !isNaN(sec)) {
           parsedEvents.push({
             id: `evt-${index}`,
             time: (min * 60) + sec,
             rawTime: `${min}:${sec.toString().padStart(2, '0')}`,
             label: cols.slice(3).join(' '),
             part: part
           });
        }
      }
    });
    parsedEvents.sort((a, b) => a.time - b.time);
    setEvents(parsedEvents);
    setIsDataLinked(true);
  };

  const filteredEvents = events.filter(e => {
     const matchesPart = filterPart === 'ALL' || e.part === filterPart;
     const matchesType = filterType === 'ALL' || e.label === filterType;
     return matchesPart && matchesType;
  });

  const uniqueEventTypes = Array.from(new Set(events.map(e => e.label))).sort();

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-12 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">DATAHUB <span className="text-[#EE2523]">VIDEO</span></h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Sincronización de Eventos y Análisis Temporal</p>
        </div>
        <div className="bg-[#EE2523]/10 px-4 py-2 rounded-xl border border-[#EE2523]/20 flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-[#EE2523] rounded-full animate-pulse"></span>
           <span className="text-[#EE2523] text-[9px] font-black uppercase tracking-[0.2em]">Engine v2.4 Active</span>
        </div>
      </div>

      {/* Main Grid: Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
        
        {/* VIDEO PLAYER - MAIN AREA */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="bg-black rounded-[32px] overflow-hidden border border-white/10 relative shadow-2xl aspect-video w-full">
               {vimeoId ? (
                  <iframe 
                     key={currentTimestamp}
                     src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479#t=${currentTimestamp}s`}
                     allow="autoplay; fullscreen" 
                     className="absolute inset-0 w-full h-full" 
                  ></iframe>
               ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                     <p className="text-white/20 uppercase font-black text-xs">A la espera de señal de video...</p>
                  </div>
               )}
            </div>
            
            <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl flex justify-between items-center shadow-lg">
                <div className="flex items-center space-x-3">
                   <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="text-[#EE2523] font-mono font-black text-sm tracking-widest">
                         {new Date(currentTimestamp * 1000).toISOString().substr(14, 5)}
                      </span>
                   </div>
                   <span className="text-white/40 font-black text-[9px] uppercase tracking-[0.2em]">Timestamp Actual</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                   <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Sincronización OK</p>
                </div>
            </div>
        </div>

        {/* SIDE CONFIG PANEL */}
        <div className="lg:col-span-1 flex flex-col space-y-4 h-full">
           <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-[28px] space-y-5 shadow-xl flex-1 flex flex-col">
              <div>
                 <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2 ml-1">Origen del Video</label>
                 <input 
                    type="text" value={vimeoUrl} onChange={handleUrlChange}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-xs focus:border-[#EE2523] outline-none transition-all"
                    placeholder="URL Vimeo"
                 />
              </div>

              {!isDataLinked ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2 px-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Carga de Datos</label>
                      <button onClick={handleParseData} className="text-[8px] bg-[#EE2523] hover:bg-red-600 text-white font-black px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all">Vincular</button>
                  </div>
                  <textarea 
                      value={rawData} onChange={(e) => setRawData(e.target.value)}
                      className="w-full flex-1 bg-black/60 border border-white/10 rounded-2xl p-4 text-white text-[10px] font-mono focus:border-[#EE2523] outline-none resize-none"
                      placeholder="Pega aquí los registros del Live Tagging..."
                  ></textarea>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <p className="text-green-500 text-[10px] font-black uppercase tracking-widest leading-none">Vinculado</p>
                      <p className="text-white/40 text-[9px] uppercase tracking-tighter mt-1">{events.length} Eventos Cargados</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDataLinked(false)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-[9px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-all"
                  >
                    Redefinir Datos
                  </button>
                </div>
              )}
              
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 border-dashed">
                 <p className="text-[8px] text-white/20 leading-relaxed font-medium uppercase tracking-wider">
                    Sincroniza el listado inferior con el reproductor pulsando sobre cada registro. El tiempo de video se ajustará automáticamente.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* BOTTOM SECTION: EVENT FEED (NOW BELOW PLAYER) */}
      <div className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
          <div className="p-6 border-b border-white/5 bg-black/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#EE2523]/10 rounded-lg flex items-center justify-center border border-[#EE2523]/20">
                   <svg className="w-4 h-4 text-[#EE2523]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <div>
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Línea de Eventos Tácticos</h3>
                   <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Filtrado inteligente por parte y tipo</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="bg-black/40 rounded-xl p-1 border border-white/10 flex">
                    {(['ALL', '1', '2'] as const).map(p => (
                       <button key={p} onClick={() => setFilterPart(p)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterPart === p ? 'bg-[#EE2523] text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>
                          {p === 'ALL' ? 'Todo' : `P${p}`}
                       </button>
                    ))}
                </div>
                <select 
                   value={filterType} 
                   onChange={(e) => setFilterType(e.target.value)} 
                   className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[9px] font-black text-white uppercase tracking-widest outline-none focus:border-[#EE2523] appearance-none cursor-pointer"
                >
                   <option value="ALL">TODOS LOS TIPOS</option>
                   {uniqueEventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 scrollbar-hide bg-[#0a0a0a]/50">
             {filteredEvents.length > 0 ? filteredEvents.map((evt) => (
                <button
                   key={evt.id}
                   onClick={() => { setCurrentTimestamp(evt.time); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                   className="flex items-center bg-[#1a1a1a] hover:bg-white/5 border border-white/5 rounded-2xl p-4 transition-all group text-left relative overflow-hidden"
                >
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EE2523] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="bg-[#EE2523]/10 text-[#EE2523] font-mono text-xs font-black px-3 py-1.5 rounded-lg mr-4 border border-[#EE2523]/20 shadow-inner group-hover:bg-[#EE2523] group-hover:text-white transition-colors">
                      {evt.rawTime}
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-white text-[11px] font-black uppercase truncate tracking-wide">{evt.label}</span>
                      <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-0.5">Parte {evt.part}</span>
                   </div>
                </button>
             )) : (
               <div className="col-span-full h-48 flex flex-col items-center justify-center text-center opacity-20">
                  <svg className="w-12 h-12 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No se han encontrado registros vinculados</p>
               </div>
             )}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5 flex justify-center">
             <button 
               className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-[#EE2523] transition-colors"
               onClick={() => { alert("Exportando secuencia de eventos para VideoLab IA..."); }}
             >
                Exportar Secuencia Táctica
             </button>
          </div>
      </div>
    </div>
  );
};

export default DataHubContainer;

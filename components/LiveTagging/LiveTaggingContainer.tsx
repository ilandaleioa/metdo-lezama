
import React, { useState, useEffect, useRef } from 'react';

type TagType = 'GOL' | 'OCASION' | 'SALIDA' | 'DUELO' | 'PRESION';
type ActiveTeam = 'ATHLETIC' | 'RIVAL';
type EventQuality = 'BIEN' | 'MAL' | 'N/A';

interface TagEvent {
  id: string;
  time: number; // segundos
  team: ActiveTeam;
  type: TagType;
  label: string;
  quality: EventQuality;
  details: string;
}

const LiveTaggingContainer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState({ athletic: 0, rival: 0 });
  const [selectedTeam, setSelectedTeam] = useState<ActiveTeam>('ATHLETIC');
  const [events, setEvents] = useState<TagEvent[]>([]);
  
  // Estado para el modal de edición de evento recién creado
  const [editingEvent, setEditingEvent] = useState<TagEvent | null>(null);
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (!isActive && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTag = (type: TagType) => {
    const newEvent: TagEvent = {
      id: Date.now().toString(),
      time,
      team: selectedTeam,
      type,
      label: type === 'GOL' ? '¡GOOOOL!' : type.charAt(0) + type.slice(1).toLowerCase(),
      quality: 'N/A',
      details: ''
    };

    if (type === 'GOL') {
      setScore(prev => ({
        ...prev,
        athletic: selectedTeam === 'ATHLETIC' ? prev.athletic + 1 : prev.athletic,
        rival: selectedTeam === 'RIVAL' ? prev.rival + 1 : prev.rival
      }));
    }

    setEvents([newEvent, ...events]);
    setEditingEvent(newEvent); // Abrir ventana de detalles automáticamente
    
    // Feedback visual
    const btn = document.getElementById(`tag-btn-${type}`);
    if (btn) {
        btn.classList.add('scale-90', 'opacity-50');
        setTimeout(() => btn.classList.remove('scale-90', 'opacity-50'), 150);
    }
  };

  const updateEventDetails = (id: string, quality: EventQuality, details: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, quality, details } : e));
    setEditingEvent(null);
  };

  const removeEvent = (id: string) => {
    const eventToRemove = events.find(e => e.id === id);
    if (eventToRemove?.type === 'GOL') {
        setScore(prev => ({
            ...prev,
            athletic: eventToRemove.team === 'ATHLETIC' ? prev.athletic - 1 : prev.athletic,
            rival: eventToRemove.team === 'RIVAL' ? prev.rival - 1 : prev.rival
        }));
    }
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const resetMatch = () => {
    if (confirm("¿Reiniciar partido y limpiar todos los datos?")) {
      setTime(0);
      setIsActive(false);
      setScore({ athletic: 0, rival: 0 });
      setEvents([]);
    }
  };

  const TAGS: { type: TagType; label: string; color: string; icon: React.ReactNode }[] = [
    { type: 'GOL', label: 'GOL', color: 'bg-[#EE2523]', icon: <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
    { type: 'OCASION', label: 'OCASIÓN', color: 'bg-orange-500', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> },
    { type: 'SALIDA', label: 'SALIDA', color: 'bg-blue-500', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg> },
    { type: 'DUELO', label: 'DUELO', color: 'bg-purple-500', icon: <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { type: 'PRESION', label: 'PRESIÓN', color: 'bg-green-600', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-20 relative">
      
      {/* HEADER: Crono y Marcador */}
      <div className="bg-[#1a1a1a] rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl flex flex-col items-center shrink-0">
         <div className="flex items-center justify-between w-full max-w-xl mb-4">
            <div className="flex flex-col items-center">
               <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-10 h-auto opacity-80" alt="ATH" />
               <span className="text-[12px] font-black text-[#EE2523] mt-1">{score.athletic}</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="bg-black/40 px-6 py-2 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-3xl font-mono font-black text-white">{formatTime(time)}</span>
               </div>
               <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`px-6 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${isActive ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}
                  >
                     {isActive ? 'PAUSAR' : 'INICIAR'}
                  </button>
                  <button onClick={resetMatch} className="text-white/20 hover:text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest">RESET</button>
               </div>
            </div>

            <div className="flex flex-col items-center">
               <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <span className="text-[12px] font-black text-white/40 mt-1">{score.rival}</span>
            </div>
         </div>
      </div>

      {/* TEAM SELECTOR & TAGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         
         {/* Botonera Principal (Cuadrados pequeños, Iconos grandes) */}
         <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex bg-[#1a1a1a] p-1 rounded-2xl border border-white/10">
               <button 
                 onClick={() => setSelectedTeam('ATHLETIC')}
                 className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedTeam === 'ATHLETIC' ? 'bg-[#EE2523] text-white shadow-lg' : 'text-white/20'}`}
               >
                  ATHLETIC CLUB
               </button>
               <button 
                 onClick={() => setSelectedTeam('RIVAL')}
                 className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedTeam === 'RIVAL' ? 'bg-white text-black shadow-lg' : 'text-white/20'}`}
               >
                  EQUIPO RIVAL
               </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 shrink-0">
               {TAGS.map((tag) => (
                  <button
                    key={tag.type}
                    id={`tag-btn-${tag.type}`}
                    onClick={() => addTag(tag.type)}
                    disabled={!isActive}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all active:scale-90 disabled:opacity-10 shadow-lg ${tag.color} text-white group`}
                  >
                     <div className="group-hover:scale-110 transition-transform mb-1">{tag.icon}</div>
                     <span className="font-black text-[7px] tracking-[0.1em] uppercase opacity-80">{tag.label}</span>
                  </button>
               ))}
            </div>

            <div className="bg-[#1a1a1a]/50 rounded-2xl border border-white/5 border-dashed flex-1 flex items-center justify-center p-6 text-center">
               <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] leading-relaxed">Registro táctico instantáneo • Selección de equipo activa</p>
            </div>
         </div>

         {/* Registro de Eventos (Feed) */}
         <div className="bg-[#0f0f0f] border border-white/10 rounded-[32px] flex flex-col min-h-[400px] overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center shrink-0">
               <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Feed de Registros ({events.length})</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
               {events.length > 0 ? events.map((evt) => (
                  <div 
                    key={evt.id} 
                    onClick={() => setEditingEvent(evt)}
                    className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                  >
                     <div className="flex items-center gap-3">
                        <div className="bg-black/40 px-2 py-1 rounded text-[9px] font-mono font-black text-[#EE2523] border border-white/5">
                           {formatTime(evt.time)}
                        </div>
                        <div className="flex flex-col">
                           <div className="flex items-center gap-2">
                              <span className={`text-[7px] font-black uppercase ${evt.team === 'ATHLETIC' ? 'text-[#EE2523]' : 'text-white/40'}`}>
                                 {evt.team}
                              </span>
                              {evt.quality !== 'N/A' && (
                                 <span className={`text-[7px] font-black px-1 rounded ${evt.quality === 'BIEN' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {evt.quality}
                                 </span>
                              )}
                           </div>
                           <span className="text-white text-[11px] font-bold uppercase">{evt.label}</span>
                        </div>
                     </div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); removeEvent(evt.id); }}
                        className="text-white/10 hover:text-red-500 p-2 transition-colors"
                     >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                     </button>
                  </div>
               )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
                     <svg className="w-10 h-10 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <p className="text-[8px] font-black uppercase tracking-widest">Sin registros</p>
                  </div>
               )}
            </div>

            <div className="p-4 bg-black/60 border-t border-white/5 shrink-0">
               <button 
                 disabled={events.length === 0}
                 className="w-full bg-white/5 hover:bg-white/10 text-white/40 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all disabled:opacity-10"
                 onClick={() => { alert("Exportando a Lezama Data Lake..."); }}
               >
                  Exportar Informe XML
               </button>
            </div>
         </div>
      </div>

      {/* VENTANA EMERGENTE DE CALIFICACIÓN (MODAL) */}
      {editingEvent && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#121212]">
                  <div>
                     <span className="text-[#EE2523] text-[9px] font-black uppercase tracking-widest">{formatTime(editingEvent.time)} • {editingEvent.team}</span>
                     <h4 className="text-xl font-black text-white uppercase mt-0.5">{editingEvent.label}</h4>
                  </div>
                  <button onClick={() => setEditingEvent(null)} className="text-white/20 hover:text-white">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
               </div>

               <div className="p-6 space-y-6">
                  {/* Selector Bien / Mal */}
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Calificación Táctica</label>
                     <div className="flex gap-3">
                        <button 
                           onClick={() => setEditingEvent({ ...editingEvent, quality: 'BIEN' })}
                           className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${editingEvent.quality === 'BIEN' ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-white/5 border-transparent text-white/20'}`}
                        >
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                           <span className="font-black text-[10px] uppercase tracking-widest">BIEN</span>
                        </button>
                        <button 
                           onClick={() => setEditingEvent({ ...editingEvent, quality: 'MAL' })}
                           className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${editingEvent.quality === 'MAL' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-transparent text-white/20'}`}
                        >
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" transform="rotate(45 12 12)"/></svg>
                           <span className="font-black text-[10px] uppercase tracking-widest">MAL</span>
                        </button>
                     </div>
                  </div>

                  {/* Campo Libre */}
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Detalles / Observaciones</label>
                     <textarea 
                        autoFocus
                        value={editingEvent.details}
                        onChange={(e) => setEditingEvent({ ...editingEvent, details: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#EE2523] outline-none resize-none h-24"
                        placeholder="Jugador involucrado, zona del campo, motivo..."
                     ></textarea>
                  </div>
               </div>

               <div className="p-4 bg-[#121212] border-t border-white/5">
                  <button 
                     onClick={() => updateEventDetails(editingEvent.id, editingEvent.quality, editingEvent.details)}
                     className="w-full bg-[#EE2523] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                  >
                     Confirmar Registro
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default LiveTaggingContainer;

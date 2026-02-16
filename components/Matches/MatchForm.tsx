
import React, { useState, useEffect } from 'react';
import { TEAMS } from '../../constants';
import { Player, Match, Substitution } from '../../types';
import { supabase } from '../../lib/supabase';

interface PositionCoords {
  label: string;
  top: string;
  left: string;
}

const TACTICAL_COORDS: Record<string, PositionCoords[]> = {
  '1-3-4-3': [
    { label: 'GK', top: '88%', left: '50%' },
    { label: 'DF', top: '75%', left: '25%' },
    { label: 'DF', top: '75%', left: '50%' },
    { label: 'DF', top: '75%', left: '75%' },
    { label: 'MF', top: '55%', left: '20%' },
    { label: 'MF', top: '55%', left: '40%' },
    { label: 'MF', top: '55%', left: '60%' },
    { label: 'MF', top: '55%', left: '80%' },
    { label: 'FW', top: '25%', left: '25%' },
    { label: 'FW', top: '25%', left: '50%' },
    { label: 'FW', top: '25%', left: '75%' },
  ],
  '1-4-3-3': [
    { label: 'POR', top: '88%', left: '50%' },
    { label: 'LD', top: '70%', left: '85%' },
    { label: 'DCD', top: '75%', left: '62%' },
    { label: 'DCI', top: '75%', left: '38%' },
    { label: 'LI', top: '70%', left: '15%' },
    { label: 'MCD', top: '55%', left: '50%' },
    { label: 'INTD', top: '40%', left: '70%' },
    { label: 'INTI', top: '40%', left: '30%' },
    { label: 'ED', top: '15%', left: '85%' },
    { label: 'DEL', top: '10%', left: '50%' },
    { label: 'EI', top: '15%', left: '15%' },
  ],
  '1-4-4-2': [
    { label: 'POR', top: '88%', left: '50%' },
    { label: 'LD', top: '72%', left: '85%' },
    { label: 'DCD', top: '75%', left: '62%' },
    { label: 'DCI', top: '75%', left: '38%' },
    { label: 'LI', top: '72%', left: '15%' },
    { label: 'MD', top: '45%', left: '85%' },
    { label: 'MCD', top: '48%', left: '60%' },
    { label: 'MCI', top: '48%', left: '40%' },
    { label: 'MI', top: '45%', left: '15%' },
    { label: 'DELD', top: '15%', left: '65%' },
    { label: 'DELI', top: '15%', left: '35%' },
  ]
};

const SYSTEMS = Object.keys(TACTICAL_COORDS);

interface MatchFormProps {
  onSave: () => void;
  onCancel: () => void;
  initialMatch?: Match | null;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSave, onCancel, initialMatch }) => {
  const [dbPlayers, setDbPlayers] = useState<Player[]>([]);
  const [draggedPlayerId, setDraggedPlayerId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Match>>(initialMatch || {
    competition: 'LIGA NACIONAL',
    teamId: TEAMS[0].id,
    date: new Date().toISOString().split('T')[0],
    localTeam: 'BILBAO ATHLETIC',
    visitorTeam: '',
    localLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png',
    visitorLogo: '',
    localGoals: 0,
    visitorGoals: 0,
    system: '1-3-4-3',
    starters: [],
    substitutes: [],
    nonCalled: [],
    substitutions: [],
    player_positions: {}
  });

  useEffect(() => {
    supabase.from('players').select('*').eq('team_id', formData.teamId).then(({ data }) => {
      if (data) {
        setDbPlayers(data);
        if (!initialMatch) {
            setFormData(prev => ({ ...prev, nonCalled: data.map(p => p.id) }));
        }
      }
    });
  }, [formData.teamId]);

  const getPositionCategory = (position: string) => {
    const p = position.toUpperCase();
    if (p.includes('PORTERO')) return 'GK';
    if (p.includes('DEFENSA') || p.includes('LATERAL') || p.includes('CENTRAL')) return 'DF';
    if (p.includes('CENTRO') || p.includes('MEDIA') || p.includes('PIVOTE')) return 'MF';
    return 'FW';
  };

  const togglePlayerRole = (playerId: string, role: 'starter' | 'substitute' | 'none') => {
    const starters = [...(formData.starters || [])];
    const substitutes = [...(formData.substitutes || [])];
    const nonCalled = [...(formData.nonCalled || [])];
    const positions = { ...(formData.player_positions || {}) };

    const cleanS = starters.filter(id => id !== playerId);
    const cleanSub = substitutes.filter(id => id !== playerId);
    const cleanN = nonCalled.filter(id => id !== playerId);

    if (role !== 'starter') {
        Object.keys(positions).forEach(pos => {
            if (positions[pos] === playerId) delete positions[pos];
        });
    }

    if (role === 'starter') {
        if (cleanS.length >= 11) return alert("Solo puedes tener 11 titulares.");
        setFormData({ ...formData, starters: [...cleanS, playerId], substitutes: cleanSub, nonCalled: cleanN, player_positions: positions });
    } else if (role === 'substitute') {
        setFormData({ ...formData, starters: cleanS, substitutes: [...cleanSub, playerId], nonCalled: cleanN, player_positions: positions });
    } else {
        setFormData({ ...formData, starters: cleanS, substitutes: cleanSub, nonCalled: [...cleanN, playerId], player_positions: positions });
    }
  };

  const assignPosition = (posLabel: string, playerId: string) => {
    // Solo permitir asignar si es titular
    if (!formData.starters?.includes(playerId)) {
        return alert("Solo puedes arrastrar a jugadores marcados como TIT (Titulares)");
    }

    const currentPositions = { ...(formData.player_positions || {}) };
    Object.keys(currentPositions).forEach(key => { if (currentPositions[key] === playerId) delete currentPositions[key]; });
    if (playerId) currentPositions[posLabel] = playerId;
    setFormData({ ...formData, player_positions: currentPositions });
  };

  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    setDraggedPlayerId(playerId);
    e.dataTransfer.setData("playerId", playerId);
  };

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData("playerId") || draggedPlayerId;
    if (playerId) assignPosition(slotId, playerId);
    setDragOverSlot(null);
    setDraggedPlayerId(null);
  };

  const PlayerItem: React.FC<{ p: Player }> = ({ p }) => {
    const isStarter = formData.starters?.includes(p.id);
    const isSub = formData.substitutes?.includes(p.id);
    return (
        <div 
            draggable={isStarter}
            onDragStart={(e) => handleDragStart(e, p.id)}
            className={`bg-[#2a2a2a] p-2 rounded-lg flex items-center justify-between group transition-all border border-white/5 hover:border-white/20 ${isStarter ? 'cursor-grab active:cursor-grabbing border-white/20' : ''}`}
        >
            <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full overflow-hidden bg-black border border-white/10 shrink-0 ${isStarter ? 'ring-2 ring-[#EE2523]/50' : ''}`}>
                    <img src={p.photo_url || p.photoUrl} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black text-white uppercase truncate">{p.apodo || p.name.split(' ')[0]}</p>
                    {isStarter && !Object.values(formData.player_positions || {}).includes(p.id) && (
                        <p className="text-[7px] text-[#EE2523] font-bold animate-pulse">ARRÁSTRAME</p>
                    )}
                </div>
            </div>
            <div className="flex gap-1">
                <button onClick={() => togglePlayerRole(p.id, 'starter')} className={`w-8 h-6 rounded flex items-center justify-center text-[7px] font-black transition-all ${isStarter ? 'bg-[#EE2523] text-white shadow-lg' : 'bg-black text-white/20 hover:text-white'}`}>TIT</button>
                <button onClick={() => togglePlayerRole(p.id, 'substitute')} className={`w-8 h-6 rounded flex items-center justify-center text-[7px] font-black transition-all ${isSub ? 'bg-white text-black shadow-lg' : 'bg-black text-white/20 hover:text-white'}`}>SUP</button>
                <button onClick={() => togglePlayerRole(p.id, 'none')} className={`w-8 h-6 rounded flex items-center justify-center text-[7px] font-black transition-all ${!isStarter && !isSub ? 'bg-white/10 text-white' : 'bg-black text-white/20 hover:text-white'}`}>OUT</button>
            </div>
        </div>
    );
  };

  const PositionHeader = ({ label, color }: { label: string, color: string }) => (
    <div className={`${color} py-1 px-4 text-black font-black text-[10px] uppercase tracking-widest mb-2 rounded-md`}>
        {label}
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] rounded-[32px] border border-white/5 p-6 md:p-10 shadow-2xl space-y-10 max-w-7xl mx-auto">
      
      {/* SECCIÓN 1: CABECERA */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-black/20 p-6 rounded-2xl border border-white/5">
           <div className="flex flex-col">
              <label className="text-[8px] font-black text-white/30 uppercase mb-2 ml-1">Competición</label>
              <input type="text" value={formData.competition} onChange={e => setFormData({...formData, competition: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-[#EE2523] transition-all" />
           </div>
           <div className="flex flex-col">
              <label className="text-[8px] font-black text-white/30 uppercase mb-2 ml-1">Esquema Táctico</label>
              <select value={formData.system} onChange={e => setFormData({...formData, system: e.target.value, player_positions: {}})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-[#EE2523] transition-all">
                 {SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
           <div className="md:col-span-2 flex justify-end gap-3">
                <button onClick={onCancel} className="px-6 py-3 text-[9px] font-black text-white/40 uppercase hover:text-white transition-colors tracking-[0.2em]">Cancelar</button>
                <button 
                    onClick={async () => { 
                        if(formData.starters?.length === 11) { 
                            await supabase.from('matches').upsert({...formData, isFinished: true}); 
                            onSave(); 
                        } else alert(`Faltan ${11 - (formData.starters?.length || 0)} jugadores para completar los 11 titulares.`); 
                    }} 
                    className="bg-[#EE2523] text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    Guardar Acta
                </button>
           </div>
      </section>

      {/* SECCIÓN 2: INTERFAZ PIZARRA */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LISTADO DE JUGADORES */}
        <div className="lg:col-span-5 bg-black/40 rounded-3xl border border-white/5 p-5 flex flex-col gap-6 overflow-y-auto max-h-[800px] scrollbar-hide">
            <div>
                <PositionHeader label="GK" color="bg-yellow-400" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dbPlayers.filter(p => getPositionCategory(p.position) === 'GK').map(p => <PlayerItem key={p.id} p={p} />)}
                </div>
            </div>

            <div>
                <PositionHeader label="DF" color="bg-red-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dbPlayers.filter(p => getPositionCategory(p.position) === 'DF').map(p => <PlayerItem key={p.id} p={p} />)}
                </div>
            </div>

            <div>
                <PositionHeader label="MF" color="bg-emerald-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dbPlayers.filter(p => getPositionCategory(p.position) === 'MF').map(p => <PlayerItem key={p.id} p={p} />)}
                </div>
            </div>

            <div>
                <PositionHeader label="FW" color="bg-blue-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dbPlayers.filter(p => getPositionCategory(p.position) === 'FW').map(p => <PlayerItem key={p.id} p={p} />)}
                </div>
            </div>
        </div>

        {/* PIZARRA TÁCTICA */}
        <div className="lg:col-span-7 flex flex-col">
            <div className="bg-[#0a0a0a] rounded-[40px] p-2 border border-white/5 shadow-2xl relative group">
                <div className="relative aspect-[3/4] bg-[#11301d] rounded-[32px] border-[8px] border-[#2a2a2a] overflow-hidden">
                    {/* Marcas del campo */}
                    <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <g fill="none" stroke="white" strokeWidth="0.8">
                            <rect x="5" y="5" width="90" height="90" />
                            <rect x="25" y="5" width="50" height="15" />
                            <rect x="25" y="80" width="50" height="15" />
                            <circle cx="50" cy="50" r="12" />
                            <line x1="5" y1="50" x2="95" y2="50" />
                            <path d="M 5 15 A 10 10 0 0 1 15 5" />
                            <path d="M 85 5 A 10 10 0 0 1 95 15" />
                        </g>
                    </svg>

                    {/* Slots tácticos siempre visibles como círculos de arrastre */}
                    {formData.system && TACTICAL_COORDS[formData.system]?.map((pos, idx) => {
                        const slotId = `${pos.label}-${idx}`;
                        const assignedId = formData.player_positions?.[slotId];
                        const player = dbPlayers.find(p => p.id === assignedId);
                        const isOver = dragOverSlot === slotId;
                        
                        return (
                            <div 
                                key={slotId}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10 transition-all duration-300 ${isOver ? 'scale-125' : ''}`}
                                style={{ top: pos.top, left: pos.left }}
                                onDragOver={(e) => handleDragOver(e, slotId)}
                                onDragLeave={() => setDragOverSlot(null)}
                                onDrop={(e) => handleDrop(e, slotId)}
                            >
                                <div className="relative group/slot">
                                    {/* Círculo base (ZONA DE ARRASTRE) */}
                                    <div className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-all shadow-xl backdrop-blur-md ${player ? 'bg-white border-[#EE2523] border-solid scale-110' : isOver ? 'bg-[#EE2523]/40 border-[#EE2523] border-solid animate-pulse' : 'bg-white/5 border-white/20'}`}>
                                        {player ? (
                                            <img src={player.photo_url || player.photoUrl} className="w-full h-full object-contain rounded-full" alt="" />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter">{pos.label}</span>
                                                <div className="w-1.5 h-1.5 bg-white/10 rounded-full mt-0.5"></div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Etiqueta Dorsal */}
                                    {player && (
                                        <div className="absolute -top-1 -left-1 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] border-2 border-[#11301d] shadow-lg">
                                            {player.dorsal}
                                        </div>
                                    )}

                                    {/* Botón quitar rápido */}
                                    {player && (
                                        <button 
                                            onClick={() => assignPosition(slotId, '')}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    )}
                                </div>

                                {/* Nombre del Jugador */}
                                {player && (
                                    <div className="bg-black/90 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 max-w-[100px] shadow-2xl text-center">
                                        <p className="text-[7px] font-black text-white uppercase truncate tracking-tight">{player.apodo || player.name.split(' ')[0]}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/5 border-dashed">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-dashed border-white/30"></div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">SLOT VACÍO</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EE2523]"></div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">JUGADOR ASIGNADO</span>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{formData.starters?.length || 0} / 11 TITULARES</span>
            </div>
        </div>
      </section>
    </div>
  );
};

export default MatchForm;

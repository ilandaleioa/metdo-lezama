
import React, { useState, useMemo, useEffect } from 'react';
import { TEAMS, MOCK_PLAYERS } from '../../constants';
import { Player } from '../../types';
import { supabase } from '../../lib/supabase';

const FORMATIONS = {
  '4-3-3': [
    { id: 'POR', label: 'POR', x: 50, y: 88 },
    { id: 'LD', label: 'LD', x: 82, y: 68 },
    { id: 'CDD', label: 'CDD', x: 62, y: 68 },
    { id: 'CDI', label: 'CDI', x: 38, y: 68 },
    { id: 'LI', label: 'LI', x: 18, y: 68 },
    { id: 'MCD', label: 'MCD', x: 50, y: 45 },
    { id: 'INTD', label: 'INTD', x: 70, y: 35 },
    { id: 'INTI', label: 'INTI', x: 30, y: 35 },
    { id: 'ED', label: 'ED', x: 82, y: 12 },
    { id: 'DEL', label: 'DEL', x: 50, y: 8 },
    { id: 'EI', label: 'EI', x: 18, y: 12 },
  ],
  '4-4-2': [
    { id: 'POR', label: 'POR', x: 50, y: 88 },
    { id: 'LD', label: 'LD', x: 82, y: 68 },
    { id: 'CDD', label: 'CDD', x: 62, y: 68 },
    { id: 'CDI', label: 'CDI', x: 38, y: 68 },
    { id: 'LI', label: 'LI', x: 18, y: 68 },
    { id: 'MD', label: 'MD', x: 82, y: 40 },
    { id: 'MCD', label: 'MCD', x: 60, y: 40 },
    { id: 'MCI', label: 'MCI', x: 40, y: 40 },
    { id: 'MI', label: 'MI', x: 18, y: 40 },
    { id: 'DELD', label: 'DELD', x: 65, y: 10 },
    { id: 'DELI', label: 'DELI', x: 35, y: 10 },
  ]
};

const CATEGORIES = ['PORTEROS', 'DEFENSAS', 'CENTROCAMPISTAS', 'DELANTEROS'];

const CampogramasContainer: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [selectedFormation, setSelectedFormation] = useState<'4-3-3' | '4-4-2'>('4-3-3');
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [dbPlayers, setDbPlayers] = useState<Player[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionName, setSessionName] = useState('Estructura Principal');
  const [savedSchemes, setSavedSchemes] = useState<any[]>([]);

  const fetchSavedSchemes = async () => {
    const { data } = await supabase
      .from('campograma_assignments')
      .select('*')
      .eq('team_id', selectedTeamId)
      .order('updated_at', { ascending: false });
    if (data) setSavedSchemes(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: playersData } = await supabase.from('players').select('*').eq('team_id', selectedTeamId);
      if (playersData && playersData.length > 0) {
        setDbPlayers(playersData);
      } else {
        setDbPlayers(MOCK_PLAYERS[selectedTeamId] || []);
      }
      fetchSavedSchemes();
    };
    
    fetchData();
  }, [selectedTeamId]);

  const currentTeam = useMemo(() => TEAMS.find(t => t.id === selectedTeamId), [selectedTeamId]);

  const getPositionCategory = (position: string) => {
    const p = position.toUpperCase();
    if (p.includes('PORTERO')) return 'PORTEROS';
    if (p.includes('DEFENSA') || p.includes('LATERAL') || p.includes('CENTRAL')) return 'DEFENSAS';
    if (p.includes('CENTRO') || p.includes('MEDIA') || p.includes('PIVOTE')) return 'CENTROCAMPISTAS';
    return 'DELANTEROS';
  };

  const groupedPlayers = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = dbPlayers.filter(p => getPositionCategory(p.position) === cat);
      return acc;
    }, {} as Record<string, Player[]>);
  }, [dbPlayers]);

  const handleAssignPlayer = (player: Player) => {
    if (!activeSlot) return;
    
    const isAssignedSomewhereElse = Object.entries(assignments).some(
      ([slotId, ids]) => slotId !== activeSlot && (ids as string[]).includes(player.id)
    );
    if (isAssignedSomewhereElse) return;

    setAssignments(prev => {
      const currentAssigned = prev[activeSlot] || [];
      if (currentAssigned.includes(player.id)) {
        return { ...prev, [activeSlot]: currentAssigned.filter(id => id !== player.id) };
      } else if (currentAssigned.length < 3) {
        return { ...prev, [activeSlot]: [...currentAssigned, player.id] };
      }
      return prev;
    });
  };

  const handleSaveToCloud = async () => {
    if (!sessionName.trim()) return alert("Asigna un nombre a la sesión.");
    setIsSaving(true);
    try {
      // Usamos el nombre en el JSON o como columna extra si existiera, 
      // aquí lo guardamos como un registro único por nombre para este equipo
      const { error } = await supabase
        .from('campograma_assignments')
        .upsert({
          team_id: selectedTeamId,
          formation: selectedFormation,
          assignments: assignments,
          // Guardamos el nombre dentro del JSON para recuperarlo
          metadata: { name: sessionName },
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' }); // Cambiamos a ID para permitir múltiples guardados o manejarlo por nombre

      if (error) throw error;
      alert(`Sesión "${sessionName}" sincronizada.`);
      fetchSavedSchemes();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadScheme = (scheme: any) => {
    setSelectedFormation(scheme.formation as any);
    setAssignments(scheme.assignments);
    setSessionName(scheme.metadata?.name || 'Cargado');
    setActiveSlot(null);
  };

  const getAssignedPlayers = (slotId: string) => {
    const assignedIds = assignments[slotId] || [];
    return assignedIds.map(id => dbPlayers.find(p => p.id === id)).filter(Boolean) as Player[];
  };

  return (
    <div className="h-screen flex flex-col animate-in fade-in duration-500 overflow-hidden -mt-8 -mx-8 bg-[#0a0a0a]">
      {/* HEADER */}
      <div className="px-8 pt-6 flex justify-between items-center shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">CAMPOGRAMA <span className="text-[#EE2523]">DIRECCIÓN TÉCNICA</span></h2>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Metodología Lezama</p>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Nombre Sesión</span>
            <input 
              type="text" 
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-[11px] font-bold uppercase focus:border-[#EE2523] outline-none transition-all"
              placeholder="Ej: Salida de balón..."
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <select 
            value={selectedFormation}
            onChange={(e) => { setSelectedFormation(e.target.value as any); setAssignments({}); setActiveSlot(null); }}
            className="bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-white/10 outline-none hover:border-[#EE2523] transition-colors"
            >
            <option value="4-3-3">SISTEMA 4-3-3</option>
            <option value="4-4-2">SISTEMA 4-4-2</option>
            </select>
            <button 
                onClick={handleSaveToCloud}
                disabled={isSaving}
                className="bg-[#EE2523] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
                {isSaving ? 'Guardando...' : 'Guardar Pizarra'}
            </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
         {/* CAMPO */}
         <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
            <div className="w-full h-full relative bg-[#1a1a1a] rounded-[60px] border-[12px] border-[#222] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
               <div className="absolute inset-0 bg-[#11301d] opacity-90"></div>
               
               <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 pointer-events-none opacity-40 px-10 py-6">
                  <g fill="none" stroke="white" strokeWidth="0.6">
                     <rect x="5" y="5" width="90" height="90" />
                     <line x1="5" y1="50" x2="95" y2="50" />
                     <circle cx="50" cy="50" r="12" />
                     <rect x="25" y="5" width="50" height="15" />
                     <rect x="25" y="80" width="50" height="15" />
                  </g>
               </svg>

               {FORMATIONS[selectedFormation].map((pos) => {
                  const assigned = getAssignedPlayers(pos.id);
                  const isActive = activeSlot === pos.id;
                  
                  return (
                     <div 
                        key={pos.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 transition-all duration-500"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                     >
                        <div 
                           onClick={() => setActiveSlot(pos.id)}
                           className={`w-52 bg-[#0c0c0c]/95 border rounded-2xl overflow-hidden shadow-2xl transition-all ${isActive ? 'ring-2 ring-[#EE2523] scale-105 border-white/20' : 'border-white/5 hover:border-white/20'}`}
                        >
                           <div className="bg-[#141414] p-2 border-b border-white/5 flex items-center justify-center">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{pos.label}</span>
                           </div>

                           <div className="p-1 space-y-1 min-h-[80px]">
                              {assigned.length > 0 ? assigned.map((p) => (
                                 <div key={p.id} className="flex items-center gap-3 p-1.5 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-[#EE2523] flex items-center justify-center shrink-0 shadow-lg">
                                       <span className="text-[10px] font-black text-white">{p.dorsal}</span>
                                    </div>
                                    <div className="w-8 h-10 rounded-lg bg-[#222] overflow-hidden border border-white/10 shrink-0">
                                       <img src={p.photo_url || p.photoUrl} className="w-full h-full object-contain object-bottom" alt="" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                       <p className="text-[9px] font-black text-white uppercase truncate tracking-tight">
                                          {p.apodo || p.name}
                                       </p>
                                    </div>
                                 </div>
                              )) : (
                                 <div className="h-16 flex items-center justify-center opacity-10">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest italic">-</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* PANEL LATERAL */}
         <div className="w-[360px] bg-[#0c0c0c] border-l border-white/5 flex flex-col shrink-0 overflow-hidden shadow-2xl relative z-50 rounded-tl-[40px]">
            <div className="p-8 border-b border-white/5">
               <h3 className="text-white font-black text-[12px] uppercase tracking-[0.25em] mb-4">Plantilla Seleccionada</h3>
               <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 border-l-4 border-l-[#EE2523]">
                  <p className="text-white font-black text-[11px] uppercase tracking-[0.1em]">{currentTeam?.name}</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
               {CATEGORIES.map(category => {
                  const categoryPlayers = groupedPlayers[category] || [];
                  if (categoryPlayers.length === 0) return null;

                  return (
                     <div key={category} className="space-y-3">
                        <div className="flex items-center justify-between px-2 pb-1 border-b border-white/5">
                           <h4 className="text-[10px] font-black text-[#EE2523] uppercase tracking-[0.25em]">{category}</h4>
                           <span className="text-[9px] font-black text-white/20">{categoryPlayers.length}</span>
                        </div>
                        
                        <div className="space-y-2">
                           {categoryPlayers.map(player => {
                              const isAssignedToActive = activeSlot && (assignments[activeSlot] as string[] | undefined)?.includes(player.id);
                              const isAssignedSomewhereElse = Object.entries(assignments).some(
                                ([slotId, ids]) => slotId !== activeSlot && (ids as string[]).includes(player.id)
                              );
                              const currentCountInSlot = activeSlot ? (assignments[activeSlot]?.length || 0) : 0;
                              const isDisabled = (!isAssignedToActive && isAssignedSomewhereElse) || (!isAssignedToActive && currentCountInSlot >= 3);
                              
                              return (
                                 <div 
                                    key={player.id}
                                    onClick={() => !isDisabled && handleAssignPlayer(player)}
                                    className={`p-3 rounded-2xl border transition-all cursor-pointer group flex items-center gap-4 ${
                                       isAssignedToActive 
                                          ? 'bg-[#1a1a1a] border-[#EE2523] shadow-lg' 
                                          : isDisabled
                                             ? 'opacity-20 cursor-not-allowed grayscale border-transparent pointer-events-none'
                                             : 'bg-[#141414] border-white/5 hover:bg-[#1a1a1a]'
                                    }`}
                                 >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-all ${isAssignedToActive ? 'bg-[#EE2523] text-white shadow-[0_0_15px_rgba(238,37,35,0.4)]' : 'bg-black text-white/20 group-hover:text-white'}`}>
                                       {player.dorsal}
                                    </div>

                                    <div className="w-10 h-12 rounded-lg bg-[#0a0a0a] overflow-hidden border border-white/5 shrink-0">
                                       <img src={player.photo_url || player.photoUrl} className="w-full h-full object-contain object-bottom" alt="" />
                                    </div>

                                    <div className="min-w-0 flex-1 flex justify-between items-center">
                                       <span className={`text-[12px] font-black uppercase tracking-tight truncate block ${isAssignedToActive ? 'text-[#EE2523]' : 'text-white/90 group-hover:text-white'}`}>
                                          {player.apodo || player.name}
                                       </span>
                                       {isAssignedSomewhereElse && !isAssignedToActive && (
                                         <span className="text-[7px] font-black text-white/20 uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">Ocupado</span>
                                       )}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  );
               })}
            </div>
            
            {/* BIBLIOTECA DE ESTRUCTURAS */}
            <div className="p-6 bg-black/40 border-t border-white/5 h-64 flex flex-col shrink-0">
               <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  Biblioteca de Estructuras
               </h3>
               <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                  {savedSchemes.length > 0 ? savedSchemes.map((s) => (
                     <div 
                        key={s.id} 
                        onClick={() => loadScheme(s)}
                        className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer group"
                     >
                        <div className="flex justify-between items-center">
                           <p className="text-[11px] font-black text-white group-hover:text-[#EE2523] truncate">{s.metadata?.name || 'Sin nombre'}</p>
                           <span className="text-[8px] font-black text-white/20 uppercase">{s.formation}</span>
                        </div>
                        <p className="text-[7px] text-white/10 font-bold mt-1 uppercase tracking-widest">{new Date(s.updated_at).toLocaleDateString()}</p>
                     </div>
                  )) : (
                     <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl">
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Sin esquemas guardados</span>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CampogramasContainer;


import React, { useState, useEffect } from 'react';
import { MOCK_PLAYERS } from '../../constants';

/* Fix: Added playerId to props to satisfy parent component call and allow for individual filtering */
const WellnessBorgView: React.FC<{ playerId?: string }> = ({ playerId }) => {
  // Initialization
  const allPlayers = Object.values(MOCK_PLAYERS).flat();
  const [selectedPlayer, setSelectedPlayer] = useState(playerId || (allPlayers.length > 0 ? allPlayers[0].id : ''));
  
  const [borgValue, setBorgValue] = useState(6);
  const [wellness, setWellness] = useState({
    fatigue: 3,
    sleep: 4,
    soreness: 2,
    stress: 2,
    mood: 4
  });

  useEffect(() => {
    if (playerId) setSelectedPlayer(playerId);
  }, [playerId]);

  const BORG_SCALE = [
    { val: 6, label: 'Sin esfuerzo', color: 'bg-blue-400' },
    { val: 7, label: 'Extremadamente ligero', color: 'bg-blue-500' },
    { val: 9, label: 'Muy ligero', color: 'bg-green-400' },
    { val: 11, label: 'Ligero', color: 'bg-green-500' },
    { val: 13, label: 'Algo duro', color: 'bg-yellow-400' },
    { val: 15, label: 'Duro', color: 'bg-orange-400' },
    { val: 17, label: 'Muy duro', color: 'bg-orange-600' },
    { val: 19, label: 'Extremadamente duro', color: 'bg-red-600' },
    { val: 20, label: 'Agotamiento máximo', color: 'bg-black' }
  ];

  const updateWellness = (key: keyof typeof wellness, val: number) => {
    setWellness(prev => ({ ...prev, [key]: val }));
  };

  const getReadinessScore = () => {
    const total = (Object.values(wellness) as number[]).reduce((a, b) => a + b, 0);
    // Max possible: 5 * 5 = 25. 
    return Math.round((total / 25) * 100);
  };

  const readiness = getReadinessScore();
  const readinessColor = readiness > 80 ? 'text-green-500' : readiness > 60 ? 'text-yellow-500' : 'text-red-500';

  const wellnessItems = [
    { id: 'fatigue', label: 'Nivel de Fatiga', min: 'Exhausto', max: 'Fresco' },
    { id: 'sleep', label: 'Calidad de Sueño', min: 'Insomnio', max: 'Descansado' },
    { id: 'soreness', label: 'Dolor Muscular', min: 'Muy Adolorido', max: 'Sin Dolor' },
    { id: 'stress', label: 'Nivel de Estrés', min: 'Muy Alto', max: 'Relajado' },
    { id: 'mood', label: 'Estado de Ánimo', min: 'Irritable', max: 'Positivo' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            WELLNESS <span className="text-[#EE2523]">&</span> BORG
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Control de Carga Interna Diaria</p>
        </div>
        
        <select 
           value={selectedPlayer}
           onChange={(e) => setSelectedPlayer(e.target.value)}
           className="bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-white/10 outline-none hover:border-[#EE2523] transition-colors cursor-pointer"
        >
           {allPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
           ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* COLUMNA IZQUIERDA: WELLNESS */}
         <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Cuestionario de Bienestar</h3>
                  <div className="flex flex-col items-end">
                     <span className={`text-4xl font-black ${readinessColor}`}>{readiness}%</span>
                     <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Readiness Score</span>
                  </div>
               </div>

               <div className="space-y-6">
                  {wellnessItems.map((item) => (
                     <div key={item.id} className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold text-white/60 uppercase tracking-wider">
                           <span>{item.label}</span>
                           <span className="text-[#EE2523]">{(wellness as any)[item.id]}/5</span>
                        </div>
                        <input 
                           type="range" min="1" max="5" step="1"
                           value={(wellness as any)[item.id]}
                           onChange={(e) => updateWellness(item.id as any, parseInt(e.target.value))}
                           className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#EE2523]"
                        />
                        <div className="flex justify-between text-[7px] font-black text-white/20 uppercase tracking-widest">
                           <span>{item.min}</span>
                           <span>{item.max}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* COLUMNA DERECHA: ESCALA BORG */}
         <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 shadow-2xl h-full flex flex-col">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8">Escala de Percepción del Esfuerzo (RPE)</h3>
               
               <div className="flex-1 flex flex-col gap-2">
                  {BORG_SCALE.map((level) => (
                     <button
                        key={level.val}
                        onClick={() => setBorgValue(level.val)}
                        className={`flex items-center p-3 rounded-xl transition-all group ${borgValue === level.val ? 'bg-white text-black scale-105 shadow-xl font-bold' : 'bg-[#111] hover:bg-white/5 text-white/40 hover:text-white'}`}
                     >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs mr-4 ${level.color} text-white shadow-lg`}>
                           {level.val}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{level.label}</span>
                        {borgValue === level.val && (
                           <div className="ml-auto w-2 h-2 bg-[#EE2523] rounded-full animate-pulse"></div>
                        )}
                     </button>
                  ))}
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Carga sRPE (Sesión 90')</span>
                     <span className="text-2xl font-black text-white mt-1">{borgValue * 90} <span className="text-xs text-[#EE2523]">UA</span></span>
                  </div>
                  <button 
                     onClick={() => alert("Datos de carga interna registrados.")}
                     className="bg-[#EE2523] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all"
                  >
                     Guardar Registro
                  </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default WellnessBorgView;

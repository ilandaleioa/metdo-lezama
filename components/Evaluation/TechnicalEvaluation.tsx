
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

const TechnicalEvaluation: React.FC<{ playerId?: string }> = ({ playerId }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerId || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [scores, setScores] = useState({
    tecnica: 3,
    tactica: 3,
    condicional: 3,
    disponibilidad: 3,
    rendimiento: 3,
    companerismo: 3
  });

  useEffect(() => {
    supabase.from('players').select('*').order('name').then(({ data }) => {
      if (data) setPlayers(data);
    });
  }, []);

  const average = useMemo(() => {
    // Fix: Explicitly cast values as number[] to avoid 'unknown' type errors in reduce arithmetic operation (Line 28 fix)
    const values = Object.values(scores) as number[];
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  }, [scores]);

  const handleSave = async () => {
    if (!selectedPlayerId) return alert("Selecciona un jugador");
    setIsSaving(true);
    // Simulación de persistencia en Lezama Cloud
    setTimeout(() => {
      alert("Evaluación Técnica Guardada: Sincronización Lezama Cloud completada.");
      setIsSaving(false);
    }, 1000);
  };

  const RadarChart = () => {
    const size = 320;
    const center = size / 2;
    const radius = 100;
    
    // Hexágono de 6 ejes
    const axes = [
      { key: 'tecnica', label: 'TÉCNICA', angle: -Math.PI / 2 },
      { key: 'rendimiento', label: 'RENDIMIENTO', angle: -Math.PI / 6 },
      { key: 'tactica', label: 'TÁCTICA', angle: Math.PI / 6 },
      { key: 'disponibilidad', label: 'DISPONIBILIDAD', angle: Math.PI / 2 },
      { key: 'condicional', label: 'CONDICIONAL', angle: 5 * Math.PI / 6 },
      { key: 'companerismo', label: 'COMPAÑERISMO', angle: 7 * Math.PI / 6 },
    ];

    const getPoint = (val: number, angle: number) => {
      const r = (val / 5) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y };
    };

    const points = axes.map(axis => getPoint((scores as any)[axis.key], axis.angle));
    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

    return (
      <div className="relative flex items-center justify-center p-12 bg-black/40 rounded-[48px] border border-white/5 shadow-inner overflow-visible">
        <svg width={size} height={size} className="overflow-visible drop-shadow-[0_0_30px_rgba(238,37,35,0.15)]">
          {/* Guías circulares */}
          {[1, 2, 3, 4, 5].map(i => (
            <circle key={i} cx={center} cy={center} r={(i/5)*radius} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
          ))}
          {/* Ejes */}
          {axes.map((axis, i) => {
            const end = getPoint(5, axis.angle);
            return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="white" strokeOpacity="0.05" strokeWidth="1" />;
          })}
          {/* Polígono de datos */}
          <path d={pathData} fill="#EE2523" fillOpacity="0.3" stroke="#EE2523" strokeWidth="4" strokeLinejoin="round" className="transition-all duration-700" />
          {/* Vértices */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#EE2523" className="transition-all duration-700" />
          ))}
          
          {/* Etiquetas Dinámicas */}
          {axes.map((axis, i) => {
            const p = getPoint(5.8, axis.angle);
            return (
              <text 
                key={i} 
                x={p.x} 
                y={p.y} 
                textAnchor="middle" 
                alignmentBaseline="middle"
                className="fill-white/40 text-[9px] font-black uppercase tracking-widest"
              >
                {axis.label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  const RatingSelector = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 border border-white/5 p-5 rounded-[28px] space-y-4 hover:bg-white/[0.08] transition-all">
       <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
          <span className="text-2xl font-[1000] text-white italic">{value}</span>
       </div>
       <div className="flex justify-between gap-1.5">
          {[1, 2, 3, 4, 5].map(v => (
            <button 
              key={v} onClick={() => onChange(v)}
              className={`flex-1 py-2.5 rounded-xl font-black text-[10px] transition-all ${value === v ? 'bg-white text-black scale-105 shadow-xl' : 'bg-black/40 text-white/20 hover:text-white'}`}
            >
              {v}
            </button>
          ))}
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-[1000] text-white tracking-tighter uppercase italic leading-none">FORMULARIO <span className="text-[#EE2523]">TÉCNICO 360</span></h2>
          <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">Métricas Integrales de Rendimiento y Actitud</p>
        </div>
        <div className="bg-[#EE2523]/10 px-6 py-3 rounded-full border border-[#EE
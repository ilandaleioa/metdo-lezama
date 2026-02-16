
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

interface ReportFormProps {
  onSave: () => void;
  initialData?: any;
  defaultPlayerId?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSave, initialData, defaultPlayerId }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    playerId: '',
    month: 'OCTUBRE',
    behaviorStatus: 'green',
    behaviorComment: '',
    availabilityStatus: 'green',
    availabilityComment: '',
    participationStatus: 'green',
    participationComment: '',
    performanceStatus: 'green',
    performanceComment: '',
    environmentStatus: 'green',
    environmentComment: '',
    academicStatus: 'green',
    academicComment: '',
    socialStatus: 'green',
    socialComment: '',
    improvementStatus: 'green',
    improvementComment: '',
    finalObservations: ''
  });

  useEffect(() => {
    supabase.from('players').select('*').then(({data}) => {
      if (data) setPlayers(data);
    });
    
    if (initialData) {
      setFormData(initialData);
    } else if (defaultPlayerId) {
      setFormData(prev => ({ ...prev, playerId: defaultPlayerId }));
    }
  }, [initialData, defaultPlayerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.playerId) return alert('Selecciona un jugador');
    
    setIsSaving(true);
    try {
      const selectedPlayer = players.find(p => p.id === formData.playerId);
      const { playerId, month, ...rest } = formData;
      
      const payload = {
        player_id: playerId,
        team_id: selectedPlayer?.team_id || '2',
        month: month,
        data: rest
      };

      const { error } = await supabase
        .from('tracking_reports')
        .upsert(payload, { onConflict: 'player_id,month' }); // Evita duplicados para el mismo mes

      if (error) throw error;
      alert("Informe sincronizado con el servidor.");
      onSave();
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = "w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EE2523] transition-colors appearance-none outline-none";
  const labelClasses = "block text-white font-black text-[9px] uppercase tracking-[0.2em] mb-2 opacity-40";

  const renderSection = (title: string, prefix: string) => (
    <div className="bg-[#0f0f0f] border border-white/5 p-4 md:p-6 rounded-2xl space-y-4 relative mt-10">
      <div className="absolute -top-3 left-4 md:left-6 px-3 bg-[#EE2523] rounded-full shadow-lg">
        <h4 className="text-white font-black text-[8px] tracking-[0.2em] py-1 uppercase">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        <div className="md:col-span-1">
          <label className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 block">Estado</label>
          <select 
            name={`${prefix}Status`}
            value={(formData as any)[`${prefix}Status`]}
            onChange={e => setFormData({...formData, [`${prefix}Status`]: e.target.value})}
            className={inputClasses}
          >
            <option value="green">🟢 CORRECTO</option>
            <option value="yellow">🟡 ALERTA</option>
            <option value="red">🔴 CRÍTICO</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 block">Observaciones Técnicas</label>
          <textarea 
            name={`${prefix}Comment`}
            value={(formData as any)[`${prefix}Comment`]}
            onChange={e => setFormData({...formData, [`${prefix}Comment`]: e.target.value})}
            className={`${inputClasses} h-12 md:h-11 resize-none overflow-hidden focus:h-24 transition-all duration-300`}
            placeholder={`Notas...`}
          ></textarea>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] p-5 md:p-10 rounded-3xl md:rounded-[32px] border border-white/5 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
          <div>
            <label className={labelClasses}>Jugador de Plantilla</label>
            <select 
              name="playerId" 
              value={formData.playerId} 
              onChange={e => setFormData({...formData, playerId: e.target.value})} 
              className={inputClasses}
              disabled={!!defaultPlayerId && !initialData}
            >
              <option value="">Seleccionar Jugador...</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.dorsal})</option>)}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Mes de Evaluación</label>
            <select name="month" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className={inputClasses}>
              <option value="OCTUBRE">OCTUBRE</option>
              <option value="ENERO">ENERO</option>
              <option value="ABRIL">ABRIL</option>
              <option value="JUNIO">JUNIO</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          <div className="space-y-0">
             <p className="text-[#EE2523] text-[9px] font-black uppercase tracking-[0.3em] mb-4 border-l-2 border-[#EE2523] pl-3">Dimensiones Deportivas</p>
             {renderSection('Comportamiento', 'behavior')}
             {renderSection('Disponibilidad', 'availability')}
             {renderSection('Participación', 'participation')}
             {renderSection('Rendimiento', 'performance')}
          </div>
          <div className="space-y-0 mt-10 lg:mt-0">
             <p className="text-[#EE2523] text-[9px] font-black uppercase tracking-[0.3em] mb-4 border-l-2 border-[#EE2523] pl-3">Dimensiones Personales</p>
             {renderSection('Entorno Familiar', 'environment')}
             {renderSection('Situación Académica', 'academic')}
             {renderSection('Relación Social', 'social')}
             {renderSection('Capacidad de Mejora', 'improvement')}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <label className={labelClasses}>Observaciones Finales (Resumen)</label>
          <textarea 
             value={formData.finalObservations}
             onChange={e => setFormData({...formData, finalObservations: e.target.value})}
             className={`${inputClasses} h-32 resize-none`}
             placeholder="Redacta la conclusión técnica..."
          ></textarea>
        </div>
        
        <div className="flex justify-end pt-8">
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full md:w-auto px-12 py-5 bg-[#EE2523] text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Sincronizando...' : 'Sincronizar Informe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;

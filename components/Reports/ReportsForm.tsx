
import React, { useState, useEffect } from 'react';
import { TEAMS } from '../../constants';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

const MONTHS = ['SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO'];
const LATERALITIES = ['DIESTRO', 'ZURDO', 'AMBIDIESTRO'];
const POSITIONS = ['PORTERO', 'DEFENSA', 'MEDIO', 'DELANTERO'];

interface ReportsFormProps {
  onSave: (data: any) => void;
  initialData?: any;
  defaultPlayerId?: string;
}

const ReportsForm: React.FC<ReportsFormProps> = ({ onSave, initialData, defaultPlayerId }) => {
  const [dbPlayers, setDbPlayers] = useState<Player[]>([]);
  const [formData, setFormData] = useState({
    teamId: '',
    playerId: '',
    month: 'NOVIEMBRE',
    laterality: 'DIESTRO',
    position: 'MEDIO',
    description: '',
    familySituation: '',
    socialRelationship: '',
    weeklyOrganization: '',
    learningCapacity: '',
    academicSituation: '',
    currentMoment: ''
  });

  useEffect(() => {
    supabase.from('players').select('*').then(({ data }) => {
      if (data) {
        setDbPlayers(data);
        if (defaultPlayerId && !initialData) {
            const player = data.find(p => p.id === defaultPlayerId);
            if (player) {
                setFormData(prev => ({ ...prev, playerId: player.id, teamId: player.team_id }));
            }
        }
      }
    });

    if (initialData) {
      setFormData({
        teamId: initialData.team_id,
        playerId: initialData.player_id,
        month: initialData.month,
        laterality: initialData.data?.laterality || 'DIESTRO',
        position: initialData.data?.position || 'MEDIO',
        description: initialData.data?.description || '',
        familySituation: initialData.data?.familySituation || '',
        socialRelationship: initialData.data?.socialRelationship || '',
        weeklyOrganization: initialData.data?.weeklyOrganization || '',
        learningCapacity: initialData.data?.learningCapacity || '',
        academicSituation: initialData.data?.academicSituation || '',
        currentMoment: initialData.data?.currentMoment || ''
      });
    }
  }, [initialData, defaultPlayerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamId || !formData.playerId) {
      return alert('Por favor selecciona equipo y jugador.');
    }
    onSave(formData);
  };

  const selectedPlayer = dbPlayers.find(p => p.id === formData.playerId);
  const filteredPlayers = dbPlayers.filter(p => p.team_id === formData.teamId);

  const inputClasses = "w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#EE2523] transition-colors appearance-none";
  const labelClasses = "block text-white/30 font-black text-[9px] uppercase tracking-widest mb-2 ml-1";
  const sectionTitleClasses = "text-[#EE2523] text-[9px] font-black uppercase tracking-[0.2em] mt-10 mb-4 border-l-2 border-[#EE2523] pl-3";

  return (
    <div className="bg-[#1a1a1a] p-10 rounded-3xl border border-white/5 shadow-2xl">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {initialData ? 'Editar Perfil 360º' : 'Nuevo Informe 360º'}
          </h3>
          <p className="text-white/40 text-[10px] font-black mt-2 uppercase tracking-[0.3em]">Lezama Teknikoa • Evaluación Cualitativa</p>
        </div>
        {selectedPlayer && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-32 rounded-2xl overflow-hidden border-2 border-[#EE2523] shadow-2xl bg-black/40">
                <img 
                  src={selectedPlayer.photo_url || selectedPlayer.photoUrl} 
                  alt="Jugador" 
                  className="w-full h-full object-contain object-bottom grayscale hover:grayscale-0 transition-all" 
                />
            </div>
            <span className="text-[9px] text-[#EE2523] font-black mt-3 uppercase tracking-widest">{selectedPlayer.name}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-2xl border border-white/5">
          <div className="space-y-2">
            <label className={labelClasses}>Categoría</label>
            <select 
              name="teamId" 
              value={formData.teamId} 
              onChange={e => setFormData({...formData, teamId: e.target.value})} 
              className={inputClasses}
              disabled={!!defaultPlayerId && !initialData}
            >
              <option value="">Seleccionar Categoría...</option>
              {TEAMS.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Jugador</label>
            <select 
              name="playerId" 
              value={formData.playerId} 
              onChange={e => setFormData({...formData, playerId: e.target.value})} 
              className={inputClasses} 
              disabled={!formData.teamId || (!!defaultPlayerId && !initialData)}
            >
              <option value="">{formData.teamId ? 'Seleccionar Jugador...' : 'Primero elige categoría'}</option>
              {filteredPlayers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.dorsal})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div className="space-y-2">
              <label className={labelClasses}>Mes Evaluación</label>
              <select name="month" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className={inputClasses}>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Posición Técnica</label>
              <select name="position" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className={inputClasses}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
          <div>
            <h4 className={sectionTitleClasses}>01. Situación Familiar</h4>
            <textarea 
              name="familySituation" 
              value={formData.familySituation} 
              onChange={e => setFormData({...formData, familySituation: e.target.value})} 
              className={`${inputClasses} h-28 resize-none mb-6`}
              placeholder="Descripción del entorno familiar..."
            ></textarea>

            <h4 className={sectionTitleClasses}>02. Relación Social</h4>
            <textarea 
              name="socialRelationship" 
              value={formData.socialRelationship} 
              onChange={e => setFormData({...formData, socialRelationship: e.target.value})} 
              className={`${inputClasses} h-28 resize-none mb-6`}
              placeholder="Integración en el grupo y relaciones externas..."
            ></textarea>

            <h4 className={sectionTitleClasses}>03. Organización Semanal</h4>
            <textarea 
              name="weeklyOrganization" 
              value={formData.weeklyOrganization} 
              onChange={e => setFormData({...formData, weeklyOrganization: e.target.value})} 
              className={`${inputClasses} h-28 resize-none`}
              placeholder="Gestión del tiempo, descansos y logística..."
            ></textarea>
          </div>

          <div>
            <h4 className={sectionTitleClasses}>04. Capacidad de Aprendizaje</h4>
            <textarea 
              name="learningCapacity" 
              value={formData.learningCapacity} 
              onChange={e => setFormData({...formData, learningCapacity: e.target.value})} 
              className={`${inputClasses} h-28 resize-none mb-6`}
              placeholder="Asimilación de conceptos tácticos de Lezama..."
            ></textarea>

            <h4 className={sectionTitleClasses}>05. Situación Académica</h4>
            <textarea 
              name="academicSituation" 
              value={formData.academicSituation} 
              onChange={e => setFormData({...formData, academicSituation: e.target.value})} 
              className={`${inputClasses} h-28 resize-none mb-6`}
              placeholder="Rendimiento en estudios y comportamiento escolar..."
            ></textarea>

            <h4 className={sectionTitleClasses}>06. Momento Actual / Objetivos</h4>
            <textarea 
              name="currentMoment" 
              value={formData.currentMoment} 
              onChange={e => setFormData({...formData, currentMoment: e.target.value})} 
              className={`${inputClasses} h-28 resize-none`}
              placeholder="Conclusión del trimestre y retos futuros..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-10">
          <button 
            type="submit"
            className="px-12 py-4 bg-[#EE2523] text-white font-black rounded-2xl shadow-2xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] text-[11px]"
          >
            {initialData ? 'Actualizar Cloud' : 'Guardar Informe Completo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportsForm;

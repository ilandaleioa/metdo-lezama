
import React, { useState, useEffect } from 'react';
import { Player, AvailabilityStatus } from '../../types';
import { supabase } from '../../lib/supabase';
import { TEAMS } from '../../constants';

interface AddPlayerFormProps {
  teamName: string;
  teamId: string;
  onSave: (player: Partial<Player>) => Promise<void>;
  onCancel: () => void;
  initialData?: Player | null;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ teamName, teamId, onSave, onCancel, initialData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    apodo: '',
    dorsal: '',
    position: 'DELANTERO',
    status: AvailabilityStatus.AVAILABLE,
    laterality: 'Diestro' as 'Diestro' | 'Zurdo' | 'Ambas',
    birth_date: '',
    photo_url: '',
    matches_played: 0,
    matches_started: 0,
    minutes: 0,
    goals: 0,
    participation: 0,
    team_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        apodo: initialData.apodo || '',
        dorsal: initialData.dorsal?.toString() || '',
        position: initialData.position || 'DELANTERO',
        status: initialData.status || AvailabilityStatus.AVAILABLE,
        laterality: initialData.laterality || 'Diestro',
        birth_date: initialData.birth_date || initialData.birthDate || '',
        photo_url: initialData.photo_url || initialData.photoUrl || '',
        matches_played: initialData.matches_played || initialData.matchesPlayed || 0,
        matches_started: initialData.matches_started || initialData.matchesStarted || 0,
        minutes: initialData.minutes || 0,
        goals: initialData.goals || 0,
        participation: initialData.participation || 0,
        team_id: initialData.team_id || teamId
      });
    } else {
      setFormData(prev => ({ ...prev, team_id: teamId }));
    }
  }, [initialData, teamId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    const localPreviewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, photo_url: localPreviewUrl }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `squad-photos/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('LEZAMA').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('LEZAMA').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, photo_url: data.publicUrl }));
    } catch (error: any) {
      setUploadError("Subida Cloud fallida. Se usará la imagen localmente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dorsal) return alert("Por favor, completa el Nombre y el Dorsal.");
    setIsSaving(true);
    try { await onSave(formData); } finally { setIsSaving(false); }
  };

  const inputStyle = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#EE2523] transition-all placeholder:text-white/20";
  const labelStyle = "block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-bold text-white uppercase tracking-tight">{initialData ? 'Editar Jugador' : 'Registro de Jugador'}</h4>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className={`aspect-[3/4] w-full max-w-[200px] rounded-3xl overflow-hidden border-2 border-dashed border-white/10 flex items-center justify-center bg-black/20 relative group hover:border-[#EE2523]/50 transition-all ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-5 h-5 border-2 border-t-[#EE2523] border-white/20 rounded-full animate-spin"></div>
                  <span className="text-[8px] text-white/40 font-black uppercase">Procesando</span>
                </div>
              ) : formData.photo_url ? (
                <img src={formData.photo_url} alt="Profile" className="w-full h-full object-contain object-bottom" />
              ) : (
                <div className="flex flex-col items-center text-white/20 group-hover:text-white/40">
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <span className="text-[8px] font-black uppercase">Subir Foto</span>
                </div>
              )}
              <input type="file" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" disabled={isUploading} />
            </div>
            {uploadError && <p className="text-[8px] text-yellow-500 mt-2 text-center max-w-[150px] leading-tight font-medium">{uploadError}</p>}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelStyle}>Nombre Completo</label>
              <input type="text" placeholder="Ej: Iker Muniain Goñi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputStyle} required />
            </div>
            
            <div>
              <label className={labelStyle}>Apodo (Se verá en el campo)</label>
              <input type="text" placeholder="Ej: Muniain" value={formData.apodo} onChange={e => setFormData({...formData, apodo: e.target.value})} className={inputStyle} />
            </div>

            <div>
              <label className={labelStyle}>Dorsal</label>
              <input type="text" placeholder="10" value={formData.dorsal} onChange={e => setFormData({...formData, dorsal: e.target.value})} className={inputStyle} required />
            </div>

            <div>
              <label className={labelStyle}>Posición</label>
              <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className={inputStyle}>
                <option value="PORTERO">PORTERO</option>
                <option value="DEFENSA">DEFENSA</option>
                <option value="CENTROCAMPISTA">CENTROCAMPISTA</option>
                <option value="DELANTERO">DELANTERO</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>Lateralidad</label>
              <select value={formData.laterality} onChange={e => setFormData({...formData, laterality: e.target.value as any})} className={inputStyle}>
                <option value="Diestro">Diestro</option>
                <option value="Zurdo">Zurdo</option>
                <option value="Ambas">Ambas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
          <button type="button" onClick={onCancel} className="px-6 py-3 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
          <button type="submit" disabled={isSaving} className="bg-[#EE2523] text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {isSaving ? 'Sincronizando...' : initialData ? 'Actualizar Ficha' : 'Dar de Alta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayerForm;

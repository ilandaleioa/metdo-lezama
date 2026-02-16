
import React, { useState, useEffect } from 'react';
import { TEAMS } from '../../constants';
import { supabase } from '../../lib/supabase';

// Tipos para el Staff
type EuskeraLevel = 'ALTO' | 'MEDIO' | 'BAJO';
type Qualification = 'NIVEL 1' | 'NIVEL 2' | 'NIVEL 3 (UEFA PRO)';
type Role = 'PRIMER ENTRENADOR' | 'SEGUNDO ENTRENADOR' | 'ENTRENADOR DE PORTEROS' | 'PREPARADOR FÍSICO' | 'ANALISTA' | 'READAPTADOR';

interface Coach {
  id: string;
  name: string; 
  birth_date: string;
  team_id: string;
  role: Role;
  qualification: Qualification;
  euskera_level: EuskeraLevel;
  photo_url: string;
  bio?: string;
  experience?: string[];
}

const CoachView: React.FC = () => {
  const [staffList, setStaffList] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [selectedCoachForEval, setSelectedCoachForEval] = useState<Coach | null>(null);
  const [selectedCoachForDetail, setSelectedCoachForDetail] = useState<Coach | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Partial<Coach>>({});
  
  const [evalData, setEvalData] = useState({
    matchDirection: 'green',
    charisma: 'green',
    organization: 'green',
    observations: ''
  });

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('coaches').select('*').order('name');
      if (error) throw error;
      setStaffList(data || []);
    } catch (err) {
      console.error("Error cargando técnicos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const getEuskeraColor = (level: EuskeraLevel) => {
    switch (level) {
      case 'ALTO': return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
      case 'MEDIO': return 'bg-yellow-500 shadow-[0_0_10px_#eab308]';
      case 'BAJO': return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
      default: return 'bg-gray-500';
    }
  };

  const handleAddNew = () => {
    setEditingCoach({
      name: '',
      birth_date: '',
      team_id: TEAMS[0]?.id || '2',
      role: 'PRIMER ENTRENADOR',
      qualification: 'NIVEL 3 (UEFA PRO)',
      euskera_level: 'MEDIO',
      photo_url: '',
      experience: []
    });
    setShowEditModal(true);
  };

  const handleEdit = (coach: Coach) => {
    setEditingCoach({ ...coach });
    setShowEditModal(true);
  };

  const handleSaveCoach = async () => {
    if (!editingCoach.name || !editingCoach.role) return alert("Nombre y Cargo requeridos");
    
    setIsSaving(true);
    try {
      const payload = {
        name: editingCoach.name,
        birth_date: editingCoach.birth_date,
        team_id: editingCoach.team_id,
        role: editingCoach.role,
        qualification: editingCoach.qualification,
        euskera_level: editingCoach.euskera_level,
        photo_url: editingCoach.photo_url,
        bio: editingCoach.bio,
        experience: editingCoach.experience || []
      };

      if (editingCoach.id) {
        const { error } = await supabase.from('coaches').update(payload).eq('id', editingCoach.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('coaches').insert([payload]);
        if (error) throw error;
      }
      
      await fetchCoaches();
      setShowEditModal(false);
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCoach = async (id: string) => {
    if (confirm("¿Eliminar definitivamente a este técnico de la base de datos Cloud?")) {
      try {
        const { error } = await supabase.from('coaches').delete().eq('id', id);
        if (error) throw error;
        await fetchCoaches();
        setShowEditModal(false);
      } catch (err: any) {
        alert("Error al borrar: " + err.message);
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `coach-${Date.now()}.${fileExt}`;
      const filePath = `staff-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('LEZAMA').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('LEZAMA').getPublicUrl(filePath);
      setEditingCoach(prev => ({ ...prev, photo_url: data.publicUrl }));
    } catch (err: any) {
      alert("Error subiendo imagen: " + err.message);
    }
  };

  const handleOpenEval = (coach: Coach) => {
    setSelectedCoachForEval(coach);
    setEvalData({ matchDirection: 'green', charisma: 'green', organization: 'green', observations: '' });
  };

  const handleSaveEval = () => {
    alert(`Evaluación guardada localmente para ${selectedCoachForEval?.name}.`);
    setSelectedCoachForEval(null);
  };

  const TrafficLightInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex flex-col space-y-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{label}</span>
        <div className="flex space-x-6 justify-center">
            <button onClick={() => onChange('green')} className={`w-8 h-8 rounded-full border-2 transition-all ${value === 'green' ? 'bg-green-500 border-white scale-110 shadow-[0_0_15px_#22c55e]' : 'bg-green-900/20 border-white/10 hover:bg-green-500/50'}`}></button>
            <button onClick={() => onChange('orange')} className={`w-8 h-8 rounded-full border-2 transition-all ${value === 'orange' ? 'bg-yellow-500 border-white scale-110 shadow-[0_0_15px_#eab308]' : 'bg-yellow-900/20 border-white/10 hover:bg-yellow-500/50'}`}></button>
            <button onClick={() => onChange('red')} className={`w-8 h-8 rounded-full border-2 transition-all ${value === 'red' ? 'bg-red-500 border-white scale-110 shadow-[0_0_15px_#ef4444]' : 'bg-red-900/20 border-white/10 hover:bg-yellow-500/50'}`}></button>
        </div>
    </div>
  );

  const CoachTable = ({ coaches }: { coaches: Coach[] }) => (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-[#0a0a0a] text-white/30 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
          <tr>
            <th className="px-8 py-5">Técnico</th>
            <th className="px-6 py-5">Cargo / Función</th>
            <th className="px-6 py-5">Categoría</th>
            <th className="px-8 py-5 text-right">Gestión</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {coaches.map((staff) => (
            <tr key={staff.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                    {staff.photo_url ? (
                      <img src={staff.photo_url} className="w-full h-full object-contain object-bottom" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white uppercase truncate">{staff.name}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="text-[#EE2523] text-[10px] font-black uppercase tracking-widest">{staff.role}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  {TEAMS.find(t => t.id === staff.team_id)?.name || 'Sin equipo'}
                </span>
              </td>
              <td className="px-8 py-5 text-right space-x-2">
                <button 
                  onClick={() => handleOpenEval(staff)}
                  className="bg-white/5 hover:bg-[#EE2523] text-white/30 hover:text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Evaluar
                </button>
                <button 
                  onClick={() => setSelectedCoachForDetail(staff)}
                  className="bg-white/5 hover:bg-white text-white/30 hover:text-black p-2 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
                <button 
                  onClick={() => handleEdit(staff)}
                  className="bg-white/5 hover:bg-white/10 text-white/10 hover:text-white p-2 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCoachCard = (staff: Coach) => (
    <div key={staff.id} className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/20 transition-all flex flex-col relative shadow-xl">
      <button 
        onClick={() => handleEdit(staff)}
        className="absolute top-4 right-4 text-white/20 hover:text-white z-10 bg-black/50 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
      >
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
      </button>

      <div className="flex p-5 gap-5 items-center border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
         <div className="w-20 h-24 rounded-2xl bg-[#0a0a0a] border-2 border-white/10 overflow-hidden shrink-0 relative group/photo shadow-2xl">
            {staff.photo_url ? (
              <img src={staff.photo_url} alt={staff.name} className="w-full h-full object-contain object-bottom" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10">
                 <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
            )}
         </div>
         <div className="min-w-0">
            <h3 className="text-sm font-bold text-white uppercase leading-tight mb-1 truncate">{staff.name}</h3>
            <span className="text-[#EE2523] text-[9px] font-black uppercase tracking-[0.2em]">{staff.role}</span>
            <p className="text-white/40 text-[9px] mt-1 font-bold uppercase tracking-widest">
              {TEAMS.find(t => t.id === staff.team_id)?.name || 'Sin equipo'}
            </p>
         </div>
      </div>

      <div className="p-5 grid grid-cols-2 gap-4 flex-1">
         <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Fecha Nacimiento</p>
            <p className="text-white font-bold text-xs">{staff.birth_date || '-'}</p>
         </div>
         <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Titulación</p>
            <p className="text-white font-bold text-[10px] uppercase truncate" title={staff.qualification}>{staff.qualification}</p>
         </div>
         <div className="bg-black/20 p-3 rounded-xl border border-white/5 col-span-2 flex justify-between items-center">
            <div>
               <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Dominio Euskera</p>
               <p className="text-white font-bold text-xs uppercase">{staff.euskera_level}</p>
            </div>
            <div className={`w-4 h-4 rounded-full ${getEuskeraColor(staff.euskera_level)}`}></div>
         </div>
      </div>

      <div className="p-5 pt-0 mt-auto flex gap-2">
         <button 
           onClick={() => handleOpenEval(staff)}
           className="flex-1 bg-white/5 hover:bg-[#EE2523] hover:text-white text-white/60 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 group-hover:border-transparent flex items-center justify-center gap-2"
         >
            evaluar
         </button>
         <button 
           onClick={() => setSelectedCoachForDetail(staff)}
           className="bg-white text-black p-3 rounded-xl hover:bg-[#EE2523] hover:text-white transition-all shadow-lg active:scale-95"
         >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
         </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight uppercase italic">Cuerpo <span className="text-[#EE2523]">Técnico</span></h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Dirección de Metodología • Lezama Cloud</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-white/10 shadow-xl shrink-0">
               <button onClick={() => setViewMode('TABLE')} className={`p-2 px-4 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest ${viewMode === 'TABLE' ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>Tabla</button>
               <button onClick={() => setViewMode('GRID')} className={`p-2 px-4 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest ${viewMode === 'GRID' ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>Mosaico</button>
            </div>
            <button 
              onClick={handleAddNew}
              className="bg-[#EE2523] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-red-600 transition-all flex items-center gap-2"
            >
              nuevo alta
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-[#EE2523] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-16">
          {TEAMS.map((team) => {
            const teamCoaches = staffList.filter(c => c.team_id === team.id);
            if (teamCoaches.length === 0) return null;

            return (
              <div key={team.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center">
                    <span className="w-2 h-2 bg-[#EE2523] rounded-full mr-3 shadow-[0_0_10px_#EE2523]"></span>
                    {team.name}
                  </h3>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                {viewMode === 'GRID' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {teamCoaches.map(staff => renderCoachCard(staff))}
                  </div>
                ) : (
                  <CoachTable coaches={teamCoaches} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DETALLE 360 MODAL */}
      {selectedCoachForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-[#111111] border border-white/10 rounded-[40px] w-full max-w-4xl relative shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[90vh]">
              <div className="w-full lg:w-2/5 bg-gradient-to-b from-[#1a1a1a] to-black p-10 flex flex-col items-center justify-center border-r border-white/5 relative">
                 <div className="relative group">
                    <div className="w-64 h-64 rounded-full border-4 border-[#EE2523] bg-black shadow-2xl overflow-hidden relative z-10 flex items-end justify-center">
                       {selectedCoachForDetail.photo_url ? (
                          <img src={selectedCoachForDetail.photo_url} className="w-full h-full object-contain object-bottom" alt="" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10"><svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                       )}
                    </div>
                 </div>
              </div>
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto scrollbar-hide space-y-10">
                 <div className="flex justify-between items-start">
                    <div>
                       <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">{selectedCoachForDetail.name}</h2>
                       <p className="text-[#EE2523] font-black text-sm uppercase tracking-[0.3em] mt-2">{selectedCoachForDetail.role}</p>
                    </div>
                    <button onClick={() => setSelectedCoachForDetail(null)} className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5"><span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Equipo</span><span className="text-white font-bold text-xs uppercase">{TEAMS.find(t => t.id === selectedCoachForDetail.team_id)?.name}</span></div>
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5"><span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Titulación</span><span className="text-white font-bold text-[10px] uppercase">{selectedCoachForDetail.qualification}</span></div>
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5"><span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Euskera</span><div className="flex items-center gap-2"><span className="text-white font-bold text-xs uppercase">{selectedCoachForDetail.euskera_level}</span><div className={`w-2 h-2 rounded-full ${getEuskeraColor(selectedCoachForDetail.euskera_level)}`}></div></div></div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-[32px] w-full max-w-2xl relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-white/5 bg-[#121212] flex justify-between items-center">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Ficha <span className="text-[#EE2523]">Técnica</span></h3>
                 <button onClick={() => setShowEditModal(false)} className="text-white/20 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2">Nombre Completo</label><input type="text" value={editingCoach.name} onChange={e => setEditingCoach({...editingCoach, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EE2523] outline-none" /></div>
                    <div><label className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2">Cargo</label><select value={editingCoach.role} onChange={e => setEditingCoach({...editingCoach, role: e.target.value as Role})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#EE2523] outline-none"><option value="PRIMER ENTRENADOR">Primer Entrenador</option><option value="SEGUNDO ENTRENADOR">Segundo Entrenador</option></select></div>
                 </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-[#121212] flex justify-end gap-2">
                 <button onClick={() => setShowEditModal(false)} className="text-white/40 text-[10px] font-black uppercase tracking-widest px-4 hover:text-white">cancelar</button>
                 <button onClick={handleSaveCoach} className="bg-[#EE2523] hover:bg-red-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95">{isSaving ? 'Guardando...' : 'Guardar Datos'}</button>
              </div>
           </div>
        </div>
      )}

      {/* EVALUATION MODAL */}
      {selectedCoachForEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-[#1a1a1a] border border-white/10 rounded-[32px] w-full max-w-2xl relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-white/5 bg-[#121212] flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Evaluación <span className="text-[#EE2523]">Técnica</span></h3>
                    <p className="text-[#EE2523] text-[10px] font-black uppercase tracking-[0.25em] mt-1">{selectedCoachForEval.name}</p>
                 </div>
                 <button onClick={() => setSelectedCoachForEval(null)} className="text-white/20 hover:text-white transition-colors"><svg className="w-5 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TrafficLightInput label="Dirección de Partido" value={evalData.matchDirection} onChange={(v) => setEvalData({...evalData, matchDirection: v})} />
                    <TrafficLightInput label="Liderazgo" value={evalData.charisma} onChange={(v) => setEvalData({...evalData, charisma: v})} />
                    <TrafficLightInput label="Organización" value={evalData.organization} onChange={(v) => setEvalData({...evalData, organization: v})} />
                 </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-[#121212] flex justify-end"><button onClick={handleSaveEval} className="bg-[#EE2523] hover:bg-red-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95">Finalizar Evaluación</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CoachView;

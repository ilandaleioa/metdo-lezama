
import React, { useState, useEffect } from 'react';
import ReportForm from './ReportForm';
import { TEAMS } from '../../constants';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

interface SavedReport {
  id: string;
  player_id: string;
  month: string;
  data: any;
  created_at: string;
}

const TARGET_MONTHS = ['OCTUBRE', 'ENERO', 'ABRIL', 'JUNIO'];

const DIMENSIONS = [
    { key: 'behavior', label: 'Comportamiento' },      
    { key: 'availability', label: 'Disponibilidad' },  
    { key: 'participation', label: 'Participación' }, 
    { key: 'performance', label: 'Rendimiento' },   
    { key: 'environment', label: 'Entorno' },   
    { key: 'academic', label: 'Académico' },      
    { key: 'social', label: 'Social' },       
    { key: 'improvement', label: 'Mejora' }    
];

const TrackingContainer: React.FC<{ playerId?: string, teamId?: string }> = ({ playerId, teamId }) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [view, setView] = useState<'TIMELINE' | 'FORM'>('TIMELINE');
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [activeDetail, setActiveDetail] = useState<{label: string, status: string, comment: string, month: string} | null>(null);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(teamId || TEAMS[0].id);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(playerId || '');

  useEffect(() => {
    supabase.from('players').select('*').order('dorsal', { ascending: true }).then(({ data }) => {
      if (data) {
        setPlayers(data as Player[]);
        if (playerId) {
          const p = data.find(x => x.id === playerId);
          if (p) {
            setSelectedTeamId(p.team_id);
            setSelectedPlayerId(p.id);
          }
        }
      }
    });
  }, [playerId]);

  useEffect(() => {
    if (!selectedPlayerId) return;
    const fetchReports = async () => {
      setLoading(true);
      const { data } = await supabase.from('tracking_reports').select('*').eq('player_id', selectedPlayerId);
      if (data) {
        setReports(data.sort((a, b) => TARGET_MONTHS.indexOf(a.month) - TARGET_MONTHS.indexOf(b.month)));
      }
      setLoading(false);
    };
    fetchReports();
  }, [selectedPlayerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return '#22C55E';
      case 'yellow': return '#EAB308';
      case 'red': return '#EF4444';
      default: return '#333333';
    }
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500 pb-10">
      
      {!playerId && (
          <div className="flex flex-col sm:flex-row gap-2">
             <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {TEAMS.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTeamId(t.id); setSelectedPlayerId(''); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedTeamId === t.id ? 'bg-[#EE2523] text-white' : 'text-white/30 hover:text-white'}`}>{t.name}</button>
                ))}
             </div>
             <select 
                className="bg-[#1a1a1a] text-white text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-2 border border-white/5 outline-none focus:border-[#EE2523] flex-1"
                value={selectedPlayerId}
                onChange={(e) => { setSelectedPlayerId(e.target.value); setView('TIMELINE'); }}
             >
                <option value="">SELECCIONAR JUGADOR...</option>
                {players.filter(p => p.team_id === selectedTeamId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
          </div>
      )}

      {!selectedPlayerId ? (
        <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-[32px]">
           <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">Selecciona un perfil para ver el seguimiento</p>
        </div>
      ) : (
        <div className="space-y-2">
          {view === 'FORM' ? (
             <ReportForm onSave={() => setView('TIMELINE')} initialData={editingReport} defaultPlayerId={selectedPlayerId} />
          ) : (
            <>
              <div className="flex justify-end mb-2">
                  <button onClick={() => { setEditingReport(null); setView('FORM'); }} className="bg-white text-black px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M12 4v16m8-8H4"></path></svg>
                      AÑADIR BLOQUE
                  </button>
              </div>

              <div className="space-y-2">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 px-6 shadow-lg hover:border-[#EE2523]/50 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-center gap-2.5 shrink-0 border-r border-white/5 pr-6 w-36">
                          <span className="bg-[#EE2523] text-white text-[13px] font-black px-4 py-3 rounded-xl uppercase tracking-tighter w-full text-center shadow-lg">
                            {report.month}
                          </span>
                          <button 
                            onClick={() => { setEditingReport({...report.data, id: report.id, playerId: report.player_id, month: report.month}); setView('FORM'); }} 
                            className="text-white/20 hover:text-[#EE2523] flex items-center gap-2 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">EDIT</span>
                          </button>
                       </div>

                       <div className="flex-1 grid grid-cols-8 gap-1.5 min-w-[900px]">
                          {DIMENSIONS.map((dim, idx) => {
                             const status = report.data[`${dim.key}Status`] || 'neutral';
                             const color = getStatusColor(status);
                             return (
                                 <div 
                                    key={idx} 
                                    onClick={() => setActiveDetail({ label: dim.label, status, comment: report.data[`${dim.key}Comment`] || 'Sin notas.', month: report.month })} 
                                    className="bg-black/50 py-7 px-1 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-3.5 cursor-pointer hover:bg-black/70 hover:border-[#EE2523]/30 transition-all group/item overflow-hidden"
                                  >
                                    <div className="w-4 h-4 rounded-full shrink-0 shadow-[0_0_12px_rgba(0,0,0,0.6)] border border-white/20" style={{ backgroundColor: color }}></div>
                                    <span className="text-[11.5px] font-black text-white/50 uppercase tracking-tighter w-full text-center group-hover/item:text-white transition-colors leading-[1.1] break-words px-2">
                                      {dim.label}
                                    </span>
                                 </div>
                             );
                          })}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeDetail && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl p-10 relative">
                <button onClick={() => setActiveDetail(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-all scale-125">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-6 h-6 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/10" style={{ backgroundColor: getStatusColor(activeDetail.status) }}></div>
                   <div>
                      <h4 className="text-4xl font-black text-white uppercase italic leading-none tracking-tighter">{activeDetail.label}</h4>
                      <p className="text-[#EE2523] text-[12px] font-black uppercase tracking-[0.4em] mt-2">{activeDetail.month}</p>
                   </div>
                </div>
                <div className="bg-black/60 p-8 rounded-[32px] border border-white/5 shadow-inner">
                  <p className="text-white/80 text-[16px] italic leading-relaxed font-light">"{activeDetail.comment}"</p>
                </div>
                <button onClick={() => setActiveDetail(null)} className="w-full mt-10 bg-white text-black font-black py-5 rounded-2xl text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                  CERRAR EXPEDIENTE
                </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default TrackingContainer;


import React, { useState, useEffect } from 'react';
import ReportsTable from './ReportsTable';
import ReportsForm from './ReportsForm';
import ReportPreview from './ReportPreview';
import { TEAMS, MOCK_PLAYERS } from '../../constants';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

export interface TechnicalReport {
  id: string;
  player_id: string;
  playerName?: string;
  playerPhoto?: string;
  playerDorsal?: string;
  playerTeamName?: string;
  team_id: string;
  month: string;
  data: {
    laterality: string;
    position: string;
    familySituation: string;
    socialRelationship: string;
    weeklyOrganization: string;
    learningCapacity: string;
    academicSituation: string;
    currentMoment: string;
    description: string;
  };
  created_at: string;
}

interface ReportsContainerProps {
  playerId?: string;
  teamId?: string;
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({ playerId, teamId }) => {
  const [reports, setReports] = useState<TechnicalReport[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [view, setView] = useState<'LIST' | 'FORM' | 'PREVIEW'>('LIST');
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState<TechnicalReport | null>(null);
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>(teamId || 'ALL');

  const fetchData = async () => {
    setLoading(true);
    let playersList: Player[] = [];
    const { data: dbPlayers } = await supabase.from('players').select('*');
    playersList = dbPlayers && dbPlayers.length > 0 ? dbPlayers : Object.values(MOCK_PLAYERS).flat();
    setPlayers(playersList);

    let query = supabase.from('technical_reports').select('*');
    if (playerId) query = query.eq('player_id', playerId);
    else {
      if (monthFilter !== 'ALL') query = query.eq('month', monthFilter);
      if (teamFilter !== 'ALL') query = query.eq('team_id', teamFilter);
    }
    
    const { data: reportsData } = await query.order('created_at', { ascending: false });
    const finalReports = reportsData || [];

    const mappedReports = finalReports.map(r => {
      const player = playersList.find(p => p.id === r.player_id);
      const team = TEAMS.find(t => t.id === r.team_id);
      return {
        ...r,
        playerName: player?.name || 'Jugador no encontrado',
        playerPhoto: player?.photo_url || player?.photoUrl || 'https://via.placeholder.com/150',
        playerDorsal: player?.dorsal || 'N/A',
        playerTeamName: team?.name || 'Desconocido'
      };
    });

    setReports(mappedReports);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [monthFilter, teamFilter, playerId]);

  const handleSave = async (reportData: any) => {
    const { playerId, teamId, month, ...dataFields } = reportData;
    const payload = { player_id: playerId, team_id: teamId, month: month, data: dataFields };
    if (activeReport && view === 'FORM') {
      await supabase.from('technical_reports').update(payload).eq('id', activeReport.id);
    } else {
      await supabase.from('technical_reports').insert([payload]);
    }
    setView('LIST');
    setActiveReport(null);
    fetchData();
  };

  const handlePreview = (report: TechnicalReport) => {
    setActiveReport(report);
    setView('PREVIEW');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* FILTROS SUPERIORES "QUIET" */}
      {view === 'LIST' && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 items-center">
              {!teamId && (
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                   <button onClick={() => setTeamFilter('ALL')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${teamFilter === 'ALL' ? 'bg-[#EE2523] text-white' : 'text-white/30 hover:text-white'}`}>TODO</button>
                   {TEAMS.map(t => (
                     <button key={t.id} onClick={() => setTeamFilter(t.id)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${teamFilter === t.id ? 'bg-[#EE2523] text-white' : 'text-white/30 hover:text-white'}`}>{t.name}</button>
                   ))}
                </div>
              )}
              {!playerId && (
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {['ALL', 'OCTUBRE', 'ENERO', 'ABRIL'].map((m) => (
                    <button key={m} onClick={() => setMonthFilter(m)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${monthFilter === m ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>
                      {m === 'ALL' ? 'MESES' : m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
                {view !== 'LIST' ? (
                    <button onClick={() => setView('LIST')} className="bg-white/5 text-white/40 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all border border-white/5">CERRAR</button>
                ) : (
                    <button onClick={() => { setActiveReport(null); setView('FORM'); }} className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-[10px] shadow-xl uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M12 4v16m8-8H4"></path></svg>
                        NUEVO INFORME
                    </button>
                )}
            </div>
        </div>
      )}

      {view === 'LIST' && (
        <div className="pt-2">
          {(playerId || teamId) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {reports.map((report) => (
                  <div key={report.id} onClick={() => handlePreview(report)} className="bg-[#1a1a1a] rounded-[24px] p-6 border border-white/5 hover:border-[#EE2523]/40 cursor-pointer group transition-all hover:shadow-2xl">
                     <div className="flex justify-between items-start mb-4">
                        <span className="bg-[#EE2523] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">{report.month}</span>
                        <span className="text-white/20 text-[8px] font-black uppercase">{new Date(report.created_at).toLocaleDateString()}</span>
                     </div>
                     <h3 className="text-lg font-black text-white uppercase mb-2 group-hover:text-[#EE2523] transition-colors">{report.playerName}</h3>
                     <p className="text-white/40 text-[11px] line-clamp-2 italic mb-6 font-medium">"{report.data.description || report.data.currentMoment || 'Sin resumen registrado.'}"</p>
                     <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                        <img src={report.playerPhoto} className="w-6 h-6 rounded-full border border-white/10 bg-black/40 object-contain" alt="" />
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/60">VER EXPEDIENTE</span>
                     </div>
                  </div>
               ))}
            </div>
          ) : (
             <ReportsTable reports={reports} onEdit={(r) => { setActiveReport(r); setView('FORM'); }} onDelete={async (id) => { if(confirm('¿Eliminar?')){ await supabase.from('technical_reports').delete().eq('id', id); fetchData(); } }} onPreview={handlePreview} />
          )}

          {reports.length === 0 && !loading && (
             <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[32px]">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Sin expedientes registrados</p>
             </div>
          )}
        </div>
      )}

      {view === 'FORM' && <ReportsForm onSave={handleSave} initialData={activeReport || undefined} defaultPlayerId={playerId} />}
      {view === 'PREVIEW' && activeReport && <ReportPreview report={activeReport} />}
    </div>
  );
};

export default ReportsContainer;

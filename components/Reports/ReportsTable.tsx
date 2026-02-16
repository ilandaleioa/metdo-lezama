
import React from 'react';
import { TechnicalReport } from './ReportsContainer';
import { TEAMS } from '../../constants';

interface ReportsTableProps {
  reports: TechnicalReport[];
  onEdit: (report: TechnicalReport) => void;
  onDelete: (id: string) => void;
  onPreview: (report: TechnicalReport) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onEdit, onDelete, onPreview }) => {
  const getTeamName = (id: string) => TEAMS.find(t => t.id === id)?.name || 'Cat. Desconocida';

  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center">
        <h3 className="font-bold text-white uppercase tracking-widest text-[9px] flex items-center">
          <span className="w-2 h-2 bg-[#EE2523] rounded-full mr-2 shadow-[0_0_8px_rgba(238,37,35,0.4)]"></span>
          Base de Datos de Informes (Cloud)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0f0f0f]/50 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-6 py-5">Equipo</th>
              <th className="px-6 py-5">Jugador</th>
              <th className="px-6 py-5">Mes</th>
              <th className="px-6 py-5">Posición</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-6 text-white/40 text-[10px] font-bold uppercase">{getTeamName(report.team_id)}</td>
                <td className="px-6 py-6">
                  <div className="flex items-center space-x-3">
                    <img src={report.playerPhoto} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                    <span className="text-white font-bold text-sm">{report.playerName}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="text-[#EE2523] text-[9px] font-black uppercase bg-[#EE2523]/10 px-2 py-1 rounded">{report.month}</span>
                </td>
                <td className="px-6 py-6 text-white/60 text-xs font-bold uppercase">{report.data?.position}</td>
                <td className="px-6 py-6 text-right space-x-1">
                  <button onClick={() => onPreview(report)} className="text-white/20 hover:text-green-500 transition-colors p-2 rounded-lg hover:bg-white/5" title="Vista Previa">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button onClick={() => onEdit(report)} className="text-white/20 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button onClick={() => onDelete(report.id)} className="text-white/10 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;

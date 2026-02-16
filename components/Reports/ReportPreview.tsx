
import React from 'react';
import { TechnicalReport } from './ReportsContainer';

interface ReportPreviewProps {
  report: TechnicalReport;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report }) => {
  const Section = ({ title, content }: { title: string; content: string }) => (
    <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <h4 className="text-[#EE2523] text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-3 border-l-4 border-[#EE2523] pl-4">
        {title}
      </h4>
      <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-2xl backdrop-blur-sm">
        <p className="text-white/80 text-xs md:text-sm leading-relaxed whitespace-pre-wrap italic font-light">
          "{content || 'Sin observaciones registradas en este apartado.'}"
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20">
      {/* Dossier Header */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl md:rounded-[40px] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none hidden md:block">
          <span className="text-[14rem] font-black italic tracking-tighter">ATH</span>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <div className="flex items-center space-x-3 mb-6 justify-center lg:justify-start">
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-8 md:w-12 h-auto" alt="" />
              <div className="h-6 w-[1px] bg-white/10"></div>
              <span className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Informe Oficial 360º</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2 break-words w-full">
              {report.playerName}
            </h1>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mt-4 md:mt-6">
              <span className="bg-[#EE2523] text-white text-[8px] md:text-[10px] font-black px-3 md:px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-red-600/20">
                DORSAL {report.playerDorsal}
              </span>
              <span className="bg-white/5 text-white/60 text-[8px] md:text-[10px] font-black px-3 md:px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                {report.data?.position}
              </span>
              <span className="bg-white/5 text-white/60 text-[8px] md:text-[10px] font-black px-3 md:px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                LATER. {report.data?.laterality || 'N/A'}
              </span>
            </div>
            
            <div className="mt-8 md:mt-10 grid grid-cols-2 gap-8 md:gap-12 w-full max-w-sm mx-auto lg:mx-0">
              <div>
                <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest">CATEGORÍA</p>
                <p className="text-white font-bold text-sm md:text-base uppercase mt-1">{report.playerTeamName}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest">PERIODO</p>
                <p className="text-[#EE2523] font-bold text-sm md:text-base uppercase mt-1">{report.month}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-tr from-[#EE2523] to-transparent rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <img 
                src={report.playerPhoto} 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-[30px] md:rounded-[40px] object-cover border-4 border-[#121212] shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700" 
                alt={report.playerName} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Body */}
      <div className="bg-[#111111] rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-16 gap-6">
          <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center">
            <span className="w-1.5 md:w-2 h-6 md:h-8 bg-[#EE2523] mr-4 md:mr-5 rounded-full shadow-[0_0_15px_#EE2523]"></span>
            ANÁLISIS CUALITATIVO
          </h3>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 self-start md:self-auto">
             <span className="block text-[7px] font-black text-white/20 uppercase">VALIDEZ</span>
             <span className="text-green-500 text-[9px] font-black">OFICIAL CLOUD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          <div className="space-y-2">
            <Section title="01. Situación Familiar" content={report.data?.familySituation} />
            <Section title="02. Relación Social" content={report.data?.socialRelationship} />
            <Section title="03. Organización Semanal" content={report.data?.weeklyOrganization} />
          </div>
          <div className="space-y-2">
            <Section title="04. Capacidad de Aprendizaje" content={report.data?.learningCapacity} />
            <Section title="05. Situación Académica" content={report.data?.academicSituation} />
            <Section title="06. Momento Actual y Objetivos" content={report.data?.currentMoment} />
          </div>
        </div>

        <div className="mt-12 md:mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6 md:space-x-8">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">FECHA</span>
              <span className="text-white/60 text-[10px] md:text-xs font-bold">{new Date(report.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">AUTORIZACIÓN</span>
              <span className="text-white font-black text-[9px] md:text-[10px] tracking-widest">DT LEZAMA</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 opacity-30">
            <p className="text-[7px] font-black text-white uppercase tracking-[0.3em] text-right">
              Gure estiloa<br/>Gure indarra
            </p>
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-8 h-auto grayscale" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;

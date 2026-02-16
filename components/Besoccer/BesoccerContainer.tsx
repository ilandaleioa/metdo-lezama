
import React from 'react';

const BesoccerContainer: React.FC = () => {
  const besoccerUrl = "https://es.besoccer.com/equipo/athletic-bilbao-b";

  const KpiCard = ({ label, value, trend }: { label: string, value: string, trend: string }) => (
    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:bg-white/[0.05] transition-all">
      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <span className="text-[10px] text-[#83f52c] font-bold bg-[#83f52c]/10 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12 h-full flex flex-col">
      {/* Header con Branding BeSoccer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-[#83f52c] p-2 rounded-xl shadow-lg shadow-[#83f52c]/20">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">BeSoccer</h2>
              <span className="bg-[#83f52c] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">PRO DATA</span>
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">Sincronización de Inteligencia Externa • Bilbao Athletic</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#121212] bg-white/10 flex items-center justify-center text-[8px] font-bold">A</div>
            ))}
          </div>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">3 Analistas Conectados</span>
        </div>
      </div>

      {/* Main Bridge UI */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
               <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center">
                <span className="w-2 h-2 bg-[#83f52c] rounded-full mr-3 animate-pulse"></span>
                Instantánea de Rendimiento (Real-Time)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <KpiCard label="xG (Goles Esperados)" value="1.84" trend="+12%" />
                <KpiCard label="Duelos Ganados %" value="62.4%" trend="+4.1%" />
                <KpiCard label="PPDA (Presión)" value="8.4" trend="-0.5" />
                <KpiCard label="Pases Progresivos" value="48.2" trend="+8.4" />
                <KpiCard label="Recuperaciones Campo Rival" value="12.8" trend="+2" />
                <KpiCard label="Eficacia Remate" value="14.5%" trend="+1.2%" />
              </div>

              <div className="mt-10 p-6 bg-black/40 rounded-2xl border border-white/5 border-dashed">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Estado de la Conexión</span>
                  <span className="text-[10px] font-bold text-[#83f52c] uppercase">Segura (Encrypted)</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Debido a protocolos de seguridad de <strong>BeSoccer Pro</strong>, el panel completo debe abrirse en una ventana de alta resolución independiente para garantizar la integridad de los datos de scouting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Action & Secondary Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#83f52c] to-[#4ea31a] rounded-3xl p-1 shadow-2xl shadow-[#83f52c]/20">
            <div className="bg-[#0a0a0a] rounded-[22px] p-8 h-full flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#83f52c]/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-[#83f52c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <h4 className="text-white font-black uppercase tracking-widest text-lg mb-3">Lanzar Suite Completa</h4>
              <p className="text-white/40 text-xs mb-8 leading-relaxed px-4">
                Accede a la base de datos completa, comparación de jugadores y rankings mundiales.
              </p>
              <a 
                href={besoccerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#83f52c] text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#83f52c]/30"
              >
                Abrir BeSoccer Pro
              </a>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6">
            <h5 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4 text-center">Herramientas de Scouting</h5>
            <div className="space-y-2">
              {['Ranking de Filiales', 'Radar de Talento', 'Informe de Rivales', 'Mapa de Calor Pro'].map(tool => (
                <div key={tool} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#83f52c]/50 transition-colors cursor-pointer">
                  <span className="text-[10px] text-white/60 font-bold uppercase">{tool}</span>
                  <svg className="w-3 h-3 text-white/20 group-hover:text-[#83f52c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BesoccerContainer;

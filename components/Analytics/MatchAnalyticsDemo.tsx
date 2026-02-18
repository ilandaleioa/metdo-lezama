
import React, { useState, useMemo } from 'react';
import { TEAMS } from '../../constants';
import { translations } from '../../translations';

const ANALYTICS_DATA_RAW = [
  { id: '1', teamId: '2', playerId: 'J101', playerName: 'Adama Boiro', role: 'TITULAR', minutes: 1850, goals: 2, yellow: 3 },
  { id: '2', teamId: '2', playerId: 'J102', playerName: 'Mikel Jauregizar', role: 'TITULAR', minutes: 2100, goals: 4, yellow: 2 },
  { id: '3', teamId: '2', playerId: 'J103', playerName: 'Aingeru Olabarrieta', role: 'SUPLENTE', minutes: 650, goals: 3, yellow: 0 },
];

const MatchAnalyticsDemo: React.FC<{ language?: string }> = ({ language = 'ES' }) => {
  const t = translations[language] || translations['ES'];
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);

  const playerStats = useMemo(() => {
    return ANALYTICS_DATA_RAW
      .filter(d => d.teamId === selectedTeamId)
      .sort((a, b) => b.minutes - a.minutes);
  }, [selectedTeamId]);

  const maxMinutes = Math.max(...playerStats.map(p => p.minutes), 2800);

  const FilterSelect = ({ label, options }: { label: string, options: string[] }) => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
      <label className="text-[8px] font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>
      <select className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] font-bold uppercase outline-none focus:border-[#EE2523] transition-all cursor-pointer appearance-none">
        <option>{language === 'EU' ? 'Denak' : 'Todos'}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-[#111111] border border-white/5 p-5 rounded-[24px] shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <FilterSelect label={t.ana_filter_gender} options={language === 'EU' ? ['Gizonezkoa', 'Emakumezkoa'] : ['Masculino', 'Femenino']} />
          <FilterSelect label={t.ana_filter_status} options={language === 'EU' ? ['Erabilgarri', 'Baja', 'Zalantza'] : ['Disponible', 'Baja', 'Duda']} />
          <FilterSelect label={t.ana_filter_context} options={language === 'EU' ? ['Etxean', 'Kanpoan'] : ['Local', 'Visitante']} />
          <FilterSelect label={t.ana_filter_type} options={language === 'EU' ? ['Ofiziala', 'Lagunartekoa'] : ['Oficial', 'Amistoso']} />
          <FilterSelect label={t.ana_filter_comp} options={['Liga', 'Kopa', 'Torneo']} />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-6 bg-[#EE2523] rounded-full"></div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{t.ana_title_minutes}</h3>
        </div>
        <div className="space-y-3">
          {playerStats.map((p) => (
            <div key={p.id} className="flex items-center group">
              <div className="w-[140px] text-right pr-4 shrink-0">
                <span className="text-[10px] font-black text-white/40 uppercase group-hover:text-white transition-colors truncate block">{p.playerName}</span>
              </div>
              <div className="flex-1 h-4 bg-white/5 rounded-r-sm overflow-hidden relative">
                <div style={{ width: `${(p.minutes / maxMinutes) * 100}%` }} className="h-full bg-[#EE2523] transition-all duration-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchAnalyticsDemo;

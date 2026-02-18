
import React, { useState } from 'react';
import { TEAMS } from '../../constants';
import { translations } from '../../translations';

type EventType = 'PARTIDO' | 'SESION' | 'INTERNO';

interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  team: string;
  date: string;
  time: string;
  location: string;
}

const generateFebruaryEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const teams = ['Bilbao Athletic', 'Basconia', 'Femenino A', 'Juvenil B'];
  for (let day = 1; day <= 28; day++) {
    const dayOfWeek = (day + 5) % 7; 
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const dateStr = `${day < 10 ? '0' + day : day} FEB`;

    if (isWeekend) {
      events.push({
        id: `match-${day}`,
        type: 'PARTIDO',
        title: 'Partido Oficial',
        team: teams[day % 4],
        date: dateStr,
        time: dayOfWeek === 6 ? '12:00' : '18:30',
        location: 'Lezama'
      });
    } else {
      events.push({
        id: `train-${day}`,
        type: 'SESION',
        title: 'Entrenamiento',
        team: teams[(day + 1) % 4],
        date: dateStr,
        time: '10:30',
        location: 'Campo 3'
      });
    }
    if (day % 10 === 0) {
        events.push({
            id: `internal-${day}`,
            type: 'INTERNO',
            title: 'Staff Técnico',
            team: 'Staff Técnico',
            date: dateStr,
            time: '09:00',
            location: 'Oficinas'
        });
    }
  }
  return events;
};

const MOCK_EVENTS = generateFebruaryEvents();

const ActivitiesCalendar: React.FC<{ language?: string }> = ({ language = 'ES' }) => {
  const t = translations[language] || translations['ES'];
  const [filterType, setFilterType] = useState<EventType | 'ALL'>('ALL');
  const [filterTeam, setFilterTeam] = useState<string>('ALL');

  const filteredEvents = MOCK_EVENTS.filter(e => {
    const typeMatch = filterTeam === 'ALL' || e.team === filterTeam;
    const teamMatch = filterType === 'ALL' || e.type === filterType;
    return typeMatch && teamMatch;
  });

  const getEventStyles = (type: EventType) => {
    switch (type) {
      case 'PARTIDO': return { bg: 'bg-[#EE2523]/10', border: 'border-[#EE2523]', indicator: 'bg-[#EE2523]' };
      case 'SESION': return { bg: 'bg-green-500/10', border: 'border-green-500', indicator: 'bg-green-500' };
      case 'INTERNO': return { bg: 'bg-blue-500/10', border: 'border-blue-500', indicator: 'bg-blue-500' };
    }
  };

  const daysOfWeek = t.cal_days;
  const startDayOffset = 6; 
  const daysInMonth = 28; 

  const renderCalendarCell = (day: number) => {
    const dayEvents = filteredEvents.filter(e => parseInt(e.date.split(' ')[0]) === day);
    const isToday = day === 14; 

    return (
      <div key={day} className="bg-[#111111] p-3 border-b border-r border-white/5 relative group hover:bg-[#161616] transition-colors flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-start mb-2">
           <span className={`text-[12px] font-black tracking-tighter ${isToday ? 'bg-[#EE2523] text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg' : 'text-white/20'}`}>
             {day}
           </span>
        </div>
        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto scrollbar-hide">
          {dayEvents.map(event => {
            const style = getEventStyles(event.type);
            const labelType = language === 'EU' ? 
              (event.type === 'PARTIDO' ? 'PARTIDUA' : event.type === 'SESION' ? 'SAIOA' : 'BARRUKOA') : 
              event.type;

            return (
              <div key={event.id} className={`w-full text-left p-2 rounded-xl border ${style.bg} ${style.border} border-opacity-20 transition-all hover:bg-opacity-20 cursor-pointer`}>
                 <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${style.indicator}`}></div>
                    <span className="text-[9px] font-black text-white uppercase truncate flex-1">{event.time}</span>
                 </div>
                 <div className="text-white/50 text-[8px] font-black uppercase truncate mt-0.5 tracking-wider">{event.team}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6 animate-in fade-in duration-500 pb-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 shrink-0 px-2">
          <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center italic">
                <span className="w-3 h-3 bg-[#EE2523] rounded-full mr-4 animate-pulse shadow-[0_0_15px_#EE2523]"></span>
                {t.cal_title} <span className="text-[#EE2523] ml-2">LEZAMA</span>
            </h3>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-1 ml-7">{t.cal_subtitle} • {language === 'EU' ? '2026ko Otsaila' : 'Febrero 2026'}</p>
          </div>
          
          <div className="flex bg-[#0d0d0d] border border-white/10 p-1 rounded-[20px] items-center overflow-x-auto scrollbar-hide shadow-2xl">
              {['TODOS', 'BILBAO ATHLETIC', 'BASCONIA', 'FEMENINO A', 'JUVENIL A', 'STAFF'].map(team => {
                const label = language === 'EU' && team === 'TODOS' ? 'DENAK' : team;
                return (
                  <button
                      key={team}
                      onClick={() => setFilterTeam(team === 'TODOS' ? 'ALL' : team)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterTeam === (team === 'TODOS' ? 'ALL' : team) ? 'bg-[#EE2523] text-white shadow-xl' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                      {label}
                  </button>
                );
              })}
          </div>
      </div>
      
      <div className="flex-1 bg-[#111111] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-4 flex flex-col">
        <div className="flex-1 border border-white/5 rounded-[36px] overflow-hidden bg-[#080808] flex flex-col">
             <div className="grid grid-cols-7 bg-[#121212] border-b border-white/5 shrink-0">
                {daysOfWeek.map(day => (
                   <div key={day} className="py-6 text-center text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">{day}</div>
                ))}
             </div>
             
             <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-white/[0.02] gap-px border-l border-t border-white/5">
                {Array.from({ length: startDayOffset }).map((_, i) => (
                   <div key={`empty-${i}`} className="bg-[#0a0a0a] border-b border-r border-white/5 opacity-40"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => renderCalendarCell(i + 1))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesCalendar;


import React, { useState, useEffect } from 'react';
import MatchForm from './MatchForm';
import MatchSheet from './MatchSheet';
import { Match } from '../../types';
import { supabase } from '../../lib/supabase';

const MatchesContainer: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'FORM' | 'DETAILS'>('LIST');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setMatches(data);
    setLoading(false);
  };

  const handleCreate = () => {
    setSelectedMatch(null);
    setView('FORM');
  };

  const handleSelect = (match: Match) => {
    setSelectedMatch(match);
    setView('DETAILS');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Gesti&oacute;n de <span className="text-[#EE2523]">Partidos</span></h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Calendario y Actas Oficiales</p>
        </div>
        {view === 'LIST' && (
          <button 
            onClick={handleCreate}
            className="bg-[#EE2523] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo Partido
          </button>
        )}
        {view !== 'LIST' && (
          <button 
            onClick={() => setView('LIST')}
            className="bg-white/5 text-white/60 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:text-white transition-all"
          >
            Volver al Listado
          </button>
        )}
      </div>

      {view === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center animate-pulse">Cargando encuentros...</div>
          ) : matches.length > 0 ? (
            matches.map(match => (
              <div 
                key={match.id}
                onClick={() => handleSelect(match)}
                className="bg-[#1a1a1a] border border-white/5 rounded-[32px] p-6 hover:border-[#EE2523]/50 transition-all cursor-pointer group shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-white/5 px-3 py-1 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">{match.competition}</span>
                  <span className="text-[10px] font-bold text-[#EE2523]">{new Date(match.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between gap-4 mb-6">
                   <div className="flex-1 text-center">
                      <div className="w-12 h-12 bg-black rounded-full mx-auto mb-2 border border-white/10 overflow-hidden">
                        <img src={match.localLogo || 'https://via.placeholder.com/50'} className="w-full h-full object-contain" alt="" />
                      </div>
                      <p className="text-[10px] font-black text-white uppercase truncate">{match.localTeam}</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white">{match.localGoals}</span>
                      <span className="text-white/20 text-sm">-</span>
                      <span className="text-2xl font-black text-white">{match.visitorGoals}</span>
                   </div>
                   <div className="flex-1 text-center">
                      <div className="w-12 h-12 bg-black rounded-full mx-auto mb-2 border border-white/10 overflow-hidden">
                        <img src={match.visitorLogo || 'https://via.placeholder.com/50'} className="w-full h-full object-contain" alt="" />
                      </div>
                      <p className="text-[10px] font-black text-white uppercase truncate">{match.visitorTeam}</p>
                   </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sistema: {match.system}</span>
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[40px] text-center">
               <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em]">Sin partidos registrados este periodo</p>
            </div>
          )}
        </div>
      )}

      {view === 'FORM' && (
        <MatchForm 
            onSave={() => { fetchMatches(); setView('LIST'); }}
            onCancel={() => setView('LIST')}
        />
      )}

      {view === 'DETAILS' && selectedMatch && (
        <MatchSheet match={selectedMatch} />
      )}
    </div>
  );
};

export default MatchesContainer;

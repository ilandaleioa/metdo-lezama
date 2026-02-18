
import React, { useState, useEffect, useMemo } from 'react';
import { TEAMS } from '../../constants';
import SquadTable from './SquadTable';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import { Team, Player, AvailabilityStatus } from '../../types';
import { supabase } from '../../lib/supabase';
import { translations } from '../../translations';

const SquadsContainer: React.FC<{ onNavigateToPlayer?: (playerId: string) => void, language?: string }> = ({ onNavigateToPlayer, language = 'ES' }) => {
  const t = translations[language] || translations['ES'];
  const [selectedTeam, setSelectedTeam] = useState<Team>(TEAMS[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('GRID');

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPosition, setFilterPosition] = useState<string>('ALL');
  const [filterLaterality, setFilterLaterality] = useState<string>('ALL');
  const [filterYear, setFilterYear] = useState<string>('ALL');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', selectedTeam.id)
        .order('dorsal', { ascending: true });

      if (!error && data) {
        setPlayers(data as Player[]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [selectedTeam.id]);

  const getYearFromDate = (date?: string) => {
    if (!date) return '-';
    const parts = date.split('-');
    if (parts.length === 3 && parts[0].length === 4) return parts[0];
    if (parts.length === 3 && parts[2].length === 4) return parts[2];
    return '-';
  };

  const yearsOptions = useMemo(() => {
    const yrs = players.map(p => getYearFromDate(p.birth_date || p.birthDate)).filter(y => y !== '-');
    return Array.from(new Set(yrs)).sort((a: string, b: string) => b.localeCompare(a));
  }, [players]);

  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.apodo && p.apodo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchesPosition = filterPosition === 'ALL' || p.position === filterPosition;
      const matchesLaterality = filterLaterality === 'ALL' || p.laterality === filterLaterality;
      const matchesYear = filterYear === 'ALL' || getYearFromDate(p.birth_date || p.birthDate) === filterYear;
      
      return matchesSearch && matchesStatus && matchesPosition && matchesLaterality && matchesYear;
    });
  }, [players, searchTerm, filterStatus, filterPosition, filterLaterality, filterYear]);

  const handleSavePlayer = async (playerData: Partial<Player>) => {
    try {
      if (editingPlayer) {
        const { error } = await supabase.from('players').update(playerData).eq('id', editingPlayer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('players').insert([playerData]);
        if (error) throw error;
      }
      setShowAddForm(false);
      setEditingPlayer(null);
      fetchPlayers();
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    }
  };

  const handleDeletePlayer = async (e: React.MouseEvent, player: Player) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar a ${player.name} de la base de datos? / ${player.name} datu-basetik ezabatu?`)) {
      const { error } = await supabase.from('players').delete().eq('id', player.id);
      if (!error) fetchPlayers();
    }
  };

  const handleEditClick = (e: React.MouseEvent, player: Player) => {
    e.stopPropagation();
    setEditingPlayer(player);
    setShowAddForm(true);
  };

  const handlePlayerInteraction = (player: Player) => {
    if (onNavigateToPlayer) onNavigateToPlayer(player.id);
  };

  const getPositionCategory = (position: string) => {
    const p = (position || '').toUpperCase();
    if (p.includes('PORTERO')) return 'PORTEROS';
    if (p.includes('DEFENSA') || p.includes('LATERAL') || p.includes('CENTRAL')) return 'DEFENSAS';
    if (p.includes('CENTRO') || p.includes('MEDIA') || p.includes('PIVOTE')) return 'CENTROCAMPISTAS';
    return 'DELANTEROS';
  };

  const CATEGORIES = ['PORTEROS', 'DEFENSAS', 'CENTROCAMPISTAS', 'DELANTEROS'];
  const groupedPlayers = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredPlayers.filter(p => getPositionCategory(p.position) === cat);
    return acc;
  }, {} as Record<string, Player[]>);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight italic">{t.squad_title.split(' ')[0]} <span className="text-[#EE2523]">{t.squad_title.split(' ')[1]}</span></h2>
          <p className="text-white/50 text-[10px] md:text-sm mt-1 uppercase tracking-widest font-medium">{t.squad_subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/10">
            <button onClick={() => setViewMode('TABLE')} className={`p-2 rounded-lg transition-all ${viewMode === 'TABLE' ? 'bg-white/10 text-white' : 'text-white/20'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2"/></svg></button>
            <button onClick={() => setViewMode('GRID')} className={`p-2 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-white/10 text-white' : 'text-white/20'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h2v2H4zM14 6h2v2h-2zM4 16h2v2H4zM14 16h2v2H4z" strokeWidth="2"/></svg></button>
          </div>
          <button 
            onClick={() => { setEditingPlayer(null); setShowAddForm(!showAddForm); }}
            className="bg-[#EE2523] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
          >
            {showAddForm ? (language === 'EU' ? 'Inprimakia Itxi' : 'Cerrar Formulario') : t.squad_new}
          </button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        {TEAMS.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[9px] font-black transition-all border uppercase tracking-widest ${selectedTeam.id === team.id ? 'bg-[#EE2523] text-white border-[#EE2523] shadow-lg' : 'bg-white/5 text-white/40 border-white/5'}`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* BARRA DE FILTROS DESPLEGABLE */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-[28px] p-5 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
                <input 
                  type="text" 
                  placeholder={t.squad_search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 pl-10 text-[10px] font-black uppercase text-white outline-none focus:border-[#EE2523] transition-all w-full"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none focus:border-[#EE2523] transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">{t.squad_filter_status}</option>
              {Object.values(AvailabilityStatus).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>

            <select 
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none focus:border-[#EE2523] transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">{t.squad_filter_pos}</option>
              <option value="PORTERO">{language === 'EU' ? 'ATEZAINA' : 'PORTERO'}</option>
              <option value="DEFENSA">{language === 'EU' ? 'ATZELARIA' : 'DEFENSA'}</option>
              <option value="CENTROCAMPISTA">{language === 'EU' ? 'ERDIZKARIA' : 'CENTROCAMPISTA'}</option>
              <option value="DELANTERO">{language === 'EU' ? 'AURRELARIA' : 'DELANTERO'}</option>
            </select>

            <select 
              value={filterLaterality}
              onChange={(e) => setFilterLaterality(e.target.value)}
              className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none focus:border-[#EE2523] transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">{t.squad_filter_lat}</option>
              <option value="Diestro">{language === 'EU' ? 'ESKUINA' : 'DIESTRO'}</option>
              <option value="Zurdo">{language === 'EU' ? 'EZKERRA' : 'ZURDO'}</option>
              <option value="Ambas">{language === 'EU' ? 'BIAK' : 'AMBAS'}</option>
            </select>

            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none focus:border-[#EE2523] transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">{t.squad_filter_year}</option>
              {yearsOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(searchTerm || filterStatus !== 'ALL' || filterPosition !== 'ALL' || filterLaterality !== 'ALL' || filterYear !== 'ALL') && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('ALL');
                  setFilterPosition('ALL');
                  setFilterLaterality('ALL');
                  setFilterYear('ALL');
                }}
                className="text-[#EE2523] text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                {t.squad_clean}
              </button>
            </div>
          )}
      </div>

      {showAddForm && (
        <AddPlayerForm 
          teamName={selectedTeam.name} 
          teamId={selectedTeam.id} 
          onSave={handleSavePlayer} 
          onCancel={() => { setShowAddForm(false); setEditingPlayer(null); }} 
          initialData={editingPlayer}
        />
      )}

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-[#525252] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-8">
          {viewMode === 'GRID' ? (
            CATEGORIES.map((category) => (
              groupedPlayers[category]?.length > 0 && (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4">
                     <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border bg-[#1a1a1a] text-[#EE2523] border-white/10`}>
                        {category} <span className="text-white/40 ml-2">{groupedPlayers[category].length}</span>
                     </h3>
                     <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                    {groupedPlayers[category].map(p => (
                      <PlayerCard 
                        key={p.id} 
                        player={p} 
                        onClick={handlePlayerInteraction} 
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeletePlayer}
                      />
                    ))}
                  </div>
                </div>
              )
            ))
          ) : (
            <SquadTable 
              players={filteredPlayers} 
              onPlayerClick={handlePlayerInteraction} 
              onEditClick={handleEditClick} 
              onDeleteClick={handleDeletePlayer}
            />
          )}

          {filteredPlayers.length === 0 && (
             <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em]">{t.squad_empty}</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SquadsContainer;

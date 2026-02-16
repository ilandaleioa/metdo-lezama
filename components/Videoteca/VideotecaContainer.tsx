
import React, { useState } from 'react';
import { TEAMS } from '../../constants';

interface Video {
  id: string;
  vimeoId: string;
  title: string;
  teamId: string;
  competition: string;
  round: string;
  type: 'RESUMEN' | 'GOLES' | 'OCASIONES' | 'PARTIDO_COMPLETO';
  date: string;
}

const MOCK_VIDEOS: Video[] = [
  { id: 'v5', vimeoId: '1156434639', title: 'Bilbao Athletic vs Barakaldo', teamId: '2', competition: '1ª RFEF', round: 'Jornada 21', type: 'RESUMEN', date: '2026-02-04' },
  { id: 'v6', vimeoId: '1156434639', title: 'Basconia vs Portugalete', teamId: '3', competition: '3ª RFEF', round: 'Jornada 18', type: 'GOLES', date: '2026-02-02' },
];

const COMPETITIONS = ['1ª RFEF', '3ª RFEF', 'Copa Federación', 'Amistoso', 'Youth League'];
const ROUNDS = ['Jornada 25', 'Jornada 24', 'Jornada 23', 'Jornada 22', 'Jornada 21', 'Semifinal', 'Cuartos', 'Octavos'];

const VideotecaContainer: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [filterTeam, setFilterTeam] = useState<string>('ALL');
  const [filterCompetition, setFilterCompetition] = useState<string>('ALL');
  const [filterRound, setFilterRound] = useState<string>('ALL');

  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoTeam, setNewVideoTeam] = useState(TEAMS[0]?.id || '2');
  const [newVideoComp, setNewVideoComp] = useState('1ª RFEF');
  const [newVideoRound, setNewVideoRound] = useState('Jornada 25');
  const [newVideoType, setNewVideoType] = useState<Video['type']>('RESUMEN');

  const extractVimeoId = (url: string) => {
    const regExp = /(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const vId = extractVimeoId(newVideoUrl);
    if (!vId) { alert("URL de Vimeo no válida"); return; }
    const newVideo: Video = {
      id: Date.now().toString(),
      vimeoId: vId,
      title: newVideoTitle,
      teamId: newVideoTeam,
      competition: newVideoComp,
      round: newVideoRound,
      type: newVideoType,
      date: new Date().toISOString().split('T')[0]
    };
    setVideos([newVideo, ...videos]);
    setShowAddForm(false);
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const filteredVideos = videos.filter(v => {
    const matchTeam = filterTeam === 'ALL' || v.teamId === filterTeam;
    const matchComp = filterCompetition === 'ALL' || v.competition === filterCompetition;
    const matchRound = filterRound === 'ALL' || v.round === filterRound;
    return matchTeam && matchComp && matchRound;
  });

  const getTeamName = (id: string) => TEAMS.find(t => t.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Videoteca</h2>
          <p className="text-white/40 text-[10px] md:text-sm uppercase tracking-widest font-black">Repositorio Técnico</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto bg-[#EE2523] text-white px-6 py-4 sm:py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          Subir Análisis
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#1a1a1a] p-5 md:p-8 rounded-[32px] border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
           <h3 className="text-white font-black uppercase mb-6 text-xs tracking-widest">Nuevo Registro de Video</h3>
           <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Título del Video" 
                value={newVideoTitle}
                onChange={e => setNewVideoTitle(e.target.value)}
                className="md:col-span-2 bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-[#EE2523] focus:outline-none"
                required
              />
              <input 
                type="text" 
                placeholder="URL de Vimeo" 
                value={newVideoUrl}
                onChange={e => setNewVideoUrl(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-[#EE2523] focus:outline-none"
                required
              />
              
              <select value={newVideoTeam} onChange={e => setNewVideoTeam(e.target.value)} className="bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-sm">
                 {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              <select value={newVideoComp} onChange={e => setNewVideoComp(e.target.value)} className="bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-sm">
                 {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={newVideoRound} onChange={e => setNewVideoRound(e.target.value)} className="bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-white text-sm">
                 {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              
              <div className="md:col-span-3 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                 <button type="button" onClick={() => setShowAddForm(false)} className="py-4 sm:py-2 px-6 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white">Descartar</button>
                 <button type="submit" className="bg-white text-black px-8 py-4 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Guardar Análisis</button>
              </div>
           </form>
        </div>
      )}

      {/* FILTER BAR - MOBILE OPTIMIZED */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-[24px] p-4 flex flex-col gap-3">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Filtros de Búsqueda</p>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select 
               value={filterTeam} 
               onChange={(e) => setFilterTeam(e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#EE2523] appearance-none"
            >
               <option value="ALL">Todos los Equipos</option>
               {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <select 
               value={filterCompetition} 
               onChange={(e) => setFilterCompetition(e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#EE2523] appearance-none"
            >
               <option value="ALL">Competiciones</option>
               {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="relative">
               <select 
                  value={filterRound} 
                  onChange={(e) => setFilterRound(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#EE2523] appearance-none"
               >
                  <option value="ALL">Jornadas</option>
                  {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
               </select>
               {(filterTeam !== 'ALL' || filterCompetition !== 'ALL' || filterRound !== 'ALL') && (
                  <button 
                     onClick={() => { setFilterTeam('ALL'); setFilterCompetition('ALL'); setFilterRound('ALL'); }}
                     className="absolute -right-1 -top-8 text-[#EE2523] text-[9px] font-black uppercase tracking-widest"
                  >
                     Limpiar Filtros
                  </button>
               )}
            </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <div key={video.id} className="bg-[#1a1a1a] border border-white/5 rounded-[28px] overflow-hidden group hover:border-[#EE2523]/50 transition-all shadow-xl">
             <div className="relative aspect-video bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`} 
                  title={video.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
             </div>
             <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex flex-col">
                      <span className="text-[#EE2523] text-[9px] font-black uppercase tracking-[0.15em] mb-1">{getTeamName(video.teamId)}</span>
                      <span className="text-white/30 text-[8px] font-bold uppercase tracking-widest">{video.competition} • {video.round}</span>
                   </div>
                   <span className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border border-white/5">{video.type}</span>
                </div>
                <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-4 group-hover:text-[#EE2523] transition-colors">{video.title}</h3>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                   <p className="text-white/20 text-[9px] uppercase font-black tracking-widest">{new Date(video.date).toLocaleDateString()}</p>
                   <svg className="w-4 h-4 text-white/10 group-hover:text-[#EE2523] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideotecaContainer;

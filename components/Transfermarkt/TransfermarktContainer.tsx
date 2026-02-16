
import React, { useState, useEffect } from 'react';
import { MOCK_PLAYERS } from '../../constants';
import { Player } from '../../types';

const TransfermarktContainer: React.FC = () => {
  // Obtener todos los jugadores con URL de Transfermarkt de todas las categorías
  const playersWithMarketData = Object.values(MOCK_PLAYERS).flat().filter(p => !!p.transfermarktUrl);
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(playersWithMarketData[0] || null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayerChange = (playerId: string) => {
    const player = playersWithMarketData.find(p => p.id === playerId);
    if (player) {
      setIsLoading(true);
      setSelectedPlayer(player);
    }
  };

  // Reset loading when URL changes (handled by iframe onLoad)
  useEffect(() => {
    if (selectedPlayer) {
      setIsLoading(true);
    }
  }, [selectedPlayer]);

  return (
    <div className="space-y-6 animate-fade-in pb-10 flex flex-col h-full">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#1a3151] p-3 rounded-2xl shadow-xl border border-white/5">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Market Intel</h2>
              <span className="bg-[#1a3151] text-[#85a6cc] text-[10px] font-black px-2 py-1 rounded border border-[#85a6cc]/20 uppercase">TM Live Bridge</span>
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">Visor Inteligente de Valoración de Activos</p>
          </div>
        </div>

        {/* Player Selector */}
        <div className="flex items-center space-x-3 bg-[#0a0a0a] border border-white/5 p-2 rounded-2xl min-w-[300px]">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest pl-3">Analizar:</span>
          <select 
            value={selectedPlayer?.id || ''} 
            onChange={(e) => handlePlayerChange(e.target.value)}
            className="flex-1 bg-transparent text-white font-bold text-sm uppercase tracking-wider focus:outline-none appearance-none cursor-pointer pr-8 py-2"
          >
            {playersWithMarketData.map(p => (
              <option key={p.id} value={p.id} className="bg-[#0a0a0a]">{p.name} - {p.position}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Market Viewport */}
      <div className="flex-1 bg-black border border-white/5 rounded-3xl overflow-hidden flex flex-col min-h-[700px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative">
        {/* Viewport Toolbar */}
        <div className="p-4 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              TRANSFERMARKT PROFILER: <span className="text-white">{selectedPlayer?.name}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <a 
              href={selectedPlayer?.transfermarktUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-[10px] font-black text-[#85a6cc] bg-[#1a3151]/20 hover:bg-[#1a3151]/40 border border-[#1a3151]/30 px-4 py-2 rounded-xl transition-all uppercase tracking-widest group"
            >
              <span>Abrir en Nueva Ventana</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-[#121212]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#121212] z-20">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#1a3151] border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] animate-pulse">Consultando Base de Datos TM</p>
                  <p className="text-[8px] text-white/10 uppercase tracking-widest mt-2">Cifras sujetas a mercado internacional</p>
                </div>
              </div>
            </div>
          )}
          
          {selectedPlayer ? (
            <iframe 
              key={selectedPlayer.id}
              src={selectedPlayer.transfermarktUrl} 
              title={`Perfil de mercado de ${selectedPlayer.name}`}
              onLoad={() => setIsLoading(false)}
              className={`w-full h-full border-none transition-all duration-700 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            ></iframe>
          ) : (
            <div className="h-full flex items-center justify-center text-white/20 italic p-10 text-center uppercase tracking-widest text-xs">
              No hay jugadores con perfiles de mercado configurados.
            </div>
          )}
        </div>

        {/* Intelligence Alert */}
        <div className="bg-[#1a3151]/10 p-3 flex items-center justify-center space-x-3 border-t border-white/5">
           <span className="w-2 h-2 bg-[#85a6cc] rounded-full animate-pulse shadow-[0_0_8px_#85a6cc]"></span>
           <p className="text-[9px] font-bold text-[#85a6cc]/60 uppercase tracking-[0.2em]">
             Nota: Algunos perfiles de Transfermarkt pueden restringir la navegación embebida según su política de seguridad.
           </p>
        </div>
      </div>
    </div>
  );
};

export default TransfermarktContainer;

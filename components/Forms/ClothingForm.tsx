
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

const ClothingForm: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sizes, setSizes] = useState({
    training: 'M',
    match: 'M',
    tracksuit: 'M',
    boots: '42'
  });

  useEffect(() => {
    supabase.from('players').select('*').order('name').then(({ data }) => {
      if (data) setPlayers(data);
    });
  }, []);

  const handleSave = async () => {
    if (!selectedPlayerId) return alert("Selecciona un jugador");
    setIsSaving(true);
    setTimeout(() => {
      alert("Tallaje enviado correctamente al Departamento de Logística.");
      setIsSaving(false);
    }, 800);
  };

  const SizeButton = ({ label, current, val, onClick }: any) => (
    <button 
      onClick={() => onClick(val)}
      className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${current === val ? 'bg-[#EE2523] text-white border-[#EE2523]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'}`}
    >
      {val}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" className="w-64" alt="" />
        </div>
        
        <div className="relative z-10 space-y-10">
          <div>
            <h2 className="text-3xl font-[1000] text-white italic uppercase tracking-tighter">Tallaje Oficial <span className="text-[#EE2523]">25/26</span></h2>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Logística & Equipamiento Lezama</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Seleccionar Jugador</label>
              <select 
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#EE2523] transition-all"
              >
                <option value="">ELIJA UN ACTIVO DE PLANTILLA...</option>
                {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Ropa Entrenamiento</label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => <SizeButton key={s} val={s} current={sizes.training} onClick={(v:any) => setSizes({...sizes, training: v})} />)}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Botas (Talla EUR)</label>
                  <input 
                    type="text" value={sizes.boots} onChange={(e) => setSizes({...sizes, boots: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white font-bold"
                  />
               </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving || !selectedPlayerId}
            className="w-full bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-20"
          >
            {isSaving ? 'ENVIANDO...' : 'ENVIAR FORMULARIO DE TALLAJE >'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingForm;

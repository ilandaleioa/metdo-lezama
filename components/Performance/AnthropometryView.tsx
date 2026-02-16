
import React from 'react';

interface AnthropometryData {
  id: string;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  team: string;
  date: string;
  footSize: string;
  sittingHeight: string;
  weight: number;
  skinfolds: {
    tricipital: number;
    subescapular: number;
    supraespinal: number;
    abdominal: number;
    crural: number;
    gemelar: number;
    bicipital: number | null;
    suprailiaco: number | null;
  };
  sum6: number;
  sum6Status: 'good' | 'bad' | 'neutral';
  sum8: number | null;
  fatPercentage: number;
  fatStatus: 'good' | 'warning' | 'bad' | 'neutral';
  diameters: {
    biacromial: number | null;
    toraxT: number | null;
    toraxAP: number | null;
    biiliocrest: number | null;
    biepicond: number | null;
  };
}

const MOCK_ANTHRO_DATA: AnthropometryData[] = [
  {
    id: '1', name: 'IGOR OYONO', position: 'FW', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 83.0,
    skinfolds: { tricipital: 7.4, subescapular: 8.4, supraespinal: 6.2, abdominal: 8.8, crural: 8.2, gemelar: 3.2, bicipital: null, suprailiaco: null },
    sum6: 42.2, sum6Status: 'good', sum8: null, fatPercentage: 10.5, fatStatus: 'warning', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '2', name: 'DAVID OSIPOV', position: 'DF', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 73.1,
    skinfolds: { tricipital: 6.6, subescapular: 6.8, supraespinal: 7.2, abdominal: 10.4, crural: 8.8, gemelar: 4.6, bicipital: null, suprailiaco: null },
    sum6: 44.4, sum6Status: 'good', sum8: null, fatPercentage: 10.5, fatStatus: 'warning', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '3', name: 'AIMAR GOICOECHEA', position: 'DF', team: 'Infantil B', date: '09-02-2026', footSize: '162.0', sittingHeight: '-', weight: 50.2,
    skinfolds: { tricipital: 5.8, subescapular: 10.4, supraespinal: 5.4, abdominal: 9.2, crural: 10.4, gemelar: 5.2, bicipital: null, suprailiaco: null },
    sum6: 46.4, sum6Status: 'neutral', sum8: null, fatPercentage: 10.5, fatStatus: 'neutral', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '4', name: 'ALAIN ALBIZU', position: 'FW', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 71.5,
    skinfolds: { tricipital: 9.2, subescapular: 9.6, supraespinal: 8.2, abdominal: 13.6, crural: 12.2, gemelar: 5.2, bicipital: null, suprailiaco: null },
    sum6: 58.0, sum6Status: 'bad', sum8: null, fatPercentage: 12.0, fatStatus: 'bad', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '5', name: 'OIER UNAMUNO', position: 'DF', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 65.3,
    skinfolds: { tricipital: 4.8, subescapular: 8.0, supraespinal: 5.8, abdominal: 9.0, crural: 5.6, gemelar: 4.8, bicipital: null, suprailiaco: null },
    sum6: 38.0, sum6Status: 'good', sum8: null, fatPercentage: 10.0, fatStatus: 'warning', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '6', name: 'ALAIN COBOS', position: 'MF', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 65.0,
    skinfolds: { tricipital: 5.6, subescapular: 5.2, supraespinal: 4.2, abdominal: 7.6, crural: 9.0, gemelar: 3.8, bicipital: null, suprailiaco: null },
    sum6: 35.4, sum6Status: 'good', sum8: null, fatPercentage: 9.2, fatStatus: 'good', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '7', name: 'SIMON GARCIA', position: 'GK', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 82.4,
    skinfolds: { tricipital: 11.6, subescapular: 8.2, supraespinal: 10.6, abdominal: 14.8, crural: 11.4, gemelar: 6.2, bicipital: null, suprailiaco: null },
    sum6: 62.8, sum6Status: 'bad', sum8: null, fatPercentage: 12.7, fatStatus: 'bad', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '8', name: 'OHIAN CREMALLET', position: 'DF', team: 'Infantil A', date: '09-02-2026', footSize: '170.4', sittingHeight: '-', weight: 60.2,
    skinfolds: { tricipital: 7.4, subescapular: 13.8, supraespinal: 7.8, abdominal: 12.6, crural: 14.2, gemelar: 10.4, bicipital: null, suprailiaco: null },
    sum6: 66.2, sum6Status: 'neutral', sum8: null, fatPercentage: 12.1, fatStatus: 'neutral', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '9', name: 'DIEGO FERNANDEZ', position: 'FW', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 68.4,
    skinfolds: { tricipital: 7.6, subescapular: 6.8, supraespinal: 5.6, abdominal: 6.8, crural: 8.6, gemelar: 4.2, bicipital: null, suprailiaco: null },
    sum6: 39.6, sum6Status: 'good', sum8: null, fatPercentage: 9.9, fatStatus: 'good', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  },
  {
    id: '10', name: 'IKER QUINTERO', position: 'DF', team: 'Basconia', date: '09-02-2026', footSize: '-', sittingHeight: '-', weight: 63.9,
    skinfolds: { tricipital: 7.6, subescapular: 8.8, supraespinal: 5.6, abdominal: 8.6, crural: 7.8, gemelar: 5.6, bicipital: null, suprailiaco: null },
    sum6: 44.0, sum6Status: 'good', sum8: null, fatPercentage: 10.5, fatStatus: 'warning', diameters: { biacromial: null, toraxT: null, toraxAP: null, biiliocrest: null, biepicond: null }
  }
];

/* Fix: Added playerId to props to satisfy parent component call */
const AnthropometryView: React.FC<{ playerId?: string }> = ({ playerId }) => {
  
  const getPosColor = (pos: string) => {
    switch(pos) {
        case 'FW': return 'bg-blue-500 text-white';
        case 'DF': return 'bg-red-500 text-white';
        case 'MF': return 'bg-green-500 text-white';
        case 'GK': return 'bg-yellow-500 text-black';
        default: return 'bg-gray-500 text-white';
    }
  };

  const getSum6Color = (status: string) => {
      switch(status) {
          case 'good': return 'bg-green-600/90 text-white';
          case 'bad': return 'bg-red-600/90 text-white';
          default: return 'text-white/60';
      }
  };

  const getFatColor = (status: string) => {
      switch(status) {
          case 'good': return 'bg-green-600/90 text-white';
          case 'warning': return 'bg-yellow-500/90 text-black';
          case 'bad': return 'bg-red-600/90 text-white';
          default: return 'text-white/60';
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Registro Antropométrico</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Control de Composición Corporal</p>
            </div>
            <div className="flex gap-2">
                <button className="bg-[#1a1a1a] border border-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white/5 transition-all">
                    Exportar Excel
                </button>
                <button className="bg-[#EE2523] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-lg hover:bg-red-600 transition-all">
                    + Nuevo Registro
                </button>
            </div>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1400px]">
                    <thead>
                        {/* FIRST HEADER ROW */}
                        <tr className="bg-[#0a0a0a] text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">
                            <th className="p-4 sticky left-0 bg-[#0a0a0a] z-20 w-48 border-r border-white/5" rowSpan={2}>Nombre</th>
                            <th className="p-4 w-32 border-r border-white/5" rowSpan={2}>Equipo</th>
                            <th className="p-4 w-24 border-r border-white/5" rowSpan={2}>Fecha</th>
                            <th className="p-4 text-center border-r border-white/5" rowSpan={2}>Talla pie</th>
                            <th className="p-4 text-center border-r border-white/5" rowSpan={2}>Talla Sent.</th>
                            <th className="p-4 text-center border-r border-white/5" rowSpan={2}>Peso</th>
                            <th className="p-2 text-center border-r border-white/5 bg-[#111]" colSpan={9}>Pliegues (mm)</th>
                            <th className="p-2 text-center border-r border-white/5 bg-[#111]" colSpan={2}>Composición</th>
                            <th className="p-2 text-center border-r border-white/5 bg-[#111]" colSpan={5}>Diámetros</th>
                            <th className="p-4 sticky right-0 bg-[#0a0a0a] z-20 text-right" rowSpan={2}></th>
                        </tr>
                        {/* SECOND HEADER ROW */}
                        <tr className="bg-[#0a0a0a] text-[8px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">
                            {/* Pliegues */}
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Tricipital">Tricip.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Subescapular">Subesc.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Supraespinal">Supraes.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Abdominal">Abdom.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Crural">Crural</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Gemelar">Gemelar</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Bicipital">Bicip.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 hover:text-white transition-colors cursor-help" title="Suprailiaco">Suprail.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 font-black text-white bg-white/5">Suma 6</th>
                            
                            {/* Comp */}
                            <th className="px-2 py-3 text-center border-r border-white/5">Suma 8</th>
                            <th className="px-2 py-3 text-center border-r border-white/5 font-black text-white bg-white/5">% Grasa</th>
                            
                            {/* Diameters */}
                            <th className="px-2 py-3 text-center border-r border-white/5">Biacrom.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5">Tórax T.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5">Tórax AP</th>
                            <th className="px-2 py-3 text-center border-r border-white/5">Biiliocr.</th>
                            <th className="px-2 py-3 text-center border-r border-white/5">Biepic.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[10px] font-medium text-white/80">
                        {MOCK_ANTHRO_DATA.map((player) => (
                            <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
                                {/* FIXED NAME COL */}
                                <td className="p-4 sticky left-0 bg-[#1a1a1a] group-hover:bg-[#1f1f1f] z-20 border-r border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 flex items-center justify-center rounded text-[8px] font-black shadow-lg ${getPosColor(player.position)}`}>
                                            {player.position}
                                        </div>
                                        <span className="font-bold text-white uppercase truncate">{player.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-white/5 text-white/50">{player.team}</td>
                                <td className="px-4 py-3 border-r border-white/5 text-white/50 tabular-nums">{player.date}</td>
                                <td className="px-4 py-3 text-center border-r border-white/5 text-white/40">{player.footSize}</td>
                                <td className="px-4 py-3 text-center border-r border-white/5 text-white/40">{player.sittingHeight}</td>
                                <td className="px-4 py-3 text-center border-r border-white/5 font-bold text-white">{player.weight.toFixed(1)}</td>
                                
                                {/* SKINFOLDS */}
                                <td className="px-2 py-3 text-center border-r border-white/5">{player.skinfolds.tricipital.toFixed(1)}</td>
                                <td className="px-2 py-3 text-center border-r border-white/5">{player.skinfolds.subescapular.toFixed(1)}</td>
                                <td className="px-2 py-3 text-center border-r border-white/5">{player.skinfolds.supraespinal.toFixed(1)}</td>
                                <td className="px-2 py-3 text-center border-r border-white/5">{player.skinfolds.abdominal.toFixed(1)}</td>
                                <td className="px-2 py-3 text-center border-r border-white/5">{player.skinfolds.crural.toFixed(1)}</td>
                                <td className="px-2 py-3 text-center border-r border-white/5">{player.skinfolds.gemelar.toFixed(1)}</td>
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                
                                {/* SUM 6 */}
                                <td className={`px-2 py-3 text-center border-r border-white/5 font-black ${getSum6Color(player.sum6Status)}`}>
                                    <div className="flex items-center justify-center gap-1">
                                        {player.sum6.toFixed(1)}
                                        {player.sum6Status === 'bad' && <span className="text-[7px]">↑</span>}
                                        {player.sum6Status === 'good' && <span className="text-[7px]">↓</span>}
                                    </div>
                                </td>

                                {/* COMP */}
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                <td className={`px-2 py-3 text-center border-r border-white/5 font-black ${getFatColor(player.fatStatus)}`}>
                                    {player.fatPercentage.toFixed(1)}
                                </td>

                                {/* DIAMETERS */}
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>
                                <td className="px-2 py-3 text-center border-r border-white/5 text-white/20">-</td>

                                {/* ACTIONS */}
                                <td className="p-4 sticky right-0 bg-[#1a1a1a] group-hover:bg-[#1f1f1f] z-20 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-white/20 hover:text-white p-1 hover:bg-white/10 rounded">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button className="text-white/20 hover:text-red-500 p-1 hover:bg-red-500/10 rounded">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AnthropometryView;

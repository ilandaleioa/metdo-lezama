
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError('Credenciales de Lezama no válidas.');
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Simulamos un login exitoso guardando una marca en localStorage
    // El App.tsx lo detectará como una sesión activa para la demo
    localStorage.setItem('lezama_demo_mode', 'true');
    window.location.reload(); // Recargamos para que App.tsx lea el nuevo estado
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Background purely aesthetic */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover grayscale" 
          alt="San Mamés"
        />
      </div>

      <div className="relative z-20 w-full max-w-md p-8">
        <div className="bg-[#121212]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" 
              className="w-24 h-auto drop-shadow-[0_0_25px_rgba(238,37,35,0.4)] mb-6" 
              alt="Logo"
            />
            <h1 className="text-white font-black text-2xl tracking-[0.2em] uppercase text-center">
              ACCESO TÉCNICO
            </h1>
            <p className="text-[#EE2523] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Lezama Intranet</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Email Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#EE2523] transition-all"
                placeholder="usuario@athletic-club.eus"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#EE2523] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#EE2523] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Entrar en la Catedral</span>
                )}
              </button>

              <button 
                type="button"
                onClick={handleGuestAccess}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 transition-all"
              >
                Acceso Invitado (Modo Demo)
              </button>
            </div>
          </form>

          <p className="text-center text-white/20 text-[9px] font-bold uppercase tracking-widest mt-10">
            © {new Date().getFullYear()} ATHLETIC CLUB • DEPARTAMENTO IT LEZAMA
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

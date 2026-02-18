
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsEmailUnconfirmed(false);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (authError) {
        // Detectar específicamente si el error es por falta de verificación (como indica el estado en el pantallazo)
        if (authError.message.toLowerCase().includes('confirm') || authError.message.toLowerCase().includes('verify')) {
          setIsEmailUnconfirmed(true);
          throw new Error('Cuenta pendiente de verificación. Revisa el email enviado a tu bandeja de entrada.');
        }
        throw authError;
      }
      
      console.log('Acceso autorizado:', data.user?.email);
    } catch (err: any) {
      console.error('Error de acceso:', err.message);
      setError(err.message || 'Credenciales no válidas o usuario sin permisos de acceso.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (resendError) throw resendError;
      alert('Enlace de verificación reenviado correctamente a: ' + email);
      setError(null);
      setIsEmailUnconfirmed(false);
    } catch (err: any) {
      alert('Error al reenviar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover grayscale" 
          alt="Lezama"
        />
      </div>

      <div className="relative z-20 w-full max-w-md p-8">
        <div className="bg-[#121212]/90 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-12">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Club_Athletic_Bilbao_logo.svg/1200px-Club_Athletic_Bilbao_logo.svg.png" 
              className="w-24 h-auto drop-shadow-[0_0_30px_rgba(238,37,35,0.5)] mb-8" 
              alt="Athletic Club"
            />
            <h1 className="text-white font-[1000] text-3xl tracking-tighter uppercase italic text-center leading-none">
              LEZAMA <span className="text-[#EE2523]">SUITE</span>
            </h1>
            <p className="text-[#EE2523] text-[10px] font-black uppercase tracking-[0.5em] mt-4 opacity-70">Identificación Obligatoria</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Email Técnico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#EE2523] transition-all text-sm placeholder:text-white/10"
                placeholder="usuario@athletic-club.eus"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#EE2523] transition-all text-sm placeholder:text-white/10"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className={`border p-5 rounded-2xl text-center animate-in fade-in zoom-in-95 duration-300 ${isEmailUnconfirmed ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed">{error}</p>
                {isEmailUnconfirmed && (
                  <button 
                    type="button"
                    onClick={handleResendVerification}
                    className="mt-4 w-full bg-orange-500 text-black py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg"
                  >
                    Reenviar enlace de confirmación
                  </button>
                )}
              </div>
            )}

            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#EE2523] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>INICIAR SESIÓN</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 flex flex-col items-center gap-2">
             <div className="h-px w-12 bg-white/10"></div>
             <p className="text-white/10 text-[8px] font-black uppercase tracking-widest text-center leading-relaxed">
               Dirección de Metodología • Lezama<br/>Athletic Club de Bilbao
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

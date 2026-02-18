
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const getEnv = (key: string) => {
  return (window as any).process?.env?.[key] || '';
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('supabase.co')
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);

/**
 * Cierra la sesión en el dispositivo actual y en todos los demás.
 * Limpia el rastro de almacenamiento local.
 */
export const signOutGlobally = async () => {
  try {
    // 1. Sign out de Supabase (Global invalida todos los tokens en el servidor)
    await supabase.auth.signOut({ scope: 'global' });
    
    // 2. Limpieza agresiva de almacenamiento
    localStorage.clear();
    sessionStorage.clear();
    
    // 3. Cookies (opcional pero recomendado para tokens persistentes)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log("Sesiones invalidadas globalmente.");
    window.location.href = '/'; // Redirección forzada
  } catch (error) {
    console.error("Error en cierre global:", error);
    window.location.reload();
  }
};

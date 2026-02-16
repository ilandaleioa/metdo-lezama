
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validación de configuración para evitar errores en tiempo de ejecución
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseUrl.length > 20
);

// Cliente con configuración de persistencia y manejo de sesión
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: { 'x-application-name': 'lezama-technical-suite' }
    }
  }
);

/**
 * Test de conectividad avanzado para el Health Check de la infraestructura
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured) {
    return { success: false, message: "INFRAESTRUCTURA: CONFIGURACIÓN PENDIENTE" };
  }

  try {
    // Timeout de 5 segundos para no bloquear el arranque
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const { error } = await supabase
      .from('players')
      .select('id')
      .limit(1)
      .abortSignal(controller.signal);
    
    clearTimeout(timeoutId);
    
    if (error) {
      // Manejo específico de errores de base de datos
      if (error.code === 'PGRST301') return { success: false, message: "ERROR: JWT / ANON_KEY INVÁLIDO" };
      if (error.code === '42P01') return { success: true, message: "AVISO: TABLAS NO MIGRADAS" };
      return { success: false, message: `API ERROR: ${error.message}` };
    }

    return { success: true, message: "CLOUD: CONEXIÓN ESTABLE" };
  } catch (e: any) {
    return { success: false, message: "RED: FALLO DE CONEXIÓN O CORS" };
  }
};

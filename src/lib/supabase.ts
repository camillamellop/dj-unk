import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://fxkhkcvnmvqqjzgsdoec.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// ✅ cliente do Supabase (é isso que você deve importar em outros arquivos)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ tipos (pode ser gerado automaticamente com a CLI)
export interface Profile {
  user_id: string
  name?: string | null
  full_name?: string | null
  email?: string | null
  role?: 'admin' | 'dj' | null

  phone?: string | null
  bio?: string | null
  location?: string | null
  artist_name?: string | null
  birth_date?: string | null
  pix_key?: string | null

  genres?: string[] | null
  portfolio_url?: string | null
  instagram_url?: string | null
  youtube_url?: string | null
  presskit_url?: string | null
  music_links?: string[] | null
}

// Função utilitária para tratar erros
export const handleSupabaseError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error_description) return error.error_description;
  return 'Erro desconhecido';
};

// Função para testar conexão com o Supabase
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' })
      .limit(1);

    return {
      success: !error,
      error: error ? handleSupabaseError(error) : null,
    };
  } catch (err) {
    return {
      success: false,
      error: handleSupabaseError(err),
    };
  }
};

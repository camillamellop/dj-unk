import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  artist_name: string | null;
  bio: string | null;
  location: string | null;
  birth_date: string | null;
  pix_key: string | null;
  portfolio_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  presskit_url: string | null;
  genres: string[];
  music_links: string[];
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Error handling utility
export const handleSupabaseError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error_description) return error.error_description;
  return 'Erro desconhecido';
};

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    return {
      success: !error,
      error: error ? handleSupabaseError(error) : null
    };
  } catch (err) {
    return {
      success: false,
      error: handleSupabaseError(err)
    };
  }
};

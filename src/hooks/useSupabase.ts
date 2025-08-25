import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];

interface UseSupabaseReturn {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useSupabase = (): UseSupabaseReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Erro inesperado ao buscar perfil:', err);
      return null;
    }
  };

  // Função para fazer logout
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError(handleSupabaseError(error));
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setError(null);
      }
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a sessão
  const refreshSession = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        setError(handleSupabaseError(error));
      } else if (data.session) {
        setSession(data.session);
        setUser(data.user);

        if (data.user) {
          const userProfile = await fetchProfile(data.user.id);
          setProfile(userProfile);
        }
      }
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Effect para monitorar mudanças de autenticação
  useEffect(() => {
    let mounted = true;

    // Função para lidar com mudanças de auth
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (!mounted) return;

      console.log('Auth event:', event, session?.user?.id);

      setSession(session);
      setUser(session?.user ?? null);
      setError(null);

      if (session?.user && event !== 'SIGNED_OUT') {
        const userProfile = await fetchProfile(session.user.id);
        if (mounted) {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    // Buscar sessão inicial
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro ao buscar sessão:', error);
          setError(handleSupabaseError(error));
        }

        await handleAuthChange('INITIAL_SESSION', session);
      } catch (err) {
        console.error('Erro na inicialização:', err);
        setError(handleSupabaseError(err));
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    error,
    signOut,
    refreshSession,
  };
};

// Hook especializado para dados protegidos
export const useProtectedData = <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSupabase();

  useEffect(() => {
    if (!session) {
      setData(null);
      setLoading(false);
      setError('Usuário não autenticado');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await queryFn();

        if (result.error) {
          setError(handleSupabaseError(result.error));
        } else {
          setData(result.data);
        }
      } catch (err) {
        setError(handleSupabaseError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, ...deps]);

  return { data, loading, error, refetch: () => {} };
};

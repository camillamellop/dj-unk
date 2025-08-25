import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface TodayEvent {
  id: string;
  event_name: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
}

export const useTodayEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<TodayEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTodayEvents();
    }
  }, [user]);

  const loadTodayEvents = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('eventos')
        .select('id, event_name, start_time, end_time, location, status')
        .eq('user_id', user?.id)
        .eq('event_date', today)
        .order('start_time', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos de hoje:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    loadTodayEvents();
  };

  return { events, loading, refreshEvents };
};
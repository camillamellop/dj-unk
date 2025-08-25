import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, User, Share2, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaEvent {
  id: string;
  user_id: string;
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  producer_name: string;
  cache: number;
  status: string;
  shared_with_admin: boolean;
  dj_name: string;
  artist_name: string;
}

interface User {
  id: string;
  full_name: string;
  artist_name: string;
}

const AgendaGeral: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEventData, setShareEventData] = useState({
    user_id: '',
    event_name: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    producer_name: '',
    cache: 0,
    description: ''
  });

  // Verificar se é admin
  React.useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar usuários
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, artist_name')
        .order('full_name');

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Carregar eventos
      const { data: eventsData, error: eventsError } = await supabase
        .from('eventos')
        .select(`
          *,
          profiles:user_id (
            full_name,
            artist_name
          )
        `)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      const formattedEvents: AgendaEvent[] = eventsData?.map((event: any) => ({
        ...event,
        dj_name: event.profiles?.full_name || 'DJ não identificado',
        artist_name: event.profiles?.artist_name || ''
      })) || [];

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareEvent = async () => {
    try {
      const { error } = await supabase
        .from('eventos')
        .insert({
          ...shareEventData,
          shared_with_admin: true,
          created_by_admin: true,
          status: 'pending'
        });

      if (error) throw error;

      setShowShareModal(false);
      setShareEventData({
        user_id: '',
        event_name: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        producer_name: '',
        cache: 0,
        description: ''
      });
      
      loadData();
    } catch (error) {
      console.error('Erro ao compartilhar evento:', error);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 0 });
    const end = endOfWeek(selectedWeek, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.event_date);
      const matchesDay = isSameDay(eventDate, date);
      const matchesUser = selectedUser === 'all' || event.user_id === selectedUser;
      return matchesDay && matchesUser;
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      completed: 'bg-blue-500/20 text-blue-400'
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Realizado'
    };
    return statusLabels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/central')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Agenda Geral
        </h1>
        <Button
          onClick={() => setShowShareModal(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
        >
          <Plus size={16} className="mr-2" />
          Compartilhar Data
        </Button>
      </div>

      {/* Filtros e navegação */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            ← Semana Anterior
          </Button>
          
          <span className="text-white font-medium">
            {format(selectedWeek, 'MMMM yyyy', { locale: ptBR })}
          </span>
          
          <Button
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            Próxima Semana →
          </Button>
        </div>

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 bg-white/10 border border-gray-600 rounded-md text-white"
        >
          <option value="all">Todos os DJs</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.full_name} {user.artist_name && `(${user.artist_name})`}
            </option>
          ))}
        </select>
      </div>

      {/* Calendario semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {getWeekDays().map(day => (
          <GlassCard key={day.toISOString()} variant="music" className="min-h-[200px]">
            <div className="text-center mb-3">
              <div className="text-sm text-gray-400">
                {format(day, 'EEEE', { locale: ptBR })}
              </div>
              <div className="text-lg font-bold text-white">
                {format(day, 'd')}
              </div>
            </div>

            <div className="space-y-2">
              {getEventsForDay(day).map(event => (
                <div
                  key={event.id}
                  className="bg-white/5 rounded-lg p-2 border-l-2 border-purple-400"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-white truncate">
                      {event.event_name}
                    </div>
                    {event.shared_with_admin && (
                      <Share2 size={12} className="text-purple-400" />
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-1">
                    {event.dj_name}
                    {event.artist_name && ` (${event.artist_name})`}
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-1">
                    {event.start_time} - {event.end_time}
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2">
                    {event.location}
                  </div>
                  
                  <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </Badge>
                </div>
              ))}

              {getEventsForDay(day).length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Nenhum evento
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal de compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <GlassCard variant="music" className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              Compartilhar Data com DJ
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  DJ
                </label>
                <select
                  value={shareEventData.user_id}
                  onChange={(e) => setShareEventData(prev => ({ ...prev, user_id: e.target.value }))}
                  className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                >
                  <option value="">Selecione um DJ</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} {user.artist_name && `(${user.artist_name})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Evento
                </label>
                <input
                  type="text"
                  value={shareEventData.event_name}
                  onChange={(e) => setShareEventData(prev => ({ ...prev, event_name: e.target.value }))}
                  className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                  placeholder="Nome do evento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={shareEventData.event_date}
                    onChange={(e) => setShareEventData(prev => ({ ...prev, event_date: e.target.value }))}
                    className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cachê (R$)
                  </label>
                  <input
                    type="number"
                    value={shareEventData.cache}
                    onChange={(e) => setShareEventData(prev => ({ ...prev, cache: Number(e.target.value) }))}
                    className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Início
                  </label>
                  <input
                    type="time"
                    value={shareEventData.start_time}
                    onChange={(e) => setShareEventData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fim
                  </label>
                  <input
                    type="time"
                    value={shareEventData.end_time}
                    onChange={(e) => setShareEventData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  value={shareEventData.location}
                  onChange={(e) => setShareEventData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                  placeholder="Local do evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Produtor
                </label>
                <input
                  type="text"
                  value={shareEventData.producer_name}
                  onChange={(e) => setShareEventData(prev => ({ ...prev, producer_name: e.target.value }))}
                  className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                  placeholder="Nome do produtor"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleShareEvent}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                Compartilhar
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AgendaGeral;
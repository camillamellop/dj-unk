import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Share2, 
  MapPin, 
  Clock, 
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BottomNavigation from '@/components/BottomNavigation';

interface AgendaEvent {
  id: string;
  user_id: string;
  event_name: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  producer_name: string;
  cache: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  shared_with_admin: boolean;
  created_at: string;
}

const AgendaImproved: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    event_name: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    producer_name: '',
    cache: 0,
    status: 'pending' as const,
    shared_with_admin: false
  });

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('user_id', user?.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('eventos')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('eventos')
          .insert({
            ...formData,
            user_id: user?.id,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      setShowForm(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: AgendaEvent) => {
    setEditingEvent(event);
    setFormData({
      event_name: event.event_name,
      description: event.description || '',
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      producer_name: event.producer_name,
      cache: event.cache,
      status: event.status,
      shared_with_admin: event.shared_with_admin
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      loadEvents();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      event_name: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      producer_name: '',
      cache: 0,
      status: 'pending',
      shared_with_admin: false
    });
    setEditingEvent(null);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
    <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white">
      {/* Header - Mobile Friendly */}
      <div className="sticky top-0 bg-gradient-to-br from-[#100C1F]/90 via-[#0D0A18]/90 to-black/90 backdrop-blur-sm z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold">Agenda</h1>
          </div>
          
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-2"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-4">
        {events.length === 0 ? (
          <GlassCard variant="music" className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum evento cadastrado</h3>
            <p className="text-gray-400 mb-6">Comece criando seu primeiro evento na agenda</p>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            >
              <Plus size={16} className="mr-2" />
              Criar Evento
            </Button>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <GlassCard key={event.id} variant="music" className="overflow-hidden">
                <div className="space-y-3">
                  {/* Header do evento */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {event.event_name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(event.status)} text-xs`}>
                          {getStatusLabel(event.status)}
                        </Badge>
                        {event.shared_with_admin && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                            <Share2 size={10} className="mr-1" />
                            Compartilhado
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Informações do evento */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CalendarIcon size={14} className="text-purple-400" />
                      <span>
                        {format(parseISO(event.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    
                    {(event.start_time || event.end_time) && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={14} className="text-blue-400" />
                        <span>
                          {event.start_time && format(parseISO(`2000-01-01T${event.start_time}`), 'HH:mm')}
                          {event.start_time && event.end_time && ' - '}
                          {event.end_time && format(parseISO(`2000-01-01T${event.end_time}`), 'HH:mm')}
                        </span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={14} className="text-green-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    
                    {event.cache > 0 && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <DollarSign size={14} className="text-yellow-400" />
                        <span>{formatCurrency(event.cache)}</span>
                      </div>
                    )}
                  </div>

                  {/* Descrição */}
                  {event.description && (
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Modal de formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-md my-8">
            <GlassCard variant="music">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome do Evento *
                  </label>
                  <Input
                    type="text"
                    value={formData.event_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                    className="bg-white/10 border-gray-600 text-white"
                    placeholder="Nome do evento"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data *
                  </label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    className="bg-white/10 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Início
                    </label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Fim
                    </label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Local
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-white/10 border-gray-600 text-white"
                    placeholder="Local do evento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Produtor
                  </label>
                  <Input
                    type="text"
                    value={formData.producer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, producer_name: e.target.value }))}
                    className="bg-white/10 border-gray-600 text-white"
                    placeholder="Nome do produtor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cachê (R$)
                    </label>
                    <Input
                      type="number"
                      value={formData.cache}
                      onChange={(e) => setFormData(prev => ({ ...prev, cache: Number(e.target.value) }))}
                      className="bg-white/10 border-gray-600 text-white"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white text-sm"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="cancelled">Cancelado</option>
                      <option value="completed">Realizado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descrição
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-gray-600 text-white min-h-[80px]"
                    placeholder="Detalhes do evento..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="shared_with_admin"
                    checked={formData.shared_with_admin}
                    onChange={(e) => setFormData(prev => ({ ...prev, shared_with_admin: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 rounded border-gray-600 focus:ring-purple-500"
                  />
                  <label htmlFor="shared_with_admin" className="text-sm text-gray-300 flex items-center gap-1">
                    <Share2 size={14} />
                    Compartilhar com admin
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Salvando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save size={16} />
                        Salvar
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default AgendaImproved;
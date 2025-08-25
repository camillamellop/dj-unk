import React from 'react';
import { GlassCard } from './glass-card';
import { Calendar, Clock, MapPin, Badge as BadgeIcon } from 'lucide-react';
import { Badge } from './badge';
import { useTodayEvents } from '@/hooks/useTodayEvents';

export function TodayEventsCard() {
  const { events, loading } = useTodayEvents();

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

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeString;
    }
  };

  return (
    <GlassCard variant="music">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Eventos de Hoje</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-gray-400 text-sm">Carregando eventos...</div>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white text-sm font-medium leading-tight">
                  {event.event_name}
                </h4>
                <Badge className={`${getStatusColor(event.status)} text-xs ml-2`}>
                  {getStatusLabel(event.status)}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-gray-300">
                {(event.start_time || event.end_time) && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>
                      {event.start_time && formatTime(event.start_time)}
                      {event.start_time && event.end_time && ' - '}
                      {event.end_time && formatTime(event.end_time)}
                    </span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
          <p className="text-gray-400 text-sm">
            Nenhum evento agendado para hoje
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Aproveite para descansar ou planejar novos projetos
          </p>
        </div>
      )}
    </GlassCard>
  );
}

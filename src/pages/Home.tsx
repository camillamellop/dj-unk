import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { 
  Calendar, 
  Target, 
  CheckSquare, 
  StickyNote, 
  Heart,
  Plus,
  Search,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useTasks } from '@/lib/useTasks';
import QuickNotes from '@/components/ui/QuickNotes';
import { TodayEventsCard } from '@/components/ui/TodayEventsCard';
import { getGreeting, getAnimatedColors } from '@/lib/greeting';
import { useInspirationQuote } from '@/hooks/useInspirationQuote';

export default function Home() {
  const { user } = useAuth();
  const { quote, loading: quoteLoading } = useInspirationQuote();
  const [animatedColor, setAnimatedColor] = useState(getAnimatedColors());
  
  // Atualiza as cores da frase a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedColor(getAnimatedColors());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const { tasks, toggleTask, removeTask } = useTasks();
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  
  return (
  <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <GreetingIcon className={`w-6 h-6 ${greeting.color}`} />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting.greeting}{user && user.name ? `, ${user.name}!` : '!'}
          </h1>
        </div>
        <p className={`text-base font-medium bg-gradient-to-r ${animatedColor} bg-clip-text text-transparent transition-all duration-1000`}>
          Vamos criar conexões reais hoje?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Card de acesso à Prospecção */}
  <GlassCard variant="music" className="hover:bg-orange-500/10 transition-all w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-400" />
                Central do Admin
              </h3>
              <p className="text-gray-300 text-sm mt-1">Acesso completo às ferramentas administrativas</p>
            </div>
            <Button
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold shadow-lg hover:from-orange-600 hover:to-yellow-500"
              onClick={() => window.location.href = '/admin/central'}
            >
              Acessar
            </Button>
          </div>
        </GlassCard>

        {/* Notas Rápidas (CRUD real) */}
  <GlassCard variant="music" className="w-full">
          <StickyNote className="w-5 h-5 text-yellow-400 mb-2" />
          <QuickNotes />
        </GlassCard>

        {/* Eventos do Dia */}
        <div className="w-full">
          <TodayEventsCard />
        </div>


        {/* Tarefas Pendentes (apenas visualização, criadas em Projetos) */}
  <GlassCard variant="music" className="w-full">
          <div className="flex items-center space-x-2 mb-4">
            <CheckSquare className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Tarefas Pendentes</h3>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 && <span className="text-gray-400 text-sm">Nenhuma tarefa cadastrada.</span>}
            {tasks.map(task => (
              <div key={task.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 text-green-500"
                  checked={task.status === 'completed'}
                  onChange={() => toggleTask(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                  disabled
                />
                <span className={`text-sm flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-300'}`}>{task.title}</span>
                <Badge variant="outline" className={
                  task.priority === 'high' ? 'text-red-400 border-red-400 text-xs' :
                  task.priority === 'medium' ? 'text-yellow-400 border-yellow-400 text-xs' :
                  'text-blue-400 border-blue-400 text-xs'}>
                  {task.priority === 'high' ? 'Urgente' : task.priority === 'medium' ? 'Médio' : 'Baixo'}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Frase de Autocuidado */}
        <GlassCard variant="gradient" className="w-full">
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Inspiração do Dia</h3>
          </div>
          {quoteLoading ? (
            <div className="text-center py-4">
              <div className="animate-pulse text-gray-400">Carregando inspiração...</div>
            </div>
          ) : (
            <p className="text-gray-300 italic text-center py-4 leading-relaxed">
              "{quote}"
            </p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Users, 
  BarChart3,
  Calendar,
  Settings,
  Shield,
  UserPlus,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const adminCards = [
    {
      title: 'Prospecção de Datas',
      description: 'Gerencie contatos e negociações com produtores',
      icon: Search,
      color: 'from-orange-500 to-yellow-400',
      hoverColor: 'hover:bg-orange-500/10',
      iconColor: 'text-orange-400',
      path: '/admin/prospeccao'
    },
    {
      title: 'Cadastro de DJs',
      description: 'Gerencie o cadastro e informações dos DJs',
      icon: UserPlus,
      color: 'from-purple-500 to-pink-400',
      hoverColor: 'hover:bg-purple-500/10',
      iconColor: 'text-purple-400',
      path: '/admin/djs'
    },
    {
      title: 'Relatórios',
      description: 'Visualize estatísticas e relatórios de performance',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-400',
      hoverColor: 'hover:bg-blue-500/10',
      iconColor: 'text-blue-400',
      path: '/admin/relatorios'
    },
    {
      title: 'Agenda Geral',
      description: 'Visão completa da agenda de todos os DJs',
      icon: Calendar,
      color: 'from-green-500 to-emerald-400',
      hoverColor: 'hover:bg-green-500/10',
      iconColor: 'text-green-400',
      path: '/admin/agenda'
    }
  ];

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Central do Admin
          </h1>
        </div>
        <p className="text-gray-300 text-base">
          Gerencie todos os aspectos administrativos da plataforma
        </p>
      </div>

      {/* Cards de Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {adminCards.map((card, index) => (
          <GlassCard 
            key={index}
            variant="music" 
            className={`${card.hoverColor} transition-all duration-200 cursor-pointer`}
            onClick={() => window.location.href = card.path}
          >
            <div className="flex items-center justify-between p-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  <h3 className="text-lg font-semibold text-white">
                    {card.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {card.description}
                </p>
              </div>
              <Button
                className={`bg-gradient-to-r ${card.color} text-white font-bold shadow-lg ml-4`}
                size="sm"
              >
                Acessar
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard variant="gradient" className="text-center p-4">
          <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">12</div>
          <div className="text-xs text-gray-400">DJs Ativos</div>
        </GlassCard>
        
        <GlassCard variant="gradient" className="text-center p-4">
          <Search className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">8</div>
          <div className="text-xs text-gray-400">Prospecções</div>
        </GlassCard>
        
        <GlassCard variant="gradient" className="text-center p-4">
          <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">5</div>
          <div className="text-xs text-gray-400">Eventos Hoje</div>
        </GlassCard>
        
        <GlassCard variant="gradient" className="text-center p-4">
          <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">+15%</div>
          <div className="text-xs text-gray-400">Crescimento</div>
        </GlassCard>
      </div>

      {/* Atividades Recentes */}
      <GlassCard variant="music" className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Atividades Recentes</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-sm text-white">Novo DJ cadastrado: João Silva</div>
              <div className="text-xs text-gray-400">Há 2 horas</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-sm text-white">Prospecção atualizada: Festa Corporativa XYZ</div>
              <div className="text-xs text-gray-400">Há 4 horas</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-sm text-white">Evento confirmado: Casamento Marina & Pedro</div>
              <div className="text-xs text-gray-400">Há 1 dia</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

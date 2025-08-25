import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BarChart3, Calendar, Search, UserPlus } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CentralAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Verificar se é admin
  React.useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  const adminModules = [
    {
      title: 'Cadastro de DJs',
      description: 'Registrar novos DJs no sistema',
      icon: UserPlus,
      color: 'text-green-400',
      route: '/admin/cadastro-djs',
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios por DJ, eventos e localidades',
      icon: BarChart3,
      color: 'text-blue-400',
      route: '/admin/relatorios',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Agenda Geral',
      description: 'Visualizar agenda completa de todos os DJs',
      icon: Calendar,
      color: 'text-purple-400',
      route: '/admin/agenda-geral',
      gradient: 'from-purple-500 to-indigo-400'
    },
    {
      title: 'Prospecção de Datas',
      description: 'Controle de negociações e contatos com produtores',
      icon: Search,
      color: 'text-orange-400',
      route: '/admin/prospeccao',
      gradient: 'from-orange-500 to-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Central do Admin
        </h1>
        <div></div>
      </div>

      {/* Welcome message */}
      <div className="text-center mb-8">
        <h2 className="text-xl text-gray-300 mb-2">
          Bem-vindo ao painel administrativo
        </h2>
        <p className="text-gray-400">
          Gerencie todos os aspectos da plataforma em um só lugar
        </p>
      </div>

      {/* Admin modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {adminModules.map((module) => {
          const IconComponent = module.icon;
          
          return (
            <GlassCard 
              key={module.route} 
              variant="music" 
              className="hover:bg-white/5 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.route)}
            >
              <div className="flex items-start justify-between h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className={`w-6 h-6 ${module.color}`} />
                    <h3 className="text-lg font-semibold text-white group-hover:text-gray-100">
                      {module.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <Button
                    className={`w-full bg-gradient-to-r ${module.gradient} text-white font-bold shadow-lg hover:shadow-xl transition-all`}
                  >
                    Acessar
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
        <GlassCard variant="music" className="text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-gray-400">DJs Ativos</div>
        </GlassCard>
        
        <GlassCard variant="music" className="text-center">
          <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-gray-400">Eventos</div>
        </GlassCard>
        
        <GlassCard variant="music" className="text-center">
          <Search className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-gray-400">Prospecções</div>
        </GlassCard>
        
        <GlassCard variant="music" className="text-center">
          <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-gray-400">Relatórios</div>
        </GlassCard>
      </div>
    </div>
  );
};

export default CentralAdmin;
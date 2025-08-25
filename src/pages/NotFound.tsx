import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useNavigate } from 'react-router-dom';
import { Home, Music } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <GlassCard variant="music" className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-2">Página Não Encontrada</h2>
        
        <p className="text-gray-300 mb-8">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full text-gray-300 border-gray-600 hover:bg-white/10"
          >
            Voltar à Página Anterior
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
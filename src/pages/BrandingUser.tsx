import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Palette, 
  Eye,
  Download,
  Share2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import BottomNavigation from '@/components/BottomNavigation';

interface BrandingData {
  id: string;
  user_id: string;
  brand_name: string;
  brand_colors: string[];
  logo_url: string;
  description: string;
  target_audience: string;
  values: string[];
  voice_tone: string;
  visual_style: string;
  social_media_strategy: string;
  created_at: string;
  updated_at: string;
}

const BrandingUser: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [brandingData, setBrandingData] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBrandingData();
    }
  }, [user]);

  const loadBrandingData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('branding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      setBrandingData(data);
    } catch (error) {
      console.error('Erro ao carregar branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const getToneLabel = (tone: string) => {
    const toneLabels: Record<string, string> = {
      profissional: 'Profissional',
      casual: 'Casual',
      divertido: 'Divertido',
      inspiracional: 'Inspiracional',
      autoritativo: 'Autoritativo',
      amigavel: 'Amigável'
    };
    return toneLabels[tone] || tone;
  };

  const getStyleLabel = (style: string) => {
    const styleLabels: Record<string, string> = {
      minimalista: 'Minimalista',
      moderno: 'Moderno',
      retro: 'Retrô',
      urbano: 'Urbano',
      elegante: 'Elegante',
      ousado: 'Ousado'
    };
    return styleLabels[style] || style;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl">Carregando branding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-[#100C1F]/90 via-[#0D0A18]/90 to-black/90 backdrop-blur-sm z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold">Meu Branding</h1>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 pb-24">
        {!brandingData ? (
          <GlassCard variant="music" className="text-center py-12">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Branding em Desenvolvimento
            </h3>
            <p className="text-gray-400 mb-6">
              Seu branding está sendo criado pelo admin. Em breve você poderá visualizar aqui todas as informações da sua marca.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-purple-400">
              <Eye className="w-4 h-4" />
              Aguarde a finalização
            </div>
          </GlassCard>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header do branding */}
            <GlassCard variant="music">
              <div className="text-center">
                {brandingData.logo_url && (
                  <img
                    src={brandingData.logo_url}
                    alt="Logo"
                    className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
                  />
                )}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {brandingData.brand_name || 'Sua Marca'}
                </h2>
                {brandingData.description && (
                  <p className="text-gray-300 leading-relaxed">
                    {brandingData.description}
                  </p>
                )}
              </div>
            </GlassCard>

            {/* Cores da marca */}
            <GlassCard variant="music">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Paleta de Cores
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {brandingData.brand_colors?.map((color, index) => 
                  color && (
                    <div key={index} className="text-center">
                      <div
                        className="w-full h-16 rounded-lg border border-gray-600 mb-2"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm text-gray-300 font-mono">
                        {color.toUpperCase()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </GlassCard>

            {/* Público-alvo */}
            {brandingData.target_audience && (
              <GlassCard variant="music">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Público-alvo
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {brandingData.target_audience}
                </p>
              </GlassCard>
            )}

            {/* Valores da marca */}
            {brandingData.values && brandingData.values.some(v => v) && (
              <GlassCard variant="music">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Valores da Marca
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {brandingData.values.map((value, index) => 
                    value && (
                      <Badge key={index} className="bg-purple-500/20 text-purple-400 p-2 text-center">
                        {value}
                      </Badge>
                    )
                  )}
                </div>
              </GlassCard>
            )}

            {/* Tom de voz e estilo visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandingData.voice_tone && (
                <GlassCard variant="music">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Tom de Voz
                  </h3>
                  <Badge className="bg-blue-500/20 text-blue-400 text-lg p-3">
                    {getToneLabel(brandingData.voice_tone)}
                  </Badge>
                </GlassCard>
              )}

              {brandingData.visual_style && (
                <GlassCard variant="music">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Estilo Visual
                  </h3>
                  <Badge className="bg-green-500/20 text-green-400 text-lg p-3">
                    {getStyleLabel(brandingData.visual_style)}
                  </Badge>
                </GlassCard>
              )}
            </div>

            {/* Estratégia de redes sociais */}
            {brandingData.social_media_strategy && (
              <GlassCard variant="music">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Estratégia de Redes Sociais
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {brandingData.social_media_strategy}
                </p>
              </GlassCard>
            )}

            {/* Informações de atualização */}
            <GlassCard variant="music" className="text-center">
              <div className="text-sm text-gray-400">
                <p className="mb-2">
                  Branding criado em: {new Date(brandingData.created_at).toLocaleDateString('pt-BR')}
                </p>
                {brandingData.updated_at && (
                  <p>
                    Última atualização: {new Date(brandingData.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </GlassCard>

            {/* Ações */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-white/10"
              >
                <Download size={16} className="mr-2" />
                Exportar
              </Button>
              
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Branding - ${brandingData.brand_name}`,
                      text: brandingData.description,
                      url: window.location.href
                    });
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BrandingUser;
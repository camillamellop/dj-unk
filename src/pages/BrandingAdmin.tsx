import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Palette, 
  User, 
  Save, 
  Edit,
  Eye,
  Search
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

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
  user_name: string;
  artist_name: string;
}

interface User {
  id: string;
  full_name: string;
  artist_name: string;
}

const BrandingAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [brandingData, setBrandingData] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    brand_name: '',
    brand_colors: ['', '', ''],
    logo_url: '',
    description: '',
    target_audience: '',
    values: ['', '', '', ''],
    voice_tone: '',
    visual_style: '',
    social_media_strategy: ''
  });

  // Verificar se é admin
  React.useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.is_admin) {
      loadUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId) {
      loadBrandingData();
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, artist_name')
        .eq('is_admin', false)
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrandingData = async () => {
    if (!selectedUserId) return;

    try {
      const { data, error } = await supabase
        .from('branding')
        .select(`
          *,
          profiles:user_id (
            full_name,
            artist_name
          )
        `)
        .eq('user_id', selectedUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setBrandingData(data);
        setFormData({
          brand_name: data.brand_name || '',
          brand_colors: data.brand_colors || ['', '', ''],
          logo_url: data.logo_url || '',
          description: data.description || '',
          target_audience: data.target_audience || '',
          values: data.values || ['', '', '', ''],
          voice_tone: data.voice_tone || '',
          visual_style: data.visual_style || '',
          social_media_strategy: data.social_media_strategy || ''
        });
      } else {
        setBrandingData(null);
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao carregar branding:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      brand_name: '',
      brand_colors: ['', '', ''],
      logo_url: '',
      description: '',
      target_audience: '',
      values: ['', '', '', ''],
      voice_tone: '',
      visual_style: '',
      social_media_strategy: ''
    });
  };

  const handleSave = async () => {
    if (!selectedUserId) return;

    setSaving(true);
    try {
      if (brandingData) {
        // Atualizar branding existente
        const { error } = await supabase
          .from('branding')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', brandingData.id);

        if (error) throw error;
      } else {
        // Criar novo branding
        const { error } = await supabase
          .from('branding')
          .insert({
            ...formData,
            user_id: selectedUserId,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      loadBrandingData();
      alert('Branding salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar branding:', error);
      alert('Erro ao salvar branding');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...formData.brand_colors];
    newColors[index] = value;
    setFormData(prev => ({ ...prev, brand_colors: newColors }));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = value;
    setFormData(prev => ({ ...prev, values: newValues }));
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.artist_name && u.artist_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl">Carregando usuários...</p>
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
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Branding - Admin
        </h1>
        <div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Lista de usuários */}
        <div className="lg:col-span-1">
          <GlassCard variant="music">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Selecionar DJ</h3>
            </div>

            <div className="mb-4">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-gray-600 text-white"
                placeholder="Buscar DJ..."
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedUserId === u.id
                      ? 'bg-purple-600/20 border border-purple-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-white">{u.full_name}</div>
                  {u.artist_name && (
                    <div className="text-sm text-gray-400">@{u.artist_name}</div>
                  )}
                </button>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum DJ encontrado</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Formulário de branding */}
        <div className="lg:col-span-2">
          {selectedUserId ? (
            <GlassCard variant="music">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Branding - {users.find(u => u.id === selectedUserId)?.full_name}
                  </h3>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
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

              <div className="space-y-6">
                {/* Informações básicas */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
                    Informações Básicas
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome da Marca
                    </label>
                    <Input
                      type="text"
                      value={formData.brand_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white"
                      placeholder="Nome da marca do DJ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo URL
                    </label>
                    <Input
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white"
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição da Marca
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white min-h-[100px]"
                      placeholder="Descrição da identidade da marca..."
                    />
                  </div>
                </div>

                {/* Cores da marca */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
                    Cores da Marca
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    {formData.brand_colors.map((color, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cor {index + 1}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color || '#ffffff'}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="w-12 h-10 rounded border border-gray-600 bg-transparent cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="bg-white/10 border-gray-600 text-white flex-1"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Público-alvo */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
                    Público-alvo
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição do Público-alvo
                    </label>
                    <Textarea
                      value={formData.target_audience}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white min-h-[80px]"
                      placeholder="Descrição do público-alvo..."
                    />
                  </div>
                </div>

                {/* Valores da marca */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
                    Valores da Marca
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {formData.values.map((value, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Valor {index + 1}
                        </label>
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                          className="bg-white/10 border-gray-600 text-white"
                          placeholder={`Valor ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tom de voz e estilo */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
                    Comunicação e Estilo
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tom de Voz
                      </label>
                      <select
                        value={formData.voice_tone}
                        onChange={(e) => setFormData(prev => ({ ...prev, voice_tone: e.target.value }))}
                        className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Selecione o tom de voz</option>
                        <option value="profissional">Profissional</option>
                        <option value="casual">Casual</option>
                        <option value="divertido">Divertido</option>
                        <option value="inspiracional">Inspiracional</option>
                        <option value="autoritativo">Autoritativo</option>
                        <option value="amigavel">Amigável</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Estilo Visual
                      </label>
                      <select
                        value={formData.visual_style}
                        onChange={(e) => setFormData(prev => ({ ...prev, visual_style: e.target.value }))}
                        className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Selecione o estilo visual</option>
                        <option value="minimalista">Minimalista</option>
                        <option value="moderno">Moderno</option>
                        <option value="retro">Retrô</option>
                        <option value="urbano">Urbano</option>
                        <option value="elegante">Elegante</option>
                        <option value="ousado">Ousado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Estratégia de redes sociais */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
                    Estratégia de Redes Sociais
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estratégia de Conteúdo
                    </label>
                    <Textarea
                      value={formData.social_media_strategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, social_media_strategy: e.target.value }))}
                      className="bg-white/10 border-gray-600 text-white min-h-[100px]"
                      placeholder="Descrição da estratégia de redes sociais..."
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard variant="music" className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Selecione um DJ
              </h3>
              <p className="text-gray-400">
                Escolha um DJ na lista para gerenciar seu branding
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandingAdmin;
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Plus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Music,
  Star,
  Calendar,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

interface DJ {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estilo: string;
  preco: string;
  avaliacao: number;
  status: 'ativo' | 'inativo';
  observacoes: string;
  dataCadastro: number;
}

export default function DJsManagement() {
  const { user } = useAuth();
  const [djs, setDjs] = useState<DJ[]>([
    {
      id: '1',
      nome: 'DJ Alex',
      email: 'alex@email.com',
      telefone: '(11) 99999-9999',
      cidade: 'São Paulo',
      estilo: 'House, Techno',
      preco: 'R$ 2.000',
      avaliacao: 5,
      status: 'ativo',
      observacoes: 'DJ experiente, especialista em festas corporativas',
      dataCadastro: Date.now() - 86400000 * 30
    },
    {
      id: '2',
      nome: 'DJ Marina',
      email: 'marina@email.com',
      telefone: '(11) 88888-8888',
      cidade: 'Rio de Janeiro',
      estilo: 'Pop, Funk',
      preco: 'R$ 1.500',
      avaliacao: 4,
      status: 'ativo',
      observacoes: 'Especialista em casamentos e eventos sociais',
      dataCadastro: Date.now() - 86400000 * 15
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estilo: '',
    preco: '',
    avaliacao: 5,
    status: 'ativo' as 'ativo' | 'inativo',
    observacoes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.nome || !form.email) return;

    const newDJ: DJ = {
      id: editingId || Date.now().toString(),
      ...form,
      dataCadastro: editingId ? djs.find(d => d.id === editingId)?.dataCadastro || Date.now() : Date.now()
    };

    if (editingId) {
      setDjs(djs.map(d => d.id === editingId ? newDJ : d));
    } else {
      setDjs([...djs, newDJ]);
    }

    setShowForm(false);
    setForm({
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estilo: '',
      preco: '',
      avaliacao: 5,
      status: 'ativo',
      observacoes: ''
    });
    setEditingId(null);
  };

  const handleEdit = (dj: DJ) => {
    setForm({
      nome: dj.nome,
      email: dj.email,
      telefone: dj.telefone,
      cidade: dj.cidade,
      estilo: dj.estilo,
      preco: dj.preco,
      avaliacao: dj.avaliacao,
      status: dj.status,
      observacoes: dj.observacoes
    });
    setEditingId(dj.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDjs(djs.filter(d => d.id !== id));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/admin'}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <User className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            Cadastro de DJs
          </h1>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({
              nome: '',
              email: '',
              telefone: '',
              cidade: '',
              estilo: '',
              preco: '',
              avaliacao: 5,
              status: 'ativo',
              observacoes: ''
            });
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-400"
        >
          <Plus className="w-4 h-4 mr-1" /> Novo DJ
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">
            {editingId ? 'Editar DJ' : 'Cadastrar Novo DJ'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
              <input
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="Nome do DJ"
                value={form.nome}
                onChange={e => setForm(f => ({...f, nome: e.target.value}))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
              <input
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={e => setForm(f => ({...f, telefone: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
              <input
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="São Paulo"
                value={form.cidade}
                onChange={e => setForm(f => ({...f, cidade: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estilo Musical</label>
              <input
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="House, Techno, Pop"
                value={form.estilo}
                onChange={e => setForm(f => ({...f, estilo: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preço</label>
              <input
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="R$ 2.000"
                value={form.preco}
                onChange={e => setForm(f => ({...f, preco: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Avaliação</label>
              <select
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                value={form.avaliacao}
                onChange={e => setForm(f => ({...f, avaliacao: parseInt(e.target.value)}))}
              >
                <option value={1}>1 Estrela</option>
                <option value={2}>2 Estrelas</option>
                <option value={3}>3 Estrelas</option>
                <option value={4}>4 Estrelas</option>
                <option value={5}>5 Estrelas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                value={form.status}
                onChange={e => setForm(f => ({...f, status: e.target.value as 'ativo' | 'inativo'}))}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
              <textarea
                className="w-full rounded bg-black/20 border border-gray-700 px-3 py-2 text-white"
                placeholder="Observações sobre o DJ..."
                rows={3}
                value={form.observacoes}
                onChange={e => setForm(f => ({...f, observacoes: e.target.value}))}
              />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                size="sm"
                className="bg-purple-500 hover:bg-purple-400 text-white"
              >
                {editingId ? 'Salvar Alterações' : 'Cadastrar DJ'}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                size="sm"
                variant="ghost"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Lista de DJs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-gray-400 text-sm col-span-full text-center">Carregando...</div>
        ) : djs.length === 0 ? (
          <div className="text-gray-400 text-sm col-span-full text-center">Nenhum DJ cadastrado.</div>
        ) : (
          djs.map(dj => (
            <GlassCard key={dj.id} className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-white">{dj.nome}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        dj.status === 'ativo' 
                          ? 'text-green-400 border-green-400' 
                          : 'text-red-400 border-red-400'
                      }`}
                    >
                      {dj.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(dj.avaliacao)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(dj)}
                    className="text-neutral-400 hover:text-white h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(dj.id)}
                    className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{dj.email}</span>
                </div>
                {dj.telefone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>{dj.telefone}</span>
                  </div>
                )}
                {dj.cidade && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{dj.cidade}</span>
                  </div>
                )}
                {dj.estilo && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Music className="w-4 h-4" />
                    <span>{dj.estilo}</span>
                  </div>
                )}
                {dj.preco && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="w-4 h-4" />
                    <span>{dj.preco}</span>
                  </div>
                )}
                {dj.observacoes && (
                  <div className="mt-3 p-2 bg-white/5 rounded text-xs text-gray-400">
                    {dj.observacoes}
                  </div>
                )}
                <div className="mt-3 text-xs text-neutral-500">
                  Cadastrado em: {new Date(dj.dataCadastro).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

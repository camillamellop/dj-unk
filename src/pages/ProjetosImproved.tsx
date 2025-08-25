import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Music, 
  Instagram, 
  Target, 
  FileText,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  Share2,
  Eye,
  Send
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import BottomNavigation from '@/components/BottomNavigation';

interface Task {
  id: string;
  user_id: string;
  titulo: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  due_date: string;
  created_at: string;
}

interface MusicProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'planning' | 'recording' | 'mixing' | 'completed';
  shared_with_admin: boolean;
  deadline: string;
  created_at: string;
}

interface InstagramPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'posted';
  post_type: 'photo' | 'video' | 'carousel' | 'story';
  created_at: string;
}

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  target_date: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

interface Document {
  id: string;
  user_id: string;
  title: string;
  description: string;
  file_url: string;
  shared_with_admin: boolean;
  created_at: string;
}

const ProjetosImproved: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tarefas');
  
  // Estados para cada seção
  const [tasks, setTasks] = useState<Task[]>([]);
  const [musicProjects, setMusicProjects] = useState<MusicProject[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Formulários
  const [taskForm, setTaskForm] = useState({
    titulo: '',
    description: '',
    priority: 'medium' as const,
    due_date: ''
  });

  const [musicProjectForm, setMusicProjectForm] = useState({
    title: '',
    description: '',
    deadline: '',
    shared_with_admin: false
  });

  const [instagramForm, setInstagramForm] = useState({
    title: '',
    content: '',
    post_type: 'photo' as const,
    status: 'draft' as const
  });

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    target_value: 0,
    target_date: ''
  });

  const [documentForm, setDocumentForm] = useState({
    title: '',
    description: '',
    file_url: '',
    shared_with_admin: true
  });

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTasks(),
        loadMusicProjects(),
        loadInstagramPosts(),
        loadGoals(),
        loadDocuments()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTasks(data || []);
  };

  const loadMusicProjects = async () => {
    const { data, error } = await supabase
      .from('music_projects')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setMusicProjects(data || []);
  };

  const loadInstagramPosts = async () => {
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setInstagramPosts(data || []);
  };

  const loadGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setGoals(data || []);
  };

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setDocuments(data || []);
  };

  // Funções para tarefas
  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    
    const { error } = await supabase
      .from('tarefas')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (!error) {
      loadTasks();
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('tarefas')
          .update(taskForm)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tarefas')
          .insert({
            ...taskForm,
            user_id: user?.id,
            status: 'todo'
          });

        if (error) throw error;
      }

      setShowForm(false);
      resetForms();
      loadTasks();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setSaving(false);
    }
  };

  // Funções para projetos musicais
  const handleMusicProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('music_projects')
          .update(musicProjectForm)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('music_projects')
          .insert({
            ...musicProjectForm,
            user_id: user?.id,
            status: 'planning'
          });

        if (error) throw error;
      }

      setShowForm(false);
      resetForms();
      loadMusicProjects();
    } catch (error) {
      console.error('Erro ao salvar projeto musical:', error);
    } finally {
      setSaving(false);
    }
  };

  // Funções para posts do Instagram
  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('instagram_posts')
          .update(instagramForm)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('instagram_posts')
          .insert({
            ...instagramForm,
            user_id: user?.id
          });

        if (error) throw error;
      }

      setShowForm(false);
      resetForms();
      loadInstagramPosts();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForms = () => {
    setTaskForm({
      titulo: '',
      description: '',
      priority: 'medium',
      due_date: ''
    });
    setMusicProjectForm({
      title: '',
      description: '',
      deadline: '',
      shared_with_admin: false
    });
    setInstagramForm({
      title: '',
      content: '',
      post_type: 'photo',
      status: 'draft'
    });
    setGoalForm({
      title: '',
      description: '',
      target_value: 0,
      target_date: ''
    });
    setDocumentForm({
      title: '',
      description: '',
      file_url: '',
      shared_with_admin: true
    });
    setEditingItem(null);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-blue-500/20 text-blue-400'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'Urgente',
      medium: 'Médio',
      low: 'Baixo'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const handleDelete = async (table: string, id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (!error) {
        loadAllData();
      }
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl">Carregando projetos...</p>
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
            <h1 className="text-lg sm:text-xl font-bold">Projetos</h1>
          </div>
          
          <Button
            onClick={() => {
              resetForms();
              setShowForm(true);
            }}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-2"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 pb-24">
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          {[
            { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
            { id: 'musica', label: 'Projetos Musicais', icon: Music },
            { id: 'instagram', label: 'Posts Instagram', icon: Instagram },
            { id: 'metas', label: 'Metas', icon: Target },
            { id: 'documentos', label: 'Documentos', icon: FileText }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  resetForms();
                  setShowForm(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'tarefas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Tarefas</h2>
              <Badge className="bg-purple-500/20 text-purple-400">
                {tasks.filter(t => t.status === 'completed').length}/{tasks.length} concluídas
              </Badge>
            </div>

            {tasks.length === 0 ? (
              <GlassCard variant="music" className="text-center py-12">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma tarefa cadastrada</h3>
                <p className="text-gray-400 mb-6">Organize suas atividades com tarefas</p>
                <Button
                  onClick={() => {
                    resetForms();
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Criar Tarefa
                </Button>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <GlassCard key={task.id} variant="music">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => handleTaskToggle(task.id, task.status)}
                        className="mt-1 w-5 h-5 text-purple-600 rounded border-gray-600 focus:ring-purple-500"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-medium mb-1 ${
                              task.status === 'completed' 
                                ? 'line-through text-gray-400' 
                                : 'text-white'
                            }`}>
                              {task.titulo}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-400 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                              {task.due_date && (
                                <span className="text-xs text-gray-400">
                                  Vence: {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => {
                                setEditingItem(task);
                                setTaskForm({
                                  titulo: task.titulo,
                                  description: task.description,
                                  priority: task.priority,
                                  due_date: task.due_date
                                });
                                setShowForm(true);
                              }}
                              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete('tasks', task.id)}
                             onClick={() => handleDelete('tarefas', task.id)}
                              className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'musica' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Projetos Musicais</h2>
              <Badge className="bg-blue-500/20 text-blue-400">
                {musicProjects.length} projetos
              </Badge>
            </div>

            {musicProjects.length === 0 ? (
              <GlassCard variant="music" className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto musical</h3>
                <p className="text-gray-400 mb-6">Organize seus projetos musicais</p>
                <Button
                  onClick={() => {
                    resetForms();
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Novo Projeto
                </Button>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {musicProjects.map(project => (
                  <GlassCard key={project.id} variant="music">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          {project.shared_with_admin && (
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                              <Share2 size={10} className="mr-1" />
                              Compartilhado
                            </Badge>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            {project.status}
                          </Badge>
                          {project.deadline && (
                            <span className="text-xs text-gray-400">
                              Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => {
                            setEditingItem(project);
                            setMusicProjectForm({
                              title: project.title,
                              description: project.description,
                              deadline: project.deadline,
                              shared_with_admin: project.shared_with_admin
                            });
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete('music_projects', project.id)}
                          className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulário Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-md my-8">
              <GlassCard variant="music">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {editingItem ? 'Editar' : 'Novo'} {
                      activeTab === 'tarefas' ? 'Tarefa' :
                      activeTab === 'musica' ? 'Projeto Musical' :
                      activeTab === 'instagram' ? 'Post' :
                      activeTab === 'metas' ? 'Meta' : 'Documento'
                    }
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForms();
                    }}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Formulário de Tarefas */}
                {activeTab === 'tarefas' && (
                  <form onSubmit={handleTaskSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Título *
                      </label>
                      <Input
                        type="text"
                        value={taskForm.titulo}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, titulo: e.target.value }))}
                        className="bg-white/10 border-gray-600 text-white"
                        placeholder="Título da tarefa"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição
                      </label>
                      <Textarea
                        value={taskForm.description}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-white/10 border-gray-600 text-white min-h-[80px]"
                        placeholder="Detalhes da tarefa..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Prioridade
                        </label>
                        <select
                          value={taskForm.priority}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as any }))}
                          className="w-full p-2 bg-white/10 border border-gray-600 rounded-md text-white text-sm"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Urgente</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Data limite
                        </label>
                        <Input
                          type="date"
                          value={taskForm.due_date}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, due_date: e.target.value }))}
                          className="bg-white/10 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          resetForms();
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
                        {saving ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Formulário de Projetos Musicais */}
                {activeTab === 'musica' && (
                  <form onSubmit={handleMusicProjectSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Título *
                      </label>
                      <Input
                        type="text"
                        value={musicProjectForm.title}
                        onChange={(e) => setMusicProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-white/10 border-gray-600 text-white"
                        placeholder="Nome do projeto"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição
                      </label>
                      <Textarea
                        value={musicProjectForm.description}
                        onChange={(e) => setMusicProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-white/10 border-gray-600 text-white min-h-[80px]"
                        placeholder="Detalhes do projeto..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Prazo
                      </label>
                      <Input
                        type="date"
                        value={musicProjectForm.deadline}
                        onChange={(e) => setMusicProjectForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="bg-white/10 border-gray-600 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="shared_music"
                        checked={musicProjectForm.shared_with_admin}
                        onChange={(e) => setMusicProjectForm(prev => ({ ...prev, shared_with_admin: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                      />
                      <label htmlFor="shared_music" className="text-sm text-gray-300 flex items-center gap-1">
                        <Share2 size={14} />
                        Compartilhar com admin
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          resetForms();
                        }}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300"
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        disabled={saving}
                      >
                        {saving ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProjetosImproved;
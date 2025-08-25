import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type Task = {
  id: string;
  titulo: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
};

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tarefas')
        .select('id, titulo, status, priority, due_date')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const addTask = async (titulo: string, priority: Task['priority'], due_date?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tarefas')
        .insert({
          titulo,
          priority,
          due_date,
          user_id: user.id,
          status: 'todo'
        });

      if (error) throw error;
      loadTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const toggleTask = async (id: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      loadTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTasks();
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  };

  return { tasks, addTask, toggleTask, removeTask, loading, refreshTasks: loadTasks };
}

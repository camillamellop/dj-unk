import { supabase } from '@/lib/supabase';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initialData = useMemo(() => ({
    full_name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    artist_name: profile?.artist_name || '',
    birth_date: profile?.birth_date || '',
    pix_key: profile?.pix_key || '',
    genres: profile?.genres || [],
    portfolio_url: profile?.portfolio_url || '',
    instagram_url: profile?.instagram_url || '',
    youtube_url: profile?.youtube_url || '',
    presskit_url: profile?.presskit_url || '',
    music_links: profile?.music_links || []
  }), [user, profile]);

  const [editData, setEditData] = useState(initialData);

  useEffect(() => {
    setEditData(initialData);
  }, [initialData]);

  const handleLogout = useCallback(async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      try {
        await supabase.auth.signOut();
        navigate('/login');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }
  }, [navigate]);

  const handleEdit = useCallback(() => {
    setEditData(initialData);
    setIsEditing(true);
  }, [initialData]);

  const handleSave = useCallback(async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editData, user, updateProfile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditData(initialData);
  }, [initialData]);

  const handleInputChange = useCallback((field: string, value: string | any[]) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Usuário não autenticado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white pb-36">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Perfil</h1>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-400">Nome completo</label>
          {isEditing ? (
            <input
              className="w-full p-2 rounded bg-white/10"
              value={editData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
            />
          ) : (
            <p>{profile?.full_name || '-'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400">Email</label>
          <p>{user.email}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-400">Bio</label>
          {isEditing ? (
            <textarea
              className="w-full p-2 rounded bg-white/10"
              value={editData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
            />
          ) : (
            <p>{profile?.bio || '-'}</p>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              disabled={isSaving}
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-500 rounded"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 rounded"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-cyan-500 rounded"
          >
            Editar Perfil
          </button>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;

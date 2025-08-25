import { supabase } from '@/lib/supabase';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // All hooks must be called before any conditional returns
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
  
  // Debug logging
  useEffect(() => {
    console.log('ProfilePage - Auth State:', { user, loading });
  }, [user, loading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('ProfilePage - Redirecting to login (no user)');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Usuário não autenticado</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-cyan-400 text-black rounded-full font-bold hover:bg-cyan-300 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100C1F] via-[#0D0A18] to-black text-white pb-36 sm:pb-32 overflow-x-hidden profile-page">
       <div className="p-2 sm:p-3 md:p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10 mobile-header">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mobile-button"
            title="Voltar"
          >
            <ArrowLeft size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
          <h1 className="text-base sm:text-lg md:text-xl font-bold">Perfil</h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mobile-button"
            title="Sair da conta"
          >
            <LogOut size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>

      <div className="p-2 sm:p-3 md:p-4 space-y-3 sm:space-y-4 md:space-y-6 profile-content">
        <UserProfileComponent 
          profile={profile || {}}
          user={user}
          isEditing={isEditing}
          isSaving={isSaving}
          editData={editData}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onInputChange={handleInputChange}
          updateProfile={updateProfile}
        />
      </div>
  <BottomNavigation />
    </div>
  );
};

export default ProfilePage;

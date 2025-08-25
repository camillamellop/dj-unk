import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          await loadProfile(user.id)
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    try {
      console.log('Carregando perfil para usuário:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          name,
          full_name,
          email,
          role,
          phone,
          bio,
          location,
          artist_name,
          birth_date,
          pix_key,
          genres,
          portfolio_url,
          instagram_url,
          youtube_url,
          presskit_url,
          music_links
        `)
        .eq('user_id', userId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', error)
        return
      }

      console.log('Perfil carregado:', data)
      setProfile(data)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return

    console.log('Tentando atualizar perfil:', { user: user.id, updates })

    try {
      // Primeiro, atualiza o perfil no banco
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select(`
          user_id,
          name,
          full_name,
          email,
          role,
          phone,
          bio,
          location,
          artist_name,
          birth_date,
          pix_key,
          genres,
          portfolio_url,
          instagram_url,
          youtube_url,
          presskit_url,
          music_links
        `)
        .single()

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        throw error
      }

      if (data) {
        console.log('Perfil atualizado com sucesso:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
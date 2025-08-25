import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']

// Tipos para respostas de queries
export type QueryResult<T> = {
  data: T | null
  error: string | null
  loading?: boolean
}

export type QueryListResult<T> = {
  data: T[] | null
  error: string | null
  loading?: boolean
  count?: number
}

// Classe para queries type-safe
export class SupabaseQuery {
  // Buscar todos os perfis
  static async getProfiles(): Promise<QueryListResult<Tables['profiles']['Row']>> {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      return {
        data: data || null,
        error: error ? error.message : null,
        count: count || 0
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Buscar perfil por ID
  static async getProfileById(id: string): Promise<QueryResult<Tables['profiles']['Row']>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .single()

      return {
        data: data || null,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Atualizar perfil
  static async updateProfile(
    user_id: string, 
    updates: Tables['profiles']['Update']
  ): Promise<QueryResult<Tables['profiles']['Row']>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user_id)
        .select()
        .single()

      return {
        data: data || null,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Criar novo perfil
  static async createProfile(
    profile: Tables['profiles']['Insert']
  ): Promise<QueryResult<Tables['profiles']['Row']>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single()

      return {
        data: data || null,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Deletar perfil
  static async deleteProfile(user_id: string): Promise<QueryResult<boolean>> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user_id)

      return {
        data: !error,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        data: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Buscar com filtros dinâmicos
  static async getProfilesWithFilters(filters: {
    name?: string
    email?: string
    role?: string
    limit?: number
    offset?: number
  }): Promise<QueryListResult<Tables['profiles']['Row']>> {
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      // Aplicar filtros dinamicamente
      if (filters.name) {
        query = query.ilike('full_name', `%${filters.name}%`)
      }
      
      if (filters.email) {
        query = query.ilike('email', `%${filters.email}%`)
      }
      
      if (filters.role) {
        query = query.eq('role', filters.role)
      }

      // Aplicar paginação
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      return {
        data: data || null,
        error: error ? error.message : null,
        count: count || 0
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }
}

// Utilitários para autenticação
export class AuthUtils {
  // Login com email e senha
  static async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return {
        user: data.user,
        session: data.session,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Registro com email e senha
  static async signUpWithEmail(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      return {
        user: data.user,
        session: data.session,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Reset de senha
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      return {
        success: !error,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  // Atualizar senha
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return {
        success: !error,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }
}

// Utilitários para upload de arquivos
export class StorageUtils {
  static async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { upsert?: boolean }
  ) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: options?.upsert || false
        })

      return {
        data,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  static async getPublicUrl(bucket: string, path: string) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return {
        url: data.publicUrl,
        error: null
      }
    } catch (err) {
      return {
        url: null,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }

  static async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      return {
        success: !error,
        error: error ? error.message : null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      }
    }
  }
}
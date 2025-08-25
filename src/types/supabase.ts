export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      apresentacoes: {
        Row: {
          cidade: string
          created_at: string
          data_apresentacao: string
          dj_id: string
          evento: string | null
          id: string
          observacoes: string | null
          produtor: string | null
          updated_at: string
          valor_cache: number | null
        }
        Insert: {
          cidade: string
          created_at?: string
          data_apresentacao: string
          dj_id: string
          evento?: string | null
          id?: string
          observacoes?: string | null
          produtor?: string | null
          updated_at?: string
          valor_cache?: number | null
        }
        Update: {
          cidade?: string
          created_at?: string
          data_apresentacao?: string
          dj_id?: string
          evento?: string | null
          id?: string
          observacoes?: string | null
          produtor?: string | null
          updated_at?: string
          valor_cache?: number | null
        }
        Relationships: []
      }
      auto_cuidado: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          type: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          type: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          type?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      branding: {
        Row: {
          comunicacao: Json | null
          created_at: string
          editado_em: string | null
          editado_por: string | null
          id: string
          identidade_visual: Json | null
          personalidade: Json | null
          planos_acao: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comunicacao?: Json | null
          created_at?: string
          editado_em?: string | null
          editado_por?: string | null
          id?: string
          identidade_visual?: Json | null
          personalidade?: Json | null
          planos_acao?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comunicacao?: Json | null
          created_at?: string
          editado_em?: string | null
          editado_por?: string | null
          id?: string
          identidade_visual?: Json | null
          personalidade?: Json | null
          planos_acao?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      caches: {
        Row: {
          comprovante_url: string | null
          created_at: string
          data_vencimento: string | null
          evento_id: string | null
          id: string
          observacoes: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string
          data_vencimento?: string | null
          evento_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string
          data_vencimento?: string | null
          evento_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      compartilhamentos: {
        Row: {
          created_at: string
          de_user_id: string
          id: string
          item_id: string
          item_tipo: string
          mensagem: string | null
          para_user_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          de_user_id: string
          id?: string
          item_id: string
          item_tipo: string
          mensagem?: string | null
          para_user_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          de_user_id?: string
          id?: string
          item_id?: string
          item_tipo?: string
          mensagem?: string | null
          para_user_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comunicacao: {
        Row: {
          created_at: string
          hashtags: Json | null
          id: string
          social_accounts: Json | null
          tones: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hashtags?: Json | null
          id?: string
          social_accounts?: Json | null
          tones?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hashtags?: Json | null
          id?: string
          social_accounts?: Json | null
          tones?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documentos: {
        Row: {
          arquivo_url: string
          compartilhado: boolean | null
          compartilhado_com: string | null
          created_at: string
          descricao: string | null
          id: string
          projeto_id: string | null
          tamanho_arquivo: number | null
          tipo_arquivo: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          arquivo_url: string
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          projeto_id?: string | null
          tamanho_arquivo?: number | null
          tipo_arquivo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          arquivo_url?: string
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          projeto_id?: string | null
          tamanho_arquivo?: number | null
          tipo_arquivo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          compartilhado: boolean | null
          compartilhado_com: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          descricao: string | null
          id: string
          local_endereco: string | null
          local_nome: string | null
          notificacoes_ativas: boolean | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string
          user_id: string
          valor_cache: number | null
        }
        Insert: {
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          descricao?: string | null
          id?: string
          local_endereco?: string | null
          local_nome?: string | null
          notificacoes_ativas?: boolean | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
          valor_cache?: number | null
        }
        Update: {
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          id?: string
          local_endereco?: string | null
          local_nome?: string | null
          notificacoes_ativas?: boolean | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
          valor_cache?: number | null
        }
        Relationships: []
      }
      frases_autocuidado: {
        Row: {
          ativa: boolean | null
          categoria: string | null
          created_at: string
          frase: string
          id: number
        }
        Insert: {
          ativa?: boolean | null
          categoria?: string | null
          created_at?: string
          frase: string
          id?: number
        }
        Update: {
          ativa?: boolean | null
          categoria?: string | null
          created_at?: string
          frase?: string
          id?: number
        }
        Relationships: []
      }
      gastos_fixos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string
          data_vencimento: number | null
          id: string
          nome: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string
          data_vencimento?: number | null
          id?: string
          nome: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string
          data_vencimento?: number | null
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      gig_bookings: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          end_time: string | null
          equipment_needed: Json | null
          event_date: string
          event_name: string
          fee: number | null
          id: string
          notes: string | null
          project_id: string | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          end_time?: string | null
          equipment_needed?: Json | null
          event_date: string
          event_name: string
          fee?: number | null
          id?: string
          notes?: string | null
          project_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          end_time?: string | null
          equipment_needed?: Json | null
          event_date?: string
          event_name?: string
          fee?: number | null
          id?: string
          notes?: string | null
          project_id?: string | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gig_bookings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      gratitudes: {
        Row: {
          content: string
          created_at: string | null
          date: string | null
          id: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identidade_visual: {
        Row: {
          brand_colors: Json | null
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_colors?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_colors?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      metas: {
        Row: {
          ativa: boolean | null
          created_at: string
          descricao: string | null
          id: string
          prazo: string | null
          projeto_id: string | null
          titulo: string
          unidade: string | null
          updated_at: string
          user_id: string
          valor_atual: number | null
          valor_meta: number
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          projeto_id?: string | null
          titulo: string
          unidade?: string | null
          updated_at?: string
          user_id: string
          valor_atual?: number | null
          valor_meta: number
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          projeto_id?: string | null
          titulo?: string
          unidade?: string | null
          updated_at?: string
          user_id?: string
          valor_atual?: number | null
          valor_meta?: number
        }
        Relationships: []
      }
      metas_financeiras: {
        Row: {
          ativa: boolean | null
          categoria: string | null
          created_at: string
          id: string
          prazo: string | null
          titulo: string
          updated_at: string
          user_id: string
          valor_atual: number | null
          valor_meta: number
        }
        Insert: {
          ativa?: boolean | null
          categoria?: string | null
          created_at?: string
          id?: string
          prazo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
          valor_atual?: number | null
          valor_meta: number
        }
        Update: {
          ativa?: boolean | null
          categoria?: string | null
          created_at?: string
          id?: string
          prazo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
          valor_atual?: number | null
          valor_meta?: number
        }
        Relationships: []
      }
      metrics: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          type: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          type: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          type?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      notas_rapidas: {
        Row: {
          conteudo: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          created_at: string
          data_lida: string | null
          id: string
          lida: boolean | null
          mensagem: string
          tipo: string | null
          titulo: string
          url_acao: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_lida?: string | null
          id?: string
          lida?: boolean | null
          mensagem: string
          tipo?: string | null
          titulo: string
          url_acao?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_lida?: string | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          tipo?: string | null
          titulo?: string
          url_acao?: string | null
          user_id?: string
        }
        Relationships: []
      }
      personalidade: {
        Row: {
          core_values: Json | null
          created_at: string
          id: string
          missions: Json | null
          personality_traits: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          core_values?: Json | null
          created_at?: string
          id?: string
          missions?: Json | null
          personality_traits?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          core_values?: Json | null
          created_at?: string
          id?: string
          missions?: Json | null
          personality_traits?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      planos_acao: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          progress: number | null
          status: string | null
          tasks: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          tasks?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          tasks?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts_instagram: {
        Row: {
          compartilhado: boolean | null
          compartilhado_com: string | null
          created_at: string
          data_publicacao: string | null
          descricao: string | null
          hashtags: string | null
          id: string
          observacoes_admin: string | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          data_publicacao?: string | null
          descricao?: string | null
          hashtags?: string | null
          id?: string
          observacoes_admin?: string | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          data_publicacao?: string | null
          descricao?: string | null
          hashtags?: string | null
          id?: string
          observacoes_admin?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      producer_prospects: {
        Row: {
          budget_range: string | null
          contact_date: string | null
          created_at: string | null
          id: string
          last_contact_date: string | null
          negotiation_stage: string | null
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          priority: string | null
          producer_email: string | null
          producer_instagram: string | null
          producer_name: string
          producer_phone: string | null
          producer_website: string | null
          project_type: string | null
          status: string | null
          tags: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          contact_date?: string | null
          created_at?: string | null
          id?: string
          last_contact_date?: string | null
          negotiation_stage?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: string | null
          producer_email?: string | null
          producer_instagram?: string | null
          producer_name: string
          producer_phone?: string | null
          producer_website?: string | null
          project_type?: string | null
          status?: string | null
          tags?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget_range?: string | null
          contact_date?: string | null
          created_at?: string | null
          id?: string
          last_contact_date?: string | null
          negotiation_stage?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: string | null
          producer_email?: string | null
          producer_instagram?: string | null
          producer_name?: string
          producer_phone?: string | null
          producer_website?: string | null
          project_type?: string | null
          status?: string | null
          tags?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          artist_name_name: string | null
          bio: string | null
          birth_date: string | null
          chave_pix: string | null
          email: string | null
          full_name: string | null
          instagram_handle: string | null
          location: string | null
          music_links: string | null
          name: string | null
          phone: string | null
          portfolio_url: string | null
          presskit_url: string | null
          role: string | null 
          soundcloud_url: string | null
          user_id: string
          youtube_url: string | null
        }
        Insert: {
          artist_name_name?: string | null
          bio?: string | null
          birth_date?: string | null
          chave_pix?: string | null
          email?: string | null
          full_name?: string | null
          instagram_handle?: string | null
          location?: string | null
          music_links?: string | null
          name?: string | null
          phone?: string | null
          portfolio_url?: string | null
          presskit_url?: string | null
          role?: string
          soundcloud_url?: string | null
          user_id: string
          youtube_url?: string | null
        }
        Update: {
          artist_name_name?: string | null
          bio?: string | null
          birth_date?: string | null
          chave_pix?: string | null
          email?: string | null
          full_name?: string | null
          instagram_handle?: string | null
          location?: string | null
          music_links?: string | null
          name?: string | null
          phone?: string | null
          portfolio_url?: string | null
          presskit_url?: string | null
          role?: string
          soundcloud_url?: string | null
          user_id?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          bpm: number | null
          budget: number | null
          collaborators: Json | null
          created_at: string | null
          description: string | null
          end_date: string | null
          genre: string | null
          id: string
          key_signature: string | null
          start_date: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bpm?: number | null
          budget?: number | null
          collaborators?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          genre?: string | null
          id?: string
          key_signature?: string | null
          start_date?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bpm?: number | null
          budget?: number | null
          collaborators?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          genre?: string | null
          id?: string
          key_signature?: string | null
          start_date?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          compartilhado: boolean | null
          compartilhado_com: string | null
          created_at: string
          data_inicio: string | null
          data_prazo: string | null
          descricao: string | null
          id: string
          progresso: number | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          data_inicio?: string | null
          data_prazo?: string | null
          descricao?: string | null
          id?: string
          progresso?: number | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          compartilhado?: boolean | null
          compartilhado_com?: string | null
          created_at?: string
          data_inicio?: string | null
          data_prazo?: string | null
          descricao?: string | null
          id?: string
          progresso?: number | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prospeccoes_admin: {
        Row: {
          contato: string
          created_at: string
          data_evento: string | null
          email: string | null
          id: string
          nome_cliente: string
          observacoes: string | null
          orcamento: string | null
          status: string | null
          telefone: string | null
          tipo_evento: string | null
          updated_at: string
        }
        Insert: {
          contato: string
          created_at?: string
          data_evento?: string | null
          email?: string | null
          id?: string
          nome_cliente: string
          observacoes?: string | null
          orcamento?: string | null
          status?: string | null
          telefone?: string | null
          tipo_evento?: string | null
          updated_at?: string
        }
        Update: {
          contato?: string
          created_at?: string
          data_evento?: string | null
          email?: string | null
          id?: string
          nome_cliente?: string
          observacoes?: string | null
          orcamento?: string | null
          status?: string | null
          telefone?: string | null
          tipo_evento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      self_care_activities: {
        Row: {
          content: string
          created_at: string | null
          date: string | null
          id: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      selfcare_phrases: {
        Row: {
          author: string | null
          created_at: string | null
          id: string
          phrase: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          id?: string
          phrase: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          id?: string
          phrase?: string
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          concluido_em: string | null
          created_at: string
          data_prazo: string | null
          descricao: string | null
          id: string
          prioridade: string | null
          projeto_id: string
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          concluido_em?: string | null
          created_at?: string
          data_prazo?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          projeto_id: string
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          concluido_em?: string | null
          created_at?: string
          data_prazo?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          projeto_id?: string
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          categoria: string | null
          created_at: string
          data_transacao: string | null
          id: string
          observacoes: string | null
          tipo: string
          titulo: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_transacao?: string | null
          id?: string
          observacoes?: string | null
          tipo: string
          titulo: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_transacao?: string | null
          id?: string
          observacoes?: string | null
          tipo?: string
          titulo?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      user_id: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

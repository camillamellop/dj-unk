// src/utils/supabase-setup.ts

import { testSupabaseConnection } from '@/lib/supabase'

export const setupSupabase = async () => {
  console.log('🔧 Iniciando setup do Supabase...')
  
  // Verificar variáveis de ambiente
  const requiredEnvVars = {
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY
  }
  
  console.log('📋 Verificando variáveis de ambiente...')
  for (const [name, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.error(`❌ ${name} não está definida`)
      return false
    }
    console.log(`✅ ${name}: ${name.includes('KEY') ? value.substring(0, 20) + '...' : value}`)
  }
  
  // Testar conexão
  console.log('🔍 Testando conexão...')
  const connectionTest = await testSupabaseConnection()
  
  if (connectionTest.success) {
    console.log('🎉 Setup do Supabase concluído com sucesso!')
    return true
  } else {
    console.error('❌ Falha no setup:', connectionTest.error)
    return false
  }
}

// Executar setup automaticamente em desenvolvimento
if (import.meta.env.DEV) {
  setupSupabase()
}
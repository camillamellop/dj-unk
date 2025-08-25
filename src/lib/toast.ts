// Sistema de toast personalizado para feedback do usuário
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // Implementação futura com biblioteca de toast
  },
  
  error: (message: string) => {
    console.error('❌ Error:', message);
    // Implementação futura com biblioteca de toast
  },
  
  info: (message: string) => {
    console.info('ℹ️ Info:', message);
    // Implementação futura com biblioteca de toast
  },
  
  warning: (message: string) => {
    console.warn('⚠️ Warning:', message);
    // Implementação futura com biblioteca de toast
  }
};
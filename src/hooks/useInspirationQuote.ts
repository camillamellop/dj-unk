import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface InspirationQuote {
  id: number;
  frases: string;
  created_at?: string;
}

export const useInspirationQuote = () => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const getTodayQuote = async () => {
    try {
      setLoading(true);
      
      // Pega todas as frases
      const { data: quotes, error } = await supabase
        .from('frases_autocuidado')
        .select('*');

      if (error) throw error;

      if (quotes && quotes.length > 0) {
        // Usa a data atual para selecionar uma frase consistente por dia
        const today = new Date().toDateString();
        const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length;
        setQuote(quotes[index].frases);
      }
    } catch (error) {
      console.error('Erro ao buscar frase de inspiração:', error);
      // Frase padrão em caso de erro
      setQuote('Sua música é o reflexo da sua alma. Cuide bem dela.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodayQuote();
    
    // Verifica se mudou o dia a cada hora
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        getTodayQuote();
      }
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, []);

  return { quote, loading, refreshQuote: getTodayQuote };
};
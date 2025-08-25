import { db } from './supabase';
import { collection, addDoc } from 'supabase/supabase';

// Compartilha agenda de um usuário com o admin
export async function shareAgendaWithAdmin({ userId, userName, events }: { userId: string, userName: string, events: any[] }) {
  // O admin receberá todas agendas compartilhadas na coleção 'agendas_compartilhadas'
  await addDoc(collection(db, 'agendas_compartilhadas'), {
    userId,
    userName,
    events,
    sharedAt: Date.now(),
    sharedWith: 'admin',
  });
}


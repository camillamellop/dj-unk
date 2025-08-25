
"use client";
import { useState, useRef } from 'react';
import { StickyNote, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { Button } from './button';

interface Note {
  id: number;
  text: string;
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const nextIdRef = useRef(1);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: nextIdRef.current++, text: newNote.trim() }]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const removeNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };
  
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingText('');
  };
  
  const saveNote = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, text: editingText } : note
    ));
    cancelEditing();
  };


  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Notas Rápidas</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIsAdding(!isAdding)} className="text-neutral-400 hover:text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Adicionar nota..."
              className="bg-white/10 border-neutral-600 text-white placeholder-gray-400 rounded-lg px-3 py-1 w-full text-sm h-8"
              onKeyDown={(e) => e.key === 'Enter' && addNote()}
              autoFocus
            />
            <Button size="sm" onClick={addNote} className="bg-purple-600 hover:bg-purple-700 !h-8 w-8 !p-0">
              <Plus className="w-4 h-4" />
            </Button>
        </div>
      )}

      <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="group bg-white/5 rounded-lg p-3 flex justify-between items-center">
            {editingNoteId === note.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="bg-transparent border-b border-purple-400/50 focus:outline-none text-sm text-gray-300 w-full"
                onKeyDown={(e) => e.key === 'Enter' && saveNote(note.id)}
              />
            ) : (
              <p className="text-sm text-gray-300">{note.text}</p>
            )}
            
            <div className="flex items-center">
              {editingNoteId === note.id ? (
                <>
                  <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300" onClick={() => saveNote(note.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={cancelEditing}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white opacity-50 hover:opacity-100 transition-opacity" onClick={() => startEditing(note)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500/70 hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity" onClick={() => removeNote(note.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
         {notes.length === 0 && !isAdding && <p className="text-gray-500 text-sm text-center">Nenhuma nota ainda.</p>}
      </div>
    </div>
  );
}

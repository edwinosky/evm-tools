'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar, Tag, Eye, EyeOff, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPrivate: boolean;
  projectId: string;
}

interface NotesManagerProps {
  projectId: string;
  userAddress: string;
}

const NotesManager: React.FC<NotesManagerProps> = ({ projectId, userAddress }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    content: '',
    tags: [] as string[],
    isPrivate: false
  });

  // Load notes for this project
  const loadNotes = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call when notes API is implemented
      const mockNotes: Note[] = [
        {
          id: '1',
          content: 'Proyecto interesante con buena comunidad. Debería seguir su desarrollo.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          tags: ['research', 'followup'],
          isPrivate: false,
          projectId
        },
        {
          id: '2',
          content: 'RECORDATORIO: Revisar el whitepaper antes de finalizar análisis del proyecto.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          tags: ['reminder', 'whitepaper'],
          isPrivate: true,
          projectId
        }
      ];
      setNotes(mockNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save new note
  const saveNote = async () => {
    if (!newNote.content.trim()) return;

    try {
      // TODO: Replace with actual API call
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: newNote.tags,
        isPrivate: newNote.isPrivate,
        projectId
      };

      setNotes(prev => [note, ...prev]);
      setNewNote({ content: '', tags: [], isPrivate: false });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error guardando nota');
    }
  };

  // Update existing note
  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      setNotes(prev => prev.map(note =>
        note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      ));
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error actualizando nota');
    }
  };

  // Delete note
  const deleteNote = async (noteId: string) => {
    if (!confirm('¿Eliminar esta nota?')) return;

    try {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error eliminando nota');
    }
  };

  // Add tag to new note
  const addTag = (tag: string) => {
    if (tag.trim() && !newNote.tags.includes(tag.trim())) {
      setNewNote(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    }
  };

  // Remove tag from new note
  const removeTag = (tagIndex: number) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== tagIndex)
    }));
  };

  useEffect(() => {
    loadNotes();
  }, [projectId]);

  const suggestedTags = ['research', 'followup', 'activity', 'whitepaper', 'reminder', 'important', 'airdrops', 'partnership'];

  if (loading) {
    return (
      <div className="card">
        <div className="card-content p-8 text-center text-muted-foreground">
          Cargando notas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-section">Mis Notas del Proyecto</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Nueva Nota
        </button>
      </div>

      {/* New Note Form */}
      {showForm && (
        <div className="card">
          <div className="card-content p-6">
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Escribe tu nota sobre este proyecto..."
              className="w-full p-3 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background mb-3"
              rows={4}
            />

            {/* Tags Input */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {newNote.tags.map((tag, index) => (
                  <span key={index} className="badge bg-primary/10 text-primary">
                    #{tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="px-2 py-1 text-xs text-muted-foreground bg-muted rounded hover:bg-accent hover:text-accent-foreground"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={newNote.isPrivate}
                  onChange={(e) => setNewNote(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                Nota privada (sólo visible para mí)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={saveNote}
                className="btn btn-secondary"
              >
                <Save size={16} className="mr-2" />
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewNote({ content: '', tags: [], isPrivate: false });
                }}
                className="btn btn-outline"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="card">
          <div className="card-content p-8 text-center text-muted-foreground">
            <Edit3 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h4 className="text-card-foreground font-medium mb-1">Aún no tienes notas</h4>
            <p className="text-muted-foreground">Crea entradas para seguir el progreso de este proyecto</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="card shadow-hover hover:shadow-elevated">
              <div className="card-content p-6">
                {editingNote === note.id ? (
                  <div>
                    <textarea
                      defaultValue={note.content}
                      onBlur={async (e) => {
                        if (e.target.value.trim() !== note.content) {
                          await updateNote(note.id, { content: e.target.value.trim() });
                        } else {
                          setEditingNote(null);
                        }
                      }}
                      className="w-full p-3 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                      rows={4}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        {note.isPrivate && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            <Eye size={10} />
                            Privada
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingNote(note.id)}
                          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-accent"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-card-foreground whitespace-pre-wrap mb-3">{note.content}</p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <span key={index} className="badge bg-primary/10 text-primary">
                            <Tag size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesManager;

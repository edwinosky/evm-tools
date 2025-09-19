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
    return <div className="text-center py-8 text-gray-500">Cargando notas...</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Mis Notas del Proyecto</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nueva Nota
        </button>
      </div>

      {/* New Note Form */}
      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Escribe tu nota sobre este proyecto..."
            className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />

          {/* Tags Input */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {newNote.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  #{tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
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
                  className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={newNote.isPrivate}
                onChange={(e) => setNewNote(prev => ({ ...prev, isPrivate: e.target.checked }))}
                className="rounded"
              />
              Nota privada (sólo visible para mí)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={saveNote}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              Guardar
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewNote({ content: '', tags: [], isPrivate: false });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Edit3 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">Aún no tienes notas</h4>
          <p className="text-sm text-gray-500">Crea entradas para seguir el progreso de este proyecto</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
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
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      {note.isPrivate && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          <Eye size={10} />
                          Privada
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingNote(note.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesManager;

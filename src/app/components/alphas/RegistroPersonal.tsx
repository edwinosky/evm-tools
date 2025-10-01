'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Calendar, Edit3, Trash2, CheckSquare, AlertCircle } from 'lucide-react';

interface PersonalLogEntry {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'task' | 'completed' | 'discovery';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface RegistroPersonalProps {
  projectId: string;
  userAddress: string;
}

interface PersonalLogData {
  entries: PersonalLogEntry[];
  lastUpdated: string;
}

const RegistroPersonal: React.FC<RegistroPersonalProps> = ({ projectId, userAddress }) => {
  const [entries, setEntries] = useState<PersonalLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PersonalLogEntry | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note' as PersonalLogEntry['type'],
    tags: ''
  });

  // KV storage key for this user's project log
  const storageKey = `personal_log_${projectId}`;

  // Load entries from KV storage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/storage?key=${encodeURIComponent(storageKey)}`, {
          headers: {
            'X-Wallet-Address': userAddress
          }
        });

        if (response.ok) {
          const data = await response.json();
          const logData: PersonalLogData = data || { entries: [], lastUpdated: new Date().toISOString() };
          setEntries(logData.entries || []);
        }
      } catch (error) {
        console.error('Error loading personal log:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userAddress) {
      loadData();
    }
  }, [userAddress, projectId]);

  // Save entries to KV storage
  const saveData = async (updatedEntries: PersonalLogEntry[]) => {
    try {
      setSaving(true);
      const logData: PersonalLogData = {
        entries: updatedEntries,
        lastUpdated: new Date().toISOString()
      };

      await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': userAddress
        },
        body: JSON.stringify({
          key: storageKey,
          value: logData
        })
      });

      setEntries(updatedEntries);
    } catch (error) {
      console.error('Error saving personal log:', error);
      alert('Error guardando los cambios. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'note',
      tags: ''
    });
    setEditingEntry(null);
    setShowForm(false);
  };

  const handleAddEntry = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Por favor completa el título y contenido');
      return;
    }

    const now = new Date().toISOString();
    const newEntry: PersonalLogEntry = {
      id: editingEntry?.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      type: formData.type,
      createdAt: editingEntry?.createdAt || now,
      updatedAt: now,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    let updatedEntries = [...entries];

    if (editingEntry) {
      // Update existing entry
      const index = updatedEntries.findIndex(e => e.id === editingEntry.id);
      if (index >= 0) {
        updatedEntries[index] = newEntry;
      }
    } else {
      // Add new entry
      updatedEntries.unshift(newEntry); // Add to beginning
    }

    saveData(updatedEntries);
    resetForm();
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta entrada?')) return;

    const updatedEntries = entries.filter(e => e.id !== entryId);
    saveData(updatedEntries);
  };

  const startEditing = (entry: PersonalLogEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      type: entry.type,
      tags: entry.tags?.join(', ') || ''
    });
    setShowForm(true);
  };

  const getTypeIcon = (type: PersonalLogEntry['type']) => {
    switch (type) {
      case 'note':
        return <Edit3 className="w-4 h-4" />;
      case 'task':
        return <CheckSquare className="w-4 h-4" />;
      case 'completed':
        return <CheckSquare className="w-4 h-4 text-green-600" />; // Solid check
      case 'discovery':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: PersonalLogEntry['type']) => {
    switch (type) {
      case 'note':
        return 'border-blue-200 bg-blue-50';
      case 'task':
        return 'border-yellow-200 bg-yellow-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'discovery':
        return 'border-purple-200 bg-purple-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">Cargando registro personal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mi Registro Personal</h3>
          <div className="text-sm text-gray-600 mt-1">
            <span>{entries.length} entradas</span>
            {entries.length > 0 && (
              <span className="ml-2">• Última: {new Date(entries[0]?.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Entrada
        </button>
      </div>

      {/* Formulario de nueva entrada */}
      {showForm && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Título de la entrada"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PersonalLogEntry['type'] }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="note">📝 Nota</option>
                <option value="task">✅ Tarea</option>
                <option value="completed">🎉 Completado</option>
                <option value="discovery">💡 Descubrimiento</option>
              </select>
            </div>

            <textarea
              placeholder="Contenido de la entrada (soporta texto simple)"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />

            <input
              type="text"
              placeholder="Etiquetas (separadas por comas, opcional)"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddEntry}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : editingEntry ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={resetForm}
                className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de entradas */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Aún no tienes entradas</p>
            <p className="text-gray-400 text-sm mt-1">Crea tu primera entrada para empezar a rastrear tu progreso</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`border rounded-lg p-4 ${getTypeColor(entry.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getTypeIcon(entry.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{entry.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap line-clamp-3">
                      {entry.content}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-white bg-opacity-50 text-gray-600 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2">
                      Actualizado • {new Date(entry.updatedAt).toLocaleDateString()} a las {new Date(entry.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => startEditing(entry)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Leyenda */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <p><strong>Leyenda:</strong> 📝 Nota, ✅ Tarea, 🎉 Completado, 💡 Descubrimiento</p>
        <p className="mt-1">Tu registro es privado y solo visible para ti. Se guarda automáticamente en la base de datos.</p>
      </div>
    </div>
  );
};

export default RegistroPersonal;

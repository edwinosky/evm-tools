'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAlphasApi } from '@/lib/alphas-api';

interface Project {
  id: string;
  name: string;
  categories: string[];
  website: string;
  description?: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  };
  galxeUrl?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Import the categories from the backend
const PROJECT_CATEGORIES = [
  'DEFI',
  'NFT',
  'GAMEFI',
  'TOOLS',
  'GAMING',
  'INFRASTRUCTURE',
  'AI',
  'NODES',
  'TESTNETS',
  'RWA',
  'OTHER'
];

const ProjectsPanel: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { address } = useAppContext();
  const alphasApi = useAlphasApi();

  // Load projects from API
  const loadProjects = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      const data = await alphasApi.projects.getAll();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete project handler
  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`¿Está seguro que desea eliminar el proyecto "${projectName}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await alphasApi.projects.delete(projectId);
      console.log('Project deleted successfully:', projectId);

      // Remove from local state immediately for better UX
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error eliminando proyecto');
      // Reload list in case of error to ensure consistency
      await loadProjects();
    }
  };

  useEffect(() => {
    if (address) {
      loadProjects();
    }
  }, [address]);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.website.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || (project.categories || []).includes(categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
      draft: { color: 'bg-muted text-muted-foreground', icon: Edit },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Eye },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-destructive text-destructive-foreground', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-section">Gestión de Proyectos</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background px-4 py-3"
            >
              <option value="all">Todos los Estados</option>
              <option value="draft">Borrador</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background px-4 py-3"
            >
              <option value="all">Todas las Categorías</option>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="btn btn-outline"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="card-content p-8 text-center text-muted-foreground">
            Cargando proyectos...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="card-content p-8 text-center text-muted-foreground">
            No se encontraron proyectos
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{project.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{project.website}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(project.categories || []).slice(0, 3).map((category, catIndex) => (
                          <span key={catIndex} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category}
                          </span>
                        ))}
                        {(project.categories || []).length > 3 && (
                          <span className="text-xs text-gray-500">+{(project.categories || []).length - 3} más</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {/* TODO: View project details */}}
                          className="text-muted-foreground hover:text-foreground p-2 rounded hover:bg-accent focus-ring"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-primary hover:text-primary/80 p-2 rounded hover:bg-accent focus-ring"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="text-destructive hover:text-destructive/80 p-2 rounded hover:bg-accent focus-ring"
                          title="Eliminar proyecto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowCreateForm(false);
            setEditingProject(null);
          }}
          onSave={loadProjects}
        />
      )}
    </div>
  );
};

// Project Form Component
interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSave: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    categories: project?.categories || [],
    website: project?.website || '',
    description: project?.description || '',
    twitter: project?.socialLinks?.twitter || '',
    telegram: project?.socialLinks?.telegram || '',
    discord: project?.socialLinks?.discord || '',
    github: project?.socialLinks?.github || '',
    galxeUrl: project?.galxeUrl || '',
    status: project?.status || 'draft'
  });

  const [saving, setSaving] = useState(false);
  const alphasApi = useAlphasApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.website) {
      alert('Nombre y sitio web son requeridos');
      return;
    }

    if (formData.categories.length === 0) {
      alert('Por favor selecciona al menos una categoría');
      return;
    }

    setSaving(true);
    try {
      const projectData = {
        ...formData,
        socialLinks: {
          twitter: formData.twitter || undefined,
          telegram: formData.telegram || undefined,
          discord: formData.discord || undefined,
          github: formData.github || undefined,
        }
      };

      let result;

      if (project) {
        // Update existing project
        result = await alphasApi.projects.update(project.id, projectData);
        console.log('Project updated successfully:', result);
      } else {
        // Create new project
        result = await alphasApi.projects.create(projectData);
        console.log('Project created successfully:', result);
      }

      // Force reload projects list to show changes immediately
      await onSave();

      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error guardando proyecto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="card-header">
          <h3 className="card-title">
            {project ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          </h3>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                  required
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Categorías *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PROJECT_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          categories: checked
                            ? [...prev.categories, category]
                            : prev.categories.filter(c => c !== category)
                        }));
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Sitio Web *
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Galxe
                </label>
                <input
                  type="url"
                  value={formData.galxeUrl}
                  onChange={(e) => setFormData({ ...formData, galxeUrl: e.target.value })}
                  placeholder="https://galxe.com/..."
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Telegram
                </label>
                <input
                  type="url"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="https://t.me/..."
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Discord
                </label>
                <input
                  type="url"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  placeholder="https://discord.gg/..."
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                />
              </div>
            </div>

            {/* Status - Only for edits */}
            {project && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border-input rounded-md focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-input focus-visible:outline-none bg-background"
                >
                  <option value="draft">Borrador</option>
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground border-input rounded-md hover:bg-accent hover:text-accent-foreground focus-ring"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 focus-ring"
              >
                {saving ? 'Guardando...' : (project ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPanel;

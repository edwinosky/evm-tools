'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ExternalLink, Calendar, TrendingUp, Star } from 'lucide-react';
import { useTabContext } from '@/context/TabContext';

interface Project {
  id: string;
  name: string;
  category: 'DeFi' | 'NFT' | 'GameFi' | 'Tools' | 'Gaming' | 'Infrastructure' | 'Other';
  website: string;
  description?: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const PROJECTS_PER_PAGE = 12;

const ProjectsGrid: React.FC = () => {
  const { addTab } = useTabContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Handle project click to open in new tab
  const handleProjectClick = (project: Project) => {
    addTab({
      title: project.name,
      projectId: project.id,
      type: 'project'
    });
  };

  // Load projects from API
  const loadProjects = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PROJECTS_PER_PAGE.toString(),
        category: selectedCategory !== 'all' ? selectedCategory : '',
        search: searchQuery,
        sort: sortBy
      });

      const response = await fetch(`/api/alphas/admin/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        const newProjects = data.projects || [];

        if (isLoadMore) {
          setProjects(prev => [...prev, ...newProjects]);
        } else {
          setProjects(newProjects);
        }

        setHasMore(newProjects.length === PROJECTS_PER_PAGE);
        setCurrentPage(page);
      } else {
        setError('Error cargando proyectos');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Error conectando con el servidor');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, searchQuery, sortBy]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    loadProjects(1, false);
  }, [loadProjects]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '' || selectedCategory !== 'all') {
        setLoading(true);
        setCurrentPage(1);
        loadProjects(1, false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, loadProjects]);

  // Load more projects (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      await loadProjects(currentPage + 1, true);
    }
  }, [loadingMore, hasMore, currentPage, loadProjects]);

  // Intersection Observer for infinite scroll
  const observer = React.useRef<IntersectionObserver>();
  const lastProjectRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      threshold: 0.1
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  // Category badge component
  const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    const colors: Record<string, string> = {
      DeFi: 'bg-blue-100 text-blue-800',
      NFT: 'bg-purple-100 text-purple-800',
      GameFi: 'bg-green-100 text-green-800',
      Tools: 'bg-orange-100 text-orange-800',
      Gaming: 'bg-pink-100 text-pink-800',
      Infrastructure: 'bg-gray-100 text-gray-800',
      Other: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category] || colors.Other}`}>
        {category}
      </span>
    );
  };

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <TrendingUp size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error cargando proyectos</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      {/* No mostrar header aquí, se muestra en la página principal */}

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Filtros y Búsqueda</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Buscar proyecto</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
            >
              <option value="all">Todas las categorías</option>
              <option value="DeFi">DeFi</option>
              <option value="NFT">NFT</option>
              <option value="GameFi">GameFi</option>
              <option value="Tools">Tools</option>
              <option value="Gaming">Gaming</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="name">Por nombre</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-6">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-gray-600 hover:text-gray-800 underline text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Star size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== 'all'
              ? 'Prueba ajustar tus filtros de búsqueda'
              : 'Aún no hay proyectos disponibles'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={index === projects.length - 1 ? lastProjectRef : null}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.name}
                    </h3>
                    <CategoryBadge category={project.category} />
                  </div>
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Description */}
                <p
                  className="text-gray-600 text-sm mb-4"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {project.description || 'Proyecto blockchain en desarrollo con potencial interesante.'}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 mb-4">
                  {project.socialLinks.twitter && (
                    <a
                      href={project.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {project.socialLinks.telegram && (
                    <a
                      href={project.socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 1 0 12-12 12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </a>
                  )}
                  {project.socialLinks.github && (
                    <a
                      href={project.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.158.549.088.752-.233.752-.522 0-.266-.045-1.176-.069-2.108-3.106.66-3.75-1.334-3.75-1.334-.525-1.326-1.282-1.678-1.282-1.678-1.036-.701.081-.687.081-.687 1.158.08 1.75 1.17 1.75 1.17.811 1.406 2.088 1.007 2.608.769.081-.582.317-.968.58-1.19-2.042-.227-4.168-1.041-4.168-4.704 0-1.041.366-1.891 1.024-2.56-.108-.243-.459-1.282.091-2.633 0 0 .841-.267 2.75 1.026A9.392 9.392 0 0112.017 5.76c1.67 0 3.361.224 4.94.662 1.909-1.293 2.75-1.026 2.75-1.026.549 1.351.199 2.39.091 2.633.657.669 1.024 1.52 1.024 2.56 0 3.674-2.133 4.466-4.236 4.704.345.294.658.867.658 1.764 0 1.282-.047 2.31-.069 2.583 0 .291.203.61.752.622C20.876 21.404 24.029 17.066 24.029 11.987 24.029 5.367 18.662 0 12.017 0z"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading More */}
          {loadingMore && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando más proyectos...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsGrid;

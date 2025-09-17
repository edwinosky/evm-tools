'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, BarChart3, Calendar, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAlphasApi } from '@/lib/alphas-api';

const AnalyticsPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    approvedProjects: 0,
    pendingProjects: 0,
    totalUsers: 0,
    activeUsers: 0,
    newProjectsToday: 0,
    topCategories: [] as Array<{ category: string; count: number }>
  });

  const [loading, setLoading] = useState(true);

  const { address } = useAppContext();
  const alphasApi = useAlphasApi();

  // Load analytics data
  const loadAnalytics = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      // Load projects data
      const projectsData = await alphasApi.projects.getAll();
      const projects = projectsData.projects || [];

      // Load users data
      const usersData = await alphasApi.users.getAll();
      const users = usersData.users || [];

      // Calculate stats
      const approvedProjects = projects.filter((p: any) => p.status === 'approved').length;
      const pendingProjects = projects.filter((p: any) => p.status === 'pending').length;
      const newProjectsToday = projects.filter((p: any) => {
        const createdDate = new Date(p.createdAt);
        const today = new Date();
        return createdDate.toDateString() === today.toDateString();
      }).length;

      // Calculate top categories
      const categoryCount: Record<string, number> = {};
      projects.forEach((project: any) => {
        categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;
      });

      const topCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([category, count]) => ({ category, count: count as number }));

      setStats({
        totalProjects: projects.length,
        approvedProjects,
        pendingProjects,
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => ['super_admin', 'editor', 'moderator'].includes(u.role)).length,
        newProjectsToday,
        topCategories
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      loadAnalytics();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics y Métricas</h2>
        <div className="p-8 text-center text-gray-500">
          Cargando métricas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Analytics y Métricas</h2>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="statCard p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Proyectos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Proyectos Aprobados</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approvedProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Proyectos Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos Proyectos Hoy</p>
              <p className="text-3xl font-semibold text-gray-900">{stats.newProjectsToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Aprobación</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.totalProjects > 0
                  ? Math.round((stats.approvedProjects / stats.totalProjects) * 100)
                  : 0}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categorías Más Populares</h3>
        {stats.topCategories.length > 0 ? (
          <div className="space-y-3">
            {stats.topCategories.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3">
                    #{index + 1}
                  </span>
                  <span className="text-gray-900 font-medium">{item.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{item.count} proyectos</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width: `${(item.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No hay datos disponibles</p>
        )}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="text-gray-500 text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Próximamente: Historial de actividades del sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;

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
        <div className="card-header">
          <h2 className="card-title">Analytics y Métricas</h2>
        </div>
        <div className="card-content p-8 text-center text-muted-foreground">
          Cargando métricas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h2 className="card-title">Analytics y Métricas</h2>
        <p className="text-sm text-muted-foreground">
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary h-8 w-8 mr-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Proyectos</p>
                <p className="text-2xl font-semibold text-card-foreground">{stats.totalProjects}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proyectos Aprobados</p>
                <p className="text-2xl font-semibold text-card-foreground">{stats.approvedProjects}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proyectos Pendientes</p>
                <p className="text-2xl font-semibold text-card-foreground">{stats.pendingProjects}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
                <p className="text-2xl font-semibold text-card-foreground">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nuevos Proyectos Hoy</p>
                <p className="text-3xl font-semibold text-card-foreground">{stats.newProjectsToday}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de Aprobación</p>
                <p className="text-3xl font-semibold text-card-foreground">
                  {stats.totalProjects > 0
                    ? Math.round((stats.approvedProjects / stats.totalProjects) * 100)
                    : 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Categorías Más Populares</h3>
        </div>
        <div className="card-content">
          {stats.topCategories.length > 0 ? (
            <div className="space-y-3">
              {stats.topCategories.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3">
                      #{index + 1}
                    </span>
                    <span className="text-card-foreground font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">{item.count} proyectos</span>
                    <div className="w-20 h-2 bg-muted rounded-full">
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
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Actividad Reciente</h3>
        </div>
        <div className="card-content">
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p>Próximamente: Historial de actividades del sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;

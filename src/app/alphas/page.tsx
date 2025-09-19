'use client';

import React from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ProjectsGrid from '@/app/components/alphas/ProjectsGrid';
import ProjectDetail from '@/app/components/alphas/ProjectDetail';
import TabBar from '@/app/components/alphas/TabBar';
import { useTabContext } from '@/context/TabContext';

export default function AlphasPage() {
  const breadcrumbItems = [
    { label: 'EVM Tools', href: '/' },
    { label: 'Panel Alphas' }
  ];

  const { activeTabId, tabs } = useTabContext();

  // Render different content based on active tab
  const renderContent = () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);

    if (!activeTab) {
      return <ProjectsGrid />;
    }

    if (activeTab.type === 'list' || activeTab.id === 'list') {
      return <ProjectsGrid />;
    }

    if (activeTab.type === 'project' && activeTab.projectId) {
      return <ProjectDetail projectId={activeTab.projectId} />;
    }

    // Default to grid
    return <ProjectsGrid />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header con título y descripción */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          Proyectos Alpha
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Descubre los proyectos más prometedores con potencial de airdrops
        </p>
      </div>

      {/* Tab Bar - después del header */}
      <TabBar />

      {/* Área de contenido que cambia */}
      <div className="flex-grow">
        {renderContent()}
      </div>
    </div>
  );
}

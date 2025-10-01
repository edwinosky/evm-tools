'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ProjectsGrid from '@/app/components/alphas/ProjectsGrid';
import ProjectDetail from '@/app/components/alphas/ProjectDetail';
import TabBar from '@/app/components/alphas/TabBar';
import { useTabContext } from '@/context/TabContext';

export default function AlphasPage() {
  const { t } = useLanguage();
  const breadcrumbItems = [
    { label: t('home', 'nav'), href: '/' },
    { label: t('panelAlphas', 'alphas') }
  ];

  const { activeTabId, tabs } = useTabContext();

  // Render different content based on activeTab
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
        <h1 className="text-hero mb-4 text-foreground">
          {t('alphaPageTitle', 'alphas')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('alphaPageDescription', 'alphas')}
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

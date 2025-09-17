'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function AlphasPage() {
  const { t } = useLanguage();

  const breadcrumbItems = [
    { label: 'EVM Tools', href: '/' },
    { label: 'Panel Alphas' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md flex-grow">
        <h1 className="text-3xl font-bold mb-6">Panel Alphas</h1>
        <p className="text-muted-foreground mb-6">
          Sistema inteligente para seguimiento de proyectos nuevos con potencial airdrop
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Seguimiento de Proyectos</h3>
            <p className="text-muted-foreground">
              Rastrea nuevos proyectos con potencial de airdrops y oportunidades
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Notas y Análisis</h3>
            <p className="text-muted-foreground">
              Mantén notas detalladas y análisis de cada proyecto
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Colaboración</h3>
            <p className="text-muted-foreground">
              Comparte hallazgos con tu comunidad y colabora en tiempo real
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Alertas y Notificaciones</h3>
            <p className="text-muted-foreground">
              Recibe notificaciones automáticas de actualizaciones importantes
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            Próximamente: Lista completa de proyectos y herramientas avanzadas
          </p>
        </div>
      </div>
    </div>
  );
}

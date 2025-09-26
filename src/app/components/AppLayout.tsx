'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from './Navbar';
import HistoryPanel from './HistoryPanel';
import ActionPanel from './ActionPanel';
import GeneratedAccountsPanel from './GeneratedAccountsPanel';
import LanguageSelector from '../../components/LanguageSelector';
import { Menu } from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isActionPanelOpen, toggleActionPanel } = useAppContext();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on initial load
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Action Panel (Left) */}
        {isMobile ? (
          <>
            {/* Button to open Action Panel */}
            {!isActionPanelOpen && (
              <button 
                onClick={toggleActionPanel} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-r-md bg-card text-card-foreground shadow-md z-10"
                title={t('openActionPanel')}
              >
                <Menu size={20} />
              </button>
            )}
            <div 
              className={`fixed top-0 left-0 h-full bg-background z-40 w-3/4 max-w-[75%] transition-transform duration-300 ease-in-out ${isActionPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-card-foreground">{t('actions')}</h3>
                  <button 
                    onClick={toggleActionPanel} 
                    className="p-2 rounded-md hover:bg-accent"
                  title={isActionPanelOpen ? t('closePanel') : t('openPanel')}
                  >
                    <Menu size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4">
                  <ActionPanel />
                  <GeneratedAccountsPanel />
                  <div className="border-t border-border pt-4">
                    <h3 className="text-lg font-bold text-card-foreground mb-4">{t('transactionHistory')}</h3>
                    <HistoryPanel />
                  </div>
                </div>
              </div>
            </div>
            {isActionPanelOpen && (
              <div 
                className={`fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-30 pointer-events-auto`}
                onClick={toggleActionPanel}
              />
            )}
          </>
        ) : (
          <aside
            className={`action-panel ${isActionPanelOpen ? 'w-1/3' : 'w-0'} transition-all duration-300 overflow-y-auto`}
          >
            <div className={`p-6 space-y-6 ${!isActionPanelOpen && 'hidden'}`}>
              <div className="panel-section">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold tracking-tight">{t('actions')}</h3>
                  <button 
                    onClick={toggleActionPanel} 
                    className="p-2 rounded-md hover:bg-accent"
                    title={isActionPanelOpen ? t('closePanel') : t('openPanel')}
                  >
                    <Menu size={20} />
                  </button>
                </div>
                <ActionPanel />
              </div>
              <div className="panel-section">
                <h3 className="text-xl font-bold tracking-tight">{t('generatedAccountsPanelTitle')}</h3>
                <GeneratedAccountsPanel />
              </div>
              <div className="panel-section history-section">
                <h3 className="text-xl font-bold tracking-tight">{t('transactionHistory')}</h3>
                <div className="history-list">
                  <HistoryPanel />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content (Center) */}
        <main className="flex-1 p-6 overflow-y-auto relative">
          {children}
          {/* Overlay for mobile panels */}
          {isActionPanelOpen && isMobile && (
            <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-5 pointer-events-auto" />
          )}
        </main>
      </div>

      {/* Floating Language Selector */}
      <div className="fixed bottom-4 right-4 z-50">
        <LanguageSelector isFloating={true} />
      </div>
    </div>
  );
};

export default AppLayout;

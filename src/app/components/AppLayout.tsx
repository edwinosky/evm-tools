'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from './Navbar';
import HistoryPanel from './HistoryPanel';
import ActionPanel from './ActionPanel';
import GeneratedAccountsPanel from './GeneratedAccountsPanel';
import { Menu } from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isHistoryPanelOpen, isActionPanelOpen, toggleHistoryPanel, toggleActionPanel } = useAppContext();
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
        {/* History Panel (Left) */}
        {isMobile ? (
          <>
            {/* Button to open History Panel */}
            {!isHistoryPanelOpen && (
              <button 
                onClick={toggleHistoryPanel} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-r-md bg-card text-card-foreground shadow-md z-10"
                title={t('openHistoryPanel')}
              >
                <Menu size={20} />
              </button>
            )}
            <div 
              className={`panel-mobile ${isHistoryPanelOpen ? 'open' : ''} border-r border-border w-3/4 max-w-[75%]`}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-card-foreground">{t('transactionHistory')}</h3>
                  <button 
                    onClick={toggleHistoryPanel} 
                    className="p-2 rounded-md hover:bg-accent"
                    title={isHistoryPanelOpen ? t('closePanel') : t('openPanel')}
                  >
                    <Menu size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <HistoryPanel />
                </div>
              </div>
            </div>
            {isHistoryPanelOpen && (
              <div 
                className={`panel-overlay ${isHistoryPanelOpen ? 'open' : ''}`}
                onClick={toggleHistoryPanel}
              />
            )}
          </>
        ) : (
          <aside
            style={{ flexBasis: isHistoryPanelOpen ? '25%' : '0%', transition: 'flex-basis 0.3s ease-in-out' }}
            className="flex-shrink-0 overflow-x-hidden overflow-y-auto border-r border-border"
          >
            <div className={`p-4 ${!isHistoryPanelOpen && 'hidden'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-card-foreground">{t('transactionHistory')}</h3>
                <button 
                  onClick={toggleHistoryPanel} 
                  className="p-2 rounded-md hover:bg-accent"
                  title={isHistoryPanelOpen ? t('closePanel') : t('openPanel')}
                >
                  <Menu size={20} />
                </button>
              </div>
              <HistoryPanel />
            </div>
          </aside>
        )}

        {/* Main Content (Center) */}
        <main className="flex-1 p-6 overflow-y-auto relative">
          {children}
          {/* Overlay for mobile panels */}
          {(isHistoryPanelOpen || isActionPanelOpen) && isMobile && (
            <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-5 pointer-events-auto" />
          )}
        </main>

        {/* Action Panel (Right) */}
        {isMobile ? (
          <>
            {/* Button to open Action Panel */}
            {!isActionPanelOpen && (
              <button 
                onClick={toggleActionPanel} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-l-md bg-card text-card-foreground shadow-md z-10"
                title={t('openActionPanel')}
              >
                <Menu size={20} />
              </button>
            )}
            <div 
              className={`panel-mobile ${isActionPanelOpen ? 'open' : ''} border-l border-border w-3/4 max-w-[75%]`}
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
                </div>
              </div>
            </div>
            {isActionPanelOpen && (
              <div 
                className={`panel-overlay ${isActionPanelOpen ? 'open' : ''}`}
                onClick={toggleActionPanel}
              />
            )}
          </>
        ) : (
          <aside
            style={{ flexBasis: isActionPanelOpen ? '25%' : '0%', transition: 'flex-basis 0.3s ease-in-out' }}
            className="flex-shrink-0 overflow-y-auto border-l border-border"
          >
            <div className={`p-4 space-y-4 ${!isActionPanelOpen && 'hidden'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-card-foreground">{t('actions')}</h3>
                <button 
                  onClick={toggleActionPanel} 
                  className="p-2 rounded-md hover:bg-accent"
                  title={isActionPanelOpen ? t('closePanel') : t('openPanel')}
                >
                  <Menu size={20} />
                </button>
              </div>
              <ActionPanel />
              <GeneratedAccountsPanel />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default AppLayout;

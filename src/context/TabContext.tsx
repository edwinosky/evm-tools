'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

interface Tab {
  id: string;
  title: string;
  projectId?: string;
  type: 'project' | 'list' | 'analytics';
}

interface TabContextType {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, 'id'>) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  moveTab: (fromIndex: number, toIndex: number) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTabs = localStorage.getItem('alphaTabs');
      if (savedTabs) {
        try {
          const parsedTabs = JSON.parse(savedTabs);
          // Ensure all tabs have the correct type
          return parsedTabs.map((tab: any) => ({
            ...tab,
            type: tab.type || 'list'
          })) as Tab[];
        } catch (e) {
          return [{ id: 'list', title: 'Projects List', type: 'list' }];
        }
      }
      return [{ id: 'list', title: 'Projects List', type: 'list' }];
    }
    return [{ id: 'list', title: 'Projects List', type: 'list' }];
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeAlphaTab') || 'list';
    }
    return 'list';
  });

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alphaTabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTabId) {
      localStorage.setItem('activeAlphaTab', activeTabId);
    }
  }, [activeTabId]);

  const addTab = useCallback((tab: Omit<Tab, 'id'>) => {
    const newTab: Tab = { ...tab, id: `${tab.type}-${Date.now()}` };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const removeTab = useCallback((id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);
      if (activeTabId === id && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        // Always keep at least the list tab
        const listTab: Tab = { id: 'list', title: 'Projects List', type: 'list' };
        setTabs([listTab]);
        setActiveTabId('list');
        return [listTab];
      }
      return newTabs;
    });
  }, [activeTabId]);

  const setActiveTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === id ? { ...tab, ...updates } : tab
      )
    );
  }, []);

  const moveTab = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prev => {
      const newTabs = [...prev];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      return newTabs;
    });
  }, []);

  return (
    <TabContext.Provider value={{
      tabs,
      activeTabId,
      addTab,
      removeTab,
      setActiveTab,
      updateTab,
      moveTab
    }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  category: string;
  website: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  };
  description?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface Tab {
  id: string;
  title: string;
  projectId?: string;
  isActive: boolean;
}

interface AlphaContextType {
  // Tabs management
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;

  // User projects tracking
  trackedProjects: Project[];
  trackProject: (project: Project) => void;
  untrackProject: (projectId: string) => void;
  isProjectTracked: (projectId: string) => boolean;

  // Admin data
  allProjects: Project[];
  isAdmin: boolean;
  adminRoles: any[];
}

const AlphaContext = createContext<AlphaContextType | undefined>(undefined);

export const useAlphaContext = () => {
  const context = useContext(AlphaContext);
  if (!context) {
    throw new Error('useAlphaContext must be used within an AlphaProvider');
  }
  return context;
};

interface AlphaProviderProps {
  children: ReactNode;
}

export const AlphaProvider: React.FC<AlphaProviderProps> = ({ children }) => {
  // Tabs state - persisted in localStorage
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // User tracking state
  const [trackedProjects, setTrackedProjects] = useState<Project[]>([]);

  // Admin state
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRoles, setAdminRoles] = useState([]);

  // Load initial data from localStorage
  useEffect(() => {
    const savedTabs = localStorage.getItem('alpha_tabs');
    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      // Set the first tab as active if there are tabs
      if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    }

    const savedTrackedProjects = localStorage.getItem('alpha_tracked_projects');
    if (savedTrackedProjects) {
      setTrackedProjects(JSON.parse(savedTrackedProjects));
    }
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('alpha_tabs', JSON.stringify(tabs));
  }, [tabs]);

  // Save tracked projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('alpha_tracked_projects', JSON.stringify(trackedProjects));
  }, [trackedProjects]);

  // Tab management functions
  const openTab = (tab: Tab) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(t => t.id === tab.id);
      if (existingTab) {
        // Tab already exists, just set it as active
        setActiveTabId(tab.id);
        return prevTabs;
      }
      // Add new tab
      const newTabs = [...prevTabs, tab];
      setActiveTabId(tab.id);
      return newTabs;
    });
  };

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      // If closing active tab, set another tab as active
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      return newTabs;
    });
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  // Project tracking functions
  const trackProject = (project: Project) => {
    setTrackedProjects(prev => {
      if (prev.some(p => p.id === project.id)) {
        return prev; // Already tracked
      }
      return [...prev, project];
    });
  };

  const untrackProject = (projectId: string) => {
    setTrackedProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const isProjectTracked = (projectId: string) => {
    return trackedProjects.some(p => p.id === projectId);
  };

  const contextValue: AlphaContextType = {
    // Tabs
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,

    // Projects
    trackedProjects,
    trackProject,
    untrackProject,
    isProjectTracked,

    // Admin
    allProjects,
    isAdmin,
    adminRoles,
  };

  return (
    <AlphaContext.Provider value={contextValue}>
      {children}
    </AlphaContext.Provider>
  );
};

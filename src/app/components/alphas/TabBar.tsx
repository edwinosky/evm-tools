'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, GripVertical } from 'lucide-react';
import { useTabContext } from '@/context/TabContext';

const TabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab } = useTabContext();
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+T or Cmd+T to add new tab
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        addTab({ title: 'New Tab', type: 'list' });
      }
      
      // Ctrl+W or Cmd+W to close active tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (activeTabId && activeTabId !== 'list') {
          removeTab(activeTabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, addTab, removeTab]);

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    e.dataTransfer.setData('text/plain', tabId);
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedTabId = e.dataTransfer.getData('text/plain');
    const targetElement = e.target as HTMLElement;
    const targetTabId = targetElement.closest('[data-tab-id]')?.getAttribute('data-tab-id');
    
    if (draggedTabId && targetTabId && draggedTabId !== targetTabId) {
      const fromIndex = tabs.findIndex(tab => tab.id === draggedTabId);
      const toIndex = tabs.findIndex(tab => tab.id === targetTabId);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        // Move tab in context
        // Note: We would need to add a moveTab function to our context
        // For now, we'll skip this implementation
      }
    }
    
    setDraggedTab(null);
  };

  const handleAddTab = () => {
    addTab({ title: 'New Tab', type: 'list' });
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabId !== 'list') {
      removeTab(tabId);
    }
  };

  return (
    <div 
      ref={tabBarRef}
      className="flex items-center bg-gray-100 border-b border-gray-200 px-2 py-1 overflow-x-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          draggable
          onDragStart={(e) => handleDragStart(e, tab.id)}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-3 py-1 mr-1 text-sm rounded-t-md border-t border-l border-r border-gray-200 transition-colors ${
            activeTabId === tab.id
              ? 'bg-white text-gray-800 border-b-0 relative z-10'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          <GripVertical 
            size={14} 
            className="mr-1 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100" 
          />
          <span className="max-w-[120px] truncate">{tab.title}</span>
          {tab.id !== 'list' && (
            <button
              onClick={(e) => handleCloseTab(e, tab.id)}
              className="ml-2 p-0.5 rounded hover:bg-gray-300 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </button>
      ))}
      
      <button
        onClick={handleAddTab}
        className="flex items-center px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default TabBar;

'use client';

import React, { useState } from 'react';
import { FileText, Users, BarChart3, Menu, X, Home } from 'lucide-react';
import Link from 'next/link';

interface AdminNavbarProps {
  activeTab: 'projects' | 'users' | 'analytics';
  onTabChange: (tab: 'projects' | 'users' | 'analytics') => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      key: 'projects' as const,
      label: 'Proyectos',
      icon: FileText,
    },
    {
      key: 'users' as const,
      label: 'Usuarios',
      icon: Users,
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
    }
  ];

  return (
    <nav className="bg-card border-b border-border p-4 flex items-center justify-between relative">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-foreground no-underline flex items-center gap-2">
          <Home size={24} />
          <span className="font-bold text-lg">Alphas Admin</span>
        </Link>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:flex items-center gap-4 mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden flex items-center gap-2">
        {/* Mobile Icon Tabs */}
        <div className="flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`p-2 rounded-md transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-secondary"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="p-4">
            <Link
              href="/alphas"
              className="block w-full text-left px-4 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Volver a Panel Alphas
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;

'use client';

import React, { useState } from 'react';
import { FileText, Users, BarChart3, Menu, X, Home } from 'lucide-react';
import Link from 'next/link';
import styles from './SimpleNavbar.module.css';

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
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className={styles.simpleNavbar}>
        {/* Logo Section */}
        <div className={styles.navbarLogo}>
          <Link href="/" className={styles.logoLink}>
            <Home size={24} />
            <span className={styles.logoText}>Alphas Admin</span>
          </Link>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className={styles.adminNavTabs}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`${styles.adminNavTab} ${isActive ? styles.active : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.mobileNavTabs}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`${styles.mobileTabBtn} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            
            <Link
              href="/alphas"
              className={`${styles.mobileNavItem} ${styles.backLink}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Volver a Panel Alphas
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;

'use client';

import React, { useState } from 'react';
import { FileText, Users, BarChart3, Menu, X, Home } from 'lucide-react';
import Link from 'next/link';
import styles from './AdminSidebar.module.css';

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
      <nav className={styles.adminNavbar}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <Home size={24} />
            <span className={styles.logoText}>Alphas Admin</span>
          </Link>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className={styles.desktopNavTabs}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`${styles.navTab} ${isActive ? styles.active : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.rightSection}>
          {/* Mobile Icon Tabs */}
          <div className={styles.mobileIconTabs}>
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.hamburgerBtn}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            <Link
              href="/alphas"
              className={styles.backLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Volver a Panel Alphas
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          nav div:nth-child(3) div:first-child {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            margin-left: auto !important;
          }
          nav div:nth-child(3) button:last-child {
            display: flex !important;
          }
          nav > div:last-child {
            display: block !important;
          }
          nav div:nth-child(2) {
            display: none !important;
          }
        }
        @media (min-width: 768px) {
          nav div:nth-child(3) {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;

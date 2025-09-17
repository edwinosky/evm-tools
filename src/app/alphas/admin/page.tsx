'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import styles from '../../components/alphas/SimpleNavbar.module.css';
import AdminNavbar from '../../components/alphas/AdminSidebar';
import ProjectsPanel from '../../components/alphas/ProjectsPanel';
import UsersPanel from '../../components/alphas/UsersPanel';
import AnalyticsPanel from '../../components/alphas/AnalyticsPanel';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'users' | 'analytics'>('projects');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { address } = useAppContext();
  const router = useRouter();

  // Check admin permissions
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!address) {
        setLoadingAuth(false);
        return;
      }

      try {
        // Check if user is in admin list - needs wallet address header for auth
        const response = await fetch('/api/alphas/admin/roles', {
          headers: {
            'X-Wallet-Address': address,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const userRole = data.users?.find((user: any) =>
            user.userAddress?.toLowerCase() === address?.toLowerCase()
          );

          setIsAdmin(userRole?.role === 'super_admin' || userRole?.role === 'editor');
        } else {
          console.log('Auth check failed:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAdminAccess();
  }, [address]);

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsPanel />;
      case 'users':
        return <UsersPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      default:
        return <ProjectsPanel />;
    }
  };

  const renderRestrictedNavbar = () => (
    <nav className={styles.simpleNavbar}>
      <div className={styles.navbarLogo}>
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoText}>Alphas Admin</span>
        </Link>
      </div>

      <div className={styles.navAction}>
        <Link
          href="/alphas"
          className={styles.actionBtn}
        >
          ← Volver al Panel Alphas
        </Link>
      </div>
    </nav>
  );

  const renderRestrictedContent = () => (
    <main className="relative z-10 p-4 md:p-6">
      <div className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 p-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h2>

          {!address ? (
            <>
              <p className="text-gray-600 mb-6">
                Necesitas conectar una wallet con permisos administrativos para acceder al panel.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/alphas')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ir al Panel Alphas
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                La wallet conectada no tiene permisos administrativos.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-500 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/alphas')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ir al Panel Alphas
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );

  return (
    <>
      {/* Crystal Background Blur */}
      <div className={styles.crystalBackground} />

      <div className="min-h-screen relative">
        {/* Loading State */}
        {loadingAuth ? (
          <>
            {renderRestrictedNavbar()}
            <main className="relative z-10 p-4 md:p-6">
              <div className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Verificando permisos...</p>
                </div>
              </div>
            </main>
          </>
        ) : !isAdmin ? (
          <>
            {renderRestrictedNavbar()}
            {renderRestrictedContent()}
          </>
        ) : (
          <>
            {/* Full Admin Navbar */}
            <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Full Admin Content */}
            <main className="relative z-10 p-4 md:p-6">
              <div className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 p-6">
                {renderContent()}
              </div>
            </main>
          </>
        )}
      </div>
    </>
  );
}

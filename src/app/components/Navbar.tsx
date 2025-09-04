'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAppContext } from '@/context/AppContext';
import { LogOut, Home } from 'lucide-react';
import { PrivateKeyConnectModal } from './PrivateKeyConnectModal';
import NetworkSelector from './NetworkSelector';
import LanguageSelector from '../../components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

const Navbar = () => {
  const { isConnected, disconnect, address, connectionMode, currentNetwork } = useAppContext();
  const { t } = useLanguage();
  console.log('Navbar props:', { isConnected, disconnect, address, connectionMode, currentNetwork });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="flex items-center justify-between p-4 bg-card text-card-foreground shadow-md border-b border-border">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          EVM Tools
        </Link>
        <Link href="/" className="p-2 rounded-md hover:bg-accent" title="Home">
          <Home size={20} />
        </Link>
        <LanguageSelector />
        <a
          href="https://www.drainerless.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          Rescue Dapp
        </a>
      </div>
      <div className="flex items-center space-x-2 h-[40px]"> {/* Set a fixed height to prevent layout shift */}
        {hasMounted && isConnected ? (
          <>
            <NetworkSelector />
            <div className="p-2 bg-muted rounded-md text-sm">
              {connectionMode === 'privateKey' && '🔑 '}
              {address && truncateAddress(address)}
            </div>
            <button onClick={disconnect} className="p-2 rounded-md hover:bg-accent" title={t('disconnect', 'nav')}>
              <LogOut size={20} />
            </button>
          </>
        ) : hasMounted ? (
          <>
            <NetworkSelector />
            <PrivateKeyConnectModal>
              <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {t('connectPrivateKey', 'nav')}
              </button>
            </PrivateKeyConnectModal>
            <ConnectButton />
          </>
        ) : null} {/* Render nothing on the server and initial client render */}
      </div>
    </nav>
  );
};

export default Navbar;

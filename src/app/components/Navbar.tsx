'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAppContext } from '@/context/AppContext';
import { LogOut, Home, Menu } from 'lucide-react';
import { PrivateKeyConnectModal } from './PrivateKeyConnectModal';
import NetworkSelector from './NetworkSelector';
import { useLanguage } from '@/context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { isConnected, disconnect, address, connectionMode, currentNetwork } = useAppContext();
  const { t } = useLanguage();
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    setHasMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="navbar relative">
      <div className="container flex justify-between items-center p-4">
        <div className="nav-left flex items-center space-x-4">
          <div className="nav-logo">
            <Link href="/" className="nav-link text-lg font-bold">
              EVM Tools
            </Link>
          </div>
          {/* Desktop navigation links */}
          {!isMobile && (
            <div className="flex space-x-4">
              <a
                href="https://www.drainerless.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Rescue Dapp
              </a>
              <Link href="/alphas" className="nav-link">Alphas</Link>
              <Link href="/airdrop" className="nav-link">Airdrop</Link>
            </div>
          )}
        </div>
        <div className="nav-right flex items-center space-x-4 justify-end flex-grow">
          {/* Hamburger menu button for mobile */}
          {isMobile && (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-accent focus:outline-none">
              <Menu size={24} />
            </button>
          )}
          {hasMounted && isConnected ? (
            <>
              <NetworkSelector />
              <div className="nav-button bg-muted text-muted-foreground px-3 py-2 rounded-md">
                {connectionMode === 'privateKey' && '🔑 '}
                {address && truncateAddress(address)}
              </div>
              <button onClick={disconnect} className="nav-link p-2 rounded-md hover:bg-accent" title={t('disconnect', 'nav')}>
                <LogOut size={20} />
              </button>
            </>
          ) : hasMounted ? (
            <>
              <NetworkSelector />
              <PrivateKeyConnectModal>
                <button className="nav-link bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90">
                  {isMobile ? "Connect PK" : "Connect PK"}
                </button>
              </PrivateKeyConnectModal>
              <div className="connect-button-container">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {!connected && (
                          <button onClick={openConnectModal} className="nav-link bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90">
                            {isMobile ? "Connect" : "Connect Wallet"}
                          </button>
                        )}
                        {connected && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={openChainModal}
                              className="nav-link flex items-center space-x-1 bg-muted text-muted-foreground px-3 py-2 rounded-md hover:bg-accent"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 4,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 12, height: 12 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>
                            <button onClick={openAccountModal} className="nav-link bg-muted text-muted-foreground px-3 py-2 rounded-md hover:bg-accent">
                              {account.displayName}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile menu (dropdown) */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full right-0 w-48 bg-card border border-border rounded-md shadow-lg z-50 py-2 transition-all duration-300 ease-in-out transform origin-top scale-y-100">
        <div className="flex flex-col items-end space-y-2 px-4">
            <Link href="/" className="nav-link text-base py-1" onClick={() => setIsMenuOpen(false)}>
              <Home size={16} className="inline-block mr-2" /> Home
            </Link>
            <a
              href="https://www.drainerless.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-base py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Rescue Dapp
            </a>
            <Link href="/alphas" className="nav-link text-base py-1" onClick={() => setIsMenuOpen(false)}>Alphas</Link>
            <Link href="/airdrop" className="nav-link text-base py-1" onClick={() => setIsMenuOpen(false)}>Airdrop</Link>
            {/* Add other mobile-specific menu items here if needed */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

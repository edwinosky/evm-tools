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
import './Navbar.css';

const Navbar = () => {
  const { isConnected, disconnect, address, connectionMode, currentNetwork } = useAppContext();
  const { t } = useLanguage();
  console.log('Navbar props:', { isConnected, disconnect, address, connectionMode, currentNetwork });

  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-left">
          <div className="nav-logo">
            <Link href="/" className="nav-link">
              EVM Tools
            </Link>
          </div>
          <Link href="/" className="nav-link" title="Home">
            <Home size={20} />
          </Link>
          <LanguageSelector />
          <a
            href="https://www.drainerless.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Rescue Dapp
          </a>
        </div>
        <div className="nav-right">
          {hasMounted && isConnected ? (
            <>
              <NetworkSelector />
              <div className="nav-button">
                {connectionMode === 'privateKey' && '🔑 '}
                {address && truncateAddress(address)}
              </div>
              <button onClick={disconnect} className="nav-link" title={t('disconnect', 'nav')}>
                <LogOut size={20} />
              </button>
            </>
          ) : hasMounted ? (
            <>
              <NetworkSelector />
              <PrivateKeyConnectModal>
                <button className="nav-link">
                  {isMobile ? "Connect PK" : "Connect Private Key"}
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
                          <button onClick={openConnectModal} className="nav-link">
                            {isMobile ? "Connect" : "Connect Wallet"}
                          </button>
                        )}
                        {connected && (
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button
                              onClick={openChainModal}
                              style={{ display: 'flex', alignItems: 'center' }}
                              className="nav-link"
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
                            <button onClick={openAccountModal} className="nav-link">
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
    </nav>
  );
};

export default Navbar;

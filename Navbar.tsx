"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
  toggleTheme: () => void;
  currentTheme: string;
}

const Navbar = ({ toggleTheme, currentTheme }: NavbarProps) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [permitMenuOpen, setPermitMenuOpen] = useState(false);
  const [eip7702MenuOpen, setEip7702MenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  const permitMenuRef = useRef<HTMLDivElement>(null);
  const eip7702MenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeAllMenus = () => {
    setPermitMenuOpen(false);
    setEip7702MenuOpen(false);
    setToolsMenuOpen(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        permitMenuRef.current && !permitMenuRef.current.contains(event.target as Node) &&
        eip7702MenuRef.current && !eip7702MenuRef.current.contains(event.target as Node) &&
        toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)
      ) {
        closeAllMenus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-left">
          <div className="nav-logo">
            <Link href="/">
              <img src="/logo.png" alt="DrainerLESS Logo" />
            </Link>
            <Link href="/" className="nav-link">
              DrainerLESS
            </Link>
          </div>
        </div>

        <div className={`nav-middle ${menuOpen ? 'active' : ''}`}>
          <Link href="/permit" className="nav-button" onClick={closeAllMenus}>
            {t('permit_rescue')}
          </Link>

          <div className="nav-item" ref={eip7702MenuRef}>
            <button className="nav-button" onClick={() => setEip7702MenuOpen(!eip7702MenuOpen)}>
              {t('rescue_eip7702')}
            </button>
            {eip7702MenuOpen && (
              <div className="submenu">
                <Link href="/eip7702-tokens" className="nav-link" onClick={closeAllMenus}>
                  Tokens (ERC20)
                </Link>
                <Link href="/eip7702-nfts" className="nav-link" onClick={closeAllMenus}>
                  NFTs
                </Link>
                <Link href="/eip7702-all" className="nav-link" onClick={closeAllMenus}>
                  COMPLETE RESCUE
                </Link>
                <Link href="/eip7702-airdrop" className="nav-link" onClick={closeAllMenus}>
                  AIRDROPS
                </Link>
                <Link href="/eip7702-undelegate" className="nav-link" onClick={closeAllMenus}>
                  {t('undelegate')}
                </Link>
              </div>
            )}
          </div>

          <div className="nav-item" ref={toolsMenuRef}>
            <button className="nav-button" onClick={() => setToolsMenuOpen(!toolsMenuOpen)}>
              {t('tools')}
            </button>
            {toolsMenuOpen && (
              <div className="submenu">
                <Link href="/bundles" className="nav-link" onClick={closeAllMenus}>
                  {t('bundle')}
                </Link>
                <Link href="/private-tools" className="nav-link" onClick={closeAllMenus}>
                  {t('private_script')}
                </Link>
                <Link href="/explorer" className="nav-link" onClick={closeAllMenus}>
                  {t('explorer')}
                </Link>
                <a href="https://evm-tools.drainerless.xyz/" target="_blank" rel="noopener noreferrer" className="nav-link" onClick={closeAllMenus}>
                  {t('evm_tools')}
                </a>
              </div>
            )}
          </div>
          <Link href="/faq" className="nav-button" onClick={closeAllMenus}>
            FAQ
          </Link>
        </div>

        <div className="nav-right">
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
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button" className="nav-button">
                          {t('connect_wallet')}
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button" className="nav-button">
                          {t('wrong_network')}
                        </button>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          onClick={openChainModal}
                          style={{ display: 'flex', alignItems: 'center' }}
                          type="button"
                          className="nav-button"
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

                        <button onClick={openAccountModal} type="button" className="nav-button">
                          {account.displayName}
                          
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <button className="theme-toggle" onClick={toggleTheme}>
            {currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="navbar-menu-toggle" onClick={toggleMenu}>
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
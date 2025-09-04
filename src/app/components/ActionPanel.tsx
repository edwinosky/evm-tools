'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { TransactionModal } from './TransactionModal';

const ActionButton = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
  <Link href={href} {...props} className="block w-full text-center bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
    {children}
  </Link>
);

const ActionPanel = () => {
  const { selectedToken, isConnected } = useAppContext();
  const { t } = useLanguage();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const renderContent = () => {
    if (!isConnected) {
      return <p className="text-muted-foreground">{t('connectWalletMessage', 'actions')}</p>;
    }
    if (!selectedToken) {
      return <p className="text-muted-foreground">{t('selectAssetMessage', 'actions')}</p>;
    }

    return (
      <>
        <p className="mb-2 text-muted-foreground font-semibold">
          {t('selectedPrefix', 'actions')}: {selectedToken.symbol || t('nativeSymbol', 'actions')}
        </p>
        
        {['native', 'ERC20'].includes(selectedToken.type) && (
          <TransactionModal token={selectedToken}>
             <button className="w-full text-center bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors">
                {t('sendTokenButton', 'actions')} {selectedToken.symbol || t('nativeSymbol', 'actions')}
             </button>
          </TransactionModal>
        )}

        {['ERC721', 'ERC1155'].includes(selectedToken.type) && (
           <TransactionModal token={selectedToken}>
             <button className="w-full text-center bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors">
                {t('transferNftButton', 'actions')}
             </button>
          </TransactionModal>
        )}

        {selectedToken.type === 'Contract' && (
          <ActionButton href="/token-interaction">
            {t('interactContractButton', 'actions')}
          </ActionButton>
        )}
      </>
    );
  };

  return (
    <>
      <h3 className="text-lg font-bold mb-4 text-card-foreground">{t('panelTitle', 'actions')}</h3>
      <div className="space-y-2">
        <ActionButton href="/balance">{t('viewBalancesButton', 'actions')}</ActionButton>
        <ActionButton href="/create-token">{t('createTokenButton', 'actions')}</ActionButton>
        <ActionButton href="/create-nft">{t('createNftButton', 'actions')}</ActionButton>
        <ActionButton href="/airdrop">{t('airdropToolsButton', 'actions')}</ActionButton>

        <div className="pt-4 mt-4 border-t border-border">
          {/* Render content only after mount to prevent hydration mismatch */}
          {hasMounted ? renderContent() : <p className="text-muted-foreground">{t('loadingMessage', 'actions')}</p>}
        </div>
      </div>
    </>
  );
};

export default ActionPanel;

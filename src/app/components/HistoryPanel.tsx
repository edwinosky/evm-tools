'use client';

import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink, ArrowRight, Trash2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HistoryPanel = () => {
  const { transactionHistory, clearTransactionHistory, removeTransaction, selectContract } = useAppContext();
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Function to format timestamps in localized format
  const formatLocalizedTime = (timestamp: number) => {
    const date = new Date(timestamp);

    // Get user's locale from current language
    const locale = currentLanguage === 'zh' ? 'zh-CN' :
                   currentLanguage === 'ko' ? 'ko-KR' :
                   currentLanguage === 'es' ? 'es-ES' : 'en-US';

    // Use 12-hour format for English, 24-hour for others
    const timeOptions = {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const,
      hour12: currentLanguage === 'en'
    };

    return date.toLocaleTimeString(locale, timeOptions);
  };

  // Function to translate transaction types dynamically
  const translateTransactionType = (type: string) => {
    // Handle different transaction types
    if (type.startsWith('Send')) {
      // Extract token name from "Send BAR" -> "BAR"
      const tokenName = type.replace('Send ', '');
      return `${t('sendPrefix')} ${tokenName}`;
    }
    if (type.startsWith('Deploy')) {
      if (type.includes('AirdropStandard')) return t('deployAirdropStandard');
      if (type.includes('AirdropWithFee')) return t('deployAirdropWithFee');
      if (type.includes('AirdropVesting')) return t('deployAirdropVesting');
      if (type.includes('AirdropStaking')) return t('deployAirdropStaking');
      if (type.includes('AirdropWithdraw')) return t('deployAirdropWithdraw');
      return `${t('deployPrefix')} ${type.replace('Deploy ', '')}`;
    }
    if (type.includes('Interaction')) {
      if (type.includes('Mint')) return t('mintInteraction');
      if (type.includes('Transfer')) return t('transferInteraction');
      if (type.includes('Burn')) return t('burnInteraction');
      if (type.includes('Approve')) return t('approveInteraction');
      if (type.includes('Create Token')) return t('createTokenInteraction');
      if (type.includes('Create NFT')) return t('createNftInteraction');
      if (type.includes('Airdrop')) return t('airdropInteraction');
      return type.replace(' Interaction', ` ${t('interactionType').toLowerCase()}`);
    }

    // Return original if no translation found
    return type;
  };

  const handleInteractClick = (tx: any) => {
    if (tx.contractAddress && tx.contractAbi && tx.contractFeatures) {
      const contractInfo = {
        abi: tx.contractAbi,
        features: tx.contractFeatures,
        contractType: tx.contractType,
        contractMetadata: tx.contractMetadata,
      };
      localStorage.setItem(`contract_${tx.contractAddress}`, JSON.stringify(contractInfo));
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(t('clearTransactionHistoryConfirm'))) {
      clearTransactionHistory();
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <>
      {/* Header with clear history button */}
      {transactionHistory.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-card-foreground">{t('transactionHistory')}</h3>
          <button
            onClick={handleClearHistory}
            className="px-3 py-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-200 rounded-md transition-colors"
            title={t('clearAllHistory')}
          >
            🗑️ {t('clearAllHistory')}
          </button>
        </div>
      )}

      {transactionHistory.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">{t('transactionHistory')}</h3>
          <p className="text-muted-foreground">{t('noTransactionsYet')}</p>
        </div>
      ) : (
        <ul>
          {transactionHistory.slice().reverse().map((tx, index) => {
            const isDeployTx = tx.type.startsWith('Deploy') && tx.contractAddress;

            return (
              <li key={index} className="mb-4 p-3 rounded-lg bg-muted relative group">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-card-foreground">{translateTransactionType(tx.type)}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatLocalizedTime(tx.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center overflow-hidden">
                    <p className="text-xs text-muted-foreground truncate">
                      {t('hash')} {tx.hash}
                    </p>
                    {tx.explorerUrl && (
                      <a href={`${tx.explorerUrl}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
{isDeployTx && (
                      <button
                        onClick={() => {
                          handleInteractClick(tx);
                          if (tx.type.includes('Airdrop')) {
                            // Para contratos de airdrop, guardamos la dirección en localStorage
                            // y redirigimos a la página de airdrop
                            localStorage.setItem('selectedAirdropContract', tx.contractAddress || '');
                            router.push('/airdrop');
                          } else {
                            // Para otros contratos, usamos el flujo existente
                            selectContract(tx.contractAddress || null);
                            router.push('/interact');
                          }
                        }}
                        className="flex items-center text-sm text-primary hover:underline"
                      >
                        {t('interact')} <ArrowRight size={14} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
                {isDeployTx && (
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center overflow-hidden">
                      <p className="text-xs text-muted-foreground truncate">
                        {t('contract')} {tx.contractAddress}
                      </p>
                    </div>
                    {tx.type.includes('Airdrop') && (
                      <button
                        onClick={() => handleCopyAddress(tx.contractAddress!)}
                        className="flex items-center text-sm text-primary hover:underline ml-2"
                      >
                        {copiedAddress === tx.contractAddress ? t('copied') : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                )}
                <button
                  onClick={() => removeTransaction(tx.hash)}
                  className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title={t('deleteTransaction')}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default HistoryPanel;

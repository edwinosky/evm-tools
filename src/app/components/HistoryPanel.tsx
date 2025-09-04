'use client';

import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink, ArrowRight, Trash2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HistoryPanel = () => {
  const { transactionHistory, clearTransactionHistory, removeTransaction, selectContract } = useAppContext();
  const router = useRouter();
  const { t } = useLanguage();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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
      {transactionHistory.length === 0 ? (
        <p className="text-muted-foreground">{t('noTransactionsYet')}</p>
      ) : (
        <ul>
          {transactionHistory.slice().reverse().map((tx, index) => {
            const isDeployTx = tx.type.startsWith('Deploy') && tx.contractAddress;

            return (
              <li key={index} className="mb-4 p-3 rounded-lg bg-muted relative group">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-card-foreground">{tx.type}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleTimeString()}
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

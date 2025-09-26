'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseEther, parseUnits, erc20Abi } from 'viem';

const ActionButton = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
  <Link href={href} {...props} className="btn-primary block w-full text-center p-2 rounded-md">
    {children}
  </Link>
);

const InlineTransactionForm = ({ token }: { token: any }) => {
  const { connectionMode, rpcUrl, privateKey, addTransaction, address, generatedAccounts, currentNetwork } = useAppContext();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // Wagmi hooks for different transaction types
  const { data: nativeHash, sendTransaction } = useSendTransaction();
  const { data: erc20Hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: token.type === 'ERC20' ? erc20Hash : nativeHash
  });

  // Get the hash from the appropriate transaction
  const transactionHash = token.type === 'ERC20' ? erc20Hash : nativeHash;

  useEffect(() => {
    if (isConfirmed && transactionHash) {
      addTransaction({ type: `Send ${token.symbol}`, hash: transactionHash });
      setToAddress('');
      setAmount('');
      setSendError('Transaction successful! ✅');
      setTimeout(() => setSendError(''), 3000);
    }
  }, [isConfirmed, transactionHash, token.symbol, addTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');

    if (!toAddress || !amount) {
      setSendError('Please fill in all fields');
      return;
    }

    setIsSending(true);

    try {
      // If "SELF" is selected, use the connected wallet address as the destination
      const destinationAddress = toAddress === 'SELF' ? address : toAddress;

      if (connectionMode === 'privateKey' && rpcUrl && privateKey) {
        // Backend handles the transaction for private key connections
        const params = {
          rpcUrl,
          privateKey,
          toAddress: destinationAddress,
          amount,
          tokenType: token.type,
          tokenAddress: token.address,
        };
        const result = await api.sendTransaction(params);
        addTransaction({ type: `Send ${token.symbol}`, hash: result.hash });
        setToAddress('');
        setAmount('');
        setSendError('Transaction successful! ✅');
      } else if (connectionMode === 'wallet') {
        // Handle different token types for MetaMask/RainbowKit
        if (token.type === 'ERC20' && token.address) {
          // ERC20 token transfer
          const decimals = token.decimals || 18;
          const amountInUnits = parseUnits(amount, decimals);

          console.log('Sending ERC20 token:', {
            address: token.address,
            to: destinationAddress,
            amount: amountInUnits.toString(),
            decimals,
            symbol: token.symbol
          });

          writeContract({
            address: token.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [destinationAddress as `0x${string}`, amountInUnits],
            chainId: currentNetwork?.chainId,
          });
        } else if (token.type === 'native') {
          // Native token transfer (ETH, MATIC, etc.)
          const amountInEther = parseEther(amount);

          console.log('Sending native token:', {
            to: destinationAddress,
            amount: amountInEther.toString(),
            symbol: token.symbol
          });

          sendTransaction({
            to: destinationAddress as `0x${string}`,
            value: amountInEther,
          });
        } else {
          setSendError('Unsupported token type for MetaMask transactions');
          setIsSending(false);
          return;
        }
      }
    } catch (err: any) {
      console.error('Transaction error:', err);
      setSendError(err.message || 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-muted rounded-lg space-y-4">
      <h4 className="font-semibold text-card-foreground">
        Send {token.symbol || 'Token'}
      </h4>

      {/* To Address Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          To Address
        </label>
        <div className="flex gap-2">
          <select
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="flex-1 p-3 border border-border rounded-md bg-background text-sm h-11"
            aria-label="Select destination address"
          >
            <option value="">Select address...</option>
            <option value="SELF">SELF (Connected Address)</option>
            {generatedAccounts?.map((acc) => (
              <option key={acc.address} value={acc.address}>
                {acc.address.substring(0, 6)}...{acc.address.substring(acc.address.length - 4)} ({acc.privateKey ? 'Generated' : 'External'})
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-muted-foreground">
          Or paste a different address below
        </div>
        <input
          type="text"
          value={toAddress === 'SELF' ? '' : toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="Enter recipient address..."
          className="w-full p-3 border border-border rounded-md bg-background text-sm h-11"
          disabled={toAddress === 'SELF'}
        />
      </div>

      {/* Amount Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Amount
          {token.type === 'native' && token.symbol && (
            <span className="text-xs text-muted-foreground ml-2">({token.symbol})</span>
          )}
        </label>
        <div className="relative">
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full p-3 border border-border rounded-md bg-background text-sm h-11 pr-12"
            required
          />
          {token.symbol && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              {token.symbol}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {sendError && (
        <div className={`p-2 rounded text-sm ${
          sendError.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {sendError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSending || isConfirming || !toAddress || !amount}
        className="btn-primary w-full p-3 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSending || isConfirming ? '🔄 Sending...' : `🚀 Send ${token.symbol || 'Token'}`}
      </button>
    </form>
  );
};

const ActionPanel = () => {
  const { selectedToken, isConnected } = useAppContext();
  const { t } = useLanguage();
  const [hasMounted, setHasMounted] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);

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
        <div className="mb-4">
          <p className="text-muted-foreground font-semibold">
            {t('selectedPrefix', 'actions')}: {selectedToken.symbol || t('nativeSymbol', 'actions')}
          </p>

          {/* Botón de envío integrado */}
          {['native', 'ERC20'].includes(selectedToken.type) && (
            <button
              onClick={() => setShowSendForm(!showSendForm)}
              className="w-full mt-2 mb-4 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
            >
              {showSendForm ? '❌ Hide Send Form' : `🚀 Send ${selectedToken.symbol || t('nativeSymbol', 'actions')}`}
            </button>
          )}

          {/* Formulario inline cuando se activa */}
          {showSendForm && ['native', 'ERC20'].includes(selectedToken.type) && (
            <InlineTransactionForm token={selectedToken} />
          )}

          {['ERC721', 'ERC1155'].includes(selectedToken.type) && (
            <button
              onClick={() => setShowSendForm(!showSendForm)}
              className="w-full mt-2 mb-4 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
            >
              {showSendForm ? '❌ Hide Transfer Form' : `🚀 Transfer NFT`}
            </button>
          )}

          {/* Formulario inline para NFTs */}
          {showSendForm && ['ERC721', 'ERC1155'].includes(selectedToken.type) && (
            <InlineTransactionForm token={selectedToken} />
          )}

          {selectedToken.type === 'Contract' && (
            <ActionButton href="/token-interaction">
              {t('interactContractButton', 'actions')}
            </ActionButton>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="space-y-2">
        <ActionButton href="/balance">{t('viewBalancesButton', 'actions')}</ActionButton>
        <ActionButton href="/create-token">{t('createTokenButton', 'actions')}</ActionButton>
        <ActionButton href="/create-nft">{t('createNftButton', 'actions')}</ActionButton>

        <div className="pt-4 mt-4 border-t border-border">
          {/* Render content only after mount to prevent hydration mismatch */}
          {hasMounted ? renderContent() : <p className="text-muted-foreground">{t('loadingMessage', 'actions')}</p>}
        </div>
      </div>
    </>
  );
};

export default ActionPanel;

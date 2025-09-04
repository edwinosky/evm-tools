'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/lib/api';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { X } from 'lucide-react';

export const TransactionModal = ({ children, token }: { children: React.ReactNode; token: any }) => {
  const { connectionMode, rpcUrl, privateKey, addTransaction, address, generatedAccounts } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Wagmi hooks
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      addTransaction({ type: `Send ${token.symbol}`, hash: hash! });
      setIsOpen(false);
    }
  }, [isConfirmed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // If "SELF" is selected, use the connected wallet address as the destination
      const destinationAddress = toAddress === 'SELF' ? address : toAddress;
      
      if (connectionMode === 'privateKey' && rpcUrl && privateKey) {
        const params = {
          rpcUrl,
          privateKey,
          toAddress: destinationAddress,
          amount,
          tokenType: token.type,
          tokenAddress: token.address,
          // tokenId: token.tokenId, // for NFTs
        };
        const result = await api.sendTransaction(params);
        addTransaction({ type: `Send ${token.symbol}`, hash: result.hash });
        setIsOpen(false);
      } else if (connectionMode === 'wallet') {
        sendTransaction({
          to: destinationAddress as `0x${string}`,
          value: parseEther(amount),
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] w-[90vw] max-w-[450px] rounded-lg bg-card p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-medium">
            Send {token.symbol}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="toAddress" className="block text-sm font-medium text-muted-foreground">To Address</label>
              <div className="flex gap-2">
                <select
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="flex-1 p-2 border border-border rounded-md bg-background"
                  aria-label="Select destination address"
                >
                  <option value="">Select address...</option>
                  <option value="SELF">SELF (Connected Address)</option>
                  {generatedAccounts.map((acc) => (
                    <option key={acc.address} value={acc.address}>
                      {acc.address}
                    </option>
                  ))}
                </select>
                <input
                  id="toAddress"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="Or enter address"
                  className="flex-1 p-2 border border-border rounded-md bg-background"
                />
              </div>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground">Amount</label>
              <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">Cancel</button>
              </Dialog.Close>
              <button type="submit" disabled={isLoading || isConfirming} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {isLoading || isConfirming ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:bg-accent" aria-label="Close"><X size={20} /></button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

'use client';

import React, { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { argentWallet, trustWallet, ledgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { useAppContext } from './AppContext';
import { createWagmiConfig } from '@/config';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function WagmiWrapper({ children }: { children: React.ReactNode }) {
  const { availableNetworks } = useAppContext();

  const wagmiConfig = useMemo(() => {
    const configNetworks = availableNetworks.map(n => ({
      id: n.chainId,
      name: n.name,
      rpcUrl: n.rpcUrl,
      symbol: n.nativeCurrency.symbol,
      explorerUrl: n.explorerUrl,
    }));
    return createWagmiConfig(configNetworks);
  }, [availableNetworks]);

  // We need to recreate connectors if the chains change
  const connectors = useMemo(() => {
    if (!wagmiConfig) return undefined;
    const { wallets } = getDefaultWallets();
    return connectorsForWallets(
      [
        ...wallets,
        {
          groupName: 'Other',
          wallets: [argentWallet, trustWallet, ledgerWallet],
        },
      ],
      {
        appName: 'EVM Wallet Panel',
        projectId: '7bd1fc9d9a03786175fd089e2f256b2a',
      }
    );
  }, [wagmiConfig]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

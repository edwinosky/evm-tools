'use client';

import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import type { Config } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createWagmiConfig } from '@/config';
import { api } from '@/lib/api';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const networks = await api.getNetworks();
        const wagmiConfig = createWagmiConfig(networks);
        setConfig(wagmiConfig);
      } catch (e) {
        console.error("Failed to initialize Wagmi config", e);
        // Set a default config on failure to prevent the app from crashing.
        setConfig(createWagmiConfig([]));
      }
    };
    initialize();
  }, []);

  // Render a loading state or null while the config is being fetched.
  // This prevents children from trying to use wagmi hooks before the provider is ready.
  if (!config) {
    return null; // Returning null is fine for SSR, as the useEffect will run on the client.
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

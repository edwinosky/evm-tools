import { http, createConfig } from 'wagmi';
import type { Chain } from 'viem';
import { mainnet } from 'wagmi/chains';

interface Network {
  id: number;
  name: string;
  rpcUrl: string;
  symbol: string;
  explorerUrl?: string;
}

export const createWagmiConfig = (networks: Network[]) => {
  if (!networks || networks.length === 0) {
    // Return a default or empty config if networks are not available yet
    // This helps prevent errors during the initial server-side render in Next.js
    return createConfig({
      chains: [mainnet],
      transports: {
        [mainnet.id]: http(),
      },
    });
  }

  const chains = networks.map(network => {
    return {
      id: network.id,
      name: network.name,
      nativeCurrency: {
        name: network.name, // e.g., "Ethereum"
        symbol: network.symbol, // e.g., "ETH"
        decimals: 18, // Standard for most EVM chains
      },
      rpcUrls: {
        default: { http: [network.rpcUrl] },
        public: { http: [network.rpcUrl] },
      },
      blockExplorers: network.explorerUrl ? {
        default: { name: `${network.name} Explorer`, url: network.explorerUrl },
      } : undefined,
    };
  }) as unknown as [Chain, ...Chain[]];

  const transports = networks.reduce((acc, network) => {
    acc[network.id] = http(network.rpcUrl);
    return acc;
  }, {} as Record<number, ReturnType<typeof http>>);

  return createConfig({
    chains,
    transports,
  });
};

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useBalance as useWagmiBalance, useReadContracts } from 'wagmi';
import { api } from '@/lib/api';
import { formatUnits, erc20Abi, isAddress } from 'viem';

interface Balance {
  type: 'native' | 'ERC20';
  symbol?: string;
  address?: string;
  balance: string;
  decimals?: number;
}

const BalancePanel = () => {
  const {
    isConnected,
    connectionMode,
    address,
    rpcUrl,
    setSelectedToken,
    selectedToken,
    currentNetwork,
    tokenAddresses,
    setDiscoveredTokens,
    addTokenAddress,
    addNftAddress
  } = useAppContext();
  const { t } = useLanguage();

  const [balances, setBalances] = useState<Balance[]>([]);
  const [isDiscoveryLoading, setIsDiscoveryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredTokensSet, setDiscoveredTokensSet] = useState<Set<string>>(new Set());
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  // Effect to save discovered tokens to database
  useEffect(() => {
    if (!address || !hasMounted || !currentNetwork || tokenAddresses.length === 0) return;

    const saveTokensToDB = async () => {
      try {
        const payload = {
          [`chain_${currentNetwork.chainId}_tokens`]: tokenAddresses
        };

        await api.saveStorageData(address, 'discovered_tokens', payload);
        console.log('Tokens saved to database for chain:', currentNetwork.chainId);
      } catch (error) {
        console.error('Failed to save tokens to database:', error);
      }
    };

    saveTokensToDB();
  }, [tokenAddresses, address, hasMounted, currentNetwork]);

  // Load tokens from database when chain changes or first connect
  useEffect(() => {
    if (!address || !hasMounted || !currentNetwork) return;

    const loadTokensFromDatabase = async () => {
      if (isDiscovering) return;

      try {
        console.log('🎯 Loading tokens from database for:', address, 'chain:', currentNetwork.chainId);

        const data = await api.getStorageData(address);
        const chainKey = `${address}:chain_${currentNetwork.chainId}_tokens`;
        const erc20Key = `${address}:chain_${currentNetwork.chainId}_erc20_tokens`;
        const nftKey = `${address}:chain_${currentNetwork.chainId}_nft_addresses`;

        const savedErc20Tokens = data[erc20Key] || [];
        const savedNftAddresses = data[nftKey] || [];
        const savedTokens = data[chainKey] || []; // Fallback for old format

        console.log('📦 Found in database:', {
          chainData: data[chainKey] ? data[chainKey].length : 0,
          erc20Tokens: savedErc20Tokens.length,
          nftAddresses: savedNftAddresses.length
        });

        // Set discovered tokens from database
        setDiscoveredTokensSet(new Set([...savedErc20Tokens, ...savedNftAddresses]));

        // Update context with loaded data
        if (savedErc20Tokens.length > 0 || savedNftAddresses.length > 0) {
          setDiscoveredTokens(savedErc20Tokens, savedNftAddresses);
          console.log('✅ Loaded tokens from database: ERC20=', savedErc20Tokens.length, 'NFTs=', savedNftAddresses.length);
        }

      } catch (error) {
        console.error('❌ Failed to load tokens from database:', error);
      }
    };

    if (currentNetwork.chainId !== currentChainId) {
      setCurrentChainId(currentNetwork.chainId);
      loadTokensFromDatabase();
    }
  }, [currentNetwork?.chainId, address, hasMounted]);

  // Enhanced discovery with immediate token updates
  const discoverTokens = async () => {
    if (isDiscovering || !address || !currentNetwork) return;

    setIsDiscovering(true);
    setIsDiscoveryLoading(true);
    setError(null);

    try {
      const effectiveRpcUrl = connectionMode === 'privateKey' ? rpcUrl : currentNetwork?.rpcUrl;
      if (!effectiveRpcUrl) return;

      console.log('🔍 Starting ENHANCED token discovery for:', address);

      const { erc20Balances } = await api.discoverBalances(address, effectiveRpcUrl);
      console.log('📊 Found', erc20Balances.length, 'tokens with balance > 0');

      // Immediately show tokens in UI while processing
      let addedCount = 0;
      for (let i = 0; i < erc20Balances.length; i++) {
        const tokenBalance = erc20Balances[i];
        const tokenAddress = tokenBalance.token;

        if (!discoveredTokensSet.has(tokenAddress) && BigInt(tokenBalance.balance) > BigInt(0)) {
          console.log(`🟢 Adding ${tokenBalance.symbol} (${tokenBalance.balance})`);

          // Update local UI state immediately
          const updatedTokensLocal = [...tokenAddresses];
          if (!updatedTokensLocal.includes(tokenAddress)) {
            updatedTokensLocal.push(tokenAddress);
          }
          setDiscoveredTokens(updatedTokensLocal, []);
          setDiscoveredTokensSet((prevSet: Set<string>) => new Set([...Array.from(prevSet), tokenAddress]));

          addedCount++;

          // Small delay for UI feedback
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      console.log('✅ Enhanced discovery completed - Added', addedCount, 'new tokens');

    } catch (err: any) {
      console.error("❌ Enhanced discovery failed:", err);

      if (err.message && err.message.includes('rate limit')) {
        setTimeout(() => {
          if (!isDiscovering) {
            discoverTokens();
          }
        }, 3000);
      } else {
        setError('balance.discoveryFailed');
      }
    } finally {
      setIsDiscoveryLoading(false);
      setIsDiscovering(false);
    }
  };

  // Wagmi hooks for fetching balances of discovered/added tokens
  const { data: wagmiNativeBalance, isLoading: isWagmiNativeLoading } = useWagmiBalance({
    address: address as `0x${string}` | undefined,
    chainId: currentNetwork?.chainId,
    query: { enabled: hasMounted && isConnected && !!currentNetwork },
  });

  const contractsToRead = useMemo(() => tokenAddresses.map(token => ({
    abi: erc20Abi,
    address: token as `0x${string}`,
    chainId: currentNetwork?.chainId,
  })), [tokenAddresses, currentNetwork?.chainId]);

  const { data: wagmiErc20Data, isLoading: isWagmiErc20Loading } = useReadContracts({
    contracts: [
      ...contractsToRead.map(c => ({ ...c, functionName: 'balanceOf', args: [address as `0x${string}`] })),
      ...contractsToRead.map(c => ({ ...c, functionName: 'symbol' })),
      ...contractsToRead.map(c => ({ ...c, functionName: 'decimals' })),
    ],
    query: { 
      enabled: hasMounted && isConnected && !!address && tokenAddresses.length > 0 && !!currentNetwork
    },
  });

  // Effect to process and set final balances state
  useEffect(() => {
    const processBalances = () => {
      const fetchedBalances: Balance[] = [];
      
      // Add native balance
      if (wagmiNativeBalance) {
        fetchedBalances.push({ 
          type: 'native', 
          balance: wagmiNativeBalance.formatted, 
          symbol: wagmiNativeBalance.symbol, 
          decimals: wagmiNativeBalance.decimals 
        });
      }

      // Process ERC20 balances
      if (wagmiErc20Data && tokenAddresses.length > 0) {
        const count = tokenAddresses.length;
        const balances = wagmiErc20Data.slice(0, count);
        const symbols = wagmiErc20Data.slice(count, count * 2);
        const decimals = wagmiErc20Data.slice(count * 2, count * 3);

        tokenAddresses.forEach((tokenAddress, index) => {
          const balanceResult = balances[index];
          if (balanceResult?.status === 'success' && (balanceResult.result as bigint) > BigInt(0)) {
            const symbol = (symbols[index]?.result as string) || 'TOKEN';
            const decimal = (decimals[index]?.result as number) || 18;
            fetchedBalances.push({
              type: 'ERC20',
              address: tokenAddress,
              balance: formatUnits(balanceResult.result as bigint, decimal),
              symbol,
              decimals: decimal,
            });
          }
        });
      }
      setBalances(fetchedBalances);
    };

    if (hasMounted && isConnected) {
      processBalances();
    } else {
      setBalances([]);
    }
  }, [hasMounted, isConnected, wagmiNativeBalance, wagmiErc20Data, tokenAddresses]);

  const getListItemClass = (item: Balance) => {
    const base = "p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex justify-between items-center";
    return selectedToken?.address === item.address ? `${base} bg-accent ring-2 ring-primary` : `${base} bg-muted`;
  };

  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddContract = async () => {
    if (!newTokenAddress || !isAddress(newTokenAddress)) {
      setError(t('invalidAddress', 'balance'));
      return;
    }
    if (tokenAddresses.includes(newTokenAddress)) {
      setError(t('addressAlreadyAdded', 'balance'));
      return;
    }

    const effectiveRpcUrl = connectionMode === 'privateKey' ? rpcUrl : currentNetwork?.rpcUrl;
    if (!effectiveRpcUrl) {
      setError(t('rpcNotAvailable', 'balance'));
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      const { contractType } = await api.getContractType(effectiveRpcUrl, newTokenAddress);

      if (contractType === 'ERC20') {
        addTokenAddress(newTokenAddress);
      } else if (contractType === 'ERC721' || contractType === 'ERC1155') {
        addNftAddress(newTokenAddress);
      } else {
        setError(t('unsupportedContractType', 'balance'));
      }
      setNewTokenAddress('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const renderContent = () => {
    if (!isConnected) {
      return <p className="text-muted-foreground">{t('connectWalletMessage', 'balance')}</p>;
    }

    const isLoading = isDiscoveryLoading || isWagmiNativeLoading || (isWagmiErc20Loading && tokenAddresses.length > 0);

    if (isLoading) {
      return <p className="text-muted-foreground">{t('discoveringMessage', 'balance')}</p>;
    }
    if (error && !isAdding) { // Don't show manual add errors while discovery is running
      return <p className="text-red-500">{t('errorPrefix', 'balance')} {error}</p>;
    }
    if (balances.length > 0) {
      return (
        <ul className="space-y-3">
          {balances.map((item) => (
            <li key={item.address || 'native'} className={getListItemClass(item)} onClick={() => setSelectedToken(item)}>
              <div>
                <p className="font-semibold">{item.symbol || t('unknownToken', 'balance')}</p>
                <p className="text-xs text-muted-foreground truncate">{item.address || t('nativeToken', 'balance')}</p>
              </div>
              <div className="text-right">
                <p>{parseFloat(item.balance).toFixed(4)}</p>
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-muted-foreground">{t('balance.noBalancesFound', 'balance')}</p>;
  };

  const handleDiscoverTokens = async () => {
    if (!isConnected || !address || !currentNetwork) return;
    await discoverTokens();
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{t('panelTitle', 'balance')}</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDiscoverTokens}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
          disabled={isDiscoveryLoading || !isConnected}
        >
          {isDiscoveryLoading ? t('discoveringTokens', 'balance') : t('discoverTokens', 'balance')}
        </button>

        <input
          type="text"
          value={newTokenAddress}
          onChange={(e) => setNewTokenAddress(e.target.value)}
          placeholder={t('addTokenPlaceholder', 'balance')}
          className="flex-grow p-2 border border-border rounded-md bg-background"
          disabled={isAdding}
        />
        <button onClick={handleAddContract} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" disabled={isAdding}>
          {isAdding ? t('addingToken', 'balance') : t('addToken', 'balance')}
        </button>
      </div>

      <div className="mt-4">
        {hasMounted ? renderContent() : <p className="text-muted-foreground">{t('loading', 'balance')}</p>}
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Debug: Tokens loaded: {tokenAddresses.length} | Balances shown: {balances.length}</p>
        </div>
      )}
    </div>
  );
};

export default BalancePanel;

'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
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
    nftAddresses,
    addTokenAddress,
    addNftAddress
  } = useAppContext();
  
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data: wagmiNativeBalance, isLoading: isWagmiNativeLoading } = useWagmiBalance({
    address: address as `0x${string}` | undefined,
    chainId: currentNetwork?.chainId,
    query: { enabled: hasMounted && connectionMode === 'wallet' && !!currentNetwork },
  });

  const { data: wagmiErc20Balances, isLoading: isWagmiErc20Loading } = useReadContracts({
    contracts: tokenAddresses.map(token => ({
      abi: erc20Abi,
      address: token as `0x${string}`,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
      chainId: currentNetwork?.chainId,
    })),
    query: { enabled: hasMounted && connectionMode === 'wallet' && !!address && tokenAddresses.length > 0 && !!currentNetwork },
  });

  const { data: wagmiErc20Symbols } = useReadContracts({
    contracts: tokenAddresses.map(token => ({
      abi: erc20Abi,
      address: token as `0x${string}`,
      functionName: 'symbol',
      chainId: currentNetwork?.chainId,
    })),
    query: { enabled: hasMounted && connectionMode === 'wallet' && !!address && tokenAddresses.length > 0 && !!currentNetwork },
  });

  const { data: wagmiErc20Decimals } = useReadContracts({
    contracts: tokenAddresses.map(token => ({
      abi: erc20Abi,
      address: token as `0x${string}`,
      functionName: 'decimals',
      chainId: currentNetwork?.chainId,
    })),
    query: { enabled: hasMounted && connectionMode === 'wallet' && !!address && tokenAddresses.length > 0 && !!currentNetwork },
  });

  useEffect(() => {
    const fetchPrivateKeyBalances = async () => {
      if (connectionMode !== 'privateKey' || !rpcUrl || !address) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getBalance(rpcUrl, address, tokenAddresses, nftAddresses);
        
        const nativeSymbol = currentNetwork?.nativeCurrency.symbol || 'ETH';
        
        const fetchedBalances: Balance[] = [
          { type: 'native', balance: formatUnits(BigInt(data.nativeBalance), 18), symbol: nativeSymbol, decimals: 18 }
        ];
        
        if (data.erc20Balances) {
          data.erc20Balances.forEach((b: any) => {
            const decimals = b.decimals || 18;
            fetchedBalances.push({ 
              type: 'ERC20', 
              address: b.token, 
              balance: formatUnits(BigInt(b.balance), decimals), 
              symbol: b.symbol, 
              decimals 
            });
          });
        }
        
        setBalances(fetchedBalances);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const processWalletBalances = () => {
        if (connectionMode !== 'wallet') return;
        
        const fetchedBalances: Balance[] = [];
        if (wagmiNativeBalance) {
            fetchedBalances.push({ type: 'native', balance: wagmiNativeBalance.formatted, symbol: wagmiNativeBalance.symbol, decimals: wagmiNativeBalance.decimals });
        }
        if (wagmiErc20Balances && wagmiErc20Symbols && wagmiErc20Decimals) {
            wagmiErc20Balances.forEach((b, index) => {
                if (b.status === 'success') {
                    const symbol = wagmiErc20Symbols[index]?.result as string || 'TOKEN';
                    const decimals = wagmiErc20Decimals[index]?.result as number || 18;
                    fetchedBalances.push({ 
                        type: 'ERC20', 
                        address: tokenAddresses[index], 
                        balance: formatUnits(b.result as bigint, decimals), 
                        symbol, 
                        decimals 
                    });
                }
            });
        }
        setBalances(fetchedBalances);
    };

    if (hasMounted && isConnected) {
        if (connectionMode === 'privateKey') fetchPrivateKeyBalances();
        else processWalletBalances();
    } else {
        setBalances([]);
    }
  }, [hasMounted, isConnected, address, connectionMode, rpcUrl, tokenAddresses, nftAddresses, wagmiNativeBalance, wagmiErc20Balances, currentNetwork]);

  const handleAddContract = async () => {
    if (!newTokenAddress || !isAddress(newTokenAddress)) {
      setError('Please enter a valid contract address.');
      return;
    }
    if (tokenAddresses.includes(newTokenAddress) || nftAddresses.includes(newTokenAddress)) {
      setError('This address has already been added.');
      return;
    }

    const effectiveRpcUrl = connectionMode === 'privateKey' ? rpcUrl : currentNetwork?.rpcUrl;
    if (!effectiveRpcUrl) {
      setError('RPC URL is not available. Cannot verify contract type.');
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
        setError('Could not determine contract type, or it is not a supported token/NFT standard.');
      }
      setNewTokenAddress('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const getListItemClass = (item: Balance) => {
    const base = "p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex justify-between items-center";
    return selectedToken?.address === item.address ? `${base} bg-accent ring-2 ring-primary` : `${base} bg-muted`;
  };

  const renderContent = () => {
    if (!isConnected) {
      return <p className="text-muted-foreground">Please connect your wallet to see balances.</p>;
    }
    if (isLoading || isWagmiNativeLoading || isWagmiErc20Loading) {
      return <p className="text-muted-foreground">Loading balances...</p>;
    }
    if (error && !isAdding) { // Don't show address-related errors while adding
      return <p className="text-red-500">Error: {error}</p>;
    }
    if (balances.length > 0) {
      return (
        <ul className="space-y-3">
          {balances.map((item) => (
            <li key={item.address || 'native'} className={getListItemClass(item)} onClick={() => setSelectedToken(item)}>
              <div>
                <p className="font-semibold">{item.symbol || 'Unknown Token'}</p>
                <p className="text-xs text-muted-foreground truncate">{item.address || 'Native Token'}</p>
              </div>
              <div className="text-right">
                <p>{parseFloat(item.balance).toFixed(4)}</p>
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-muted-foreground">No token balances found. Add a contract address above.</p>;
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Balances</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTokenAddress}
          onChange={(e) => setNewTokenAddress(e.target.value)}
          placeholder="0x... contract address"
          className="flex-grow p-2 border border-border rounded-md bg-background"
          disabled={isAdding}
        />
        <button onClick={handleAddContract} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      
      <div className="mt-4">
        {hasMounted ? renderContent() : <p className="text-muted-foreground">Loading...</p>}
      </div>
    </div>
  );
};

export default BalancePanel;

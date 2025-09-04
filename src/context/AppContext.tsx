'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { api } from '@/lib/api';
import { cloudflareStorage } from '@/lib/cloudflare-api';

type ConnectionMode = 'wallet' | 'privateKey' | null;

interface PrivateKeyData {
  address: string;
  rpcUrl: string;
  privateKey: string;
  chainId?: number;
  explorerUrl?: string;
}

interface Transaction {
  type: string;
  hash: string;
  timestamp: number;
  explorerUrl?: string; // Store the explorer URL at the time of transaction
  contractAddress?: string;
  contractAbi?: any;
  contractFeatures?: {
    mintable: boolean;
    burnable: boolean;
    permit: boolean;
  };
  contractType?: 'ERC20' | 'ERC721' | 'ERC1155' | string; // Add contract type
  contractMetadata?: {
    baseTokenUri?: string;
    // Add other metadata fields as needed
  };
}

interface Token {
  type: 'native' | 'ERC20' | 'ERC721' | 'ERC1155' | 'Contract';
  address?: string;
  symbol?: string;
  balance?: string;
  decimals?: number;
}

interface GeneratedAccount {
  address: string;
  privateKey: string;
}

interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

interface NewNetworkData {
  chainId: number;
  name: string;
  rpcUrl: string;
  symbol: string;
  explorerUrl?: string;
}

interface AppContextType {
  // State
  connectionMode: ConnectionMode;
  isConnected: boolean;
  address?: string;
  rpcUrl?: string;
  privateKey?: string;
  isHistoryPanelOpen: boolean;
  isActionPanelOpen: boolean;
  transactionHistory: Transaction[];
  selectedToken: Token | null;
  privateKeyData: PrivateKeyData | null;
  generatedAccounts: GeneratedAccount[];
  currentNetwork: Network | null;
  availableNetworks: Network[];
  selectedContractAddress: string | null;
  tokenAddresses: string[];
  nftAddresses: string[];
  
  // Actions
  addTokenAddress: (address: string) => void;
  addNftAddress: (address: string) => void;
  selectContract: (address: string | null) => void;
  connectWithPrivateKey: (rpcUrl: string, privateKey: string) => Promise<void>;
  disconnect: () => void;
  toggleHistoryPanel: () => void;
  toggleActionPanel: () => void;
  addTransaction: (transaction: Omit<Transaction, 'timestamp' | 'explorerUrl'> & { contractAddress?: string }) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
  setSelectedToken: (token: Token | null) => void;
  generateAccount: () => Promise<GeneratedAccount>;
  addGeneratedAccount: (account: GeneratedAccount) => void;
  removeGeneratedAccount: (address: string) => void;
  switchNetwork: (network: Network) => void;
  addNetwork: (network: NewNetworkData) => Promise<void>;
  deleteNetwork: (id: number) => Promise<void>;
  clearTransactionHistory: () => Promise<void>;
  removeTransaction: (hash: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const SESSION_STORAGE_KEY = 'evm-wallet-session';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>(null);
  const [privateKeyData, setPrivateKeyData] = useState<PrivateKeyData | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([]);
  const [nftAddresses, setNftAddresses] = useState<string[]>([]);
  const [generatedAccounts, setGeneratedAccounts] = useState<GeneratedAccount[]>([]);
  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([]);
  const [selectedContractAddress, setSelectedContractAddress] = useState<string | null>(null);

  const { address: walletAddress, isConnected: isWalletConnected, chainId: walletChainId } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Initialize Cloudflare KV storage with wallet address
  useEffect(() => {
    const userAddress = connectionMode === 'wallet' ? walletAddress : privateKeyData?.address;
    if (userAddress) {
      cloudflareStorage.setWalletAddress(userAddress);
    }
  }, [connectionMode, walletAddress, privateKeyData?.address]);

  // On initial load, try to restore session from sessionStorage and fetch networks
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const networks = await api.getNetworks();
        // Map to the frontend Network type
        const formattedNetworks = networks.map((n: any) => ({
          name: n.name,
          chainId: n.id,
          rpcUrl: n.rpcUrl,
          explorerUrl: n.explorerUrl,
          nativeCurrency: {
            name: n.name, // Or a more generic name like 'Ether'
            symbol: n.symbol,
            decimals: 18,
          },
        }));
        setAvailableNetworks(formattedNetworks);
      } catch (error) {
        console.error("Failed to fetch networks:", error);
        setError("Could not load network configurations.");
      }
    };

    fetchNetworks();

    try {
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const { mode, data, network, contractAddress } = JSON.parse(savedSession);
        if (mode === 'privateKey' && data) {
          setConnectionMode('privateKey');
          setPrivateKeyData(data);
          if (network) {
            setCurrentNetwork(network);
          }
        }
        if (contractAddress) {
          setSelectedContractAddress(contractAddress);
        }
      }
    } catch (e) {
      console.error("Failed to parse session storage:", e);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setIsInitialLoad(false);
  }, []);

  // Sync with RainbowKit connection state
  useEffect(() => {
    if (isInitialLoad) return;

    if (isWalletConnected && walletAddress) {
      setConnectionMode('wallet');
      setPrivateKeyData(null);
      setSelectedToken(null); // Reset token on new connection
      // Clear token addresses when switching to a new wallet connection
      setTokenAddresses([]);
      localStorage.removeItem('tokenAddresses');
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else if (connectionMode === 'wallet') {
      setConnectionMode(null);
      setSelectedToken(null);
      // Clear token addresses when disconnecting from wallet
      setTokenAddresses([]);
      localStorage.removeItem('tokenAddresses');
    }
  }, [isWalletConnected, walletAddress, isInitialLoad]);

  // Persist session to sessionStorage
  useEffect(() => {
    if (connectionMode === 'privateKey' && privateKeyData) {
      const sessionData = JSON.stringify({ 
        mode: 'privateKey', 
        data: privateKeyData, 
        network: currentNetwork,
        contractAddress: selectedContractAddress 
      });
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionData);
    } else if (selectedContractAddress) {
      // Persist selected contract even if not in private key mode
      const existingSession = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}');
      const sessionData = JSON.stringify({ ...existingSession, contractAddress: selectedContractAddress });
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionData);
    }
  }, [connectionMode, privateKeyData, currentNetwork, selectedContractAddress]);

  // Update current network when wallet chainId changes
  useEffect(() => {
    console.log('Wallet chainId changed:', walletChainId);
    if (isWalletConnected && walletChainId) {
      const network = availableNetworks.find(n => n.chainId === walletChainId);
      if (network) {
        console.log('Setting current network to:', network);
        setCurrentNetwork(network);
      } else {
        console.log('No matching network found for chainId:', walletChainId);
        // Set a minimal network object to indicate an unsupported network
        setCurrentNetwork({
          name: `Unsupported Network (${walletChainId})`,
          chainId: walletChainId,
          rpcUrl: '', // No RPC URL available
          nativeCurrency: {
            name: 'Unknown',
            symbol: '???',
            decimals: 18,
          },
        });
      }
    }
  }, [isWalletConnected, walletChainId, availableNetworks]);

  // Load user data from Cloudflare KV when connected
  useEffect(() => {
    const loadUserData = async () => {
      const userAddress = connectionMode === 'wallet' ? walletAddress : privateKeyData?.address;
      if (userAddress) {
        try {
          // Load transaction history
          const savedTransactions = await cloudflareStorage.getItem('transactionHistory');
          if (savedTransactions) {
            setTransactionHistory(savedTransactions);
          }
          
          // Load generated accounts
          const savedAccounts = await cloudflareStorage.getItem('generatedAccounts');
          if (savedAccounts) {
            setGeneratedAccounts(savedAccounts);
          }
          
          // Load token addresses
          const savedTokenAddresses = await cloudflareStorage.getItem('tokenAddresses');
          if (savedTokenAddresses) {
            setTokenAddresses(savedTokenAddresses);
          }
          const savedNftAddresses = await cloudflareStorage.getItem('nftAddresses');
          if (savedNftAddresses) {
            setNftAddresses(savedNftAddresses);
          }
        } catch (error) {
          console.error('Error loading user data from Cloudflare KV:', error);
        }
      } else {
        // Clear data when disconnected
        setTransactionHistory([]);
        setGeneratedAccounts([]);
        setTokenAddresses([]);
        setNftAddresses([]);
      }
    };

    loadUserData();
  }, [connectionMode, walletAddress, privateKeyData?.address]);

  const addTokenAddress = (address: string) => {
    const newTokens = [...tokenAddresses, address];
    setTokenAddresses(newTokens);
    cloudflareStorage.setItem('tokenAddresses', newTokens).catch(error => {
      console.error('Error saving token addresses to Cloudflare KV:', error);
    });
  };

  const addNftAddress = (address: string) => {
    const newNfts = [...nftAddresses, address];
    setNftAddresses(newNfts);
    cloudflareStorage.setItem('nftAddresses', newNfts).catch(error => {
      console.error('Error saving NFT addresses to Cloudflare KV:', error);
    });
  };

  const connectWithPrivateKey = async (rpcUrl: string, privateKey: string) => {
    setError(null);
    try {
      console.log('Connecting with private key to RPC URL:', rpcUrl);
      const data = await api.connect(rpcUrl, privateKey);
      console.log('Connection data:', data);
      setPrivateKeyData({ 
        address: data.address, 
        rpcUrl, 
        privateKey, 
        chainId: data.chainId,
        explorerUrl: data.explorerUrl
      });
      setConnectionMode('privateKey');
      setSelectedToken(null); // Reset token on new connection
    } catch (err: any) {
      console.error('Error connecting with private key:', err);
      setError(err.message);
      throw err;
    }
  };

  const selectContract = (address: string | null) => {
    setSelectedContractAddress(address);
  };

  const disconnect = () => {
    if (connectionMode === 'wallet') {
      wagmiDisconnect();
    }
    setConnectionMode(null);
    setPrivateKeyData(null);
    setSelectedToken(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const toggleHistoryPanel = () => setIsHistoryPanelOpen(prev => !prev);
  const toggleActionPanel = () => setIsActionPanelOpen(prev => !prev);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'timestamp' | 'explorerUrl'> & { contractAddress?: string }) => {
    const newTransaction: Transaction = {
      ...transaction,
      timestamp: Date.now(),
      explorerUrl: currentNetwork?.explorerUrl,
    };
    setTransactionHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newTransaction];
      // Save to Cloudflare KV
      cloudflareStorage.setItem('transactionHistory', updatedHistory).catch(error => {
        console.error('Error saving transaction history to Cloudflare KV:', error);
      });
      return updatedHistory;
    });
  }, [currentNetwork]);

  const updateTransaction = useCallback((hash: string, updates: Partial<Transaction>) => {
    setTransactionHistory(prevHistory => {
      const updatedHistory = prevHistory.map(tx =>
        tx.hash === hash ? { ...tx, ...updates } : tx
      );
      cloudflareStorage.setItem('transactionHistory', updatedHistory).catch(error => {
        console.error('Error saving updated transaction history to Cloudflare KV:', error);
      });
      return updatedHistory;
    });
  }, []);

  const generateAccount = async (): Promise<GeneratedAccount> => {
    try {
      const account = await api.generateAccount();
      addGeneratedAccount(account);
      return account;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addGeneratedAccount = (account: GeneratedAccount) => {
    setGeneratedAccounts(prev => [...prev, account]);
    // Save to Cloudflare KV
    cloudflareStorage.setItem('generatedAccounts', [...generatedAccounts, account]).catch(error => {
      console.error('Error saving generated accounts to Cloudflare KV:', error);
    });
  };

  const removeGeneratedAccount = (address: string) => {
    const updatedAccounts = generatedAccounts.filter(acc => acc.address !== address);
    setGeneratedAccounts(updatedAccounts);
    // Save to Cloudflare KV
    cloudflareStorage.setItem('generatedAccounts', updatedAccounts).catch(error => {
      console.error('Error saving generated accounts to Cloudflare KV:', error);
    });
  };

  const switchNetwork = (network: Network) => {
    console.log('Switching network to:', network);

    // For wallet connections, request a chain switch in the wallet
    if (connectionMode === 'wallet' && switchChain) {
      switchChain({ chainId: network.chainId });
    }
    
    // Si la red no está en la lista, agregarla
    if (!availableNetworks.find(n => n.chainId === network.chainId)) {
      setAvailableNetworks(prev => {
        const newNetworks = [...prev, network];
        localStorage.setItem('availableNetworks', JSON.stringify(newNetworks));
        return newNetworks;
      });
    }
    
    setCurrentNetwork(network);
    
    // Si estamos conectados con clave privada, reconectar con la nueva red
    if (connectionMode === 'privateKey' && privateKeyData) {
      console.log('Reconnecting with private key to new network');
      connectWithPrivateKey(network.rpcUrl, privateKeyData.privateKey);
    }
  };

  const addNetwork = async (network: NewNetworkData) => {
    try {
      const networkForApi = {
        id: network.chainId,
        name: network.name,
        rpcUrl: network.rpcUrl,
        symbol: network.symbol,
        explorerUrl: network.explorerUrl || '',
      };
      const updatedNetworks = await api.addNetwork(networkForApi);
      const formattedNetworks = updatedNetworks.map((n: any) => ({
        name: n.name,
        chainId: n.id,
        rpcUrl: n.rpcUrl,
        explorerUrl: n.explorerUrl,
        nativeCurrency: {
          name: n.name,
          symbol: n.symbol,
          decimals: 18,
        },
      }));
      setAvailableNetworks(formattedNetworks);
      // Switch to the new network after adding it
      const newNetworkInList = formattedNetworks.find((n: any) => n.chainId === network.chainId);
      if (newNetworkInList) {
        switchNetwork(newNetworkInList);
      }
    } catch (err: any) {
      console.error('Error adding network:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteNetwork = async (id: number) => {
    try {
      const updatedNetworks = await api.deleteNetwork(id);
      const formattedNetworks = updatedNetworks.map((n: any) => ({
        name: n.name,
        chainId: n.id,
        rpcUrl: n.rpcUrl,
        explorerUrl: n.explorerUrl,
        nativeCurrency: {
          name: n.name,
          symbol: n.symbol,
          decimals: 18,
        },
      }));
      setAvailableNetworks(formattedNetworks);

      // If the deleted network was the current one, switch to the first available network
      if (currentNetwork?.chainId === id) {
        switchNetwork(formattedNetworks[0]);
      }
    } catch (err: any) {
      console.error('Error deleting network:', err);
      setError(err.message);
      throw err;
    }
  };

  const clearTransactionHistory = async () => {
    try {
      await cloudflareStorage.removeItem('transactionHistory');
      setTransactionHistory([]);
    } catch (err: any) {
      console.error('Error clearing transaction history:', err);
      setError(err.message);
    }
  };

  const removeTransaction = async (hash: string) => {
    try {
      const updatedHistory = transactionHistory.filter(tx => tx.hash !== hash);
      setTransactionHistory(updatedHistory);
      await cloudflareStorage.setItem('transactionHistory', updatedHistory);
    } catch (err: any) {
      console.error('Error removing transaction:', err);
      setError(err.message);
    }
  };

  const value: AppContextType = {
    connectionMode,
    isConnected: isWalletConnected || !!privateKeyData,
    address: connectionMode === 'wallet' ? walletAddress : privateKeyData?.address,
    rpcUrl: connectionMode === 'privateKey' ? privateKeyData?.rpcUrl : undefined,
    privateKey: connectionMode === 'privateKey' ? privateKeyData?.privateKey : undefined,
    isHistoryPanelOpen,
    isActionPanelOpen,
    transactionHistory,
    selectedToken,
    privateKeyData,
    generatedAccounts,
    currentNetwork,
    availableNetworks,
    selectedContractAddress,
    tokenAddresses,
    nftAddresses,
    addTokenAddress,
    addNftAddress,
    selectContract,
    connectWithPrivateKey,
    disconnect,
    toggleHistoryPanel,
    toggleActionPanel,
    addTransaction,
    updateTransaction,
    setSelectedToken,
    generateAccount,
    addGeneratedAccount,
    removeGeneratedAccount,
    switchNetwork,
    addNetwork,
deleteNetwork,
    clearTransactionHistory,
    removeTransaction,
  };
  
  console.log('AppContext value:', {
    connectionMode,
    isConnected: isWalletConnected || !!privateKeyData,
    address: connectionMode === 'wallet' ? walletAddress : privateKeyData?.address,
    rpcUrl: connectionMode === 'privateKey' ? privateKeyData?.rpcUrl : undefined,
    currentNetwork,
  });

  return (
    <AppContext.Provider value={value}>
      {children}
      {error && <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg" onClick={() => setError(null)}>{error}</div>}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

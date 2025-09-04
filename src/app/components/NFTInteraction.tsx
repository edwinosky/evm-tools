'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/lib/api';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

interface NFTInteractionProps {
  contractAddress: string;
  contractAbi: any;
  features: {
    mintable: boolean;
    // Add other NFT-specific features if needed in the future
  };
  contractMetadata?: {
    baseTokenUri?: string;
  };
}

interface OwnedNFT {
  id: string;
}

const NFTInteraction: React.FC<NFTInteractionProps> = ({ contractAddress, contractAbi, features, contractMetadata }) => {
  const { addTransaction, address, rpcUrl, privateKey, connectionMode } = useAppContext();
  const { data: hash, writeContract, isPending: isContractWriting, error: contractError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [isMinting, setIsMinting] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const [mintToAddress, setMintToAddress] = useState('');
  const [mintTokenUri, setMintTokenUri] = useState(contractMetadata?.baseTokenUri || '');
  const [transferToAddress, setTransferToAddress] = useState('');
  const [transferTokenId, setTransferTokenId] = useState('');
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    if (contractError) {
      setError(contractError.message);
    }
  }, [contractError]);

  useEffect(() => {
    if (isConfirmed && hash && lastAction) {
      addTransaction({
        type: `${lastAction} Interaction`,
        hash: hash,
      });
      setLastAction(null);
      handleRefreshNFTs(); // Refresh NFT list after a successful transaction
    }
  }, [isConfirmed, hash]);

  const handleRefreshNFTs = async () => {
    if (!address || !contractAddress) return;
    
    // For private key mode, we need the rpcUrl. For wallet mode, wagmi handles it.
    const effectiveRpcUrl = rpcUrl || (window as any).ethereum?.currentProvider?.rpcUrl;
    if (!effectiveRpcUrl) {
        console.warn("RPC URL not available, cannot refresh NFTs.");
        // Do not set an error, as the user might be on a wallet that doesn't expose this.
        // The component should still be usable for interactions.
        return;
    }

    setError(null);
    setInfo('Loading NFTs...');
    setOwnedNFTs([]);

    try {
      const balanceResult = await api.getBalance(effectiveRpcUrl, address, [], [contractAddress]);
      const nftInfo = balanceResult.nftBalances.find((b: any) => b.nft.toLowerCase() === contractAddress.toLowerCase());

      if (nftInfo && nftInfo.tokenIds && nftInfo.tokenIds.length > 0) {
        const nfts = nftInfo.tokenIds.map((id: string) => ({ id }));
        setOwnedNFTs(nfts);
        setInfo(`You own ${nftInfo.balance} NFT(s). Select one to transfer.`);
        if (nfts.length > 0 && !transferTokenId) {
          setTransferTokenId(nfts[0].id); // Pre-select the first token if none is selected
        }
      } else if (nftInfo && parseInt(nftInfo.balance) > 0) {
        setOwnedNFTs([]);
        setInfo(`You own ${nftInfo.balance} NFT(s), but the token IDs could not be retrieved automatically. Please enter one manually.`);
      } else {
        setOwnedNFTs([]);
        setInfo('You do not own any NFTs from this contract.');
      }
    } catch (err) {
      console.error('Failed to fetch NFT balance:', err);
      setError('Failed to fetch NFT balance.');
      setInfo(''); // Clear loading message on error
    }
  };

  useEffect(() => {
    handleRefreshNFTs();
  }, [address, contractAddress, rpcUrl]);

  const handleMintNFT = async () => {
    if (!address) {
      setError('Please connect your wallet.');
      return;
    }
    if (!mintToAddress) {
      setError('Please enter a recipient address.');
      return;
    }
    setError(null);
    setLastAction('Mint NFT');

    if (connectionMode === 'privateKey') {
      if (!rpcUrl || !privateKey) {
        setError('Private key or RPC URL is missing for this operation.');
        return;
      }
      setIsMinting(true);
      try {
        const result = await api.sendTransaction({
          rpcUrl,
          privateKey,
          toAddress: contractAddress,
          amount: '0',
          tokenType: 'ERC721',
          tokenAddress: contractAddress,
          tokenId: '0',
          abi: contractAbi,
          functionName: 'safeMint',
          args: [mintToAddress],
        });
        addTransaction({ type: 'Mint NFT Interaction', hash: result.hash });
        handleRefreshNFTs();
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsMinting(false);
      }
    } else {
      // Wallet connection (RainbowKit)
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'safeMint',
        args: [mintToAddress],
      });
    }
  };

  const handleTransferNFT = async () => {
    if (!address) {
      setError('Please connect your wallet.');
      return;
    }
    if (!transferToAddress || !transferTokenId) {
      setError('Please fill all transfer fields.');
      return;
    }
    setError(null);
    setLastAction('Transfer NFT');

    if (connectionMode === 'privateKey') {
      if (!rpcUrl || !privateKey) {
        setError('Private key or RPC URL is missing for this operation.');
        return;
      }
      setIsTransfering(true);
      try {
        const result = await api.sendTransaction({
          rpcUrl,
          privateKey,
          toAddress: transferToAddress,
          amount: '0',
          tokenType: 'ERC721',
          tokenAddress: contractAddress,
          tokenId: Number(transferTokenId),
          abi: contractAbi,
          functionName: 'safeTransferFrom',
          args: [address, transferToAddress, Number(transferTokenId)],
        });
        addTransaction({ type: 'Transfer NFT Interaction', hash: result.hash });
        handleRefreshNFTs();
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsTransfering(false);
      }
    } else {
      // Wallet connection (RainbowKit)
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'safeTransferFrom',
        args: [address, transferToAddress, BigInt(transferTokenId)],
      });
    }
  };

  const isLoading = isMinting || isTransfering || isContractWriting || isConfirming;

  return (
    <div className="mt-6 p-4 border border-border rounded-lg bg-background">
      <h3 className="text-xl font-bold mb-4">Interact with NFT Contract</h3>
      <p className="text-sm text-muted-foreground mb-2">Contract Address: {contractAddress}</p>
      
      <div className="space-y-4">
        {features.mintable && (
          <div>
            <h4 className="font-semibold">Mint New NFT</h4>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mintToAddress}
                  onChange={(e) => setMintToAddress(e.target.value)}
                  placeholder="Recipient address"
                  className="flex-grow p-2 border border-border rounded-md bg-background"
                />
                <button onClick={() => setMintToAddress(address || '')} className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm">
                  Self
                </button>
              </div>
              <input
                type="text"
                value={mintTokenUri}
                onChange={(e) => setMintTokenUri(e.target.value)}
                placeholder="Token URI (if applicable)"
                className="p-2 border border-border rounded-md bg-background"
                readOnly={!!contractMetadata?.baseTokenUri}
              />
              <button onClick={handleMintNFT} disabled={isLoading} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50">
                {isLoading && lastAction === 'Mint NFT' ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold">Transfer NFT</h4>
          <div className="flex flex-col gap-2 mt-1">
            <input
              type="text"
              value={transferToAddress}
              onChange={(e) => setTransferToAddress(e.target.value)}
              placeholder="To address (recipient)"
              className="p-2 border border-border rounded-md bg-background"
            />
            <div className="flex gap-2 items-center">
              {ownedNFTs.length > 0 ? (
                <select
                  value={transferTokenId}
                  onChange={(e) => setTransferTokenId(e.target.value)}
                  className="flex-grow p-2 border border-border rounded-md bg-background"
                >
                  <option value="">Select a Token ID</option>
                  {ownedNFTs.map((nft) => (
                    <option key={nft.id} value={nft.id}>
                      Token ID: {nft.id}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={transferTokenId}
                  onChange={(e) => setTransferTokenId(e.target.value)}
                  placeholder="Token ID"
                  className="flex-grow p-2 border border-border rounded-md bg-background"
                />
              )}
              <button 
                onClick={handleTransferNFT} 
                disabled={isLoading || !transferTokenId}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading && lastAction === 'Transfer NFT' ? 'Transferring...' : 'Transfer'}
              </button>
              <button onClick={handleRefreshNFTs} className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Refresh
              </button>
            </div>
            {info && <p className="text-sm text-muted-foreground mt-2">{info}</p>}
          </div>
        </div>
      </div>

      {isConfirming && <p className="text-blue-500 mt-4">Confirming transaction...</p>}
      {isConfirmed && hash && <p className="text-green-500 mt-4">Transaction successful! Hash: {hash}</p>}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};

export default NFTInteraction;

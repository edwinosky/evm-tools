'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/lib/api';
import { useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from 'wagmi';
import { parseEther, maxUint256 } from 'viem';
import { createPublicClient, http } from 'viem';

interface TokenInteractionProps {
  contractAddress: string;
  contractAbi: any;
  features: {
    mintable: boolean;
    burnable: boolean;
    permit: boolean;
  };
}

const TokenInteraction: React.FC<TokenInteractionProps> = ({ contractAddress, contractAbi, features }) => {
  const { addTransaction, address, currentNetwork, connectionMode, rpcUrl, privateKey } = useAppContext();
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { signTypedDataAsync } = useSignTypedData();

  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [permitSpender, setPermitSpender] = useState('');
  const [permitAmount, setPermitAmount] = useState('');
  const [permitSignature, setPermitSignature] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);

  useEffect(() => {
    if (isConfirmed && hash && lastAction) {
      addTransaction({
        type: `${lastAction} Interaction`,
        hash: hash,
      });
      setLastAction(null); // Reset after logging
    }
  }, [isConfirmed, hash, lastAction, addTransaction]);

  const handleMint = async () => {
    if (!address) {
      setError('Please connect your wallet.');
      return;
    }
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      setError('Please enter a valid amount to mint.');
      return;
    }
    setError(null);
    setLastAction('Mint');

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
          tokenType: 'ERC20',
          tokenAddress: contractAddress,
          abi: contractAbi,
          functionName: 'mint',
          args: [address, parseEther(mintAmount).toString()],
        });
        addTransaction({ type: 'Mint Interaction', hash: result.hash });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsMinting(false);
      }
    } else {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'mint',
        args: [address, parseEther(mintAmount)],
      });
    }
  };

  const handleBurn = async () => {
    if (!burnAmount || parseFloat(burnAmount) <= 0) {
      setError('Please enter a valid amount to burn.');
      return;
    }
    setError(null);
    setLastAction('Burn');

    if (connectionMode === 'privateKey') {
      if (!rpcUrl || !privateKey) {
        setError('Private key or RPC URL is missing for this operation.');
        return;
      }
      setIsBurning(true);
      try {
        const result = await api.sendTransaction({
          rpcUrl,
          privateKey,
          toAddress: contractAddress,
          amount: '0',
          tokenType: 'ERC20',
          tokenAddress: contractAddress,
          abi: contractAbi,
          functionName: 'burn',
          args: [parseEther(burnAmount).toString()],
        });
        addTransaction({ type: 'Burn Interaction', hash: result.hash });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsBurning(false);
      }
    } else {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'burn',
        args: [parseEther(burnAmount)],
      });
    }
  };

  const handleTransfer = async () => {
    if (!transferAddress || !transferAmount || parseFloat(transferAmount) <= 0) {
      setError('Please enter a valid address and amount.');
      return;
    }
    setError(null);
    setLastAction('Transfer');

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
          toAddress: contractAddress,
          amount: '0',
          tokenType: 'ERC20',
          tokenAddress: contractAddress,
          abi: contractAbi,
          functionName: 'transfer',
          args: [transferAddress, parseEther(transferAmount).toString()],
        });
        addTransaction({ type: 'Transfer Interaction', hash: result.hash });
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsTransfering(false);
      }
    } else {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: 'transfer',
        args: [transferAddress, parseEther(transferAmount)],
      });
    }
  };

  const handleSignPermit = async () => {
    if (!address || !currentNetwork || !permitSpender || !permitAmount || parseFloat(permitAmount) <= 0) {
      setError('Please fill all fields for permit.');
      return;
    }
    setError(null);
    setPermitSignature(null);

    try {
      if (connectionMode === 'privateKey') {
        if (!rpcUrl || !privateKey) {
          setError('Private key or RPC URL is missing for this operation.');
          return;
        }
        const result = await api.signPermit({
          rpcUrl,
          privateKey,
          contractAddress,
          ownerAddress: address,
          spenderAddress: permitSpender,
          value: parseEther(permitAmount).toString(),
          contractAbi,
        });
        setPermitSignature(result.signature);
      } else {
        const deadline = maxUint256; // Or a specific timestamp
        const chainForViem = {
          ...currentNetwork,
          id: currentNetwork.chainId,
          rpcUrls: {
            default: { http: [currentNetwork.rpcUrl] },
            public: { http: [currentNetwork.rpcUrl] },
          },
        };
        const publicClient = createPublicClient({
          chain: chainForViem,
          transport: http(),
        });
        const nonce = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: contractAbi,
          functionName: 'nonces',
          args: [address],
        });

        const domain = {
          name: (contractAbi.find((item: any) => item.name === 'name' && item.inputs?.length === 0) ? await createPublicClient({
            chain: {
              ...currentNetwork,
              id: currentNetwork.chainId,
              rpcUrls: {
                default: { http: [currentNetwork.rpcUrl] },
                public: { http: [currentNetwork.rpcUrl] },
              },
            },
            transport: http(),
          }).readContract({
            address: contractAddress as `0x${string}`,
            abi: contractAbi,
            functionName: 'name',
            args: [],
          }) : 'PermitToken') as string,
          version: '1',
          chainId: currentNetwork.chainId,
          verifyingContract: contractAddress as `0x${string}`,
        };

        const types = {
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
        };

        const message = {
          owner: address,
          spender: permitSpender,
          value: parseEther(permitAmount),
          nonce: nonce,
          deadline: deadline,
        };

        const signature = await signTypedDataAsync({
          domain,
          types,
          primaryType: 'Permit',
          message,
        });
        setPermitSignature(signature);
      }
    } catch (e: any) {
      console.error("Permit signing failed:", e);
      setError(e.message);
    }
  };

  return (
    <div className="mt-6 p-4 border border-border rounded-lg bg-background">
      <h3 className="text-xl font-bold mb-4">Interact with Contract</h3>
      <p className="text-sm text-muted-foreground mb-2">Contract Address: {contractAddress}</p>
      
      <div className="space-y-4">
        {features.mintable && (
          <div>
            <h4 className="font-semibold">Mint Tokens</h4>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Amount to mint"
                className="flex-grow p-2 border border-border rounded-md bg-background"
              />
              <button onClick={handleMint} disabled={isPending || isConfirming || isMinting} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50">
                {(isPending || isMinting) && lastAction === 'Mint' ? 'Minting...' : 'Mint'}
              </button>
            </div>
          </div>
        )}

        {features.burnable && (
          <div>
            <h4 className="font-semibold">Burn Tokens</h4>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="Amount to burn"
                className="flex-grow p-2 border border-border rounded-md bg-background"
              />
              <button onClick={handleBurn} disabled={isPending || isConfirming || isBurning} className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50">
                {(isPending || isBurning) && lastAction === 'Burn' ? 'Burning...' : 'Burn'}
              </button>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold">Transfer Tokens</h4>
          <div className="flex flex-col gap-2 mt-1">
            <input
              type="text"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              placeholder="Recipient address"
              className="p-2 border border-border rounded-md bg-background"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Amount to transfer"
                className="flex-grow p-2 border border-border rounded-md bg-background"
              />
              <button onClick={handleTransfer} disabled={isPending || isConfirming || isTransfering} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {(isPending || isTransfering) && lastAction === 'Transfer' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {features.permit && (
          <div>
            <h4 className="font-semibold">Create Permit (EIP-2612)</h4>
            <div className="flex flex-col gap-2 mt-1">
              <input
                type="text"
                value={permitSpender}
                onChange={(e) => setPermitSpender(e.target.value)}
                placeholder="Spender address"
                className="p-2 border border-border rounded-md bg-background"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={permitAmount}
                  onChange={(e) => setPermitAmount(e.target.value)}
                  placeholder="Amount to approve"
                  className="flex-grow p-2 border border-border rounded-md bg-background"
                />
                <button onClick={handleSignPermit} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Sign Permit
                </button>
              </div>
              {permitSignature && (
                <div className="mt-2 text-xs break-all bg-muted p-2 rounded">
                  <p className="font-bold">Signature:</p>
                  <code>{permitSignature}</code>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isConfirming && <p className="text-blue-500 mt-4">Confirming transaction...</p>}
      {isConfirmed && <p className="text-green-500 mt-4">Transaction successful! Hash: {hash}</p>}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};

export default TokenInteraction;

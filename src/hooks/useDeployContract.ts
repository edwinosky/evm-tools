import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/lib/api';
import { useWalletClient, useWaitForTransactionReceipt } from 'wagmi';
import { Abi, Hash } from 'viem';

interface DeployContractParams {
  abi: Abi;
  bytecode: string;
  constructorArgs: any[];
  contractType?: 'Deploy ERC20' | 'Deploy ERC721' | 'Deploy Airdrop Contract' | 'Deploy Contract';
}

export const useDeployContract = () => {
  const { addTransaction, updateTransaction, connectionMode, rpcUrl, privateKey } = useAppContext();
  const { data: walletClient } = useWalletClient();
  
  const [hash, setHash] = useState<Hash | undefined>();
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  const { isLoading: isConfirming, isSuccess, data: receipt, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const deployContract = useCallback(async ({ abi, bytecode, constructorArgs, contractType = 'Deploy Contract' }: DeployContractParams): Promise<void> => {
    setIsDeploying(true);
    setError(null);
    setContractAddress(null);
    setHash(undefined);

    try {
      const formattedBytecode = `0x${bytecode.startsWith('0x') ? bytecode.substring(2) : bytecode}` as `0x${string}`;
      let deployHash: Hash;

      if (connectionMode === 'privateKey') {
        if (!rpcUrl || !privateKey) {
          throw new Error('Private key or RPC URL is missing for this operation.');
        }
        const result = await api.deployContract({
          rpcUrl,
          privateKey,
          abi,
          bytecode: formattedBytecode,
          constructorArgs,
        });
        deployHash = result.hash;
      } else {
        if (!walletClient) {
          throw new Error('Wallet client not found.');
        }
        deployHash = await walletClient.deployContract({
          abi,
          bytecode: formattedBytecode,
          args: constructorArgs,
        });
      }
      
      setHash(deployHash);
      
      addTransaction({
        type: contractType,
        hash: deployHash,
        contractAbi: abi,
        contractType: contractType,
      });
    } catch (err) {
      const error = err as Error;
      console.error("Deployment error:", error);
      setError(error);
      setIsDeploying(false);
      throw error;
    }
  }, [walletClient, addTransaction, connectionMode, rpcUrl, privateKey]);
  
  useEffect(() => {
    if (isConfirming) {
      setIsDeploying(true);
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isSuccess && receipt && receipt.contractAddress && hash) {
      setContractAddress(receipt.contractAddress);
      updateTransaction(hash, { contractAddress: receipt.contractAddress });
      setIsDeploying(false);
    }
  }, [isSuccess, receipt, hash, updateTransaction]);

  useEffect(() => {
    if (receiptError) {
      setError(receiptError);
      setIsDeploying(false);
    }
  }, [receiptError]);

  return {
    deployContract,
    isDeploying,
    isSuccess,
    contractAddress,
    error,
    hash,
  };
};

'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/lib/api';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import TokenInteraction from './TokenInteraction'; // Import the new component

interface ContractCreatorProps {
  addToHistory: (transaction: { type: string; hash: string }) => void;
  addNotification: (message: string) => void;
}

const ContractCreator: React.FC<ContractCreatorProps> = ({ addToHistory, addNotification }) => {
  const { isConnected, connectionMode, rpcUrl, privateKey, addTransaction, address } = useAppContext();
  
  // Form state
  const [contractType, setContractType] = useState('ERC20');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [options, setOptions] = useState({
    mintable: true,
    burnable: true,
    permit: false,
    wrapper: false,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Deployed contract state
  const [deployedContractAddress, setDeployedContractAddress] = useState<string | null>(null);
  const [deployedContractAbi, setDeployedContractAbi] = useState<any | null>(null);

  // Wagmi hooks for 'wallet' mode deployment
  const { data: wagmiHash, sendTransaction, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({ hash: wagmiHash });

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setError('Please connect a wallet first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDeployedContractAddress(null);
    setDeployedContractAbi(null);

    try {
      const compileParams = { contractType, name, symbol, options };
      const { abi, bytecode } = await api.compileContract(compileParams);
      setDeployedContractAbi(abi); // Save ABI for later interaction

      if (connectionMode === 'privateKey' && rpcUrl && privateKey) {
        const deployParams = { rpcUrl, privateKey, abi, bytecode, constructorArgs: [name, symbol, address] };
        const deployResult = await api.deployContract(deployParams);
        setDeployedContractAddress(deployResult.address);
        addTransaction({
          type: `Deploy ${contractType}`,
          hash: deployResult.hash,
          contractAddress: deployResult.address,
          contractAbi: abi,
          contractFeatures: options,
          contractType: 'ERC20', // Explicitly set contract type
        });
      } else if (connectionMode === 'wallet') {
        const encodedArgs = encodeAbiParameters(
          parseAbiParameters('string, string, address'),
          [name, symbol, address] as [string, string, `0x${string}`]
        );
        const bytecodeWithArgs = `${bytecode}${encodedArgs.slice(2)}` as `0x${string}`;
        
        sendTransaction({
          data: bytecodeWithArgs,
          to: undefined,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to handle wagmi transaction result
  useEffect(() => {
    if (isConfirmed && wagmiHash && receipt) {
        const contractAddress = receipt.contractAddress;
      if (contractAddress) {
        addTransaction({
          type: `Deploy ${contractType}`,
          hash: wagmiHash,
          contractAddress: contractAddress,
          contractAbi: deployedContractAbi,
          contractFeatures: options,
          contractType: 'ERC20', // Explicitly set contract type
        });
          setDeployedContractAddress(contractAddress);
        }
    }
  }, [isConfirmed, wagmiHash, receipt, deployedContractAbi, contractType, options]);

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a New Token</h2>
      <form onSubmit={handleDeploy} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Contract Type</label>
          <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="mt-1 block w-full p-2 border border-border rounded-md bg-background">
            <option value="ERC20">ERC20 (Fungible Token)</option>
            <option value="ERC721">ERC721 (NFT)</option>
            <option value="ERC1155">ERC1155 (Multi-Token)</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <input type="text" placeholder="My Token" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Symbol</label>
            <input type="text" placeholder="MTK" value={symbol} onChange={(e) => setSymbol(e.target.value)} required className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Features</label>
          <div className="mt-2 space-y-2 p-3 border border-border rounded-md">
            <label className="flex items-center"><input type="checkbox" checked={options.mintable} onChange={(e) => setOptions({ ...options, mintable: e.target.checked })} className="mr-2" /> Mintable</label>
            <label className="flex items-center"><input type="checkbox" checked={options.burnable} onChange={(e) => setOptions({ ...options, burnable: e.target.checked })} className="mr-2" /> Burnable</label>
            {contractType === 'ERC20' && (
              <label className="flex items-center"><input type="checkbox" checked={options.permit} onChange={(e) => setOptions({ ...options, permit: e.target.checked })} className="mr-2" /> Permit (EIP-2612)</label>
            )}
          </div>
        </div>
        <button type="submit" disabled={isLoading || isPending || isConfirming} className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 disabled:opacity-50">
          {isLoading ? 'Compiling...' : (isPending || isConfirming) ? 'Deploying...' : 'Compile & Deploy'}
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      
      {isConfirming && <p className="text-blue-500 mt-4">Waiting for confirmation...</p>}
      {isConfirmed && wagmiHash && (
        <div className="mt-4 text-green-500">
          <p>Deployment transaction sent! Hash: {wagmiHash}</p>
          {deployedContractAddress && <p>Contract deployed at: {deployedContractAddress}</p>}
        </div>
      )}

      {deployedContractAddress && deployedContractAbi && (
        <TokenInteraction
          contractAddress={deployedContractAddress}
          contractAbi={deployedContractAbi}
          features={options}
        />
      )}
    </div>
  );
};

export default ContractCreator;

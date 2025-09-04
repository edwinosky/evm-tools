'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import TokenInteraction from '@/app/components/TokenInteraction';
import NFTInteraction from '@/app/components/NFTInteraction';

interface ContractInfo {
  abi: any;
  features: {
    mintable: boolean;
    burnable: boolean;
    permit: boolean;
  };
  contractType?: 'ERC20' | 'ERC721' | 'ERC1155' | string;
  contractMetadata?: {
    baseTokenUri?: string;
    // Add other metadata fields as needed
  };
}

const InteractPage = () => {
  const { selectedContractAddress } = useAppContext(); // Using context instead of params
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedContractAddress) {
      try {
        const storedInfo = localStorage.getItem(`contract_${selectedContractAddress}`);
        if (storedInfo) {
          setContractInfo(JSON.parse(storedInfo));
          setError(null);
        } else {
          setError('Contract information not found. Please select a contract to interact with.');
        }
      } catch (e) {
        setError('Failed to load contract information.');
      }
    } else {
      setError('No contract selected. Please go back and select a contract from the history.');
    }
  }, [selectedContractAddress]);

  const renderInteractionComponent = () => {
    if (!contractInfo || !selectedContractAddress) return null;

    switch (contractInfo.contractType) {
      case 'ERC721':
      case 'ERC1155':
        return (
          <NFTInteraction
            contractAddress={selectedContractAddress}
            contractAbi={contractInfo.abi}
            features={{ mintable: contractInfo.features?.mintable || false }}
            contractMetadata={contractInfo.contractMetadata}
          />
        );
      case 'ERC20':
      default:
        // Default to ERC20 for backward compatibility
        return (
          <TokenInteraction
            contractAddress={selectedContractAddress}
            contractAbi={contractInfo.abi}
            features={contractInfo.features}
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interact with Contract</h1>
      <div className="text-muted-foreground mb-4 overflow-hidden">
        Selected Contract: <span className="font-mono bg-muted px-2 py-1 rounded truncate inline-block align-middle max-w-full">{selectedContractAddress || 'None'}</span>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {renderInteractionComponent()}
      {!contractInfo && !error && <p>Loading contract data...</p>}
    </div>
  );
};

export default InteractPage;

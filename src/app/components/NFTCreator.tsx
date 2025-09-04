'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/lib/api';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import NFTInteraction from './NFTInteraction';

const NFTCreator: React.FC = () => {
  const { isConnected, connectionMode, rpcUrl, privateKey, addTransaction, address } = useAppContext();

  // Form state
  const [contractType, setContractType] = useState('ERC721');
  const [collectionName, setCollectionName] = useState(''); // Renamed from 'name' for clarity
  const [symbol, setSymbol] = useState('');
  const [nftName, setNftName] = useState(''); // Name for the first NFT
  const [nftDescription, setNftDescription] = useState(''); // Description for the first NFT
  const [nftImage, setNftImage] = useState<File | null>(null); // For file upload
  const [nftImageUrl, setNftImageUrl] = useState(''); // For URL input
  const [useImageUrl, setUseImageUrl] = useState(false); // Toggle between file upload and URL
  const [options, setOptions] = useState({
    mintable: true,
    burnable: true,
    permit: false, // Permit is not standard for NFTs but kept for consistency
    wrapper: false,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview

  // Deployed contract state
  const [deployedContractAddress, setDeployedContractAddress] = useState<string | null>(null);
  const [deployedContractAbi, setDeployedContractAbi] = useState<any | null>(null);
  const [baseTokenUri, setBaseTokenUri] = useState<string | null>(null);

  // Wagmi hooks
  const { data: wagmiHash, sendTransaction, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({ hash: wagmiHash });

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setError('Please connect a wallet first.');
      return;
    }

    // Validate NFT metadata
    if (!nftName) {
      setError('Please enter a name for the first NFT.');
      return;
    }
    
    if (!useImageUrl && !nftImage) {
      setError('Please upload an image or provide an image URL for the first NFT.');
      return;
    }
    
    if (useImageUrl && !nftImageUrl) {
      setError('Please provide an image URL for the first NFT.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Uploading to IPFS...');
    setError(null);
    setDeployedContractAddress(null);
    setDeployedContractAbi(null);

try {
      // Upload image to IPFS
      let imageUri = '';
      if (!useImageUrl && nftImage) {
        const imageResult = await api.uploadToIpfs(nftImage, nftName);
        imageUri = imageResult.tokenURI; // This will be a full IPFS URI
      } else if (useImageUrl && nftImageUrl) {
        imageUri = nftImageUrl;
      }
      
      // Create and upload metadata to IPFS
      const metadata = {
        name: nftName,
        description: nftDescription,
        image: imageUri
      };
      
      // For now, we'll just store the metadata in the contract metadata
      // In a real implementation, we would upload this to IPFS as well
      setBaseTokenUri(imageUri); // Simplified for now

      setLoadingStep('Compiling contract...');
      const compileParams = { contractType, name: collectionName, symbol, options };
      const { abi, bytecode } = await api.compileContract(compileParams);
      setDeployedContractAbi(abi);

      setLoadingStep('Deploying contract...');
      if (connectionMode === 'privateKey' && rpcUrl && privateKey) {
        const deployParams = { rpcUrl, privateKey, abi, bytecode, constructorArgs: [collectionName, symbol, address as string] };
        const deployResult = await api.deployContract(deployParams);
        setDeployedContractAddress(deployResult.address);
        addTransaction({
          type: `Deploy ${contractType}`,
          hash: deployResult.hash, // Assuming API returns hash
          contractAddress: deployResult.address,
          contractAbi: abi,
          contractFeatures: options,
          contractType: 'ERC721',
          contractMetadata: { baseTokenUri: baseTokenUri || undefined }
        });
      } else if (connectionMode === 'wallet') {
        const encodedArgs = encodeAbiParameters(
          parseAbiParameters('string, string, address'),
          [collectionName, symbol, address as `0x${string}`]
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
          contractType: 'ERC721', // Explicitly set contract type
        });
        setDeployedContractAddress(contractAddress);
      }
    }
  }, [isConfirmed, wagmiHash, receipt, deployedContractAbi, contractType, options]);

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a New NFT Contract</h2>
      <form onSubmit={handleDeploy} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Contract Type</label>
          <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="mt-1 block w-full p-2 border border-border rounded-md bg-background">
            <option value="ERC721">ERC721 (Single NFT)</option>
            <option value="ERC1155">ERC1155 (Multi-Token NFT)</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <input type="text" placeholder="My NFT Collection" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} required className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Symbol</label>
            <input type="text" placeholder="MNFT" value={symbol} onChange={(e) => setSymbol(e.target.value)} required className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
          </div>
        </div>
        
        {/* NFT Metadata Section */}
        <div className="border-t border-border pt-4">
          <h3 className="text-lg font-medium text-foreground mb-2">First NFT Metadata</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">NFT Name</label>
                <input type="text" placeholder="My First NFT" value={nftName} onChange={(e) => setNftName(e.target.value)} required className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Description</label>
                <input type="text" placeholder="A unique digital asset" value={nftDescription} onChange={(e) => setNftDescription(e.target.value)} className="mt-1 block w-full p-2 border border-border rounded-md bg-background" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">NFT Image</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={!useImageUrl}
                    onChange={() => setUseImageUrl(false)}
                    className="mr-2"
                  />
                  Upload Image
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={useImageUrl}
                    onChange={() => setUseImageUrl(true)}
                    className="mr-2"
                  />
                  Image URL
                </label>
              </div>
              
              {!useImageUrl ? (
                <div className="mt-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setNftImage(file);
                      setNftImageUrl('');
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md border border-border" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.png" 
                    value={nftImageUrl} 
                    onChange={(e) => {
                      setNftImageUrl(e.target.value);
                      setNftImage(null);
                      setImagePreview(e.target.value || null);
                    }}
                    className="mt-1 block w-full p-2 border border-border rounded-md bg-background" 
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md border border-border" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <button type="submit" disabled={isLoading || isPending || isConfirming} className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 disabled:opacity-50">
          {isLoading ? loadingStep : (isPending || isConfirming) ? 'Waiting for confirmation...' : 'Compile & Deploy NFT'}
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

      {deployedContractAddress && deployedContractAbi && baseTokenUri && (
        <NFTInteraction
          contractAddress={deployedContractAddress}
          contractAbi={deployedContractAbi}
          features={options}
          contractMetadata={{ baseTokenUri }}
        />
      )}
    </div>
  );
};

export default NFTCreator;

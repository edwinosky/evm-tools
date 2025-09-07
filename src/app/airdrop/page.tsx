'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReadContracts, useReadContract } from 'wagmi';
import { formatUnits, isAddress, type Address, Abi } from 'viem';
import DeployPanel from '@/app/components/airdrop/DeployPanel';
import OwnerPanel from '@/app/components/airdrop/OwnerPanel';
import UserPanel from '@/app/components/airdrop/UserPanel';

// Importar todos los ABIs
import AirdropStandard from '@/lib/abi/airdrop/AirdropStandard.json';
import AirdropWithFee from '@/lib/abi/airdrop/AirdropWithFee.json';
import AirdropVesting from '@/lib/abi/airdrop/AirdropVesting.json';
import AirdropStaking from '@/lib/abi/airdrop/AirdropStaking.json';
import AirdropWithdraw from '@/lib/abi/airdrop/AirdropWithdraw.json';

const erc20DecimalsAbi = [{
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{ "name": "", "type": "uint8" }],
  "type": "function"
}] as const;

const contractAbis = {
  AirdropStandard: AirdropStandard as Abi,
  AirdropWithFee: AirdropWithFee as Abi,
  AirdropVesting: AirdropVesting as Abi,
  AirdropStaking: AirdropStaking as Abi,
  AirdropWithdraw: AirdropWithdraw as Abi,
};

type ContractType = keyof typeof contractAbis;

const AirdropPage = () => {
  const { isConnected, address } = useAppContext();
  const { t } = useLanguage();
  
  const [contractAddress, setContractAddress] = useState<Address | undefined>();
  const [contractType, setContractType] = useState<ContractType>('AirdropStandard');
  const [inputValue, setInputValue] = useState('');

  const [isOwner, setIsOwner] = useState(false);
  const [isAirdropSetup, setIsAirdropSetup] = useState(false);
  const [contractData, setContractData] = useState<any>(null);
  const [airdropTokenAddress, setAirdropTokenAddress] = useState<Address | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [message, setMessage] = useState('');
  const [showDeployPanel, setShowDeployPanel] = useState(false);
  const [isDetectingType, setIsDetectingType] = useState(false);

  const selectedAbi = contractAbis[contractType];

  // Type detection logic when loading a contract
  const { data: typeDetectionData, refetch: refetchTypeDetection } = useReadContracts({
    contracts: [
      // Try to detect AirdropVesting
      { address: contractAddress, abi: contractAbis.AirdropVesting, functionName: 'vestingStartTime' },
      { address: contractAddress, abi: contractAbis.AirdropVesting, functionName: 'vestingDuration' },
      
      // Try to detect AirdropStaking
      { address: contractAddress, abi: contractAbis.AirdropStaking, functionName: 'stakingContract' },
      { address: contractAddress, abi: contractAbis.AirdropStaking, functionName: 'snapshotBlock' },
      
      // Try to detect AirdropWithFee
      { address: contractAddress, abi: contractAbis.AirdropWithFee, functionName: 'feeToken' },
      { address: contractAddress, abi: contractAbis.AirdropWithFee, functionName: 'claimFee' },
    ],
    query: {
      enabled: !!contractAddress && !!address && isAddress(contractAddress) && isDetectingType,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  });

  // Fetch data with the detected or assumed contract type
  const { data: primaryData, refetch: refetchPrimary } = useReadContracts({
    contracts: [
      // Standard data
      { address: contractAddress, abi: selectedAbi, functionName: 'owner' },
      { address: contractAddress, abi: selectedAbi, functionName: 'isAirdropSetup' },
      { address: contractAddress, abi: selectedAbi, functionName: 'airdropToken' },
      { address: contractAddress, abi: selectedAbi, functionName: 'totalTokensAllocated' },
      { address: contractAddress, abi: selectedAbi, functionName: 'totalTokensClaimed' },
      { address: contractAddress, abi: selectedAbi, functionName: 'airdropEndTime' },
      
      // User-specific data (for claimable amount and has claimed status)
      { address: contractAddress, abi: selectedAbi, functionName: contractType === 'AirdropWithdraw' ? 'getWithdrawAmount' : 'getClaimableAmount', args: [address!] },
      { address: contractAddress, abi: selectedAbi, functionName: contractType === 'AirdropWithdraw' ? 'hasWithdrawn' : 'hasClaimed', args: [address!] },
      
      // Vesting-specific data (to show info if it's Vesting)
      { address: contractAddress, abi: selectedAbi, functionName: 'vestingStartTime' },
      { address: contractAddress, abi: selectedAbi, functionName: 'vestingDuration' },
      
      // Staking-specific data (to show info if it's Staking)
      { address: contractAddress, abi: selectedAbi, functionName: 'stakingContract' },
      { address: contractAddress, abi: selectedAbi, functionName: 'snapshotBlock' },
      
      // Fee-specific data (to show info if it's WithFee)
      { address: contractAddress, abi: selectedAbi, functionName: 'feeToken' },
      { address: contractAddress, abi: selectedAbi, functionName: 'claimFee' },
    ],
    query: {
      enabled: !!contractAddress && !!address && isAddress(contractAddress) && !isDetectingType,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  });

  const { data: decimalsData } = useReadContracts({
      contracts: [{
          address: airdropTokenAddress || undefined,
          abi: erc20DecimalsAbi,
          functionName: 'decimals',
      }],
      query: {
          enabled: !!airdropTokenAddress && isAddress(airdropTokenAddress),
      }
  });

  const fetchContractData = useCallback(() => {
    if (primaryData) {
      const [
        owner, 
        setup, 
        token, 
        allocated, 
        claimed, 
        endTime,
        claimable,
        hasClaimedResult,
        vestingStartTime,
        vestingDuration,
        stakingContract,
        snapshotBlock,
        feeToken,
        claimFee
      ] = primaryData;
      
      // Attempt to detect contract type based on unique function results
      // This is a simplified detection logic and might need refinement
      if (vestingStartTime.status === 'success' && vestingDuration.status === 'success' && vestingStartTime.result !== undefined && vestingDuration.result !== undefined) {
        setContractType('AirdropVesting');
      } else if (stakingContract.status === 'success' && snapshotBlock.status === 'success' && stakingContract.result !== undefined && snapshotBlock.result !== undefined) {
        setContractType('AirdropStaking');
      } else if (claimFee.status === 'success' && feeToken.status === 'success' && claimFee.result !== undefined && feeToken.result !== undefined) {
        setContractType('AirdropWithFee');
      } else {
        // If none of the above, default to Standard (or Withdraw, but we don't have a unique way to detect Withdraw)
        // The initial assumption when loading a contract is Standard, and the type detection logic above will correct it if needed
        setContractType('AirdropStandard');
      }
      
      setIsOwner(!!(owner.result && address && (owner.result as string).toLowerCase() === address.toLowerCase()));
      
      const setupStatus = setup.result as boolean;
      setIsAirdropSetup(setupStatus);

      if (setupStatus && token.result && isAddress(token.result as Address)) {
        setAirdropTokenAddress(token.result as Address);
      } else {
        setAirdropTokenAddress(null);
      }

      setContractData({
        token: token.result,
        allocated: allocated.result,
        claimed: claimed.result,
        endTime: endTime.result,
        claimable: claimable.result,
        hasClaimed: hasClaimedResult.result,
        vestingStartTime: vestingStartTime.status === 'success' ? vestingStartTime.result : null,
        vestingDuration: vestingDuration.status === 'success' ? vestingDuration.result : null,
        stakingContract: stakingContract.status === 'success' ? stakingContract.result : null,
        snapshotBlock: snapshotBlock.status === 'success' ? snapshotBlock.result : null,
        feeToken: feeToken.status === 'success' ? feeToken.result : null,
        claimFee: claimFee.status === 'success' ? claimFee.result : null,
      });
    }
  }, [primaryData, address]);

  useEffect(() => {
    fetchContractData();
  }, [primaryData, fetchContractData]);

  useEffect(() => {
      if (decimalsData && decimalsData[0].status === 'success') {
          setTokenDecimals(decimalsData[0].result as number);
      }
  }, [decimalsData]);

  // Efecto para recargar los datos cuando la dirección del contrato cambia.
  useEffect(() => {
    if (contractAddress && isAddress(contractAddress)) {
      // Se añade un retardo para dar tiempo al nodo RPC a indexar el estado del nuevo contrato.
      const timer = setTimeout(() => {
        refetchPrimary();
      }, 2500); // Retardo de 2.5 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador
    }
  }, [contractAddress, refetchPrimary]);

  const handleContractDeployed = useCallback((newAddress: string, deployedContractType: string) => {
    if (isAddress(newAddress)) {
      // Limpiar datos antiguos antes de establecer la nueva dirección
      setContractData(null);
      setAirdropTokenAddress(null);
      setIsAirdropSetup(false);
      setIsOwner(false); // Reset owner status to avoid optimistic UI flicker
      
      // Set the new contract address, which will trigger the useEffect to fetch data
      setContractAddress(newAddress as Address);
      setContractType(deployedContractType as ContractType);
      setInputValue(newAddress);
    }
    setShowDeployPanel(false);
      setMessage(t('newContractDeployedMessage', 'airdropPage').replace('%address%', newAddress).replace('%deployedContractType%', deployedContractType));
  }, [setMessage, setContractAddress, setContractType, setInputValue, setIsOwner, setContractData, setAirdropTokenAddress, setIsAirdropSetup, setShowDeployPanel, t]);

  const handleLoadContract = () => {
    if (isAddress(inputValue)) {
      // When loading, we don't know the type. We'll detect it.
      setContractData(null);
      setAirdropTokenAddress(null);
      setIsAirdropSetup(false);
      setIsOwner(false);
      
      setContractAddress(inputValue as Address);
      setIsDetectingType(true);
      setMessage(t('detectingContractTypeMessage', 'airdropPage').replace('%address%', inputValue));
    } else {
      setMessage(t('invalidAddressError', 'airdropPage'));
    }
  };

  // Effect to handle type detection results
  useEffect(() => {
    if (typeDetectionData && isDetectingType) {
      const [
        vestingStartTime,
        vestingDuration,
        stakingContract,
        snapshotBlock,
        feeToken,
        claimFee
      ] = typeDetectionData;

      let detectedType: ContractType = 'AirdropStandard'; // Default

      // Attempt to detect contract type based on unique function results
      if (vestingStartTime.status === 'success' && vestingDuration.status === 'success') {
        detectedType = 'AirdropVesting';
      } else if (stakingContract.status === 'success' && snapshotBlock.status === 'success') {
        detectedType = 'AirdropStaking';
      } else if (claimFee.status === 'success' && feeToken.status === 'success') {
        detectedType = 'AirdropWithFee';
      }
      // Note: AirdropWithdraw and AirdropStandard are harder to distinguish this way.
      // The UserPanel and OwnerPanel should handle the differences correctly.

      setContractType(detectedType);
      setIsDetectingType(false);
      setMessage(t('contractTypeDetectedMessage', 'airdropPage').replace('%type%', detectedType));
    }
  }, [typeDetectionData, isDetectingType]);

  const handleAction = () => {
    setMessage(t('actionReceivedMessage', 'airdropPage'));
    refetchPrimary();
  };

  const renderContractInfo = () => {
    if (!contractAddress || !contractData) return null;
    
    // Format time for vesting contracts
    const formatTime = (timestamp: bigint | number | undefined) => {
      if (!timestamp) return 'N/A';
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleString();
    };

    return (
      <div className="info-box panel p-4 border rounded-lg bg-muted mt-4">
        <h3 className="font-semibold">{t('contractInfoTitle', 'airdropPage')} ({contractType})</h3>
        <p className="text-sm break-all">{t('addressLabel', 'airdropPage')} {contractAddress}</p>
        <p className="text-sm">{t('setupStatusLabel', 'airdropPage')} {isAirdropSetup ? t('yes', 'airdropPage') : t('no', 'airdropPage')}</p>
        {isAirdropSetup && (
          <>
            <p className="text-sm break-all">{t('tokenLabel', 'airdropPage')} {contractData.token}</p>
            <p className="text-sm">{t('decimalsLabel', 'airdropPage')} {tokenDecimals}</p>
            <p className="text-sm">{t('totalAllocatedLabel', 'airdropPage')} {formatUnits(contractData.allocated ?? 0, tokenDecimals)}</p>
            <p className="text-sm">{t('totalClaimedLabel', 'airdropPage')} {formatUnits(contractData.claimed ?? 0, tokenDecimals)}</p>

            {/* Specific info for AirdropVesting */}
            {contractType === 'AirdropVesting' && contractData.vestingStartTime && contractData.vestingDuration && (
              <>
                <p className="text-sm">{t('vestingStartLabel', 'airdropPage')} {formatTime(contractData.vestingStartTime)}</p>
                <p className="text-sm">{t('vestingDurationLabel', 'airdropPage')}</p>
              </>
            )}

            {/* Specific info for AirdropStaking */}
            {contractType === 'AirdropStaking' && contractData.stakingContract && contractData.snapshotBlock && (
              <>
                <p className="text-sm break-all">{t('stakingContractLabel', 'airdropPage')} {contractData.stakingContract}</p>
                <p className="text-sm">{t('snapshotBlockLabel', 'airdropPage')} {contractData.snapshotBlock.toString()}</p>
              </>
            )}

            {/* Specific info for AirdropWithFee */}
            {contractType === 'AirdropWithFee' && contractData.feeToken && contractData.claimFee && (
              <>
                <p className="text-sm break-all">{t('feeTokenLabel', 'airdropPage')} {contractData.feeToken}</p>
                <p className="text-sm">{t('claimFeeLabel', 'airdropPage')} {formatUnits(contractData.claimFee, tokenDecimals)}</p>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title', 'airdropPage')}</h1>
      {message && <p className="mb-4 p-2 rounded-md bg-muted">{message}</p>}

      {!isConnected ? (
        <p>{t('connectWalletMessage', 'airdropPage')}</p>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder={t('loadContractPlaceholder', 'airdropPage')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 border rounded-md bg-background flex-grow"
            />
            <button onClick={handleLoadContract} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              {t('loadButton', 'airdropPage')}
            </button>
            <button onClick={() => setShowDeployPanel(!showDeployPanel)} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {showDeployPanel ? t('hideDeployButton', 'airdropPage') : t('deployNewButton', 'airdropPage')}
            </button>
          </div>

          {showDeployPanel && (
            <DeployPanel
              onContractDeployed={handleContractDeployed}
              onMessage={(msg, type) => setMessage(`${type.toUpperCase()}: ${msg}`)}
            />
          )}

          {contractAddress && isAddress(contractAddress) && (
            <>
              {renderContractInfo()}
              {isOwner && (
                <OwnerPanel 
                  contractAddress={contractAddress} 
                  contractType={contractType}
                  airdropTokenAddress={airdropTokenAddress}
                  tokenDecimals={tokenDecimals}
                  onAction={handleAction} 
                />
              )}
              {isAirdropSetup && (
                <UserPanel
                  contractAddress={contractAddress}
                  contractType={contractType}
                  tokenDecimals={tokenDecimals}
                  onAction={handleAction}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AirdropPage;

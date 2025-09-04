'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { Abi, formatUnits } from 'viem';
import { useLanguage } from '@/context/LanguageContext';

// Importar todos los ABIs
import AirdropStandard from '@/lib/abi/airdrop/AirdropStandard.json';
import AirdropWithFee from '@/lib/abi/airdrop/AirdropWithFee.json';
import AirdropVesting from '@/lib/abi/airdrop/AirdropVesting.json';
import AirdropStaking from '@/lib/abi/airdrop/AirdropStaking.json';
import AirdropWithdraw from '@/lib/abi/airdrop/AirdropWithdraw.json';

const contractAbis = {
  AirdropStandard: AirdropStandard as Abi,
  AirdropWithFee: AirdropWithFee as Abi,
  AirdropVesting: AirdropVesting as Abi,
  AirdropStaking: AirdropStaking as Abi,
  AirdropWithdraw: AirdropWithdraw as Abi,
};

interface UserPanelProps {
  contractAddress: `0x${string}`;
  contractType: keyof typeof contractAbis;
  tokenDecimals: number;
  onAction: () => void; // Callback to refresh data
}

const UserPanel: React.FC<UserPanelProps> = ({ contractAddress, contractType, tokenDecimals, onAction }) => {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const selectedAbi = contractAbis[contractType];

  const { data: claimableAmountData } = useReadContract({
    address: contractAddress,
    abi: selectedAbi,
    functionName: contractType === 'AirdropVesting' ? 'getClaimableAmount' : 'getWithdrawAmount',
    args: [address],
    query: { enabled: !!address && (contractType === 'AirdropVesting' || contractType === 'AirdropWithdraw') }
  });

  const { data: totalAllocationData } = useReadContract({
    address: contractAddress,
    abi: selectedAbi,
    functionName: 'allocations',
    args: [address],
    query: { enabled: !!address }
  });

  const { data: hasClaimedData } = useReadContract({
    address: contractAddress,
    abi: selectedAbi,
    functionName: contractType === 'AirdropWithdraw' ? 'hasWithdrawn' : 'hasClaimed',
    args: [address],
    query: { enabled: !!address }
  });

  const totalAllocationAmount = totalAllocationData ? formatUnits(totalAllocationData as bigint, tokenDecimals) : '0';
  const claimableAmount = claimableAmountData ? formatUnits(claimableAmountData as bigint, tokenDecimals) : '0';
  const hasClaimed = hasClaimedData as boolean;

  useEffect(() => {
    if (isSuccess) {
      setMessage(t('successMessage', 'userPanel'));
      onAction(); // Refresh parent component data
    }
    if (error) {
      setMessage(`${t('errorPrefix', 'userPanel')}${error.message}`);
    }
  }, [isSuccess, error, onAction, t]);

  const { functionName, buttonText } = useMemo(() => {
    switch (contractType) {
      case 'AirdropWithdraw':
        return { functionName: 'withdraw', buttonText: t('withdrawButton', 'userPanel') };
      case 'AirdropVesting':
        return { functionName: 'claimVest', buttonText: t('claimVestButton', 'userPanel') };
      case 'AirdropStaking':
        return { functionName: 'claimStaking', buttonText: t('claimStakingButton', 'userPanel') };
      default:
        return { functionName: 'claimTokens', buttonText: t('claimTokensButton', 'userPanel') };
    }
  }, [contractType, t]);

  const handleAction = () => {
    const amount = parseFloat(claimableAmount);
    if (amount <= 0) {
      setMessage(t('noAllocationMessage', 'userPanel'));
      return;
    }
    if (hasClaimed) {
      setMessage(t('alreadyClaimedMessage', 'userPanel'));
      return;
    }
    setMessage(t('processingMessage', 'userPanel'));
    writeContract({
      address: contractAddress,
      abi: selectedAbi,
      functionName: functionName,
      args: [],
    });
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="panel p-4 border rounded-lg bg-background-secondary mt-4">
      <h2 className="text-xl font-bold mb-4">{t('title', 'userPanel')}</h2>
      {message && <p className={`text-sm ${message.toLowerCase().startsWith('error') || message.toLowerCase().startsWith(t('errorPrefix', 'userPanel').toLowerCase()) ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

      <div className="info-box bg-muted p-3 rounded-md">
        {contractType === 'AirdropVesting' ? (
          <>
            <p>{t('totalAllocationPrefix', 'userPanel')}: <span className="font-semibold">{totalAllocationAmount}</span> Tokens</p>
            <p>{t('claimableVestedPrefix', 'userPanel')}: <span className="font-semibold">{claimableAmount}</span> Tokens</p>
          </>
        ) : (
          <p>{t('claimablePrefix', 'userPanel')}: <span className="font-semibold">{claimableAmount}</span> Tokens</p>
        )}
        <p>{t('claimedPrefix', 'userPanel')}: <span className="font-semibold">{hasClaimed ? t('yes', 'userPanel') : t('no', 'userPanel')}</span></p>
      </div>

      <button
        onClick={handleAction}
        disabled={hasClaimed || parseFloat(claimableAmount) <= 0 || isLoading}
        className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 w-full"
      >
        {isLoading ? t('processing', 'userPanel') : buttonText}
      </button>

      {parseFloat(claimableAmount) <= 0 && !hasClaimed && <p className="text-xs text-muted-foreground mt-2">{t('noTokensMessage', 'userPanel')}</p>}
    </div>
  );
};

export default UserPanel;

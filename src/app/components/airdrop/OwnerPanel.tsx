'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { isAddress, parseUnits, formatUnits, Abi } from 'viem';
import { useLanguage } from '@/context/LanguageContext';

// ABIs
import AirdropStandard from '@/lib/abi/airdrop/AirdropStandard.json';
import AirdropWithFee from '@/lib/abi/airdrop/AirdropWithFee.json';
import AirdropVesting from '@/lib/abi/airdrop/AirdropVesting.json';
import AirdropStaking from '@/lib/abi/airdrop/AirdropStaking.json';
import AirdropWithdraw from '@/lib/abi/airdrop/AirdropWithdraw.json';
import SimpleToken from '@/lib/abi/airdrop/SimpleToken.json'; // ABI para mintear

const contractAbis = {
  AirdropStandard: AirdropStandard as Abi,
  AirdropWithFee: AirdropWithFee as Abi,
  AirdropVesting: AirdropVesting as Abi,
  AirdropStaking: AirdropStaking as Abi,
  AirdropWithdraw: AirdropWithdraw as Abi,
};

interface OwnerPanelProps {
  contractAddress: `0x${string}`;
  contractType: keyof typeof contractAbis;
  airdropTokenAddress: `0x${string}` | null;
  tokenDecimals: number;
  onAction: () => void;
}

const OwnerPanel: React.FC<OwnerPanelProps> = ({ contractAddress, contractType, airdropTokenAddress, tokenDecimals, onAction }) => {
  const { address } = useAccount();
  const { t } = useLanguage();
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // State for UI
  const [message, setMessage] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [amounts, setAmounts] = useState('');
  const [emergencyToken, setEmergencyToken] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  
  const { data: airdropTokenBalance } = useReadContract({
    address: airdropTokenAddress ?? undefined,
    abi: SimpleToken,
    functionName: 'balanceOf',
    args: [contractAddress],
    query: { enabled: !!airdropTokenAddress }
  });

  const selectedAbi = contractAbis[contractType];
  const isAirdropPreConfigured = !!airdropTokenAddress;

  useEffect(() => {
    if (isSuccess) {
      setMessage(t('transactionSuccess', 'airdropPage'));
      onAction(); // Refresca los datos de la página principal
      reset();
    }
    if (error) {
      const errorMsg = error.message.includes('rejected') ? t('transactionRejected', 'airdropPage') : error.message;
      setMessage(`${t('transactionError', 'airdropPage')}${errorMsg}`);
    }
  }, [isSuccess, error, onAction, reset, t]);

  const handleAddAllocations = () => {
    const bensArray = beneficiaries.split(',').map(addr => addr.trim());
    const amtsArray = amounts.split(',').map(amt => amt.trim());

    if (bensArray.length !== amtsArray.length || bensArray.some(addr => !isAddress(addr))) {
      setMessage(t('invalidAllocations', 'airdropPage'));
      return;
    }
    
    try {
      const parsedAmounts = amtsArray.map(amt => parseUnits(amt, tokenDecimals));
      setMessage(t('addingAllocations', 'airdropPage'));
      writeContract({
        address: contractAddress,
        abi: selectedAbi,
        functionName: 'addAllocations',
        args: [bensArray, parsedAmounts],
      });
    } catch (e) {
        setMessage(t('invalidAmount', 'airdropPage'));
    }
  };

  const handleFundContract = () => {
    if (!airdropTokenAddress || !fundAmount) return;
    const amountToFund = parseUnits(fundAmount, tokenDecimals);
    setMessage(t('fundingContract', 'airdropPage').replace('%amount%', formatUnits(amountToFund, tokenDecimals)));
    writeContract({
      address: airdropTokenAddress,
      abi: SimpleToken,
      functionName: 'transfer',
      args: [contractAddress, amountToFund],
    });
  };

  const handleWithdrawUnclaimed = () => {
    setMessage(t('withdrawingUnclaimed', 'airdropPage'));
    writeContract({
      address: contractAddress,
      abi: selectedAbi,
      functionName: 'withdrawUnclaimedTokens',
    });
  };

  const handleEmergencyWithdraw = () => {
    if (!isAddress(emergencyToken)) return;
    setMessage(t('emergencyWithdrawing', 'airdropPage'));
    writeContract({
      address: contractAddress,
      abi: selectedAbi,
      functionName: 'emergencyWithdrawTokens',
      args: [emergencyToken],
    });
  };

  const isLoading = isPending || isConfirming;
  const fundedBalance = airdropTokenBalance ? BigInt(airdropTokenBalance.toString()) : BigInt(0);

  return (
    <div className="panel p-4 border rounded-lg bg-background-secondary mt-4">
      <h2 className="text-xl font-bold mb-4">{t('ownerPanelTitle', 'airdropPage')} ({contractType})</h2>
      {message && <p className={`text-sm break-words mb-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

      <div className="space-y-6">
        {isAirdropPreConfigured && (
          <>
            <div>
              <h3 className="font-semibold">{t('step1Title', 'airdropPage')}</h3>
              <p className="text-xs text-muted-foreground">{t('step1Description', 'airdropPage')}</p>
              <div className="flex flex-col gap-2 mt-1">
                <textarea placeholder={t('beneficiariesPlaceholder', 'airdropPage')} value={beneficiaries} onChange={e => setBeneficiaries(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                <textarea placeholder={t('amountsPlaceholder', 'airdropPage')} value={amounts} onChange={e => setAmounts(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                <button onClick={handleAddAllocations} disabled={isLoading || !beneficiaries || !amounts} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {isLoading ? t('processing', 'airdropPage') : t('addAllocationButton', 'airdropPage')}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">{t('step2Title', 'airdropPage')}</h3>
              <p className="text-xs text-muted-foreground">{t('step2Description', 'airdropPage')}</p>
              <p className="text-xs font-bold">{t('currentBalance', 'airdropPage')} {formatUnits(fundedBalance, tokenDecimals)}</p>
              <div className="flex flex-col gap-2 mt-1">
                <input type="text" placeholder={t('fundAmountPlaceholder', 'airdropPage')} value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background" disabled={isLoading} />
                <button onClick={handleFundContract} disabled={isLoading || !fundAmount} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                  {isLoading ? t('processing', 'airdropPage') : t('fundButton', 'airdropPage')}
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="font-semibold">{t('contractManagementTitle', 'airdropPage')}</h3>
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <button onClick={handleWithdrawUnclaimed} disabled={isLoading} className="flex-1 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50">
              {isLoading ? t('processing', 'airdropPage') : t('withdrawUnclaimedButton', 'airdropPage')}
            </button>
            <div className="flex-1 flex flex-col gap-1">
              <input type="text" placeholder={t('emergencyTokenPlaceholder', 'airdropPage')} value={emergencyToken} onChange={e => setEmergencyToken(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
              <button onClick={handleEmergencyWithdraw} disabled={isLoading || !emergencyToken} className="w-full px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50">
                {isLoading ? t('processing', 'airdropPage') : t('emergencyWithdrawButton', 'airdropPage')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPanel;

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { type Abi, type Hash, parseUnits } from 'viem';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

// Importar ABIs
import AirdropStandard from '@/lib/abi/airdrop/AirdropStandard.json';
import AirdropWithFee from '@/lib/abi/airdrop/AirdropWithFee.json';
import AirdropVesting from '@/lib/abi/airdrop/AirdropVesting.json';
import AirdropStaking from '@/lib/abi/airdrop/AirdropStaking.json';
import AirdropWithdraw from '@/lib/abi/airdrop/AirdropWithdraw.json';

// Importar Bytecodes
import { AirdropBytecode } from '@/lib/abi/airdrop/AirdropBytecode';

interface DeployPanelProps {
  onContractDeployed: (address: string, contractType: string) => void;
  onMessage: (message: string, type: 'info' | 'success' | 'error') => void;
}

const contractInfo = {
  'AirdropStandard': { abi: AirdropStandard as Abi, bytecode: AirdropBytecode.AirdropStandard as `0x${string}` },
  'AirdropWithFee': { abi: AirdropWithFee as Abi, bytecode: AirdropBytecode.AirdropWithFee as `0x${string}` },
  'AirdropVesting': { abi: AirdropVesting as Abi, bytecode: AirdropBytecode.AirdropVesting as `0x${string}` },
  'AirdropStaking': { abi: AirdropStaking as Abi, bytecode: AirdropBytecode.AirdropStaking as `0x${string}` },
  'AirdropWithdraw': { abi: AirdropWithdraw as Abi, bytecode: AirdropBytecode.AirdropWithdraw as `0x${string}` },
};

type ContractType = keyof typeof contractInfo;

const DeployPanel: React.FC<DeployPanelProps> = ({ onContractDeployed, onMessage }) => {
  const { addTransaction, selectContract } = useAppContext();
  const { chain } = useAccount();
  const { t } = useLanguage();

  const { data: hash, error, isPending, deployContract, reset: resetDeploy } = useDeployContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { writeContract: setFee, data: setFeeHash, reset: resetSetFee } = useWriteContract();
  const { data: setFeeReceipt, isLoading: isConfirmingSetFee } = useWaitForTransactionReceipt({ hash: setFeeHash });

  const [selectedContract, setSelectedContract] = useState<ContractType>('AirdropStandard');
  const [tokenAddress, setTokenAddress] = useState('');
  const [airdropEndDate, setAirdropEndDate] = useState('');

  // State for Vesting contract
  const [vestingEndDate, setVestingEndDate] = useState('');

  // State for Fee contract
  const [feeType, setFeeType] = useState('native'); // 'native' or 'erc20'
  const [feeTokenAddress, setFeeTokenAddress] = useState('');
  const [feeAmount, setFeeAmount] = useState('');

  // State for Staking contract
  const [stakingTokenAddress, setStakingTokenAddress] = useState('0x0000000000000000000000000000000000000000');
  const [snapshotBlock, setSnapshotBlock] = useState('0');

  const handleDeploy = async () => {
    if (!chain) {
      onMessage(t('walletRequiredError', 'airdropPage'), 'error');
      return;
    }

    if (!tokenAddress || !airdropEndDate) {
      onMessage(t('fieldsRequiredError', 'airdropPage'), 'error');
      return;
    }

    const { abi, bytecode } = contractInfo[selectedContract];
    const endTimeTimestamp = Math.floor(new Date(airdropEndDate).getTime() / 1000);

    let args: any[] = [];

    switch (selectedContract) {
      case 'AirdropVesting':
        if (!vestingEndDate) {
          onMessage(t('vestingDateRequiredError', 'airdropPage'), 'error');
          return;
        }
        const vestingEndDateTimestamp = Math.floor(new Date(vestingEndDate).getTime() / 1000);
        const vestingStartTimeTimestamp = Math.floor(Date.now() / 1000);

        if (vestingEndDateTimestamp <= vestingStartTimeTimestamp) {
          onMessage(t('vestingDateFutureError', 'airdropPage'), 'error');
          return;
        }

        const vestingDurationSeconds = vestingEndDateTimestamp - vestingStartTimeTimestamp;
        args = [tokenAddress, BigInt(endTimeTimestamp), BigInt(vestingStartTimeTimestamp), BigInt(vestingDurationSeconds)];
        break;

      case 'AirdropStaking':
        args = [tokenAddress, BigInt(endTimeTimestamp), stakingTokenAddress, BigInt(snapshotBlock)];
        break;

      case 'AirdropStandard':
      case 'AirdropWithFee':
      case 'AirdropWithdraw':
      default:
        args = [tokenAddress, BigInt(endTimeTimestamp)];
        break;
    }

    onMessage(t('deployTransactionMessage', 'airdropPage') + ` ${selectedContract}...`, 'info');

    deployContract({
      abi,
      bytecode,
      args,
    });
  };

  useEffect(() => {
    if (receipt && receipt.contractAddress) {
      if (selectedContract === 'AirdropWithFee') {
        onMessage(t('feeConfigMessage', 'airdropPage'), 'info');
        const finalFeeTokenAddress = feeType === 'native' ? '0x0000000000000000000000000000000000000000' : feeTokenAddress;
        const formattedFeeAmount = parseUnits(feeAmount, 18);
        setFee({
          address: receipt.contractAddress,
          abi: AirdropWithFee,
          functionName: 'setFeeSettings',
          args: [finalFeeTokenAddress, formattedFeeAmount],
        });
      } else {
        onMessage(t('deploySuccessMessage', 'airdropPage') + `: ${receipt.contractAddress}`, 'success');
        onContractDeployed(receipt.contractAddress, selectedContract);
        selectContract(receipt.contractAddress);
        addTransaction({
          hash: receipt.transactionHash,
          type: `Deploy ${selectedContract}`,
          contractAddress: receipt.contractAddress,
        });
        resetDeploy();
      }
    }
  }, [receipt, selectedContract, onContractDeployed, onMessage, addTransaction, selectContract, resetDeploy, feeType, feeTokenAddress, feeAmount, setFee, t]);

  useEffect(() => {
    if (setFeeReceipt) {
      onMessage(t('feeConfigSuccessMessage', 'airdropPage'), 'success');
      if (receipt && receipt.contractAddress) {
        onContractDeployed(receipt.contractAddress, selectedContract);
        selectContract(receipt.contractAddress);
        addTransaction({
          hash: receipt.transactionHash,
          type: `Deploy ${selectedContract}`,
          contractAddress: receipt.contractAddress,
        });
      }
      resetDeploy();
      resetSetFee();
    }
  }, [setFeeReceipt, receipt, selectedContract, onContractDeployed, onMessage, addTransaction, selectContract, resetDeploy, resetSetFee]);

  useEffect(() => {
    if (error) {
      const errorMessage = error.message.includes('User rejected the request')
        ? t('transactionRejected', 'airdropPage')
        : t('deployErrorMessage', 'airdropPage') + error.message;
      onMessage(errorMessage, 'error');
      console.error("Error en el despliegue:", error);
    }
  }, [error, onMessage, t]);

  const isDeploying = isPending || isConfirming || isConfirmingSetFee;

  return (
    <div className="panel deploy-panel p-4 border rounded-lg bg-background-secondary">
      <h3 className="text-lg font-semibold mb-2">{t('panelTitle', 'airdropPage')}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t('panelDescription', 'airdropPage')}
      </p>

      <div className="mb-4">
        <label htmlFor="contract-type" className="block text-sm font-medium text-foreground mb-1">
          {t('contractTypeLabel', 'airdropPage')}
        </label>
        <select id="contract-type" value={selectedContract} onChange={(e) => setSelectedContract(e.target.value as ContractType)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying}>
          {Object.keys(contractInfo).map((type) => (<option key={type} value={type}>{type}</option>))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="token-address" className="block text-sm font-medium text-foreground mb-1">
          {t('tokenAddressLabel', 'airdropPage')}
        </label>
        <input id="token-address" type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying} placeholder="0x..."/>
      </div>

      <div className="mb-4">
        <label htmlFor="airdrop-end-date" className="block text-sm font-medium text-foreground mb-1">
          {t('airdropDateLabel', 'airdropPage')}
        </label>
        <input id="airdrop-end-date" type="datetime-local" value={airdropEndDate} onChange={(e) => setAirdropEndDate(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying}/>
      </div>

      {selectedContract === 'AirdropVesting' && (
        <div className="mb-4">
          <label htmlFor="vesting-end-date" className="block text-sm font-medium text-foreground mb-1">
            {t('vestingDateLabel', 'airdropPage')}
          </label>
          <input id="vesting-end-date" type="datetime-local" value={vestingEndDate} onChange={(e) => setVestingEndDate(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying}/>
        </div>
      )}

      {selectedContract === 'AirdropWithFee' && (
        <>
          <div className="mb-4">
            <label htmlFor="fee-type" className="block text-sm font-medium text-foreground mb-1">
              {t('feeTypeLabel', 'airdropPage')}
            </label>
            <select id="fee-type" value={feeType} onChange={(e) => setFeeType(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying}>
              <option value="native">{t('nativeOption', 'airdropPage')}</option>
              <option value="erc20">{t('erc20Option', 'airdropPage')}</option>
            </select>
          </div>
          {feeType === 'erc20' && (
            <div className="mb-4">
              <label htmlFor="fee-token-address" className="block text-sm font-medium text-foreground mb-1">
                {t('feeTokenAddressLabel', 'airdropPage')}
              </label>
              <input id="fee-token-address" type="text" value={feeTokenAddress} onChange={(e) => setFeeTokenAddress(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying} placeholder="0x..."/>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="fee-amount" className="block text-sm font-medium text-foreground mb-1">
              {t('feeAmountLabel', 'airdropPage')}
            </label>
            <input id="fee-amount" type="number" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" disabled={isDeploying} placeholder={t('feeAmountPlaceholder', 'airdropPage')}/>
          </div>
        </>
      )}

      <button onClick={handleDeploy} disabled={isDeploying} className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        {isPending ? t('deployWaiting', 'airdropPage') : isConfirming ? t('deployConfirming', 'airdropPage') : t('deployButton', 'airdropPage')}
      </button>
      <p className="text-xs text-muted-foreground mt-2">{t('gasWarning', 'airdropPage')}</p>
    </div>
  );
};

export default DeployPanel;

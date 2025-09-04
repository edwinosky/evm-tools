'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { isAddress, parseUnits, formatUnits, Abi } from 'viem';

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
      setMessage('¡Transacción confirmada exitosamente!');
      onAction(); // Refresca los datos de la página principal
      reset();
    }
    if (error) {
      const errorMsg = error.message.includes('rejected') ? 'Transacción rechazada por el usuario.' : error.message;
      setMessage(`Error: ${errorMsg}`);
    }
  }, [isSuccess, error, onAction, reset]);

  const handleAddAllocations = () => {
    const bensArray = beneficiaries.split(',').map(addr => addr.trim());
    const amtsArray = amounts.split(',').map(amt => amt.trim());

    if (bensArray.length !== amtsArray.length || bensArray.some(addr => !isAddress(addr))) {
      setMessage("Error: Verifica las direcciones de beneficiarios y que las listas coincidan.");
      return;
    }
    
    try {
      const parsedAmounts = amtsArray.map(amt => parseUnits(amt, tokenDecimals));
      setMessage('Agregando asignaciones...');
      writeContract({
        address: contractAddress,
        abi: selectedAbi,
        functionName: 'addAllocations',
        args: [bensArray, parsedAmounts],
      });
    } catch (e) {
        setMessage("Error: Monto inválido proporcionado.");
    }
  };

  const handleFundContract = () => {
    if (!airdropTokenAddress || !fundAmount) return;
    const amountToFund = parseUnits(fundAmount, tokenDecimals);
    setMessage(`Transfiriendo ${formatUnits(amountToFund, tokenDecimals)} tokens al contrato...`);
    writeContract({
      address: airdropTokenAddress,
      abi: SimpleToken,
      functionName: 'transfer',
      args: [contractAddress, amountToFund],
    });
  };

  const handleWithdrawUnclaimed = () => {
    setMessage('Retirando tokens no reclamados...');
    writeContract({
      address: contractAddress,
      abi: selectedAbi,
      functionName: 'withdrawUnclaimedTokens',
    });
  };

  const handleEmergencyWithdraw = () => {
    if (!isAddress(emergencyToken)) return;
    setMessage('Realizando retiro de emergencia...');
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
      <h2 className="text-xl font-bold mb-4">Panel del Propietario ({contractType})</h2>
      {message && <p className={`text-sm break-words mb-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

      <div className="space-y-6">
        {isAirdropPreConfigured && (
          <>
            <div>
              <h3 className="font-semibold">Paso 1: Agregar Asignaciones</h3>
              <p className="text-xs text-muted-foreground">Define quién recibe tokens y cuántos. Separa las direcciones y montos con comas.</p>
              <div className="flex flex-col gap-2 mt-1">
                <textarea placeholder="Direcciones de beneficiarios (0x..., 0x...)" value={beneficiaries} onChange={e => setBeneficiaries(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                <textarea placeholder="Montos (100.5, 50, ...)" value={amounts} onChange={e => setAmounts(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                <button onClick={handleAddAllocations} disabled={isLoading || !beneficiaries || !amounts} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {isLoading ? 'Procesando...' : 'Agregar Asignaciones'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Paso 2: Fondear Contrato de Airdrop</h3>
              <p className="text-xs text-muted-foreground">Transfiere los tokens desde tu wallet al contrato para que puedan ser reclamados.</p>
              <p className="text-xs font-bold">Balance actual del contrato: {formatUnits(fundedBalance, tokenDecimals)}</p>
              <div className="flex flex-col gap-2 mt-1">
                <input type="text" placeholder="Cantidad a fondear" value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background" disabled={isLoading} />
                <button onClick={handleFundContract} disabled={isLoading || !fundAmount} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                  {isLoading ? 'Procesando...' : `Fondear Contrato`}
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="font-semibold">Gestión del Contrato</h3>
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <button onClick={handleWithdrawUnclaimed} disabled={isLoading} className="flex-1 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50">
              {isLoading ? 'Procesando...' : 'Retirar No Reclamados'}
            </button>
            <div className="flex-1 flex flex-col gap-1">
              <input type="text" placeholder="Dirección de Token (para retiro de emergencia)" value={emergencyToken} onChange={e => setEmergencyToken(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
              <button onClick={handleEmergencyWithdraw} disabled={isLoading || !emergencyToken} className="w-full px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50">
                {isLoading ? 'Procesando...' : 'Retiro de Emergencia'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPanel;

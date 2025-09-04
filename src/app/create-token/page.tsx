'use client';

import ContractCreator from '../components/ContractCreator';

export default function CreateContractPage() {
  return (
    <main className="p-4">
      <ContractCreator addToHistory={() => {}} addNotification={() => {}} />
    </main>
  );
}

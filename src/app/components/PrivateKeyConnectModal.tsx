'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';

export const PrivateKeyConnectModal = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const { connectWithPrivateKey, currentNetwork } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!currentNetwork?.rpcUrl) {
      setError('No network selected. Please select a network from the dropdown.');
      return;
    }
    try {
      await connectWithPrivateKey(currentNetwork.rpcUrl, privateKey);
      setIsOpen(false); // Close modal on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-card p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Connect with Private Key
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Enter your private key. The connection will use the currently selected network. This key will not be stored.
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="privateKey">
                Private Key
              </label>
              <input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="privateKey"
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </fieldset>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="mt-[25px] flex justify-end">
              <button type="submit" className="bg-green-400 text-green-950 hover:bg-green-500 focus:shadow-green-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Connect
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

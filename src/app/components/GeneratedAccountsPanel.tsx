'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Copy, Trash2 } from 'lucide-react';

const GeneratedAccountsPanel = () => {
  const { generatedAccounts, generateAccount, removeGeneratedAccount } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleGenerateAccount = async () => {
    setIsGenerating(true);
    try {
      await generateAccount();
    } catch (error) {
      console.error('Error generating account:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: 'address' | 'privateKey') => {
    navigator.clipboard.writeText(text);
    setCopiedValue(type);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Generated Accounts</h3>
      <button 
        onClick={handleGenerateAccount} 
        disabled={isGenerating}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate New Account'}
      </button>
      
      {generatedAccounts.length === 0 ? (
        <p className="text-muted-foreground text-sm">No accounts generated yet.</p>
      ) : (
        <div>
          {generatedAccounts.map((account) => (
            <div key={account.address} className="p-2 border border-border rounded-md mb-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate" title={account.address}>
                  Address: {account.address}
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() => copyToClipboard(account.address, 'address')}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
                  >
                    {copiedValue === 'address' ? 'Copied!' : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => removeGeneratedAccount(account.address)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-accent"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground truncate" title={account.privateKey}>
                  Private Key: ************
                </p>
                <button
                  onClick={() => copyToClipboard(account.privateKey, 'privateKey')}
                  className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
                >
                  {copiedValue === 'privateKey' ? 'Copied!' : <Copy size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneratedAccountsPanel;

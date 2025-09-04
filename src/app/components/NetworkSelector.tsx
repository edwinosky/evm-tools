'use client';

import { useAppContext } from '@/context/AppContext';
import { useState, useEffect } from 'react';

const NetworkSelector = () => {
  const { currentNetwork, availableNetworks, switchNetwork, connectionMode, isConnected, addNetwork, deleteNetwork } = useAppContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newNetwork, setNewNetwork] = useState({
    id: '',
    name: '',
    chainId: '',
    rpcUrl: '',
    symbol: '',
    explorerUrl: ''
  });

  // Si estamos conectados con clave privada, mostrar la red actual
  useEffect(() => {
    if (connectionMode === 'privateKey' && !currentNetwork && availableNetworks.length > 0) {
      // Establecer una red por defecto si no hay ninguna seleccionada
      console.log('Setting default network for private key connection');
      switchNetwork(availableNetworks[0]);
    }
  }, [connectionMode, currentNetwork, availableNetworks, switchNetwork]);

  const handleNetworkSelect = (network: any) => {
    console.log('Switching to network:', network);
    switchNetwork(network);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewNetwork(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNetwork.name && newNetwork.chainId && newNetwork.rpcUrl && newNetwork.symbol) {
      try {
        await addNetwork({
          name: newNetwork.name,
          chainId: parseInt(newNetwork.chainId, 10),
          rpcUrl: newNetwork.rpcUrl,
          symbol: newNetwork.symbol,
          explorerUrl: newNetwork.explorerUrl,
        });
        // Reset form and close dropdown
        setNewNetwork({ id: '', name: '', chainId: '', rpcUrl: '', symbol: '', explorerUrl: '' });
        setIsEditing(false);
        setIsOpen(false);
      } catch (error) {
        console.error('Failed to add/update network:', error);
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent, network: any) => {
    e.stopPropagation();
    setNewNetwork({
      id: network.chainId, // Keep original id for update
      name: network.name,
      chainId: String(network.chainId),
      rpcUrl: network.rpcUrl,
      symbol: network.nativeCurrency.symbol,
      explorerUrl: network.explorerUrl || ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewNetwork({ id: '', name: '', chainId: '', rpcUrl: '', symbol: '', explorerUrl: '' });
  };

  const handleDeleteNetwork = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent the network from being selected when deleting
    if (window.confirm('Are you sure you want to delete this network?')) {
      try {
        await deleteNetwork(id);
      } catch (error) {
        console.error('Failed to delete network:', error);
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
      >
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>{currentNetwork?.name || 'Select Network'}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-50">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Select Network</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center group">
                  <button
                    onClick={() => handleNetworkSelect(network)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex-grow ${
                      currentNetwork?.chainId === network.chainId
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{network.name}</span>
                      {currentNetwork?.chainId === network.chainId && (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleEditClick(e, network)}
                      className="p-1 ml-2 text-muted-foreground hover:text-primary"
                      title="Edit Network"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteNetwork(e, network.chainId)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                      title="Delete Network"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddOrUpdateNetwork} className="mt-4 pt-4 border-t border-border">
              <h4 className="font-medium mb-2">{isEditing ? 'Edit Network' : 'Add Custom Network'}</h4>
              <div className="space-y-2">
                <input required name="name" value={newNetwork.name} onChange={handleInputChange} placeholder="Network Name" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
                <input required name="chainId" value={newNetwork.chainId} onChange={handleInputChange} placeholder="Chain ID" type="number" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" disabled={isEditing} />
                <input required name="rpcUrl" value={newNetwork.rpcUrl} onChange={handleInputChange} placeholder="RPC URL" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
                <input required name="symbol" value={newNetwork.symbol} onChange={handleInputChange} placeholder="Symbol (e.g., ETH)" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
                <input name="explorerUrl" value={newNetwork.explorerUrl} onChange={handleInputChange} placeholder="Block Explorer URL (Optional)" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
                <div className="flex space-x-2">
                  {isEditing && (
                    <button type="button" onClick={handleCancelEdit} className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-accent">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                    {isEditing ? 'Update Network' : 'Add Network'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;

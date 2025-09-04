// src/lib/api.ts

const API_BASE_URL = '/api'; // Uses the Next.js proxy

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(error.error || 'Failed to process request');
  }
  return response.json();
}

export const api = {
  getNetworks: async () => {
    const response = await fetch(`${API_BASE_URL}/networks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  connect: async (rpcUrl: string, privateKey: string) => {
    const response = await fetch(`${API_BASE_URL}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rpcUrl, privateKey }),
    });
    return handleResponse(response);
  },

  getBalance: async (rpcUrl: string, address: string, tokenAddresses: string[], nftAddresses: string[]) => {
    console.log('Fetching balance with RPC URL:', rpcUrl);
    console.log('Address:', address);
    console.log('Token addresses:', tokenAddresses);
    console.log('NFT addresses:', nftAddresses);
    
    const response = await fetch(`${API_BASE_URL}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rpcUrl, address, tokenAddresses, nftAddresses }),
    });
    
    console.log('Balance response status:', response.status);
    return handleResponse(response);
  },

  generateAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/generate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  sendTransaction: async (params: any) => {
    const response = await fetch(`${API_BASE_URL}/send-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(response);
  },

  signPermit: async (params: any) => {
    const response = await fetch(`${API_BASE_URL}/sign-permit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(response);
  },

  compileContract: async (params: { contractType: string; name: string; symbol: string; options: any }) => {
    const response = await fetch(`${API_BASE_URL}/compile-contract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(response);
  },

  deployContract: async (params: { rpcUrl: string; privateKey: string; abi: any; bytecode: string; constructorArgs?: any[] }) => {
    const response = await fetch(`${API_BASE_URL}/deploy-contract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(response);
  },

  uploadToIpfs: async (file: File, name: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    
    const response = await fetch(`${API_BASE_URL}/upload-to-ipfs`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  addNetwork: async (network: any) => {
    const response = await fetch(`${API_BASE_URL}/networks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(network),
    });
    return handleResponse(response);
  },

  getContractType: async (rpcUrl: string, contractAddress: string) => {
    const response = await fetch(`${API_BASE_URL}/contract-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rpcUrl, contractAddress }),
    });
    return handleResponse(response);
  },

  deleteNetwork: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/networks`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },
};

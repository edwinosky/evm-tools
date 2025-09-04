
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { erc20Abi, erc721Abi, erc1155Abi } from 'viem';
import precompiledContracts from './precompiled-contracts.json';

// --- Network Configuration ---
interface Network {
  id: number;
  name: string;
  rpcUrl: string;
  symbol: string;
  explorerUrl: string;
}

// --- Environment Interface ---
export interface Env {
  EVM_PANEL_KV: KVNamespace;
  ENVIRONMENT: string;
  PINATA_JWT: string;
  NETWORKS: string; // JSON string of Network[]
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

// --- Utility Functions ---
const jsonResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Wallet-Address',
    // Aggressively prevent caching of API responses
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

const errorResponse = (message: string, status = 500) => jsonResponse({ error: message }, status);
const toHex = (buffer: ArrayBuffer): `0x${string}` => `0x${[...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('')}`;
const generateContractKey = (type: string, options: Record<string, boolean>): string => {
    const parts = [type.toLowerCase(), ...Object.keys(options).sort().filter(k => options[k]).map(k => k.toLowerCase())];
    return parts.join('_');
};
const createUserKey = (walletAddress: string, key: string): string => `${walletAddress}:${key}`;
const isValidWalletAddress = (address: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(address);

// --- Route Handlers ---

async function handleGenerateAccount(request: Request, env: Env): Promise<Response> {
  const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  const privateKey = toHex(privateKeyBytes.buffer);
  const account = privateKeyToAccount(privateKey);
  return jsonResponse({ address: account.address, privateKey });
}

async function handleCompileContract(request: Request, env: Env): Promise<Response> {
    const { contractType, options } = await request.json() as { contractType: string, options: Record<string, boolean> };
    if (!contractType || !options) return errorResponse('contractType and options are required', 400);
    const key = generateContractKey(contractType, options);
    const contractData = (precompiledContracts as Record<string, any>)[key];
    if (!contractData) return errorResponse(`No precompiled contract found for key: ${key}`, 404);
    return jsonResponse(contractData);
}

async function handleStorage(request: Request, env: Env): Promise<Response> {
    const { method, url } = request;
    const walletAddress = request.headers.get('X-Wallet-Address');
    if (!walletAddress || !isValidWalletAddress(walletAddress)) return errorResponse('Valid X-Wallet-Address header required', 400);

    const key = new URL(url).searchParams.get('key');

    if (method === 'GET') {
        if (key) { // Get single item
            const value = await env.EVM_PANEL_KV.get(createUserKey(walletAddress, key));
            return value ? new Response(value, { headers: jsonResponse({}, 200).headers }) : errorResponse('Key not found', 404);
        } else { // Get all items
            const list = await env.EVM_PANEL_KV.list({ prefix: `${walletAddress}:` });
            const items: Record<string, any> = {};
            for (const item of list.keys) {
                const value = await env.EVM_PANEL_KV.get(item.name);
                items[item.name.replace(`${walletAddress}:`, '')] = value ? JSON.parse(value) : null;
            }
            return jsonResponse(items);
        }
    }

    if (method === 'POST') {
        const data = await request.json() as { key: string; value: any };
        if (!data.key) return errorResponse('Key is required in request body', 400);
        await env.EVM_PANEL_KV.put(createUserKey(walletAddress, data.key), JSON.stringify(data.value));
        return jsonResponse({ success: true });
    }

    if (method === 'DELETE') {
        if (!key) return errorResponse('Key URL parameter is required for DELETE', 400);
        await env.EVM_PANEL_KV.delete(createUserKey(walletAddress, key));
        return jsonResponse({ success: true });
    }

    return errorResponse('Method not allowed for /storage', 405);
}

async function handleUploadToIpfs(request: Request, env: Env): Promise<Response> {
    if (!env.PINATA_JWT) return errorResponse('Pinata JWT secret not configured', 500);
    
    const formData = await request.formData();
    const file = formData.get('file') as unknown as File;
    const name = formData.get('name') as string;
    if (!file || !name) return errorResponse('Name and file are required', 400);

    const fileFormData = new FormData();
    fileFormData.append('file', file, file.name);
    fileFormData.append('pinataOptions', JSON.stringify({ wrapWithDirectory: false }));

    const pinataFileResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.PINATA_JWT}` },
        body: fileFormData,
    });
    if (!pinataFileResponse.ok) throw new Error(`Pinata file upload failed: ${await pinataFileResponse.text()}`);
    const fileResult: any = await pinataFileResponse.json();

    const metadata = { name, description: `NFT for ${name}`, image: `https://gateway.pinata.cloud/ipfs/${fileResult.IpfsHash}` };
    const pinataMetadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.PINATA_JWT}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinataContent: metadata, pinataMetadata: { name: `${name}-metadata.json` } }),
    });
    if (!pinataMetadataResponse.ok) throw new Error(`Pinata metadata upload failed: ${await pinataMetadataResponse.text()}`);
    const metadataResult: any = await pinataMetadataResponse.json();

    return jsonResponse({ tokenURI: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}` });
}

const DEFAULT_NETWORKS: Network[] = [
  { id: 1, name: "Ethereum", rpcUrl: "https://eth.drpc.org", symbol: "ETH", explorerUrl: "https://etherscan.io" },
  { id: 11155111, name: "Sepolia", rpcUrl: "https://sepolia.drpc.org", symbol: "ETH", explorerUrl: "https://sepolia.etherscan.io" },
  { id: 56, name: "BSC", rpcUrl: "https://bsc-drpc.org", symbol: "BNB", explorerUrl: "https://bscscan.com" },
  { id: 137, name: "Polygon", rpcUrl: "https://polygon.drpc.org", symbol: "MATIC", explorerUrl: "https://polygonscan.com" },
  { id: 42161, name: "Arbitrum", rpcUrl: "https://arbitrum.drpc.org", symbol: "ETH", explorerUrl: "https://arbiscan.io" },
  { id: 43114, name: "Avalanche", rpcUrl: "https://avalanche.drpc.org", symbol: "AVAX", explorerUrl: "https://snowtrace.io" },
  { id: 250, name: "Fantom", rpcUrl: "https://fantom.drpc.org", symbol: "FTM", explorerUrl: "https://ftmscan.com" },
  { id: 10, name: "Optimism", rpcUrl: "https://optimism.drpc.org", symbol: "ETH", explorerUrl: "https://optimistic.etherscan.io" },
  { id: 8453, name: "Base", rpcUrl: "https://base.drpc.org", symbol: "ETH", explorerUrl: "https://basescan.org" },
  { id: 1101, name: "Linea", rpcUrl: "https://linea.drpc.org", symbol: "ETH", explorerUrl: "https://lineascan.build" },
  { id: 100, name: "Gnosis", rpcUrl: "https://gnosis.drpc.org", symbol: "xDAI", explorerUrl: "https://gnosisscan.io" },
  { id: 421613, name: "Arbitrum Goerli", rpcUrl: "https://goerli-rollup.arbitrum.io/rpc", symbol: "AGOR", explorerUrl: "https://goerli.arbiscan.io" },    
  { id: 10143, name: "Monad Testnet", rpcUrl: "https://testnet-rpc.monad.xyz", symbol: "tMONAD", explorerUrl: "https://testnet.explorer.monad.xyz" },
  { id: 3940, name: "Nexus Testnet", rpcUrl: "https://nexus-testnet.g.alchemy.com/public", symbol: "NEX", explorerUrl: "https://testnet3.explorer.nexus.xyz/" }
];

const NETWORKS_KV_KEY = "networks_list";

async function handleGetNetworks(request: Request, env: Env): Promise<Response> {
  try {
    let networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json');
    if (!networks) {
      // If no networks are in KV, initialize with defaults
      networks = DEFAULT_NETWORKS;
      await env.EVM_PANEL_KV.put(NETWORKS_KV_KEY, JSON.stringify(networks));
    }
    return jsonResponse(networks);
  } catch (error) {
    console.error('Error getting networks from KV:', error);
    return errorResponse('Could not retrieve network list', 500);
  }
}

async function handleManageNetworks(request: Request, env: Env): Promise<Response> {
  if (request.method === 'POST') {
    try {
      const newNetwork = await request.json<Network>();
      // Basic validation
      if (!newNetwork.id || !newNetwork.name || !newNetwork.rpcUrl || !newNetwork.symbol) {
        return errorResponse('New network object is missing required fields', 400);
      }
      
      let networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
      
      // Check if network with the same id already exists
      const existingIndex = networks.findIndex(n => n.id === newNetwork.id);
      if (existingIndex > -1) {
        // Update existing network
        networks[existingIndex] = newNetwork;
      } else {
        // Add new network
        networks.push(newNetwork);
      }

      await env.EVM_PANEL_KV.put(NETWORKS_KV_KEY, JSON.stringify(networks));
      return jsonResponse(networks);
    } catch (error) {
      console.error('Error adding network to KV:', error);
      return errorResponse('Could not add network', 500);
    }
  }

  if (request.method === 'DELETE') {
    try {
      const { id } = await request.json<{ id: number }>();
      if (!id) {
        return errorResponse('Network ID is required for deletion', 400);
      }

      let networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json');
      if (!networks) {
        return errorResponse('No networks found to delete from', 404);
      }

      const updatedNetworks = networks.filter(n => n.id !== id);
      
      // Prevent deleting the last network
      if (updatedNetworks.length === 0) {
        return errorResponse('Cannot delete the last network', 400);
      }

      await env.EVM_PANEL_KV.put(NETWORKS_KV_KEY, JSON.stringify(updatedNetworks));
      return jsonResponse(updatedNetworks);
    } catch (error) {
      console.error('Error deleting network from KV:', error);
      return errorResponse('Could not delete network', 500);
    }
  }

  return errorResponse('Method not allowed for this route', 405);
}

async function handleConnect(request: Request, env: Env): Promise<Response> {
    const { rpcUrl, privateKey } = await request.json() as { rpcUrl: string; privateKey: string };
    
    console.log('Handling connect request:', { rpcUrl, privateKey });
    
    if (!rpcUrl || !privateKey) {
        return errorResponse('RPC URL or private key missing', 400);
    }
    
    // Validate private key format
    const normalizedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
        return errorResponse('Invalid private key', 400);
    }
    
    try {
        const networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
        const chainId = await getChainId(rpcUrl);
        const network = networks.find(n => n.id === chainId);
        if (!network) {
            return errorResponse(`Network with chainId ${chainId} not configured`, 400);
        }

        const client = createPublicClient({
            chain: { 
                id: network.id, 
                name: network.name, 
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: { default: { http: [network.rpcUrl] } }
            },
            transport: http(rpcUrl),
        });
        const account = privateKeyToAccount(normalizedPrivateKey as `0x${string}`);
        const balance = await client.getBalance({ address: account.address });
        
        const result = { address: account.address, balance: balance.toString(), chainId, rpcUrl, explorerUrl: network.explorerUrl };
        console.log('Connect result:', result);
        return jsonResponse(result);
    } catch (error) {
        console.error('Error in handleConnect:', error);
        return errorResponse('Failed to connect: ' + (error as Error).message, 500);
    }
}

async function handleBalance(request: Request, env: Env): Promise<Response> {
    const { rpcUrl, address, tokenAddresses = [], nftAddresses = [] } = await request.json() as { 
        rpcUrl: string; 
        address: string; 
        tokenAddresses?: string[]; 
        nftAddresses?: string[] 
    };
    
    console.log('Handling balance request:', { rpcUrl, address, tokenAddresses, nftAddresses });
    
    if (!rpcUrl || !address) {
        return errorResponse('RPC URL and address are required', 400);
    }
    
    try {
        const networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
        const chainId = await getChainId(rpcUrl);
        const network = networks.find(n => n.id === chainId);
        if (!network) {
            return errorResponse(`Network with chainId ${chainId} not configured`, 400);
        }

        const client = createPublicClient({
            chain: { 
                id: network.id, 
                name: network.name, 
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: { default: { http: [network.rpcUrl] } }
            },
            transport: http(rpcUrl),
        });
        
        console.log('Chain ID:', chainId);
        
        const nativeBalance = await client.getBalance({ address: address as `0x${string}` });
        console.log('Native balance:', nativeBalance.toString());
        
        const erc20Balances = await Promise.all(
            tokenAddresses.map(async (token) => {
                try {
                    const [balance, symbol, decimals] = await Promise.all([
                        client.readContract({
                            address: token as `0x${string}`,
                            abi: erc20Abi,
                            functionName: 'balanceOf',
                            args: [address as `0x${string}`],
                        }),
                        client.readContract({
                            address: token as `0x${string}`,
                            abi: erc20Abi,
                            functionName: 'symbol',
                        }),
                        client.readContract({
                            address: token as `0x${string}`,
                            abi: erc20Abi,
                            functionName: 'decimals',
                        }),
                    ]);
                    console.log('ERC20 token balance:', { token, balance: balance.toString(), symbol, decimals: Number(decimals) });
                    return { token, balance: balance.toString(), symbol, decimals: Number(decimals) };
                } catch (error) {
                    console.error('Error fetching ERC20 token balance:', error);
                    // Return token info with zero balance if there's an error
                    return { token, balance: "0", symbol: "UNKNOWN", decimals: 18 };
                }
            })
        );
        
        const nftBalances = await Promise.all(
            nftAddresses.map(async (nft) => {
                try {
                    const balance = await client.readContract({
                        address: nft as `0x${string}`,
                        abi: erc721Abi,
                        functionName: 'balanceOf',
                        args: [address as `0x${string}`],
                    });

                    const balanceNum = Number(balance);
                    let tokenIds: string[] = [];

                    if (balanceNum > 0) {
                        try {
                            const promises = Array.from({ length: balanceNum }).map((_, i) =>
                                client.readContract({
                                    address: nft as `0x${string}`,
                                    abi: [...erc721Abi, {
                                        name: 'tokenOfOwnerByIndex',
                                        type: 'function',
                                        stateMutability: 'view',
                                        inputs: [{ type: 'address', name: 'owner' }, { type: 'uint256', name: 'index' }],
                                        outputs: [{ type: 'uint256', name: '' }],
                                    }],
                                    functionName: 'tokenOfOwnerByIndex',
                                    args: [address as `0x${string}`, BigInt(i)],
                                })
                            );
                            const resolvedTokenIds = await Promise.all(promises);
                            tokenIds = resolvedTokenIds.map(id => id.toString());
                        } catch (err) {
                            console.error(`Could not fetch token IDs for ${nft} via tokenOfOwnerByIndex. It might not be an ERC721Enumerable contract.`, err);
                            // If enumerable fails, we can't get IDs efficiently from the contract.
                            // We will leave tokenIds as an empty array.
                            // The frontend will need to handle this case.
                        }
                    }

                    console.log('ERC721 NFT balance:', { nft, balance: balance.toString(), tokenIds });
                    return { nft, balance: balance.toString(), type: 'ERC721', tokenIds };
                } catch {
                    try {
                        const balance = await client.readContract({
                            address: nft as `0x${string}`,
                            abi: erc1155Abi,
                            functionName: 'balanceOf',
                            args: [address as `0x${string}`, 0n],
                        });
                        console.log('ERC1155 NFT balance:', { nft, balance: balance.toString() });
                        return { nft, balance: balance.toString(), type: 'ERC1155', tokenId: 0 };
                    } catch (error) {
                        console.error('Error fetching NFT balance:', error);
                        return { nft, balance: "0", type: 'UNKNOWN' };
                    }
                }
            })
        );
        
        const result = { chainId, nativeBalance: nativeBalance.toString(), erc20Balances, nftBalances };
        console.log('Balance result:', result);
        return jsonResponse(result);
    } catch (error) {
        console.error('Error in handleBalance:', error);
        return errorResponse('Failed to fetch balance: ' + (error as Error).message, 500);
    }
}

async function handleSendTransaction(request: Request, env: Env): Promise<Response> {
    const { rpcUrl, privateKey, toAddress, amount, tokenType, tokenAddress, tokenId, abi, functionName, args } = await request.json() as { 
        rpcUrl: string; 
        privateKey: string; 
        toAddress: string; 
        amount: string; 
        tokenType: string; 
        tokenAddress?: string; 
        tokenId?: string;
        abi?: any;
        functionName?: string;
        args?: any[];
    };
    
    if (!rpcUrl || !privateKey || !toAddress) {
        return errorResponse('Missing required fields', 400);
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
        return errorResponse('Invalid toAddress', 400);
    }
    
    if (tokenType !== 'native' && tokenAddress && !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
        return errorResponse('Invalid tokenAddress', 400);
    }
    
    if ((tokenType === 'ERC721' || tokenType === 'ERC1155') && !tokenId) {
        return errorResponse('Missing tokenId for NFT', 400);
    }
    
    if (!['native', 'ERC20', 'ERC721', 'ERC1155'].includes(tokenType)) {
        return errorResponse('Invalid token type', 400);
    }
    
    if (amount && isNaN(Number(amount))) {
        return errorResponse('Invalid amount', 400);
    }
    
    // Validate private key format
    const normalizedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
        return errorResponse('Invalid private key', 400);
    }
    
    try {
        const networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
        const chainId = await getChainId(rpcUrl);
        const network = networks.find(n => n.id === chainId);
        if (!network) {
            return errorResponse(`Network with chainId ${chainId} not configured`, 400);
        }

        const client = createPublicClient({
            chain: { 
                id: network.id, 
                name: network.name, 
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: { default: { http: [network.rpcUrl] } }
            },
            transport: http(rpcUrl),
        });
        const walletClient = createWalletClient({
            chain: { 
                id: network.id, 
                name: network.name, 
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: { default: { http: [network.rpcUrl] } }
            },
            transport: http(rpcUrl),
            account: privateKeyToAccount(normalizedPrivateKey as `0x${string}`),
        });
        
        let hash: `0x${string}` | undefined;
        if (tokenType === 'native') {
            hash = await walletClient.sendTransaction({
                to: toAddress as `0x${string}`,
                value: BigInt(Math.round(Number(amount) * 1e18)),
            });
        } else if (tokenType === 'ERC20') {
            hash = await walletClient.writeContract({
                address: tokenAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [toAddress as `0x${string}`, BigInt(Math.round(Number(amount) * 1e18))],
            });
        } else if (tokenType === 'ERC721') {
            if (functionName === 'safeMint') {
                hash = await walletClient.writeContract({
                    address: tokenAddress as `0x${string}`,
                    abi: abi,
                    functionName: 'safeMint',
                    args: args || [],
                });
            } else {
                hash = await walletClient.writeContract({
                    address: tokenAddress as `0x${string}`,
                    abi: erc721Abi,
                    functionName: 'safeTransferFrom',
                    // Use server-side derived address for security and correctness
                    args: [walletClient.account.address, toAddress as `0x${string}`, BigInt(tokenId!)],
                });
            }
        } else if (tokenType === 'ERC1155') {
            hash = await walletClient.writeContract({
                address: tokenAddress as `0x${string}`,
                abi: erc1155Abi,
                functionName: 'safeTransferFrom',
                args: [walletClient.account.address, toAddress as `0x${string}`, BigInt(tokenId!), BigInt(amount), '0x'],
            });
        }
        
        if (!hash) {
            return errorResponse('Failed to send transaction: hash not generated', 500);
        }
        
        const receipt = await client.waitForTransactionReceipt({ hash });
        return jsonResponse({ hash, address: receipt.contractAddress || null });
    } catch (error) {
        return errorResponse('Failed to send transaction: ' + (error as Error).message, 500);
    }
}

async function handleDeployContract(request: Request, env: Env): Promise<Response> {
    const { rpcUrl, privateKey, abi, bytecode, constructorArgs } = await request.json() as { 
        rpcUrl: string; 
        privateKey: string; 
        abi: any; 
        bytecode: string; 
        constructorArgs?: any[] 
    };
    
    if (!rpcUrl || !privateKey || !abi || !bytecode) {
        return errorResponse('Missing required fields', 400);
    }
    
    // Validate private key format
    const normalizedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
        return errorResponse('Invalid private key', 400);
    }
    
    try {
        const networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
        const chainId = await getChainId(rpcUrl);
        const network = networks.find(n => n.id === chainId);
        if (!network) {
            return errorResponse(`Network with chainId ${chainId} not configured`, 400);
        }

        const client = createPublicClient({
            chain: { 
                id: network.id, 
                name: network.name, 
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: { default: { http: [network.rpcUrl] } }
            },
            transport: http(rpcUrl),
        });
        const walletClient = createWalletClient({
            chain: { 
                id: network.id, 
                name: network.name, 
                nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 },
                rpcUrls: { default: { http: [network.rpcUrl] } }
            },
            transport: http(rpcUrl),
            account: privateKeyToAccount(normalizedPrivateKey as `0x${string}`),
        });
        
        const hash = await walletClient.deployContract({
            abi,
            bytecode: bytecode as `0x${string}`,
            args: constructorArgs || [],
        });
        
        const receipt = await client.waitForTransactionReceipt({ hash });
        return jsonResponse({ address: receipt.contractAddress, hash });
    } catch (error) {
        return errorResponse('Failed to deploy contract: ' + (error as Error).message, 500);
    }
}

// Helper function to get chain ID
async function getChainId(rpcUrl: string) {
    try {
        console.log('Fetching chain ID for RPC URL:', rpcUrl);
        const client = createPublicClient({ transport: http(rpcUrl) });
        const chainId = await client.getChainId();
        console.log('Chain ID:', chainId);
        return chainId;
    } catch (error) {
        console.error('Error fetching chain ID:', error);
        throw new Error('Failed to fetch chain ID: ' + (error as Error).message);
    }
}


async function handleSignPermit(request: Request, env: Env): Promise<Response> {
    const { rpcUrl, privateKey, contractAddress, ownerAddress, spenderAddress, value, contractAbi } = await request.json() as {
        rpcUrl: string;
        privateKey: string;
        contractAddress: `0x${string}`;
        ownerAddress: `0x${string}`;
        spenderAddress: `0x${string}`;
        value: string;
        contractAbi: any;
    };

    if (!rpcUrl || !privateKey || !contractAddress || !ownerAddress || !spenderAddress || !value || !contractAbi) {
        return errorResponse('Missing required fields', 400);
    }

    const normalizedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    if (!/^0x[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)) {
        return errorResponse('Invalid private key', 400);
    }

    try {
        const networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
        const chainId = await getChainId(rpcUrl);
        const network = networks.find(n => n.id === chainId);
        if (!network) {
            return errorResponse(`Network with chainId ${chainId} not configured`, 400);
        }

        const account = privateKeyToAccount(normalizedPrivateKey as `0x${string}`);
        const client = createPublicClient({
            chain: { id: network.id, name: network.name, nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 }, rpcUrls: { default: { http: [network.rpcUrl] } } },
            transport: http(rpcUrl),
        });

        const walletClient = createWalletClient({
            chain: { id: network.id, name: network.name, nativeCurrency: { name: network.name, symbol: network.symbol, decimals: 18 }, rpcUrls: { default: { http: [network.rpcUrl] } } },
            transport: http(rpcUrl),
            account,
        });

        const nonce = await client.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'nonces',
            args: [ownerAddress],
        });

    const name = await client.readContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'name',
      args: [],
    }) as string;

    const domain = {
            name,
            version: '1',
            chainId,
            verifyingContract: contractAddress,
        };

        const types = {
            Permit: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
            ],
        };

        const message = {
            owner: ownerAddress,
            spender: spenderAddress,
            value: BigInt(value),
            nonce: nonce,
            deadline: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), // maxUint256
        };

        const signature = await walletClient.signTypedData({
            domain,
            types,
            primaryType: 'Permit',
            message,
        });

        return jsonResponse({ signature });
    } catch (error) {
        console.error('Error in handleSignPermit:', error);
        return errorResponse('Failed to sign permit: ' + (error as Error).message, 500);
    }
}

// --- Main Fetch Handler (Manual Router) ---

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: jsonResponse({}, 200).headers });
    }

    try {
      if (path.startsWith('/api/')) {
        const route = path.substring(5); // remove '/api/'
        if (route === 'generate-account') return await handleGenerateAccount(request, env);
        if (route === 'compile-contract') return await handleCompileContract(request, env);
        if (route === 'storage') return await handleStorage(request, env);
        if (route === 'upload-to-ipfs') return await handleUploadToIpfs(request, env);
        if (route === 'connect') return await handleConnect(request, env);
        if (route === 'balance') return await handleBalance(request, env);
        if (route === 'send-transaction') return await handleSendTransaction(request, env);
        if (route === 'sign-permit') return await handleSignPermit(request, env);
if (route === 'deploy-contract') return await handleDeployContract(request, env);
if (route === 'networks' && request.method === 'GET') return await handleGetNetworks(request, env);
if (route === 'networks' && (request.method === 'POST' || request.method === 'DELETE')) return await handleManageNetworks(request, env);
if (route === 'contract-type') return await handleContractType(request, env);
if (route === 'health') return jsonResponse({ status: 'ok' });
} else {
        return await env.ASSETS.fetch(request);
      }
    } catch (e) {
        console.error("Caught error in fetch handler:", e);
        return errorResponse('Internal Server Error: ' + (e as Error).message, 500);
    }

    return errorResponse('API Route not found.', 404);
  },
};

async function handleContractType(request: Request, env: Env): Promise<Response> {
    const { rpcUrl, contractAddress } = await request.json() as { rpcUrl: string; contractAddress: `0x${string}` };

    if (!rpcUrl || !contractAddress) {
        return errorResponse('rpcUrl and contractAddress are required', 400);
    }

    try {
        const client = createPublicClient({ transport: http(rpcUrl) });

        const erc721InterfaceId: `0x${string}` = '0x80ac58cd';
        const erc1155InterfaceId: `0x${string}` = '0xd9b67a26';

        const supportsInterfaceAbi = [{
            name: 'supportsInterface',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ type: 'bytes4', name: 'interfaceId' }],
            outputs: [{ type: 'bool', name: '' }],
        }] as const;

        try {
            const [supports721, supports1155] = await Promise.all([
                client.readContract({
                    address: contractAddress,
                    abi: supportsInterfaceAbi,
                    functionName: 'supportsInterface',
                    args: [erc721InterfaceId],
                }).catch(() => false), // If call fails, it doesn't support it
                client.readContract({
                    address: contractAddress,
                    abi: supportsInterfaceAbi,
                    functionName: 'supportsInterface',
                    args: [erc1155InterfaceId],
                }).catch(() => false),
            ]);

            if (supports721) {
                return jsonResponse({ contractType: 'ERC721' });
            }
            if (supports1155) {
                return jsonResponse({ contractType: 'ERC1155' });
            }
        } catch (e) {
            // This can happen if the contract doesn't implement supportsInterface at all.
            // We can fall back to checking for ERC20 properties.
            console.log(`Could not check interfaces for ${contractAddress}, falling back to ERC20 check.`);
        }

        // Fallback: Check for common ERC20 functions. This is not foolproof but a good heuristic.
        try {
            const [hasTotalSupply, hasBalanceOf] = await Promise.all([
                client.readContract({
                    address: contractAddress,
                    abi: erc20Abi,
                    functionName: 'totalSupply',
                }).then(() => true).catch(() => false),
                client.readContract({
                    address: contractAddress,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [contractAddress], // address doesn't matter, just need to see if it exists
                }).then(() => true).catch(() => false),
            ]);

            if (hasTotalSupply && hasBalanceOf) {
                return jsonResponse({ contractType: 'ERC20' });
            }
        } catch (e) {
             return errorResponse('Could not determine contract type.', 500);
        }

        return jsonResponse({ contractType: 'UNKNOWN' });

    } catch (error) {
        return errorResponse('Failed to determine contract type: ' + (error as Error).message, 500);
    }
}

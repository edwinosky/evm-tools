
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

// --- Alphas Admin Interfaces ---
interface AdminRole {
  userAddress: string;
  role: 'super_admin' | 'editor' | 'viewer' | 'moderator';
  permissions: string[];
}

interface AlphaProject {
  id: string;
  name: string;
  category: 'DeFi' | 'NFT' | 'GameFi' | 'Tools' | 'Gaming' | 'Infrastructure' | 'Other';
  website: string;
  description?: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- Environment Interface ---
export interface Env {
  EVM_PANEL_KV: KVNamespace;
  ENVIRONMENT: string;
  PINATA_JWT: string;
  ETHERSCAN_API_KEY: string; // Single Etherscan API key for all compatible networks
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
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(p => p);
        const walletAddress = request.headers.get('X-Wallet-Address');

        console.log('=== STORAGE DEBUG ===');
        console.log('Raw URL:', request.url);
        console.log('Path parts:', pathParts);
        console.log('Wallet address header:', walletAddress);

        if (!walletAddress || !isValidWalletAddress(walletAddress)) {
            console.log('ERROR: Invalid wallet address:', walletAddress);
            return errorResponse('Valid X-Wallet-Address header required', 400);
        }

        const key = url.searchParams.get('key');
        console.log('Storage request:', request.method, 'key:', key);

        if (request.method === 'GET') {
            if (key) { // Get single item
                console.log('Getting single item for key:', key);
                const value = await env.EVM_PANEL_KV.get(createUserKey(walletAddress, key));
                if (value) {
                    console.log('Found value for key:', key);
                    // Try to parse JSON, fallback to raw value if fails
                    try {
                        return new Response(value, { headers: jsonResponse({}, 200).headers });
                    } catch (e) {
                        console.log('Value is not JSON, returning raw:', value.substring(0, 100));
                        return new Response(value, { headers: jsonResponse({}, 200).headers });
                    }
                } else {
                    console.log('Key not found:', key);
                    return errorResponse('Key not found', 404);
                }
            } else { // Get all items
                console.log('Getting all items for wallet:', walletAddress);
                const list = await env.EVM_PANEL_KV.list({ prefix: `${walletAddress}:` });
                console.log('Found keys:', list.keys.length);

                const items: Record<string, any> = {};
                for (const item of list.keys) {
                    const value = await env.EVM_PANEL_KV.get(item.name);
                    if (value) {
                        try {
                            items[item.name.replace(`${walletAddress}:`, '')] = JSON.parse(value);
                        } catch (e) {
                            console.log('Failed to parse value for key:', item.name, 'value length:', value.length);
                            items[item.name.replace(`${walletAddress}:`, '')] = value; // Raw string fallback
                        }
                    } else {
                        items[item.name.replace(`${walletAddress}:`, '')] = null;
                    }
                }
                console.log('Returning items:', Object.keys(items).length);
                return jsonResponse(items);
            }
        }

        if (request.method === 'POST') {
            console.log('POST storage request');
            const data = await request.json() as { key: string; value: any };
            console.log('POST data:', { key: data.key, valueType: typeof data.value, hasValue: !!data.value });

            if (!data.key) {
                console.log('ERROR: No key provided in POST data');
                return errorResponse('Key is required in request body', 400);
            }

            try {
                const userKey = createUserKey(walletAddress, data.key);
                const valueString = JSON.stringify(data.value);
                console.log('Saving to KV:', userKey, 'value length:', valueString.length);

                await env.EVM_PANEL_KV.put(userKey, valueString);
                console.log('Successfully saved to KV');
                return jsonResponse({ success: true });
            } catch (error) {
                console.log('ERROR saving to KV:', error);
                return errorResponse('Failed to save data: ' + (error as Error).message, 500);
            }
        }

        if (request.method === 'DELETE') {
            if (!key) {
                console.log('ERROR: No key provided for DELETE');
                return errorResponse('Key URL parameter is required for DELETE', 400);
            }

            try {
                const userKey = createUserKey(walletAddress, key);
                console.log('Deleting from KV:', userKey);
                await env.EVM_PANEL_KV.delete(userKey);
                return jsonResponse({ success: true });
            } catch (error) {
                console.log('ERROR deleting from KV:', error);
                return errorResponse('Failed to delete data: ' + (error as Error).message, 500);
            }
        }

        console.log('ERROR: Method not allowed:', request.method);
        return errorResponse('Method not allowed for /storage', 405);

    } catch (error) {
        console.error('CRITICAL ERROR in handleStorage:', error);
        // Return more detailed error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return errorResponse(`Storage error: ${errorMessage}`, 500);
    }
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

// --- Alphas Admin Constants ---
const ALPHA_ADMIN_ROLES_KEY = "alpha_admin_roles";
const ALPHA_PROJECTS_GLOBAL_KEY = "alpha_projects_global";
const AUDIT_LOG_KEY = "alpha_audit_log";

// --- Alphas Admin Auth Functions ---
// Check if user has required permission
function hasPermission(userRole: string, requiredPermission: string): boolean {
  const rolePermissions = {
    'super_admin': ['all'],
    'editor': ['projects:crud', 'projects:approve'],
    'moderator': ['projects:read', 'projects:flag'],
    'viewer': ['projects:read']
  };

  const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];
  return permissions.includes('all') || permissions.includes(requiredPermission);
}

// Get user role from wallet address
async function getUserRole(walletAddress: string, env: Env): Promise<string | null> {
  try {
    const rolesData = await env.EVM_PANEL_KV.get(ALPHA_ADMIN_ROLES_KEY, 'json') as { users: AdminRole[] } | null;
    if (!rolesData?.users) return null;

    const userRole = rolesData.users.find(user => user.userAddress.toLowerCase() === walletAddress.toLowerCase());
    return userRole?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Middleware to check auth and permissions
async function checkAuthAndPermission(request: Request, env: Env, requiredPermission: string): Promise<{ userAddress: string; role: string } | null> {
  const walletAddress = request.headers.get('X-Wallet-Address');
  if (!walletAddress || !isValidWalletAddress(walletAddress)) {
    return null;
  }

  const role = await getUserRole(walletAddress, env);
  if (!role) {
    return null;
  }

  if (!hasPermission(role, requiredPermission)) {
    return null;
  }

  return { userAddress: walletAddress, role };
}

// Audit log function
async function logAuditAction(env: Env, action: string, userAddress: string, details: any = {}): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const auditEntry = {
      timestamp,
      userAddress,
      action,
      details
    };

    // Get existing audit log
    let auditLog: any[] = [];
    const existingLog = await env.EVM_PANEL_KV.get(AUDIT_LOG_KEY, 'json');
    if (existingLog) {
      auditLog = Array.isArray(existingLog) ? existingLog : [];
    }

    // Add new entry and keep only last 1000 entries
    auditLog.push(auditEntry);
    if (auditLog.length > 1000) {
      auditLog = auditLog.slice(-1000);
    }

    await env.EVM_PANEL_KV.put(AUDIT_LOG_KEY, JSON.stringify(auditLog));
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
}

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

// --- Alphas Admin Handlers ---

// Initialization endpoint - only works if no roles exist yet
async function handleAlphasInitAdmin(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Check if any roles already exist
    const rolesData = await env.EVM_PANEL_KV.get(ALPHA_ADMIN_ROLES_KEY, 'json') as { users: AdminRole[] } | null;
    if (rolesData && Array.isArray(rolesData.users) && rolesData.users.length > 0) {
      return errorResponse('Admin system already initialized', 403);
    }

    const { walletAddress, name } = await request.json() as { walletAddress: string; name: string };

    if (!walletAddress || !isValidWalletAddress(walletAddress)) {
      return errorResponse('Valid wallet address is required', 400);
    }

    // Initialize first super admin
    const initialAdminData = {
      users: [{
        userAddress: walletAddress.toLowerCase(),
        role: 'super_admin' as const,
        permissions: ['all']
      }]
    };

    await env.EVM_PANEL_KV.put(ALPHA_ADMIN_ROLES_KEY, JSON.stringify(initialAdminData));

    // Audit log
    await logAuditAction(env, 'initialize_admin_system', walletAddress, { action: 'first_admin_created', name });

    return jsonResponse({
      success: true,
      message: `Super Admin initialized for address: ${walletAddress}`,
      role: 'super_admin'
    });
  } catch (error) {
    console.error('Error initializing admin:', error);
    return errorResponse('Failed to initialize admin system', 500);
  }
}

async function handleAlphasAdminRoles(request: Request, env: Env): Promise<Response> {
  // Check if user has admin permission
  const auth = await checkAuthAndPermission(request, env, 'all');
  if (!auth) {
    return errorResponse('Unauthorized: Admin role required', 403);
  }

  if (request.method === 'GET') {
    try {
      const rolesData = await env.EVM_PANEL_KV.get(ALPHA_ADMIN_ROLES_KEY, 'json');
      const roles = rolesData || { users: [] };
      return jsonResponse(roles);
    } catch (error) {
      console.error('Error getting admin roles:', error);
      return errorResponse('Failed to retrieve admin roles', 500);
    }
  }

  if (request.method === 'POST') {
    try {
      const { userAddress, role } = await request.json() as { userAddress: string; role: string };

      if (!userAddress || !role) {
        return errorResponse('userAddress and role are required', 400);
      }

      if (!isValidWalletAddress(userAddress)) {
        return errorResponse('Invalid wallet address', 400);
      }

      const validRoles = ['super_admin', 'editor', 'viewer', 'moderator'];
      if (!validRoles.includes(role)) {
        return errorResponse('Invalid role', 400);
      }

      // Get existing roles
      let rolesData = await env.EVM_PANEL_KV.get(ALPHA_ADMIN_ROLES_KEY, 'json') as { users: AdminRole[] } | null;
      if (!rolesData) {
        rolesData = { users: [] };
      }

      // Check if user already exists
      const existingIndex = rolesData.users.findIndex(u => u.userAddress.toLowerCase() === userAddress.toLowerCase());

      if (existingIndex >= 0) {
        rolesData.users[existingIndex].role = role as AdminRole['role'];
      } else {
        rolesData.users.push({
          userAddress,
          role: role as AdminRole['role'],
          permissions: []
        });
      }

      await env.EVM_PANEL_KV.put(ALPHA_ADMIN_ROLES_KEY, JSON.stringify(rolesData));

      // Audit log
      await logAuditAction(env, 'update_admin_role', auth.userAddress, { targetUser: userAddress, newRole: role });

      return jsonResponse({ success: true });
    } catch (error) {
      console.error('Error updating admin roles:', error);
      return errorResponse('Failed to update admin roles', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}

async function handleAlphasProjects(request: Request, env: Env): Promise<Response> {
  // Check if this is an admin request by looking at permissions or headers
  const isAdminRequest = request.headers.get('X-Wallet-Address') !== null;
  let hasAdminPermission = false;

  if (isAdminRequest) {
    const auth = await checkAuthAndPermission(request, env, 'projects:read');
    hasAdminPermission = auth !== null;
  }

  if (request.method === 'GET') {
    try {
      const projectsData = await env.EVM_PANEL_KV.get(ALPHA_PROJECTS_GLOBAL_KEY, 'json') as { projects: AlphaProject[] } | null;
      if (!projectsData?.projects) {
        return jsonResponse({ projects: [] });
      }

      let projects = projectsData.projects;

      // If NOT admin request, only show approved projects
      if (!hasAdminPermission) {
        projects = projects.filter(p => p.status === 'approved');
      }

      // Parse query parameters
      const url = new URL(request.url);
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      const sort = url.searchParams.get('sort');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '12');

      // Apply category filter
      if (category && category !== 'all') {
        projects = projects.filter(p => p.category === category);
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        projects = projects.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower)) ||
          p.website.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (sort) {
        projects.sort((a, b) => {
          switch (sort) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
      } else {
        // Default: newest first
        projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      // Apply pagination
      const totalProjects = projects.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProjects = projects.slice(startIndex, endIndex);

      return jsonResponse({
        projects: paginatedProjects,
        total: totalProjects,
        page,
        limit,
        hasMore: endIndex < totalProjects
      });
    } catch (error) {
      console.error('Error getting projects:', error);
      return errorResponse('Failed to retrieve projects', 500);
    }
  }

  // Check admin permission for write operations
  const auth = await checkAuthAndPermission(request, env, 'projects:crud');
  if (!auth) {
    return errorResponse('Unauthorized: Editor role required', 403);
  }

  if (request.method === 'POST') {
    try {
      const projectData = await request.json() as Omit<AlphaProject, 'id' | 'createdAt' | 'updatedAt'>;

      if (!projectData.name || !projectData.category || !projectData.website) {
        return errorResponse('name, category, and website are required', 400);
      }

      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newProject: AlphaProject = {
        ...projectData,
        id: projectId,
        createdBy: auth.userAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing projects
      let projectsData = await env.EVM_PANEL_KV.get(ALPHA_PROJECTS_GLOBAL_KEY, 'json') as { projects: AlphaProject[] } | null;
      if (!projectsData) {
        projectsData = { projects: [] };
      }

      projectsData.projects.push(newProject);
      await env.EVM_PANEL_KV.put(ALPHA_PROJECTS_GLOBAL_KEY, JSON.stringify(projectsData));

      // Audit log
      await logAuditAction(env, 'create_project', auth.userAddress, { projectId, projectName: newProject.name });

      return jsonResponse({ project: newProject });
    } catch (error) {
      console.error('Error creating project:', error);
      return errorResponse('Failed to create project', 500);
    }
  }

  if (request.method === 'PUT') {
    try {
      const { projectId, ...updateData } = await request.json() as { projectId: string } & Partial<AlphaProject>;

      if (!projectId) {
        return errorResponse('projectId is required', 400);
      }

      let projectsData = await env.EVM_PANEL_KV.get(ALPHA_PROJECTS_GLOBAL_KEY, 'json') as { projects: AlphaProject[] } | null;
      if (!projectsData?.projects) {
        return errorResponse('Projects not found', 404);
      }

      const projectIndex = projectsData.projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        return errorResponse('Project not found', 404);
      }

      // Update project
      projectsData.projects[projectIndex] = {
        ...projectsData.projects[projectIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      await env.EVM_PANEL_KV.put(ALPHA_PROJECTS_GLOBAL_KEY, JSON.stringify(projectsData));

      // Audit log
      await logAuditAction(env, 'update_project', auth.userAddress, { projectId, changes: updateData });

      return jsonResponse({ project: projectsData.projects[projectIndex] });
    } catch (error) {
      console.error('Error updating project:', error);
      return errorResponse('Failed to update project', 500);
    }
  }

  if (request.method === 'DELETE') {
    try {
      const url = new URL(request.url);
      const projectId = url.searchParams.get('projectId');

      if (!projectId) {
        return errorResponse('projectId URL parameter is required', 400);
      }

      let projectsData = await env.EVM_PANEL_KV.get(ALPHA_PROJECTS_GLOBAL_KEY, 'json') as { projects: AlphaProject[] } | null;
      if (!projectsData?.projects) {
        return errorResponse('Projects not found', 404);
      }

      const projectIndex = projectsData.projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        return errorResponse('Project not found', 404);
      }

      const deletedProject = projectsData.projects.splice(projectIndex, 1)[0];
      await env.EVM_PANEL_KV.put(ALPHA_PROJECTS_GLOBAL_KEY, JSON.stringify(projectsData));

      // Audit log
      await logAuditAction(env, 'delete_project', auth.userAddress, { projectId, projectName: deletedProject.name });

      return jsonResponse({ success: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      return errorResponse('Failed to delete project', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
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
if (route === 'discover-balances') return await handleDiscoverBalancesV2(request, env); // Renamed for clarity
if (route === 'networks' && request.method === 'GET') return await handleGetNetworks(request, env);
if (route === 'networks' && (request.method === 'POST' || request.method === 'DELETE')) return await handleManageNetworks(request, env);
if (route === 'contract-type') return await handleContractType(request, env);
if (route === 'health') return jsonResponse({ status: 'ok' });

// Alphas Admin Routes
if (route === 'alphas/admin/init') return await handleAlphasInitAdmin(request, env);
if (route === 'alphas/admin/roles') return await handleAlphasAdminRoles(request, env);
if (route === 'alphas/admin/projects') return await handleAlphasProjects(request, env);
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

// --- New Handler for Token Discovery using Etherscan-compatible APIs ---

async function handleDiscoverBalancesV2(request: Request, env: Env): Promise<Response> {
    console.log('=== DEBUGGING handleDiscoverBalancesV2 ===');

    const { address, rpcUrl } = await request.json() as { address: string; rpcUrl: string };
    console.log('Received params:', { address: !!address, rpcUrl: !!rpcUrl });

    if (!address || !rpcUrl) {
        console.log('Validation failed: missing address or rpcUrl');
        return errorResponse('address and rpcUrl are required', 400);
    }

    console.log('ETHERSCAN_API_KEY exists:', !!env.ETHERSCAN_API_KEY);
    console.log('ETHERSCAN_API_KEY length:', env.ETHERSCAN_API_KEY?.length || 0);

    if (!env.ETHERSCAN_API_KEY || env.ETHERSCAN_API_KEY.trim() === '') {
        console.log('Validation failed: ETHERSCAN_API_KEY is empty or undefined');
        return errorResponse('ETHERSCAN API key is not configured or empty', 500);
    }

    try {
        console.log('Starting token discovery process...');
        const networks = await env.EVM_PANEL_KV.get<Network[]>(NETWORKS_KV_KEY, 'json') || DEFAULT_NETWORKS;
        const chainId = await getChainId(rpcUrl);
        console.log('Chain ID obtained:', chainId);

        const network = networks.find(n => n.id === chainId);
        console.log('Network found:', !!network);

        if (!network || !network.explorerUrl) {
            console.log('Network validation failed');
            return errorResponse(`Network with chainId ${chainId} not configured or missing explorerUrl`, 400);
        }

        // Simplified: Use Etherscan V2 API for ALL networks with chainId
        // According to Etherscan docs: ONE base URL for all chains
        const apiUrlTemplate = 'https://api.etherscan.io/v2/api?chainid={chainid}&module=account&action=tokentx&address={address}&endblock=999999999&sort=desc&page=1&offset=50&apikey={apikey}';
        console.log('Using unified Etherscan V2 template for all chains');

        // Optimized: No startblock filter - use last 50 transactions (most recent and relevant)
        const apiUrl = apiUrlTemplate
            .replace('{chainid}', chainId.toString())
            .replace('{address}', address)
            .replace('{apikey}', env.ETHERSCAN_API_KEY);

        console.log('Final API URL (without key):', apiUrl.replace(env.ETHERSCAN_API_KEY, '[HIDDEN]'));

        console.log('Making API request to:', apiUrl.replace(env.ETHERSCAN_API_KEY, '[API_KEY]'));

        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            console.log('API response not ok:', response.status, errorText);
            throw new Error(`Etherscan API request failed: ${errorText}`);
        }

        const result = await response.json() as any;
        console.log('API response status:', result.status);
        console.log('API response message:', result.message);

        if (result.status !== '1') {
            // Etherscan API returns status '0' with a message on error
            console.log('API returned error status:', result);
            throw new Error(`Etherscan API Error: ${result.message} - ${result.result}`);
        }

        console.log('Received', result.result?.length || 0, 'token transactions');

        // Process tokentx results: group by token contract address
        const tokenMap = new Map<string, { symbol: string; decimals: string; transactions: any[] }>();

        // Group transactions by token contract
        for (const tx of result.result || []) {
            const tokenAddress = tx.contractAddress;
            if (!tokenMap.has(tokenAddress)) {
                tokenMap.set(tokenAddress, {
                    symbol: tx.tokenSymbol,
                    decimals: tx.tokenDecimal,
                    transactions: []
                });
            }
            tokenMap.get(tokenAddress)!.transactions.push(tx);
        }

        console.log('Grouped into', tokenMap.size, 'unique tokens');

        // Load existing data to avoid duplicates
        const existingErc20Key = `${address}:${chainId}_erc20_tokens`;
        const existingNftKey = `${address}:${chainId}_nft_addresses`;

        let existingErc20Tokens: string[] = [];
        let existingNftAddresses: string[] = [];

        try {
            console.log('🎯 Loading existing data for comparison...');
            const existingErc20Data = await env.EVM_PANEL_KV.get(existingErc20Key);
            const existingNftData = await env.EVM_PANEL_KV.get(existingNftKey);

            if (existingErc20Data) {
                const parsed = JSON.parse(existingErc20Data);
                existingErc20Tokens = parsed.value || parsed;
                console.log('✅ Found', existingErc20Tokens.length, 'existing ERC20 tokens');
            }

            if (existingNftData) {
                const parsed = JSON.parse(existingNftData);
                existingNftAddresses = parsed.value || parsed;
                console.log('✅ Found', existingNftAddresses.length, 'existing NFT addresses');
            }
        } catch (error) {
            console.log('❌ Could not load existing data, will proceed with full discovery');
        }

        // Create a client to check current balances for the tokens we found
        const client = createPublicClient({
            transport: http(rpcUrl),
        });

        // Separate ERC20 vs ERC721/ERC1155 tokens intelligently
        const erc20Balances: any[] = [];
        const nftBalances: any[] = [];
        const existingTokensSet = new Set([...existingErc20Tokens, ...existingNftAddresses]);
        console.log('🔄 Comparing with existing tokens:', existingTokensSet.size);

        // For each unique token, check type and compare with existing
        for (const [tokenAddress, tokenInfo] of tokenMap) {
            // Skip if already exists
            if (existingTokensSet.has(tokenAddress)) {
                console.log('⏭️ Skipped existing token:', tokenInfo.symbol);
                continue;
            }

            try {
                console.log('🔍 Analyzing token:', tokenAddress, tokenInfo.symbol);

                // Check ERC721/ERC1155 support first
                const erc721InterfaceId: `0x${string}` = '0x80ac58cd';
                const erc1155InterfaceId: `0x${string}` = '0xd9b67a26';

                const supportsInterfaceAbi = [{
                    name: 'supportsInterface',
                    type: 'function',
                    stateMutability: 'view',
                    inputs: [{ type: 'bytes4', name: 'interfaceId' }],
                    outputs: [{ type: 'bool', name: '' }],
                }] as const;

                let isNft = false;

                try {
                    const [supports721, supports1155] = await Promise.all([
                        client.readContract({
                            address: tokenAddress as `0x${string}`,
                            abi: supportsInterfaceAbi,
                            functionName: 'supportsInterface',
                            args: [erc721InterfaceId],
                        }).catch(() => false),
                        client.readContract({
                            address: tokenAddress as `0x${string}`,
                            abi: supportsInterfaceAbi,
                            functionName: 'supportsInterface',
                            args: [erc1155InterfaceId],
                        }).catch(() => false),
                    ]);

                    if (supports721 || supports1155) {
                        isNft = true;
                        console.log('🎨 Detected NFT:', tokenAddress, tokenInfo.symbol);
                    }
                } catch (e) {
                    console.log(`Could not check interfaces for ${tokenAddress}, assuming ERC20`);
                }

                // Try to get balance for either ERC20 or NFT
                if (isNft) {
                    // For NFTs, just add if we found transactions
                    console.log('🧩 Added NFT:', tokenAddress, tokenInfo.symbol);
                    nftBalances.push({
                        contract: tokenAddress,
                        symbol: tokenInfo.symbol,
                        type: 'NFT',
                    });

                    // Save new NFT addresses
                    const updatedNfts = [...existingNftAddresses, tokenAddress];
                    await env.EVM_PANEL_KV.put(existingNftKey, JSON.stringify({ value: updatedNfts }));
                    console.log('💾 Saved new NFT addresses to DB');
                } else {
                    // ERC20 token balance check
                    try {
                        const balance = await client.readContract({
                            address: tokenAddress as `0x${string}`,
                            abi: erc20Abi,
                            functionName: 'balanceOf',
                            args: [address as `0x${string}`],
                        });

                        const balanceValue = balance.toString();
                        console.log('💰 ERC20 balance:', tokenAddress, balanceValue);

                        // Only include tokens with balance > 0
                        if (BigInt(balanceValue) > BigInt(0)) {
                            erc20Balances.push({
                                token: tokenAddress,
                                balance: balanceValue,
                                symbol: tokenInfo.symbol,
                                decimals: parseInt(tokenInfo.decimals || '18', 10),
                            });

                            // Save new ERC20 tokens
                            const updatedTokens = [...existingErc20Tokens, tokenAddress];
                            await env.EVM_PANEL_KV.put(existingErc20Key, JSON.stringify({ value: updatedTokens }));
                            console.log('💾 Saved new ERC20 tokens to DB');
                        }
                    } catch (balanceError) {
                        console.log('❌ Could not get ERC20 balance for:', tokenAddress);
                    }
                }

            } catch (error) {
                console.error('❌ Error analyzing token:', tokenAddress, error);
            }
        }

        const summary = {
            erc20Tokens: erc20Balances.length,
            nftContracts: nftBalances.length,
            existingTokens: existingTokensSet.size,
            newTokensAdded: erc20Balances.length + nftBalances.length
        };

        console.log('📊 Discovery summary:', summary);

        return jsonResponse({
            erc20Balances,
            nftBalances,
            summary,
            warning: "Only ERC20 balances returned in erc20Balances. NFTs require manual addition."
        });

    } catch (error) {
        console.error('Error in handleDiscoverBalancesV2:', error);
        return errorResponse('Failed to discover balances: ' + (error as Error).message, 500);
    }
}

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

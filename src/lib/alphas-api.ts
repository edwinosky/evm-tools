import { useAppContext } from '@/context/AppContext';

const API_BASE = '/api/alphas/admin';

// Helper function to get auth headers
const getAuthHeaders = (walletAddress?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (walletAddress) {
    headers['X-Wallet-Address'] = walletAddress;
  }

  return headers;
};

// Helper function to get current connected wallet address
const getCurrentAddress = (): string | undefined => {
  // This will be called inside React components, so we need to use the context hook
  // We can't call this directly outside a React component, so we'll use it in the actual API calls
  return undefined;
};

// Helper function for making authenticated API calls
const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  walletAddress?: string
): Promise<any> => {
  const headers = getAuthHeaders(walletAddress);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// API Functions for Projects
export const apiAlphas = {
  // Initialize admin (no auth required)
  initAdmin: async (walletAddress: string, name: string) => {
    return authenticatedFetch(`${API_BASE}/init`, {
      method: 'POST',
      body: JSON.stringify({ walletAddress, name }),
    });
  },

  // Projects CRUD (require auth)
  projects: {
    getAll: async (walletAddress: string) => {
      return authenticatedFetch(`${API_BASE}/projects`, {}, walletAddress);
    },

    create: async (projectData: any, walletAddress: string) => {
      return authenticatedFetch(`${API_BASE}/projects`, {
        method: 'POST',
        body: JSON.stringify(projectData),
      }, walletAddress);
    },

    update: async (projectId: string, updateData: any, walletAddress: string) => {
      const body = { projectId, ...updateData };
      return authenticatedFetch(`${API_BASE}/projects`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }, walletAddress);
    },

    delete: async (projectId: string, walletAddress: string) => {
      return authenticatedFetch(`${API_BASE}/projects?projectId=${projectId}`, {
        method: 'DELETE',
      }, walletAddress);
    },
  },

  // Users/Roles CRUD (require auth)
  users: {
    getAll: async (walletAddress: string) => {
      return authenticatedFetch(`${API_BASE}/roles`, {}, walletAddress);
    },

    updateRole: async (userAddress: string, role: string, walletAddress: string) => {
      return authenticatedFetch(`${API_BASE}/roles`, {
        method: 'POST',
        body: JSON.stringify({ userAddress, role }),
      }, walletAddress);
    },
  },
};

// React hook wrapper that uses the app context
export const useAlphasApi = () => {
  const { address } = useAppContext();

  return {
    initAdmin: (walletAddress: string, name: string) => apiAlphas.initAdmin(walletAddress, name),

    projects: {
      getAll: () => apiAlphas.projects.getAll(address!),
      create: (projectData: any) => apiAlphas.projects.create(projectData, address!),
      update: (projectId: string, updateData: any) => apiAlphas.projects.update(projectId, updateData, address!),
      delete: (projectId: string) => apiAlphas.projects.delete(projectId, address!),
    },

    users: {
      getAll: () => apiAlphas.users.getAll(address!),
      updateRole: (userAddress: string, role: string) => apiAlphas.users.updateRole(userAddress, role, address!),
    },
  };
};

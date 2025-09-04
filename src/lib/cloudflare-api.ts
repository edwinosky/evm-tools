// Cloudflare Worker API client for EVM Wallet Panel
const API_BASE_URL = '/api';

interface StorageItem {
  key: string;
  value: any;
}

interface StorageResponse {
  [key: string]: any;
}

/**
 * Cloudflare KV Storage Client
 */
class CloudflareStorage {
  private walletAddress: string | null = null;

  /**
   * Set the wallet address for user-specific storage
   * @param address Wallet address
   */
  setWalletAddress(address: string) {
    this.walletAddress = address;
  }

  /**
   * Get all storage items for the current wallet
   */
  async getAllItems(): Promise<StorageResponse> {
    if (!this.walletAddress) {
      throw new Error('Wallet address not set');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/storage`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': this.walletAddress,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching storage items:', error);
      throw error;
    }
  }

  /**
   * Get a specific storage item by key
   * @param key Storage key
   */
  async getItem(key: string): Promise<any> {
    if (!this.walletAddress) {
      throw new Error('Wallet address not set');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/storage?key=${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': this.walletAddress,
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error(`Error fetching storage item '${key}':`, error);
      throw error;
    }
  }

  /**
   * Set a storage item
   * @param key Storage key
   * @param value Storage value
   */
  async setItem(key: string, value: any): Promise<void> {
    if (!this.walletAddress) {
      throw new Error('Wallet address not set');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/storage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': this.walletAddress,
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error setting storage item '${key}':`, error);
      throw error;
    }
  }

  /**
   * Remove a storage item
   * @param key Storage key
   */
  async removeItem(key: string): Promise<void> {
    if (!this.walletAddress) {
      throw new Error('Wallet address not set');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/storage?key=${key}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': this.walletAddress,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error removing storage item '${key}':`, error);
      throw error;
    }
  }

  /**
   * Check if the worker is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const cloudflareStorage = new CloudflareStorage();

// Export types
export type { StorageItem, StorageResponse };

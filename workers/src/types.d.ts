// Types for Cloudflare Workers
export interface KVNamespace {
  get(key: string, type: 'text'): Promise<string | null>;
  get(key: string, type: 'json'): Promise<any | null>;
  get(key: string): Promise<string | null>;
  
  put(key: string, value: string | ReadableStream | ArrayBuffer, options?: KVNamespacePutOptions): Promise<void>;
  
  delete(key: string): Promise<void>;
  
  list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>;
}

export interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: any;
}

export interface KVNamespaceListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

export interface KVNamespaceListResult {
  keys: KVNamespaceKeyInfo[];
  list_complete: boolean;
  cursor?: string;
}

export interface KVNamespaceKeyInfo {
  name: string;
  expiration?: number;
  metadata?: any;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

// Extend the global scope with Cloudflare Workers types
declare global {
  interface Request {
    cf: {
      country: string;
      colo: string;
      [key: string]: any;
    };
  }
}

export {};

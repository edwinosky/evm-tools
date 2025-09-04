# EVM Wallet Panel - Cloudflare Worker

This directory contains the Cloudflare Worker that provides backend services for the EVM Wallet Panel application. The worker uses Cloudflare KV to store user data including transaction history, generated accounts, and token addresses.

## Features

- User-specific data storage using Cloudflare KV
- REST API for storing and retrieving user data
- CORS support for cross-origin requests
- Health check endpoint for monitoring

## Endpoints

### GET /storage
Get all storage items for a wallet address.

**Headers:**
- `X-Wallet-Address`: The wallet address (required)

**Response:**
```json
{
  "transactionHistory": [...],
  "generatedAccounts": [...],
  "tokenAddresses": [...]
}
```

### POST /storage
Set a storage item for a wallet address.

**Headers:**
- `X-Wallet-Address`: The wallet address (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "key": "transactionHistory",
  "value": [...]
}
```

**Response:**
```json
{
  "success": true
}
```

### GET /storage/{key}
Get a specific storage item by key for a wallet address.

**Headers:**
- `X-Wallet-Address`: The wallet address (required)

**Response:**
```json
[...]
```

### DELETE /storage/{key}
Delete a specific storage item by key for a wallet address.

**Headers:**
- `X-Wallet-Address`: The wallet address (required)

**Response:**
```json
{
  "success": true
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "environment": "development"
}
```

## Development

### Prerequisites

- Node.js 18.x or later
- Wrangler CLI (`npm install -g wrangler`)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment

To deploy the worker to production:

```bash
npm run deploy
```

## Configuration

The worker is configured using the `wrangler.toml` file:

```toml
name = "evm-panel"
main = "src/index.ts"
compatibility_date = "2023-10-30"

[observability.logs]
enabled = true

# KV Namespace binding
[[kv_namespaces]]
binding = "EVM_PANEL_KV"
id = "db1d81cf8e2b4991bbe8af9a039e5974"
preview_id = "db1d81cf8e2b4991bbe8af9a039e5974"

[vars]
ENVIRONMENT = "development"
```

## Data Structure

User data is stored in Cloudflare KV with keys formatted as:
```
{walletAddress}:{key}
```

For example:
- `0x1234567890123456789012345678901234567890:transactionHistory`
- `0x1234567890123456789012345678901234567890:generatedAccounts`

## Security

- All requests must include a valid wallet address in the `X-Wallet-Address` header
- Wallet addresses are validated using a regex pattern
- CORS is enabled for all origins during development

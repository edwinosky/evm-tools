# EVM Wallet Panel

A comprehensive wallet management panel for EVM-compatible blockchains with support for both wallet connections (MetaMask, RainbowKit) and private key connections. This application allows users to manage tokens, view balances, create contracts and NFTs, and track transaction history.

## Features

- **Dual Connection Modes**: Connect via MetaMask/RainbowKit or private key
- **Multi-chain Support**: Works with Ethereum, BSC, Polygon, Arbitrum, Avalanche, Fantom, Optimism, and Base
- **Token Management**: Add and track ERC20 token balances
- **Contract Creation**: Deploy custom smart contracts
- **NFT Creation**: Mint new NFTs
- **Transaction History**: View and track all transactions
- **Cloudflare Integration**: Uses Cloudflare Workers and KV for global data storage
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### Frontend
- Built with Next.js 13+ (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- Wagmi for wallet interactions
- RainbowKit for wallet connection UI
- Viem for blockchain interactions

### Backend
- Cloudflare Workers for serverless functions
- Cloudflare KV for global data storage
- Custom Node.js server for private key operations

### Data Storage
- **Cloudflare KV**: User-specific data storage (transaction history, generated accounts, token addresses)
- **LocalStorage**: Temporary session data for private key connections
- **SessionStorage**: Temporary session data for wallet connections

## Cloudflare Integration

The application uses Cloudflare Workers and KV for global, low-latency data storage. Each user's data is stored with a key format of `{walletAddress}:{key}` to ensure data isolation.

### Worker Endpoints
- `GET /storage` - Get all user data
- `POST /storage` - Set a user data item
- `GET /storage/{key}` - Get a specific user data item
- `DELETE /storage/{key}` - Delete a specific user data item
- `GET /health` - Health check

## Setup

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Cloudflare account (for Workers and KV)

### Installation

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install worker dependencies:
   ```bash
   cd workers
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
```

### Development

1. Start the Next.js frontend:
   ```bash
   npm run dev
   ```

2. Start the Cloudflare Worker (in a separate terminal):
   ```bash
   cd workers
   npm run dev
   ```

3. Start the backend server (in a separate terminal):
   ```bash
   cd server
   npm start
   ```

### Deployment

1. Deploy the Cloudflare Worker:
   ```bash
   cd workers
   npm run deploy
   ```

2. Deploy the Next.js frontend to Vercel:
   ```bash
   npm run build
   npm run start
   ```

3. Deploy the backend server to your preferred hosting platform.

## Project Structure

```
evm-wallet-panel/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions and API clients
│   └── config/           # Configuration files
├── workers/              # Cloudflare Worker code
├── server/               # Backend server code
├── public/               # Static assets
└── styles/               # Global styles
```

## Key Components

### AppContext
Manages global application state including:
- Connection mode (wallet or private key)
- Wallet address and connection data
- Transaction history
- Generated accounts
- Token addresses

### BalancePanel
Displays native and ERC20 token balances for the connected wallet.

### TransactionPanel
Provides interfaces for sending transactions and interacting with contracts.

### HistoryPanel
Shows transaction history with links to blockchain explorers.

### GeneratedAccountsPanel
Manages accounts generated from private keys.

## Security

- Private keys are never stored in localStorage or Cloudflare KV
- Wallet addresses are validated before API requests
- CORS is properly configured for all endpoints
- Sensitive data is only stored in session storage (temporary)

## Troubleshooting

### Wallet Connection Issues
1. Ensure you're using a supported EVM-compatible wallet
2. Check that you're on a supported network
3. Clear browser cache and localStorage if experiencing persistent issues

### Balance Display Issues
1. Verify token contract addresses are correct
2. Ensure the token contract implements the standard ERC20 interface
3. Check network connectivity to the RPC endpoint

### Transaction Issues
1. Verify sufficient gas funds in the wallet
2. Check that the RPC endpoint is functioning correctly
3. Ensure contract addresses are correct for interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

MIT License - see LICENSE file for details.

# EVM Wallet Panel 🚀

A comprehensive **Web3 wallet management platform** for EVM-compatible blockchains with advanced **alpha project tracking** capabilities. Connect via MetaMask/RainbowKit or private keys to manage tokens, create contracts, NFTs, and discover emerging blockchain projects with our innovative **Panel Alpha** system.

## 🎯 Key Features

### 🌐 Core Wallet Features
- **Dual Connection Modes**: MetaMask/RainbowKit integration or private key authentication
- **Multi-chain Support**: Ethereum, BSC, Polygon, Arbitrum, Avalanche, Fantom, Optimism, Base
- **Token Management**: Add and track ERC20 token balances across chains
- **Contract Creation**: Deploy custom smart contracts with our compilation tools
- **NFT Creation**: Mint new NFTs with IPFS integration and custom metadata
- **Transaction History**: Comprehensive transaction tracking with explorer links
- **Cloudflare Backend**: Global data storage with Cloudflare Workers and KV

### 🆕 New: Panel Alpha - Alpha Project Tracking (v1.3.1)

**Revolutionary system for discovering and tracking blockchain alpha projects with advanced collaboration features.**

#### 📊 Project Discovery & Management
- **🗂️ Stateful Tabs System**: Multi-tab interface allowing simultaneous project tracking
- **🔍 Advanced Grid Filtering**: Search, categorize, and discover projects by blockchain category
- **🏷️ Intelligent Tagging**: Auto-suggested tags for project organization (#followup, #research, etc.)
- **📝 Personal Notes**: Individual project notes with privacy controls per user
- **📱 Social Timeline**: Discord + Twitter activity integration (mock data ready for APIs)

#### 👑 Administrative Panel (`/alphas/admin`)
- **🛡️ Role-Based Access**: Super Admin, Editor, Moderator, Viewer permissions
- **📋 CRUD Projects**: Complete project lifecycle management with approval workflows
- **👥 User Management**: Administrative user role assignment and oversight
- **📈 Analytics Dashboard**: Project metrics and system analytics
- **📝 Audit Logging**: Complete action tracking for compliance and security

#### 🎯 Collaboration & Workflows
- **✅ Approval Workflows**: Draft → Pending → Approved project lifecycles
- **🏆 Reputation System**: Community-driven project scoring and feedback
- **📂 Personal Tracking**: Individual watchlists and private project notes
- **🎨 Rich Editor**: Enhanced note-taking with tagging and formatting
- **🔗 Social Integration**: Direct links to Twitter, Discord, GitHub, Telegram

#### 🤖 Smart Features (Roadmap Prepared)
- **🤖 AI Matching**: Intelligent project discovery based on user interests
- **📊 Performance Analytics**: Project growth and community engagement metrics
- **🎯 Opportunity Scoring**: Airdrop and opportunity detection algorithms
- **🔔 Smart Notifications**: Personalized alerts for tracked projects

### 📱 Enhanced User Experience
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **🎨 Modern UI**: Tailwind CSS with dark/light mode preparation
- **⌨️ Keyboard Navigation**: Full keyboard accessibility and shortcuts
- **🚀 Performance**: Optimized rendering and API calls
- **🔧 Security**: Wallet-authenticated access with granular permissions

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

**Core Wallet Endpoints:**
- `GET /storage` - Get all user data
- `POST /storage` - Set a user data item
- `GET /storage/{key}` - Get a specific user data item
- `DELETE /storage/{key}` - Delete a specific user data item
- `GET /health` - Health check

**🚀 New Alpha Panel Endpoints (v1.3.1):**
- `GET/POST/DELETE /api/alphas/admin/projects` - Project CRUD with permissions
- `GET/POST /api/alphas/admin/roles` - User role management
- `GET /api/alphas/admin/users` - User management and permissions
- `GET /api/alphas/admin/analytics` - System analytics and metrics

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
│   ├── app/                          # Next.js app router pages
│   │   ├── alphas/                   # 🚀 ALPHA PANEL Routes
│   │   │   ├── admin/               # Admin dashboard
│   │   │   │   ├── page.tsx          # Admin panel main page
│   │   │   │   └── page.module.css   # Admin styles
│   │   │   └── page.tsx             # Public alphas page
│   │   ├── components/               # All UI components
│   │   │   └── alphas/              # 🚀 ALPHA PANEL Components
│   │   │       ├── ProjectDetail.tsx    # Project detail view
│   │   │       ├── ProjectsGrid.tsx     # Projects grid with filtering
│   │   │       ├── ProjectsPanel.tsx    # Admin projects management
│   │   │       ├── NotesManager.tsx     # Personal notes system
│   │   │       ├── SocialTimeline.tsx   # Social media timeline
│   │   │       ├── TabBar.tsx          # Stateful tabs system
│   │   │       └── AdminSidebar.tsx    # Admin navigation
│   │   ├── context/                 # React context providers
│   │   │   ├── TabContext.tsx       # 🚀 Tabs state management
│   │   │   └── AlphaContext.tsx     # 🚀 Alpha panel context
│   │   ├── lib/                     # Utility functions and API clients
│   │   │   └── alphas-api.ts        # 🚀 Alpha panel API client
│   │   └── config/                  # Configuration files
├── workers/                          # Cloudflare Worker code
│   └── src/
│       └── index.ts                  # 🚀 Extended with alpha endpoints
├── server/                           # Backend server code
├── roadmap.txt                       # 🚀 Detailed project roadmap
├── CHANGELOG.md                      # 🚀 Version history
├── README.md                         # This file
├── public/                           # Static assets
└── styles/                           # Global styles
```

### Key Components (Updated with Alpha Panel)

#### Core Wallet Components
- **AppContext**: Manages global application state including connected wallet data
- **BalancePanel**: Native and ERC20 token balance display
- **TransactionPanel**: Transaction creation and contract interaction
- **HistoryPanel**: Transaction history with explorer links
- **GeneratedAccountsPanel**: Private key account management

#### 🚀 New Alpha Panel Components (v1.3.1)
- **TabContext**: Stateful tabs management with localStorage persistence
- **ProjectsGrid**: Advanced project discovery with filtering and infinite scroll
- **ProjectDetail**: Comprehensive project view with notes and social timeline
- **NotesManager**: Personal note-taking system with tagging and privacy
- **SocialTimeline**: Discord/Twitter activity feeds (API-ready)
- **AdminSidebar**: Administrative navigation with role-based access

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

## 📋 Roadmap & Progress

### Current Version: v1.3.1

**Completed Features (7/15 phases - 47% progress):**
- ✅ **Phase 1**: Infrastructure + Admin Panel (100% complete)
- ✅ **Phase 2**: Projects List + Tabs System (100% complete)
- ✅ **Phase 3**: Project Detail + Notes (100% complete)
- 🚧 **Phase 4**: Web Scraping + Social APIs (0% - Ready for implementation)

**Documentation:**
- 📖 **[Reading ROADMAP](roadmap.txt)**: Detailed development plan and specifications
- 📝 **[Change History](CHANGELOG.md)**: Version-specific changes and improvements
- 🐛 **Bug Reports**: Comprehensive incident resolution log in roadmap.txt

### Upcoming Features

#### Q4 2025 (Phases 4-7)
- 🤖 **AI-Powered Project Discovery**: Smart filtering and recommendation algorithms
- 📊 **Advanced Analytics**: Project performance metrics and trend analysis
- 🎯 **Opportunity Scoring**: Airdrop detection and opportunity alerts
- 🔗 **Full Social Integration**: Live Discord/Twitter webhooks and automation

## 🤝 Contributing

### Repository
🐙 **[GitHub: edwinosky/evm-tools](https://github.com/edwinosky/evm-tools)**

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode requirements
- Maintain comprehensive test coverage
- Update CHANGELOG.md for all changes
- Ensure mobile-first responsive design
- Follow established naming conventions

### Issue Tracking
- 🐛 **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- 💡 **Feature Requests**: Label with `enhancement` tag
- 📚 **Documentation**: Update README.md and roadmap.txt for new features

## 📜 License

MIT License - see LICENSE file for details.

---

<p align="center">
  <strong>Built with ❤️ for the Web3 Community</strong><br>
  🇪🇸 Proudly built in Spanish-speaking community
</p>

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Cloudflare Workers integration for global data storage
- Cloudflare KV implementation for user-specific data storage
- Custom storage client for Cloudflare KV API
- Worker endpoints for storing and retrieving user data
- Documentation for Cloudflare integration
- README files for main project and workers directory
- LICENSE file

### Changed
- Updated AppContext to use Cloudflare KV for data persistence
- Modified BalancePanel to use context for wallet address
- Updated HistoryPanel to use context for transaction history
- Simplified wagmi configuration by removing custom storage
- Updated .gitignore to exclude worker dependencies

### Fixed
- Resolved localStorage persistence issues with wallet connections
- Fixed token balance display errors
- Addressed transaction history persistence across sessions
- Corrected wallet address validation in API requests

### Removed
- Removed localStorage dependency for user data storage
- Eliminated localStorage-based session management for user data

## [1.0.0] - 2025-08-03

### Added
- Initial release of EVM Wallet Panel
- Dual connection modes (MetaMask/RainbowKit and private key)
- Multi-chain support (Ethereum, BSC, Polygon, Arbitrum, Avalanche, Fantom, Optimism, Base)
- Token management and balance display
- Contract creation functionality
- NFT creation functionality
- Transaction history tracking
- Responsive design with Tailwind CSS
- Next.js 13+ App Router implementation
- TypeScript type safety
- Wagmi and RainbowKit integration
- Viem blockchain interaction library
- Custom Node.js backend server

[Unreleased]: https://github.com/your-org/evm-wallet-panel/compare/v1.0.0...HEAD

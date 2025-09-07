'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'es' | 'zh' | 'ko';

// Complete translations consolidated in single file
const translations = {
  en: {
    common: {
      welcome: 'Welcome',
      loading: 'Loading...',
      connect: 'Connect',
      disconnect: 'Disconnect',
      cancel: 'Cancel',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error',
      retry: 'Retry',
      close: 'Close',
      // Panel translations
      transactionHistory: 'Transaction History',
      actions: 'Actions',
      openHistoryPanel: 'Open history panel',
      openActionPanel: 'Open action panel',
      closePanel: 'Close panel',
      openPanel: 'Open panel',
      noTransactionsYet: 'No transactions yet.',
      clearTransactionHistoryConfirm: 'Are you sure you want to clear all transaction history? This action cannot be undone.',
      clearAllHistory: 'Clear All History',
      hash: 'Hash:',
      contract: 'Contract:',
      copied: 'Copied!',
      deleteTransaction: 'Delete Transaction',
      interact: 'Interact',
      // Transaction types
      sendPrefix: 'Send',
      deployPrefix: 'Deploy',
      mintPrefix: 'Mint',
      transferPrefix: 'Transfer',
      burnPrefix: 'Burn',
      interactionType: 'Interaction',
      approvePrefix: 'Approve',
      // Specific transaction types
      deployAirdropStandard: 'Deploy Airdrop Standard',
      deployAirdropWithFee: 'Deploy Airdrop With Fee',
      deployAirdropVesting: 'Deploy Airdrop Vesting',
      deployAirdropStaking: 'Deploy Airdrop Staking',
      deployAirdropWithdraw: 'Deploy Airdrop Withdraw',
      sendTxType: 'Send Transaction',
      deployTxType: 'Deploy Contract',
      mintInteraction: 'Mint Interaction',
      transferInteraction: 'Transfer Interaction',
      burnInteraction: 'Burn Interaction',
      approveInteraction: 'Approve Interaction',
      createTokenInteraction: 'Create Token Interaction',
      createNftInteraction: 'Create NFT Interaction',
      airdropInteraction: 'Airdrop Interaction'
    },
    balance: {
      // BalancePanel main elements
      panelTitle: 'Balances',
      connectWalletMessage: 'Please connect your wallet to see balances.',
      discoveringMessage: 'Discovering and loading balances...',
      discoveryFailed: 'Discovery failed. You may see partial results.',
      noBalancesFound: 'No token balances found for this address.',
      loading: 'Loading...',
      // Buttons
      discoveringTokens: '🔍 Discovering...',
      discoverTokens: '🔍 Discover Tokens',
      addingToken: 'Adding...',
      addToken: 'Add',
      // Input placeholders
      addTokenPlaceholder: 'Add token by address...',
      // Error messages
      errorPrefix: 'Error:',
      invalidAddress: 'Please enter a valid contract address.',
      addressAlreadyAdded: 'This address has already been added.',
      rpcNotAvailable: 'RPC URL is not available. Cannot verify contract type.',
      unsupportedContractType: 'Could not determine contract type, or it is not a supported token/NFT standard.',
      // Labels
      nativeToken: 'Native Token',
      unknownToken: 'Unknown Token'
    },
    generatedAccounts: {
      // GeneratedAccountsPanel
      panelTitle: 'Generated Accounts',
      generatingAccount: 'Generating...',
      generateNewAccount: 'Generate New Account',
      noAccountsGenerated: 'No accounts generated yet.',
      address: 'Address:',
      privateKey: 'Private Key:'
    },
    nav: {
      home: 'Home',
      balance: 'Balance',
      createToken: 'Create Token',
      createNft: 'Create NFT',
      airdropTools: 'Airdrop Tools',
      connectWallet: 'Connect Wallet',
      connectPrivateKey: 'Connect with Private Key',
      rescueDapp: 'Rescue DApp',
      disconnect: 'Disconnect'
    },
    home: {
      welcomeTitle: 'Welcome to EVM Tools',
      welcomeDescription: 'EVM Tools is a comprehensive decentralized application that empowers you to create, deploy, and interact with various smart contracts on EVM-compatible blockchains. This platform provides an intuitive interface for managing your blockchain assets and transactions.',
      keyFeatures: 'Key Features',
      tokenCreationTitle: 'Token Creation',
      tokenCreationDesc: 'Create your own custom ERC-20 tokens with just a few clicks. Configure token name, symbol, supply, and advanced features like minting, burning, and permit functionality. Deploy directly from the app and start using your tokens immediately.',
      nftCreationTitle: 'NFT Creation',
      nftCreationDesc: 'Mint custom ERC-721 NFTs with your own metadata and images. Create unique digital assets and deploy them to the blockchain. Perfect for artists, collectors, and creators looking to launch their own NFT collections.',
      airdropContractsTitle: 'Airdrop Contracts',
      airdropContractsDesc: 'Deploy and configure airdrop contracts for your tokens. Set up claim periods, manage owner controls, and distribute tokens to your community efficiently. The airdrop interface allows you to easily manage all aspects of your distribution campaign.',
      tokenInteractionTitle: 'Token Interaction',
      tokenInteractionDesc: 'Send tokens to other addresses, check balances, and interact with existing smart contracts. The intuitive interface makes it easy to perform transactions and manage your assets across different networks.',
      dashboardMessage: 'This dashboard serves as your central control panel. Select an asset from your balances to get started, or use the actions panel on the right to create new assets. Your transaction history is available in the panel on the left.',
      developmentMessage: "We're actively working to add more features and tools to expand the platform's capabilities. Stay tuned for updates!"
    },
    actions: {
      panelTitle: 'Actions',
      connectWalletMessage: 'Connect a wallet to begin',
      selectAssetMessage: 'Select an asset to see actions',
      selectedPrefix: 'Selected',
      sendTokenButton: 'Send',
      transferNftButton: 'Transfer NFT',
      interactContractButton: 'Interact with Contract',
      viewBalancesButton: 'View Balances',
      createTokenButton: 'Create Token',
      createNftButton: 'Create NFT',
      airdropToolsButton: 'Airdrop Tools',
      loadingMessage: 'Loading actions...',
      nativeSymbol: 'Native'
    },
    airdropPage: {
      // AirdropPage
      title: 'Airdrop Tools',
      connectWalletMessage: 'Please connect your wallet to manage airdrops.',
      loadContractPlaceholder: 'Enter contract address to load',
      loadButton: 'Load',
      hideDeployButton: 'Hide Deploy',
      deployNewButton: 'Deploy New',
      newContractDeployedMessage: 'New %deployedContractType% contract deployed at %address%',
      detectingContractTypeMessage: 'Detecting contract type for %address%...',
      invalidAddressError: 'Error: Invalid address provided.',
      contractTypeDetectedMessage: 'Contract type detected: %type%. You can now interact with it.',
      actionReceivedMessage: 'Action received. Refreshing data...',
      contractInfoTitle: 'Contract Information',
      addressLabel: 'Address:',
      setupStatusLabel: 'Setup:',
      yes: 'Yes',
      no: 'No',
      tokenLabel: 'Token:',
      decimalsLabel: 'Decimals:',
      totalAllocatedLabel: 'Total Allocated:',
      totalClaimedLabel: 'Total Claimed:',
      vestingStartLabel: 'Vesting Start:',
      vestingDurationLabel: 'Vesting Duration:',
      stakingContractLabel: 'Staking Contract:',
      snapshotBlockLabel: 'Snapshot Block:',
      feeTokenLabel: 'Fee Token:',
      claimFeeLabel: 'Claim Fee:',
      // DeployPanel
      walletRequiredError: 'Wallet connection is required to deploy.',
      fieldsRequiredError: 'Token address and airdrop end date are required.',
      vestingDateRequiredError: 'Vesting end date is required for this contract type.',
      vestingDateFutureError: 'Vesting end date must be in the future.',
      deployTransactionMessage: 'Deploying transaction for',
      feeConfigMessage: 'Contract deployed. Now configuring fee settings...',
      deploySuccessMessage: 'Contract deployed successfully',
      feeConfigSuccessMessage: 'Fee settings configured successfully!',
      transactionRejected: 'Transaction rejected by user.',
      deployErrorMessage: 'Deployment Error: ',
      panelTitle: 'Deploy New Airdrop Contract',
      panelDescription: 'Select a contract type and fill in the details to deploy.',
      contractTypeLabel: 'Contract Type',
      tokenAddressLabel: 'Airdrop Token Address',
      airdropDateLabel: 'Airdrop End Date',
      vestingDateLabel: 'Vesting End Date',
      feeTypeLabel: 'Fee Type',
      nativeOption: 'Native (ETH, MATIC, etc.)',
      erc20Option: 'ERC20 Token',
      feeTokenAddressLabel: 'Fee Token Address',
      feeAmountLabel: 'Fee Amount',
      feeAmountPlaceholder: 'e.g., 0.1',
      deployWaiting: 'Waiting for approval...',
      deployConfirming: 'Confirming deployment...',
      deployButton: 'Deploy Contract',
      gasWarning: 'A gas fee will be charged for this transaction.',
      // OwnerPanel
      ownerPanelTitle: 'Owner Panel',
      transactionSuccess: 'Transaction confirmed successfully!',
      transactionError: 'Error: ',
      invalidAllocations: 'Error: Check beneficiary addresses and ensure lists match.',
      invalidAmount: 'Error: Invalid amount provided.',
      addingAllocations: 'Adding allocations...',
      fundingContract: 'Transferring %amount% tokens to the contract...',
      withdrawingUnclaimed: 'Withdrawing unclaimed tokens...',
      emergencyWithdrawing: 'Performing emergency withdrawal...',
      step1Title: 'Step 1: Add Allocations',
      step1Description: 'Define who receives tokens and how many. Separate addresses and amounts with commas.',
      beneficiariesPlaceholder: 'Beneficiary addresses (0x..., 0x...)',
      amountsPlaceholder: 'Amounts (100.5, 50, ...)',
      addAllocationButton: 'Add Allocations',
      processing: 'Processing...',
      step2Title: 'Step 2: Fund Airdrop Contract',
      step2Description: 'Transfer tokens from your wallet to the contract so they can be claimed.',
      currentBalance: 'Current contract balance:',
      fundAmountPlaceholder: 'Amount to fund',
      fundButton: 'Fund Contract',
      contractManagementTitle: 'Contract Management',
      withdrawUnclaimedButton: 'Withdraw Unclaimed',
      emergencyTokenPlaceholder: 'Token address (for emergency withdrawal)',
      emergencyWithdrawButton: 'Emergency Withdraw',
      // UserPanel
      userPanel_title: 'User Panel',
      userPanel_successMessage: 'Action completed successfully!',
      userPanel_errorPrefix: 'Error: ',
      userPanel_withdrawButton: 'Withdraw',
      userPanel_claimVestButton: 'Claim Vested Tokens',
      userPanel_claimStakingButton: 'Claim Staking Rewards',
      userPanel_claimTokensButton: 'Claim Tokens',
      userPanel_noAllocationMessage: 'You have no allocation to claim.',
      userPanel_alreadyClaimedMessage: 'You have already claimed your tokens.',
      userPanel_processingMessage: 'Processing your request...',
      userPanel_totalAllocationPrefix: 'Your Total Allocation',
      userPanel_claimableVestedPrefix: 'Claimable (Vested)',
      userPanel_claimablePrefix: 'Your Claimable Amount',
      userPanel_claimedPrefix: 'Claimed',
      userPanel_yes: 'Yes',
      userPanel_no: 'No',
      userPanel_processing: 'Processing...',
      userPanel_noTokensMessage: 'You are not eligible for this airdrop or have no tokens to claim at this time.'
    }
  },
  es: {
    common: {
      welcome: 'Bienvenido',
      loading: 'Cargando...',
      connect: 'Conectar',
      disconnect: 'Desconectar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      success: 'Éxito',
      error: 'Error',
      retry: 'Reintentar',
      close: 'Cerrar',
      // Panel translations
      transactionHistory: 'Historial de Transacciones',
      actions: 'Acciones',
      openHistoryPanel: 'Abrir panel de historial',
      openActionPanel: 'Abrir panel de acciones',
      closePanel: 'Cerrar panel',
      openPanel: 'Abrir panel',
      noTransactionsYet: 'Aún no hay transacciones.',
      clearTransactionHistoryConfirm: '¿Estás seguro de que quieres borrar todo el historial de transacciones? Esta acción no se puede deshacer.',
      clearAllHistory: 'Borrar Todo el Historial',
      hash: 'Hash:',
      contract: 'Contrato:',
      copied: '¡Copiado!',
      deleteTransaction: 'Eliminar Transacción',
      interact: 'Interactuar',
      // Transaction types
      sendPrefix: 'Enviar',
      deployPrefix: 'Desplegar',
      mintPrefix: 'Acuñar',
      transferPrefix: 'Transferir',
      burnPrefix: 'Quemar',
      interactionType: 'Interacción',
      approvePrefix: 'Aprobar',
      // Specific transaction types
      deployAirdropStandard: 'Desplegar Airdrop Estándar',
      deployAirdropWithFee: 'Desplegar Airdrop con Tarifa',
      deployAirdropVesting: 'Desplegar Airdrop Vesting',
      deployAirdropStaking: 'Desplegar Airdrop Staking',
      deployAirdropWithdraw: 'Desplegar Airdrop Withdraw',
      sendTxType: 'Transacción de Envío',
      deployTxType: 'Desplegar Contrato',
      mintInteraction: 'Interacción de Acuñación',
      transferInteraction: 'Interacción de Transferencia',
      burnInteraction: 'Interacción de Quema',
      approveInteraction: 'Interacción de Aprobación',
      createTokenInteraction: 'Interacción de Crear Token',
      createNftInteraction: 'Interacción de Crear NFT',
      airdropInteraction: 'Interacción de Airdrop'
    },
    balance: {
      // BalancePanel main elements
      panelTitle: 'Balances',
      connectWalletMessage: 'Por favor conecta tu billetera para ver balances.',
      discoveringMessage: 'Descubriendo y cargando balances...',
      discoveryFailed: 'Descubrimiento falló. Puede que veas resultados parciales.',
      noBalancesFound: 'No se encontraron balances de token para esta dirección.',
      loading: 'Cargando...',
      // Buttons
      discoveringTokens: '🔍 Descubriendo...',
      discoverTokens: '🔍 Descubrir Tokens',
      addingToken: 'Agregando...',
      addToken: 'Agregar',
      // Input placeholders
      addTokenPlaceholder: 'Agregar token por dirección...',
      // Error messages
      errorPrefix: 'Error:',
      invalidAddress: 'Por favor ingresa una dirección de contrato válida.',
      addressAlreadyAdded: 'Esta dirección ya ha sido agregada.',
      rpcNotAvailable: 'URL de RPC no está disponible. No se puede verificar el tipo de contrato.',
      unsupportedContractType: 'No se pudo determinar el tipo de contrato, o no es un estándar de token/NFT soportado.',
      // Labels
      nativeToken: 'Token Nativo',
      unknownToken: 'Token Desconocido'
    },
    generatedAccounts: {
      // GeneratedAccountsPanel
      panelTitle: 'Cuentas Generadas',
      generatingAccount: 'Generando...',
      generateNewAccount: 'Generar Nueva Cuenta',
      noAccountsGenerated: 'Aún no hay cuentas generadas.',
      address: 'Dirección:',
      privateKey: 'Clave Privada:'
    },
    nav: {
      home: 'Inicio',
      balance: 'Balance',
      createToken: 'Crear Token',
      createNft: 'Crear NFT',
      airdropTools: 'Herramientas de Airdrop',
      connectWallet: 'Conectar Billetera',
      connectPrivateKey: 'Conectar con Clave Privada',
      rescueDapp: 'DApp de Rescate',
      disconnect: 'Desconectar'
    },
    home: {
      welcomeTitle: 'Bienvenido a EVM Tools',
      welcomeDescription: 'EVM Tools es una aplicación descentralizada completa que te permite crear, desplegar e interactuar con varios contratos inteligentes en blockchains compatibles con EVM. Esta plataforma proporciona una interfaz intuitiva para gestionar tus activos y transacciones blockchain.',
      keyFeatures: 'Características Principales',
      tokenCreationTitle: 'Creación de Tokens',
      tokenCreationDesc: 'Crea tus propios tokens ERC-20 personalizados con solo unos clics. Configura nombre del token, símbolo, suministro y funciones avanzadas como minteo, quema y funcionalidad de permiso. Despliega directamente desde la app y comienza a usar tus tokens inmediatamente.',
      nftCreationTitle: 'Creación de NFT',
      nftCreationDesc: 'Acuña NFTs ERC-721 personalizados con tus propios metadatos e imágenes. Crea activos digitales únicos y despliégulos en la blockchain. Perfecto para artistas, coleccionistas y creadores que buscan lanzar sus propias colecciones NFT.',
      airdropContractsTitle: 'Contratos de Airdrop',
      airdropContractsDesc: 'Despliega y configura contratos de airdrop para tus tokens. Configura períodos de reclamo, gestiona controles de propietario y distribuye tokens a tu comunidad eficientemente. La interfaz de airdrop te permite gestionar fácilmente todos los aspectos de tu campaña de distribución.',
      tokenInteractionTitle: 'Interacción con Tokens',
      tokenInteractionDesc: 'Envía tokens a otras direcciones, verifica balances e interactúa con contratos inteligentes existentes. La interfaz intuitiva facilita la realización de transacciones y la gestión de tus activos en diferentes redes.',
      dashboardMessage: 'Este panel de control sirve como tu centro de control principal. Selecciona un activo de tus balances para comenzar, o usa el panel de acciones a la derecha para crear nuevos activos. Tu historial de transacciones está disponible en el panel de la izquierda.',
      developmentMessage: '¡Estamos trabajando activamente en agregar más funciones y herramientas para expandir las capacidades de la plataforma. Mantente atento a las actualizaciones!'
    },
    actions: {
      panelTitle: 'Acciones',
      connectWalletMessage: 'Conecta una billetera para comenzar',
      selectAssetMessage: 'Selecciona un activo para ver acciones',
      selectedPrefix: 'Seleccionado',
      sendTokenButton: 'Enviar',
      transferNftButton: 'Transferir NFT',
      interactContractButton: 'Interactuar con Contrato',
      viewBalancesButton: 'Ver Balances',
      createTokenButton: 'Crear Token',
      createNftButton: 'Crear NFT',
      airdropToolsButton: 'Herramientas de Airdrop',
      loadingMessage: 'Cargando acciones...',
      nativeSymbol: 'Nativo'
    },
    airdropPage: {
      // AirdropPage
      title: 'Herramientas de Airdrop',
      connectWalletMessage: 'Por favor, conecta tu billetera para gestionar los airdrops.',
      loadContractPlaceholder: 'Ingresa la dirección del contrato para cargar',
      loadButton: 'Cargar',
      hideDeployButton: 'Ocultar Despliegue',
      deployNewButton: 'Desplegar Nuevo',
      newContractDeployedMessage: 'Nuevo contrato %deployedContractType% desplegado en %address%',
      detectingContractTypeMessage: 'Detectando tipo de contrato para %address%...',
      invalidAddressError: 'Error: La dirección proporcionada no es válida.',
      contractTypeDetectedMessage: 'Tipo de contrato detectado: %type%. Ahora puedes interactuar con él.',
      actionReceivedMessage: 'Acción recibida. Actualizando datos...',
      contractInfoTitle: 'Información del Contrato',
      addressLabel: 'Dirección:',
      setupStatusLabel: 'Configurado:',
      yes: 'Sí',
      no: 'No',
      tokenLabel: 'Token:',
      decimalsLabel: 'Decimales:',
      totalAllocatedLabel: 'Total Asignado:',
      totalClaimedLabel: 'Total Reclamado:',
      vestingStartLabel: 'Inicio de Vesting:',
      vestingDurationLabel: 'Duración de Vesting:',
      stakingContractLabel: 'Contrato de Staking:',
      snapshotBlockLabel: 'Bloque de Snapshot:',
      feeTokenLabel: 'Token de Tarifa:',
      claimFeeLabel: 'Tarifa de Reclamo:',
      // DeployPanel
      walletRequiredError: 'Se requiere conexión con la billetera para desplegar.',
      fieldsRequiredError: 'La dirección del token y la fecha de finalización del airdrop son obligatorias.',
      vestingDateRequiredError: 'La fecha de finalización del vesting es obligatoria para este tipo de contrato.',
      vestingDateFutureError: 'La fecha de finalización del vesting debe ser en el futuro.',
      deployTransactionMessage: 'Desplegando transacción para',
      feeConfigMessage: 'Contrato desplegado. Ahora configurando las tarifas...',
      deploySuccessMessage: 'Contrato desplegado exitosamente',
      feeConfigSuccessMessage: '¡Configuración de tarifas exitosa!',
      transactionRejected: 'Transacción rechazada por el usuario.',
      deployErrorMessage: 'Error de Despliegue: ',
      panelTitle: 'Desplegar Nuevo Contrato de Airdrop',
      panelDescription: 'Selecciona un tipo de contrato y completa los detalles para desplegar.',
      contractTypeLabel: 'Tipo de Contrato',
      tokenAddressLabel: 'Dirección del Token del Airdrop',
      airdropDateLabel: 'Fecha de Finalización del Airdrop',
      vestingDateLabel: 'Fecha de Finalización del Vesting',
      feeTypeLabel: 'Tipo de Tarifa',
      nativeOption: 'Nativo (ETH, MATIC, etc.)',
      erc20Option: 'Token ERC20',
      feeTokenAddressLabel: 'Dirección del Token de Tarifa',
      feeAmountLabel: 'Monto de la Tarifa',
      feeAmountPlaceholder: 'ej: 0.1',
      deployWaiting: 'Esperando aprobación...',
      deployConfirming: 'Confirmando despliegue...',
      deployButton: 'Desplegar Contrato',
      gasWarning: 'Se cobrará una tarifa de gas por esta transacción.',
      // OwnerPanel
      ownerPanelTitle: 'Panel del Propietario',
      transactionSuccess: '¡Transacción confirmada exitosamente!',
      transactionError: 'Error: ',
      invalidAllocations: 'Error: Verifica las direcciones de los beneficiarios y asegúrate de que las listas coincidan.',
      invalidAmount: 'Error: Monto inválido proporcionado.',
      addingAllocations: 'Agregando asignaciones...',
      fundingContract: 'Transfiriendo %amount% tokens al contrato...',
      withdrawingUnclaimed: 'Retirando tokens no reclamados...',
      emergencyWithdrawing: 'Realizando retiro de emergencia...',
      step1Title: 'Paso 1: Agregar Asignaciones',
      step1Description: 'Define quién recibe tokens y cuántos. Separa las direcciones y los montos con comas.',
      beneficiariesPlaceholder: 'Direcciones de beneficiarios (0x..., 0x...)',
      amountsPlaceholder: 'Montos (100.5, 50, ...)',
      addAllocationButton: 'Agregar Asignaciones',
      processing: 'Procesando...',
      step2Title: 'Paso 2: Fondear Contrato de Airdrop',
      step2Description: 'Transfiere los tokens desde tu billetera al contrato para que puedan ser reclamados.',
      currentBalance: 'Balance actual del contrato:',
      fundAmountPlaceholder: 'Cantidad a fondear',
      fundButton: 'Fondear Contrato',
      contractManagementTitle: 'Gestión del Contrato',
      withdrawUnclaimedButton: 'Retirar No Reclamados',
      emergencyTokenPlaceholder: 'Dirección del token (para retiro de emergencia)',
      emergencyWithdrawButton: 'Retiro de Emergencia',
      // UserPanel
      userPanel_title: 'Panel de Usuario',
      userPanel_successMessage: '¡Acción completada exitosamente!',
      userPanel_errorPrefix: 'Error: ',
      userPanel_withdrawButton: 'Retirar',
      userPanel_claimVestButton: 'Reclamar Tokens de Vesting',
      userPanel_claimStakingButton: 'Reclamar Recompensas de Staking',
      userPanel_claimTokensButton: 'Reclamar Tokens',
      userPanel_noAllocationMessage: 'No tienes una asignación para reclamar.',
      userPanel_alreadyClaimedMessage: 'Ya has reclamado tus tokens.',
      userPanel_processingMessage: 'Procesando tu solicitud...',
      userPanel_totalAllocationPrefix: 'Tu Asignación Total',
      userPanel_claimableVestedPrefix: 'Reclamable (Vesting)',
      userPanel_claimablePrefix: 'Tu Monto Reclamable',
      userPanel_claimedPrefix: 'Reclamado',
      userPanel_yes: 'Sí',
      userPanel_no: 'No',
      userPanel_processing: 'Procesando...',
      userPanel_noTokensMessage: 'No eres elegible para este airdrop o no tienes tokens para reclamar en este momento.'
    }
  },
  zh: {
    common: {
      welcome: '欢迎',
      loading: '加载中...',
      connect: '连接',
      disconnect: '断开连接',
      cancel: '取消',
      confirm: '确认',
      success: '成功',
      error: '错误',
      retry: '重试',
      close: '关闭',
      // Panel translations
      transactionHistory: '交易历史',
      actions: '操作',
      openHistoryPanel: '打开历史面板',
      openActionPanel: '打开操作面板',
      closePanel: '关闭面板',
      openPanel: '打开面板',
      noTransactionsYet: '暂无交易。',
      clearTransactionHistoryConfirm: '您确定要清除所有交易历史吗？此操作无法撤销。',
      clearAllHistory: '清除所有历史',
      hash: '哈希：',
      contract: '合约：',
      copied: '已复制！',
      deleteTransaction: '删除交易',
      interact: '交互',
      // Transaction types
      sendPrefix: '发送',
      deployPrefix: '部署',
      mintPrefix: '铸造',
      transferPrefix: '转让',
      burnPrefix: '销毁',
      interactionType: '交互',
      approvePrefix: '批准',
      // Specific transaction types
      deployAirdropStandard: '部署标准空投',
      deployAirdropWithFee: '部署带费空投',
      deployAirdropVesting: '部署归属空投',
      deployAirdropStaking: '部署质押空投',
      deployAirdropWithdraw: '部署提取空投',
      sendTxType: '发送交易',
      deployTxType: '部署合约',
      mintInteraction: '铸造交互',
      transferInteraction: '转让交互',
      burnInteraction: '销毁交互',
      approveInteraction: '批准交互',
      createTokenInteraction: '创建代币交互',
      createNftInteraction: '创建NFT交互',
      airdropInteraction: '空投交互'
    },
    nav: {
      home: '首页',
      balance: '余额',
      createToken: '创建代币',
      createNft: '创建NFT',
      airdropTools: '空投工具',
      connectWallet: '连接钱包',
      connectPrivateKey: '使用私钥连接',
      rescueDapp: '救援DApp',
      disconnect: '断开连接'
    },
    home: {
      welcomeTitle: '欢迎使用 EVM Tools',
      welcomeDescription: 'EVM Tools 是一个全面的去中心化应用程序，让您能够创建、部署并与 EVM 兼容区块链上的各种智能合约进行交互。该平台提供直观的界面来管理您的区块链资产和交易。',
      keyFeatures: '主要功能',
      tokenCreationTitle: '代币创建',
      tokenCreationDesc: '只需几次点击即可创建您自己的自定义 ERC-20 代币。配置代币名称、符号、供应量以及高级功能，如铸造、销毁和许可功能。直接从应用中部署并开始立即使用您的代币。',
      nftCreationTitle: 'NFT 创建',
      nftCreationDesc: '使用您自己的元数据和图像铸造自定义 ERC-721 NFT。创建独特的数字资产并将其部署到区块链上。非常适合艺术家、收藏家和希望推出自己 NFT 系列的创作者。',
      airdropContractsTitle: '空投合约',
      airdropContractsDesc: '为您的代币部署和配置空投合约。设置领取期、管理所有者控制，并高效地为您的社区分发代币。空投界面让您轻松管理分发活动的各个方面。',
      tokenInteractionTitle: '代币交互',
      tokenInteractionDesc: '将代币发送到其他地址、检查余额并与现有的智能合约进行交互。直观的界面让您可以轻松进行交易并在不同网络上管理资产。',
      dashboardMessage: '此仪表板作为您的中央控制面板。从您的余额中选择资产开始，或者使用右侧的操作面板创建新资产。您的交易历史可在左侧面板中查看。',
      developmentMessage: '我们正在积极工作以添加更多功能和工具来扩展平台的功能。敬请关注更新！'
    },
    actions: {
      panelTitle: '操作',
      connectWalletMessage: '连接钱包开始',
      selectAssetMessage: '选择资产查看操作',
      selectedPrefix: '已选择',
      sendTokenButton: '发送',
      transferNftButton: '转让 NFT',
      interactContractButton: '与合约交互',
      viewBalancesButton: '查看余额',
      createTokenButton: '创建代币',
      createNftButton: '创建 NFT',
      airdropToolsButton: '空投工具',
      loadingMessage: '加载操作中...',
      nativeSymbol: '原生'
    },
    airdropPage: {
      // AirdropPage
      title: '空投工具',
      connectWalletMessage: '请连接您的钱包以管理空投。',
      loadContractPlaceholder: '输入合约地址以加载',
      loadButton: '加载',
      hideDeployButton: '隐藏部署',
      deployNewButton: '部署新的',
      newContractDeployedMessage: '新的 %deployedContractType% 合约已部署在 %address%',
      detectingContractTypeMessage: '正在检测 %address% 的合约类型...',
      invalidAddressError: '错误：提供的地址无效。',
      contractTypeDetectedMessage: '检测到合约类型: %type%。您现在可以与其交互。',
      actionReceivedMessage: '已收到操作。正在刷新数据...',
      contractInfoTitle: '合约信息',
      addressLabel: '地址:',
      setupStatusLabel: '设置:',
      yes: '是',
      no: '否',
      tokenLabel: '代币:',
      decimalsLabel: '小数位数:',
      totalAllocatedLabel: '总分配:',
      totalClaimedLabel: '总已领取:',
      vestingStartLabel: '归属开始:',
      vestingDurationLabel: '归属持续时间:',
      stakingContractLabel: '质押合约:',
      snapshotBlockLabel: '快照区块:',
      feeTokenLabel: '费用代币:',
      claimFeeLabel: '领取费用:',
      // DeployPanel
      walletRequiredError: '部署需要连接钱包。',
      fieldsRequiredError: '需要代币地址和空投结束日期。',
      vestingDateRequiredError: '此合约类型需要归属结束日期。',
      vestingDateFutureError: '归属结束日期必须在未来。',
      deployTransactionMessage: '正在部署交易',
      feeConfigMessage: '合约已部署。正在配置文件...',
      deploySuccessMessage: '合约部署成功',
      feeConfigSuccessMessage: '费用设置配置成功！',
      transactionRejected: '用户拒绝了交易。',
      deployErrorMessage: '部署错误: ',
      panelTitle: '部署新的空投合约',
      panelDescription: '选择合约类型并填写详细信息以进行部署。',
      contractTypeLabel: '合约类型',
      tokenAddressLabel: '空投代币地址',
      airdropDateLabel: '空投结束日期',
      vestingDateLabel: '归属结束日期',
      feeTypeLabel: '费用类型',
      nativeOption: '原生 (ETH, MATIC, 等)',
      erc20Option: 'ERC20 代币',
      feeTokenAddressLabel: '费用代币地址',
      feeAmountLabel: '费用金额',
      feeAmountPlaceholder: '例如 0.1',
      deployWaiting: '等待批准...',
      deployConfirming: '确认部署中...',
      deployButton: '部署合约',
      gasWarning: '此交易将收取燃料费。',
      // OwnerPanel
      ownerPanelTitle: '所有者面板',
      transactionSuccess: '交易确认成功！',
      transactionError: '错误: ',
      invalidAllocations: '错误：请检查受益人地址并确保列表匹配。',
      invalidAmount: '错误：提供的金额无效。',
      addingAllocations: '正在添加分配...',
      fundingContract: '正在向合约转移 %amount% 代币...',
      withdrawingUnclaimed: '正在提取无人领取的代币...',
      emergencyWithdrawing: '正在执行紧急提取...',
      step1Title: '步骤1：添加分配',
      step1Description: '定义谁接收代币以及数量。用逗号分隔地址和金额。',
      beneficiariesPlaceholder: '受益人地址 (0x..., 0x...)',
      amountsPlaceholder: '金额 (100.5, 50, ...)',
      addAllocationButton: '添加分配',
      processing: '处理中...',
      step2Title: '步骤2：为空投合约注资',
      step2Description: '将代币从您的钱包转移到合约中，以便可以领取。',
      currentBalance: '当前合约余额:',
      fundAmountPlaceholder: '注资金额',
      fundButton: '为合约注资',
      contractManagementTitle: '合约管理',
      withdrawUnclaimedButton: '提取无人领取的',
      emergencyTokenPlaceholder: '代币地址（用于紧急提取）',
      emergencyWithdrawButton: '紧急提取',
      // UserPanel
      userPanel_title: '用户面板',
      userPanel_successMessage: '操作成功完成！',
      userPanel_errorPrefix: '错误: ',
      userPanel_withdrawButton: '提取',
      userPanel_claimVestButton: '领取归属代币',
      userPanel_claimStakingButton: '领取质押奖励',
      userPanel_claimTokensButton: '领取代币',
      userPanel_noAllocationMessage: '您没有可领取的分配。',
      userPanel_alreadyClaimedMessage: '您已经领取了您的代币。',
      userPanel_processingMessage: '正在处理您的请求...',
      userPanel_totalAllocationPrefix: '您的总分配',
      userPanel_claimableVestedPrefix: '可领取 (已归属)',
      userPanel_claimablePrefix: '您的可领取金额',
      userPanel_claimedPrefix: '已领取',
      userPanel_yes: '是',
      userPanel_no: '否',
      userPanel_processing: '处理中...',
      userPanel_noTokensMessage: '您不符合此空投资格或此时没有可领取的代币。'
    }
  },
  ko: {
    common: {
      welcome: '환영합니다',
      loading: '로딩 중...',
      connect: '연결',
      disconnect: '연결 끊기',
      cancel: '취소',
      confirm: '확인',
      success: '성공',
      error: '오류',
      retry: '다시 시도',
      close: '닫기',
      // Panel translations
      transactionHistory: '거래 내역',
      actions: '액션',
      openHistoryPanel: '내역 패널 열기',
      openActionPanel: '액션 패널 열기',
      closePanel: '패널 닫기',
      openPanel: '패널 열기',
      noTransactionsYet: '아직 거래가 없습니다.',
      clearTransactionHistoryConfirm: '정말 모든 거래 내역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      clearAllHistory: '모든 내역 삭제',
      hash: '해시:',
      contract: '컨트랙트:',
      copied: '복사됨!',
      deleteTransaction: '거래 삭제',
      interact: '상호작용',
      // Transaction types
      sendPrefix: '보내기',
      deployPrefix: '배포',
      mintPrefix: '발행',
      transferPrefix: '이전',
      burnPrefix: '소각',
      interactionType: '상호작용',
      approvePrefix: '승인',
      // Specific transaction types
      deployAirdropStandard: '표준 에어드롭 배포',
      deployAirdropWithFee: '유료 에어드롭 배포',
      deployAirdropVesting: '베스팅 에어드롭 배포',
      deployAirdropStaking: '스테이킹 에어드롭 배포',
      deployAirdropWithdraw: '출금 에어드롭 배포',
      sendTxType: '보내기 거래',
      deployTxType: '계약 배포',
      mintInteraction: '발행 상호작용',
      transferInteraction: '이전 상호작용',
      burnInteraction: '소각 상호작용',
      approveInteraction: '승인 상호작용',
      createTokenInteraction: '토큰 생성 상호작용',
      createNftInteraction: 'NFT 생성 상호작용',
      airdropInteraction: '에어드롭 상호작용'
    },
    nav: {
      home: '홈',
      balance: '잔액',
      createToken: '토큰 생성',
      createNft: 'NFT 생성',
      airdropTools: '에어드롭 도구',
      connectWallet: '월렛 연결',
      connectPrivateKey: '개인키로 연결',
      rescueDapp: '구출 DApp',
      disconnect: '연결 해제'
    },
    home: {
      welcomeTitle: 'EVM Tools에 오신 것을 환영합니다',
      welcomeDescription: 'EVM Tools는 EVM 호환 블록체인에서 다양한 스마트 계약을 생성, 배포 및 상호작용할 수 있게 하는 포괄적인 탈중앙화 애플리케이션입니다. 이 플랫폼은 블록체인 자산과 거래를 쉽게 관리할 수 있는 직관적인 인터페이스를 제공합니다.',
      keyFeatures: '주요 기능',
      tokenCreationTitle: '토큰 생성',
      tokenCreationDesc: '몇 번의 클릭으로 자신만의 맞춤 ERC-20 토큰을 생성하세요. 토큰 이름, 기호, 공급량 그리고 발행, 소각, 허가 기능과 같은 고급 기능을 구성합니다. 앱에서 직접 배포하고 즉시 토큰을 사용하세요.',
      nftCreationTitle: 'NFT 생성',
      nftCreationDesc: '자신의 메타데이터와 이미지를 사용하여 맞춤 ERC-721 NFT를 발행하세요. 독특한 디지털 자산을 생성하고 블록체인에 배포합니다. 자신만의 NFT 컬렉션을 출시하고 싶은 아티스트, 수집가, 제작자에게 완벽합니다.',
      airdropContractsTitle: '에어드롭 계약',
      airdropContractsDesc: '토큰에 대한 에어드롭 계약을 배포하고 구성합니다. 청구 기간을 설정하고 소유자 컨트롤을 관리하며 커뮤니티에 효율적으로 토큰을 분배합니다. 에어드롭 인터페이스로 분배 캠페인의 모든 측면을 쉽게 관리할 수 있습니다.',
      tokenInteractionTitle: '토큰 상호작용',
      tokenInteractionDesc: '다른 주소로 토큰을 전송하고 잔액을 확인하며 기존 스마트 계약과 상호작용합니다. 직관적인 인터페이스로 다양한 네트워크에서 트랜잭션을 수행하고 자산을 쉽게 관리할 수 있습니다.',
      dashboardMessage: '이 대시보드는 중앙 제어 판넬 역할을 합니다. 잔액에서 자산을 선택하여 시작하거나 오른쪽 작업 패널을 사용하여 새 자산을 생성합니다. 거래 내역은 왼쪽 패널에서 볼 수 있습니다.',
      developmentMessage: '플랫폼 기능을 확장할 더 많은 기능과 도구를 추가하기 위해 적극적으로 노력하고 있습니다. 업데이트를 주시하십시오!'
    },
    actions: {
      panelTitle: '작업',
      connectWalletMessage: '월렛을 연결하여 시작하세요',
      selectAssetMessage: '자산을 선택하여 작업을 확인하세요',
      selectedPrefix: '선택됨',
      sendTokenButton: '보내기',
      transferNftButton: 'NFT 이전하기',
      interactContractButton: '계약과 상호작용',
      viewBalancesButton: '잔액 보기',
      createTokenButton: '토큰 생성',
      createNftButton: 'NFT 생성',
      airdropToolsButton: '에어드롭 도구',
      loadingMessage: '작업 로딩 중...',
      nativeSymbol: '네이티브'
    },
    airdropPage: {
      // AirdropPage
      title: '에어드롭 도구',
      connectWalletMessage: '에어드롭을 관리하려면 지갑을 연결하십시오.',
      loadContractPlaceholder: '로드할 계약 주소 입력',
      loadButton: '로드',
      hideDeployButton: '배포 숨기기',
      deployNewButton: '새로 배포',
      newContractDeployedMessage: '새 %deployedContractType% 계약이 %address%에 배포되었습니다',
      detectingContractTypeMessage: '%address%의 계약 유형을 감지하는 중...',
      invalidAddressError: '오류: 잘못된 주소가 제공되었습니다.',
      contractTypeDetectedMessage: '계약 유형 감지됨: %type%. 이제 상호 작용할 수 있습니다.',
      actionReceivedMessage: '작업을 받았습니다. 데이터 새로 고침 중...',
      contractInfoTitle: '계약 정보',
      addressLabel: '주소:',
      setupStatusLabel: '설정:',
      yes: '예',
      no: '아니요',
      tokenLabel: '토큰:',
      decimalsLabel: '소수 자릿수:',
      totalAllocatedLabel: '총 할당량:',
      totalClaimedLabel: '총 청구됨:',
      vestingStartLabel: '베스팅 시작:',
      vestingDurationLabel: '베스팅 기간:',
      stakingContractLabel: '스테이킹 계약:',
      snapshotBlockLabel: '스냅샷 블록:',
      feeTokenLabel: '수수료 토큰:',
      claimFeeLabel: '청구 수수료:',
      // DeployPanel
      walletRequiredError: '배포하려면 지갑 연결이 필요합니다.',
      fieldsRequiredError: '토큰 주소와 에어드롭 종료 날짜가 필요합니다.',
      vestingDateRequiredError: '이 계약 유형에는 베스팅 종료 날짜가 필요합니다.',
      vestingDateFutureError: '베스팅 종료 날짜는 미래여야 합니다.',
      deployTransactionMessage: '트랜잭션 배포 중',
      feeConfigMessage: '계약이 배포되었습니다. 이제 수수료 설정을 구성합니다...',
      deploySuccessMessage: '계약이 성공적으로 배포되었습니다',
      feeConfigSuccessMessage: '수수료 설정이 성공적으로 구성되었습니다!',
      transactionRejected: '사용자가 트랜잭션을 거부했습니다.',
      deployErrorMessage: '배포 오류: ',
      panelTitle: '새 에어드롭 계약 배포',
      panelDescription: '계약 유형을 선택하고 배포할 세부 정보를 입력하십시오.',
      contractTypeLabel: '계약 유형',
      tokenAddressLabel: '에어드롭 토큰 주소',
      airdropDateLabel: '에어드롭 종료 날짜',
      vestingDateLabel: '베스팅 종료 날짜',
      feeTypeLabel: '수수료 유형',
      nativeOption: '네이티브 (ETH, MATIC 등)',
      erc20Option: 'ERC20 토큰',
      feeTokenAddressLabel: '수수료 토큰 주소',
      feeAmountLabel: '수수료 금액',
      feeAmountPlaceholder: '예: 0.1',
      deployWaiting: '승인 대기 중...',
      deployConfirming: '배포 확인 중...',
      deployButton: '계약 배포',
      gasWarning: '이 트랜잭션에 대해 가스 요금이 부과됩니다.',
      // OwnerPanel
      ownerPanelTitle: '소유자 패널',
      transactionSuccess: '트랜잭션이 성공적으로 확인되었습니다!',
      transactionError: '오류: ',
      invalidAllocations: '오류: 수혜자 주소를 확인하고 목록이 일치하는지 확인하십시오.',
      invalidAmount: '오류: 잘못된 금액이 제공되었습니다.',
      addingAllocations: '할당 추가 중...',
      fundingContract: '계약에 %amount% 토큰 전송 중...',
      withdrawingUnclaimed: '미청구 토큰 인출 중...',
      emergencyWithdrawing: '긴급 인출 수행 중...',
      step1Title: '1단계: 할당 추가',
      step1Description: '누가 얼마나 많은 토큰을 받을지 정의합니다. 주소와 금액을 쉼표로 구분합니다.',
      beneficiariesPlaceholder: '수혜자 주소 (0x..., 0x...)',
      amountsPlaceholder: '금액 (100.5, 50, ...)',
      addAllocationButton: '할당 추가',
      processing: '처리 중...',
      step2Title: '2단계: 에어드롭 계약 자금 조달',
      step2Description: '지갑에서 계약으로 토큰을 전송하여 청구할 수 있도록 합니다.',
      currentBalance: '현재 계약 잔액:',
      fundAmountPlaceholder: '자금 조달 금액',
      fundButton: '계약 자금 조달',
      contractManagementTitle: '계약 관리',
      withdrawUnclaimedButton: '미청구 인출',
      emergencyTokenPlaceholder: '토큰 주소 (긴급 인출용)',
      emergencyWithdrawButton: '긴급 인출',
      // UserPanel
      userPanel_title: '사용자 패널',
      userPanel_successMessage: '작업이 성공적으로 완료되었습니다!',
      userPanel_errorPrefix: '오류: ',
      userPanel_withdrawButton: '인출',
      userPanel_claimVestButton: '베스팅된 토큰 청구',
      userPanel_claimStakingButton: '스테이킹 보상 청구',
      userPanel_claimTokensButton: '토큰 청구',
      userPanel_noAllocationMessage: '청구할 할당이 없습니다.',
      userPanel_alreadyClaimedMessage: '이미 토큰을 청구했습니다.',
      userPanel_processingMessage: '요청 처리 중...',
      userPanel_totalAllocationPrefix: '총 할당량',
      userPanel_claimableVestedPrefix: '청구 가능 (베스팅됨)',
      userPanel_claimablePrefix: '청구 가능 금액',
      userPanel_claimedPrefix: '청구됨',
      userPanel_yes: '예',
      userPanel_no: '아니요',
      userPanel_processing: '처리 중...',
      userPanel_noTokensMessage: '이 에어드롭에 해당되지 않거나 현재 청구할 토큰이 없습니다.'
    }
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, namespace?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Load saved language from localStorage
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('i18nextLng') as Language;
      if (savedLang && ['en', 'es', 'zh', 'ko'].includes(savedLang)) {
        setCurrentLanguage(savedLang);
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lang);
      // Also set i18next language for compatibility
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('i18nextLng', lang);
      }
    }
  };

  const t = (key: string, namespace: string = 'common'): string => {
    const langData = translations[currentLanguage];
    const namespaceData = (langData as any)[namespace] || langData.common;
    
    // Custom logic for userPanel keys
    if (namespace === 'userPanel') {
      const airdropNamespaceData = (langData as any)['airdropPage'] || {};
      const userPanelKey = `userPanel_${key}`;
      return airdropNamespaceData[userPanelKey] || key;
    }

    return namespaceData[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
  };

  if (!hasMounted) {
    // During SSR/pre-hydration, render with English as default
    const ssrValue = {
      currentLanguage: 'en' as Language,
      changeLanguage,
      t: (key: string, ns?: string) => {
        if (ns === 'nav') {
          return translations.en.nav[key as keyof typeof translations.en.nav] || key;
        }
        if (ns === 'userPanel') {
          const airdropNs = translations.en.airdropPage;
          const userPanelKey = `userPanel_${key}` as keyof typeof airdropNs;
          return airdropNs[userPanelKey] || key;
        }
        return translations.en.common[key as keyof typeof translations.en.common] || key;
      },
    };

    return (
      <LanguageContext.Provider value={ssrValue}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
    {children}
  </LanguageContext.Provider>
  );
};

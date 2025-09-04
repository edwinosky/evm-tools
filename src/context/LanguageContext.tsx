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
      interact: 'Interact'
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
      interact: 'Interactuar'
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
      interact: '交互'
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
      interact: '상호작용'
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

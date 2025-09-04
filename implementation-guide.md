# 🛠️ GUÍA PASO A PASO - IMPLEMENTACIÓN I18N EN DAPP EVM

## 📋 DESCRIPCIÓN DEL PROYECTO
Implementación completa de multilingüe (i18n) en DApp EVM usando **next-i18next** para soporte de **español**, **inglés**, **chino** y **coreano**.

## 🎯 METAS
- ✅ Implementar next-i18next completamente funcional
- ✅ Soporte completo para 4 idiomas
- ✅ Traducciones técnicas precisas para blockchain
- ✅ Interfaz consistente y profesional
- ✅ Optimización de carga y rendimiento

---

## 📚 PASO 1: CONFIGURACIÓN DE DEPENDENCIAS

### 1.1 Instalar next-i18next
```bash
npm install next-i18next i18next react-i18next i18next-browser-languagedetector
```
```bash
npm install -D @types/i18next
```

### 1.2 Verificar package.json
```json
{
  "dependencies": {
    "next-i18next": "^15.4.5",
    "i18next": "^23.7.6",
    "react-i18next": "^14.0.0",
    "i18next-browser-languagedetector": "^8.0.1"
  }
}
```

---

## 🏗️ PASO 2: ESTRUCTURA DE DIRECTORIOS

### 2.1 Crear estructura de archivos de traducción
```
src/
├── lib/
│   └── i18n/
│       ├── index.js
│       ├── next-i18next.config.js
│       └── locales/
│           ├── en/
│           │   ├── common.json
│           │   ├── nav.json
│           │   ├── airdrop.json
│           │   ├── tokens.json
│           │   └── errors.json
│           ├── es/
│           │   ├── common.json
│           │   ├── nav.json
│           │   ├── airdrop.json
│           │   ├── tokens.json
│           │   └── errors.json
│           ├── zh/
│           │   ├── common.json
│           │   ├── nav.json
│           │   ├── airdrop.json
│           │   ├── tokens.json
│           │   └── errors.json
│           └── ko/
│               ├── common.json
│               ├── nav.json
│               ├── airdrop.json
│               ├── tokens.json
│               └── errors.json
```

---

## ⚙️ PASO 3: CONFIGURACIÓN PRINCIPAL

### 3.1 Crear next-i18next.config.js
```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'zh', 'ko'],
    localeDetection: true,
  },
  defaultNS: 'common',
  localePath: require('path').resolve('./src/lib/i18n/locales'),
  localeStructure: '{{lng}}/{{ns}}',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
};
```

### 3.2 Crear src/lib/i18n/index.js
```javascript
const { createInstance } = require('i18next');
const { initReactI18next } = require('react-i18next');
const LanguageDetector = require('i18next-browser-languagedetector');
const Backend = require('i18next-chained-backend');
const HttpApi = require('i18next-http-backend');

const i18n = createInstance();

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
```

### 3.3 Actualizar next.config.js
```javascript
/** @type {import('next').NextConfig} */
const { i18n } = require('./src/lib/i18n/next-i18next.config.js');

const nextConfig = {
  i18n,
  // ... existing config
};

module.exports = nextConfig;
```

---

## 🌐 PASO 4: ARCHIVOS DE TRADUCCIÓN

### 4.1 locales/en/common.json
```json
{
  "welcome": "Welcome",
  "loading": "Loading...",
  "connect": "Connect",
  "disconnect": "Disconnect",
  "cancel": "Cancel",
  "confirm": "Confirm",
  "success": "Success",
  "error": "Error",
  "retry": "Retry",
  "close": "Close"
}
```

### 4.2 locales/es/common.json
```json
{
  "welcome": "Bienvenido",
  "loading": "Cargando...",
  "connect": "Conectar",
  "disconnect": "Desconectar",
  "cancel": "Cancelar",
  "confirm": "Confirmar",
  "success": "Éxito",
  "error": "Error",
  "retry": "Reintentar",
  "close": "Cerrar"
}
```

### 4.3 locales/zh/common.json
```json
{
  "welcome": "欢迎",
  "loading": "加载中...",
  "connect": "连接",
  "disconnect": "断开连接",
  "cancel": "取消",
  "confirm": "确认",
  "success": "成功",
  "error": "错误",
  "retry": "重试",
  "close": "关闭"
}
```

### 4.4 locales/ko/common.json
```json
{
  "welcome": "환영합니다",
  "loading": "로딩 중...",
  "connect": "연결",
  "disconnect": "연결 끊기",
  "cancel": "취소",
  "confirm": "확인",
  "success": "성공",
  "error": "오류",
  "retry": "다시 시도",
  "close": "닫기"
}
```

### 4.5 locales/en/nav.json
```json
{
  "home": "Home",
  "balance": "Balance",
  "createToken": "Create Token",
  "createNft": "Create NFT",
  "airdrop": "Airdrop",
  "connectWallet": "Connect Wallet",
  "connectPrivateKey": "Connect with Private Key",
  "rescueDapp": "Rescue DApp"
}
```

### 4.6 locales/es/nav.json
```json
{
  "home": "Inicio",
  "balance": "Balance",
  "createToken": "Crear Token",
  "createNft": "Crear NFT",
  "airdrop": "Airdrop",
  "connectWallet": "Conectar Billetera",
  "connectPrivateKey": "Conectar con Clave Privada",
  "rescueDapp": "DApp de Rescate"
}
```

---

## 🔧 PASO 5: IMPLEMENTACIÓN DEL CONTEXTO

### 5.1 Crear src/context/LanguageContext.tsx
```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

type Language = 'en' | 'es' | 'zh' | 'ko';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => Promise<void>;
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
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') as Language;
    if (savedLang && ['en', 'es', 'zh', 'ko'].includes(savedLang)) {
      setCurrentLanguage(savedLang);
    } else {
      setCurrentLanguage('en');
    }
  }, []);

  const changeLanguage = async (lang: Language) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t: (key: string, namespace?: string) => t(key, { ns: namespace || 'common' }),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### 5.2 Actualizar _app.tsx
```tsx
import { appWithTranslation } from 'next-i18next';
import { LanguageProvider } from '@/context/LanguageContext';
// ... other imports

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      {/* ... existing providers */}
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default appWithTranslation(MyApp, {
  i18n: require('../src/lib/i18n/next-i18next.config').i18n,
});
```

---

## 🍳 PASO 6: COMPONENTE SELECTOR DE IDIOMA

### 6.1 Crear src/components/LanguageSelector.tsx
```tsx
'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
] as const;

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const current = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground"
      >
        <Globe size={16} />
        <span>{current?.flag}</span>
        <span className="hidden sm:block">{current?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-muted ${
                currentLanguage === language.code ? 'bg-primary/10 text-primary' : 'text-foreground'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto text-primary text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;
```

---

## 🔄 PASO 7: ACTUALIZACIÓN DE COMPONENTES

### 7.1 Actualizar Navbar (src/app/components/Navbar.tsx)
```tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAppContext } from '@/context/AppContext';
import { LogOut, Home } from 'lucide-react';
import { PrivateKeyConnectModal } from './PrivateKeyConnectModal';
import NetworkSelector from './NetworkSelector';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

const Navbar = () => {
  const { isConnected, disconnect, address, connectionMode, currentNetwork } = useAppContext();
  const { t } = useLanguage();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="flex items-center justify-between p-4 bg-card text-card-foreground shadow-md border-b border-border">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          EVM Tools
        </Link>
        <Link href="/" className="p-2 rounded-md hover:bg-accent" title={t('nav.home', 'nav')}>
          <Home size={20} />
        </Link>
        <LanguageSelector />
        <a
          href="https://www.drainerless.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          {t('nav.rescueDapp', 'nav')}
        </a>
      </div>
      <div className="flex items-center space-x-2">
        {hasMounted && isConnected ? (
          <>
            <NetworkSelector />
            <div className="p-2 bg-muted rounded-md text-sm">
              {connectionMode === 'privateKey' && '🔑 '}
              {address && truncateAddress(address)}
            </div>
            <button
              onClick={disconnect}
              className="p-2 rounded-md hover:bg-accent"
              title={t('nav.disconnect', 'nav')}
            >
              <LogOut size={20} />
            </button>
          </>
        ) : hasMounted ? (
          <>
            <NetworkSelector />
            <PrivateKeyConnectModal>
              <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {t('nav.connectPrivateKey', 'nav')}
              </button>
            </PrivateKeyConnectModal>
            <ConnectButton />
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
```

### 7.2 Plantilla para actualizar otros componentes
```tsx
// Ejemplo para componentes posteriores:
import { useLanguage } from '@/context/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  const { t: i18nT } = useTranslation('namespace'); // Para namespaces específicos

  return (
    <div>
      <h3>{t('title')}</h3>
      <p>{i18nT('description')}</p>
      <button>{t('buttonText')}</button>
    </div>
  );
};
```

---

## 🚀 PASO 8: OPTIMIZACIONES DE RENDIMIENTO

### 8.1 Lazy Loading de traducciones
```typescript
// src/lib/i18n/lazy-load.js
export function loadTranslations(lang, namespace) {
  return import(`@/lib/i18n/locales/${lang}/${namespace}.json`);
}
```

### 8.2 Configuración de cache
```javascript
// En next.config.js
module.exports = {
  i18n: {
    // ... existing config
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    serializeConfig: true,
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### 8.3 Bundle splitting
```javascript
// En next.config.js
module.exports = {
  // ... existing config
  transpilePackages: ['next-i18next'],
};
```

---

## 🧪 PASO 9: PRUEBAS Y VALIDACIÓN

### 9.1 Crear script de validación
```bash
# scripts/validate-translations.js
const fs = require('fs');
const path = require('path');

function validateTranslations() {
  const localesDir = path.join(__dirname, '../src/lib/i18n/locales');
  const languages = ['en', 'es', 'zh', 'ko'];

  const baseKeys = {};
  // Implementation here
}

validateTranslations();
```

### 9.2 Agregar comando en package.json
```json
{
  "scripts": {
    "validate:i18n": "node scripts/validate-translations.js",
    "build": "npm run validate:i18n && next build"
  }
}
```

---

## 🎉 PASO 10: DESPLIEGUE Y MANTE PRENIMIENTO

### 10.1 Verificar configuración de producción
```bash
# Compilar aplicación
npm run build

# Verificar traducciones
npm run validate:i18n

# Desplegar
npm run deploy
```

### 10.2 Estrategia de mantenimiento
1. **Monitoreo**: Logs de errores de traducción faltantes
2. **Actualización**: Scripts automáticos para agregar nuevas claves
3. **QA**: Equipo dedicado para validación de traducciones
4. **Documentación**: Guida para agregar nuevos idiomas

---

## 📞 SOPORTE Y SOLUCIÓN DE PROBLEMAS

### Problemas comunes:
1. **Traducciones no cargan**: Verificar archivos JSON y configuración
2. **Cambio de idioma lento**: Implementar lazy loading
3. **Keys faltantes**: Validadores automáticos en desarrollo

### Recursos adicionales:
- Documentación: [next-i18next docs](https://github.com/ne Fuenteinternationalization/next-i18next)
- Ejemplos: Repositorio de casos de uso similares
- Comunidad: Foros especializados en i18n para Next.js

---

**💡 RECUERDA**: Este método garantiza control total sobre las traducciones y compatibilidad universal con todos los navegadores y dispositivos.

**⏱️ TIEMPO TOTAL ESTIMADO**: 12-18 días hábiles para implementación completa.

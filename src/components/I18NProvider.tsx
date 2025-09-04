'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';

interface I18NProviderProps {
  children: React.ReactNode;
}

export const I18NProvider: React.FC<I18NProviderProps> = ({ children }) => {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
};

export default I18NProvider;

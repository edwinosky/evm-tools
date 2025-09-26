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

interface LanguageSelectorProps {
  isFloating?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isFloating = false }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const current = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors ${
          isFloating ? 'w-10 h-10 bg-background border border-border shadow-lg' : 'w-8 h-8'
        }`}
        title={`${current?.name} - Click to change language`}
      >
        <span className="text-lg">{current?.flag}</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-40 bg-background border border-border rounded-md shadow-lg z-50 ${
          isFloating ? 'bottom-full mb-2' : 'mt-1'
        }`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-muted transition-colors ${
                currentLanguage === language.code ? 'bg-primary/10 text-primary' : 'text-foreground'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto text-primary text-sm">✓</span>
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

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

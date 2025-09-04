'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTelegram, faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md flex-grow">
        <h1 className="text-3xl font-bold mb-6">{t('welcomeTitle', 'home')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('welcomeDescription', 'home')}
        </p>

        <h2 className="text-2xl font-bold mb-4">{t('keyFeatures', 'home')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{t('tokenCreationTitle', 'home')}</h3>
            <p className="text-muted-foreground">
              {t('tokenCreationDesc', 'home')}
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{t('nftCreationTitle', 'home')}</h3>
            <p className="text-muted-foreground">
              {t('nftCreationDesc', 'home')}
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{t('airdropContractsTitle', 'home')}</h3>
            <p className="text-muted-foreground">
              {t('airdropContractsDesc', 'home')}
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{t('tokenInteractionTitle', 'home')}</h3>
            <p className="text-muted-foreground">
              {t('tokenInteractionDesc', 'home')}
            </p>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          {t('dashboardMessage', 'home')}
        </p>

        <p className="text-muted-foreground mt-4">
          {t('developmentMessage', 'home')}
        </p>
      </div>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <div className="flex justify-center space-x-4" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} >
          <div className="hexagon-wrapper">
            <a href="https://github.com/edwinosky" target="_blank" rel="noopener noreferrer">
              <div className="hexagon">
                <FontAwesomeIcon icon={faGithub} />
              </div>
            </a>
          </div>
          <div className="hexagon-wrapper">
            <a href="https://t.me/drainerless" target="_blank" rel="noopener noreferrer">
              <div className="hexagon">
                <FontAwesomeIcon icon={faTelegram} />
              </div>
            </a>
          </div>
          <div className="hexagon-wrapper">
            <a href="https://discord.com/invite/ZwqkqxY9ZR" target="_blank" rel="noopener noreferrer">
              <div className="hexagon">
                <FontAwesomeIcon icon={faDiscord} />
              </div>
            </a>
          </div>
          <div className="hexagon-wrapper">
            <a href="https://twitter.com/Edwin0x0" target="_blank" rel="noopener noreferrer">
              <div className="hexagon">
                <FontAwesomeIcon icon={faXTwitter} />
              </div>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

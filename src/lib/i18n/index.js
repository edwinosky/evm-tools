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

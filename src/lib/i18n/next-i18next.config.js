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

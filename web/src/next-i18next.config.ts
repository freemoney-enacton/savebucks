// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi', 'gu', 'ja', 'te', 'fr', 'es', 'ar', 'ru', 'zh'],
    localeDetection: false,
  },
  localePath: './public/locales', // This line is optional since it's the default path
  localeStructure: '{{lng}}', // Configure to use flat structure
};

import type { InitOptions } from 'i18next';

export const FALLBACK_LOCALE = 'en';
export const supportedLocales = ['en', 'hi', 'te', 'fr', 'es', 'ar', 'ru', 'zh', 'de', 'ko'] as const;
export const countryToLanguageMap: Record<string, string> = {
  IN: 'hi',
  JP: 'ja',
  FR: 'fr',
  ES: 'es',
  RU: 'ru',
  AR: 'ar',
  CN: 'zh',
  DE: 'de',
  AT: 'de',
  CH: 'de',
  KO: 'ko',
  // Add more as needed
};
export type Locales = (typeof supportedLocales)[number];

// You can name the cookie to whatever you want
export const LANGUAGE_COOKIE = 'preferred_language';

export function getOptions(lang = FALLBACK_LOCALE, ns = 'common'): InitOptions {
  return {
    // debug: true, // Set to true to see console logs
    supportedLngs: supportedLocales,
    fallbackLng: FALLBACK_LOCALE,
    lng: lang,
    ns,
  };
}

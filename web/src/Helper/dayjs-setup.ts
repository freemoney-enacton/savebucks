import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Map supported locales to static imports
const localeImports: Record<string, () => Promise<any>> = {
  en: () => import('dayjs/locale/en'),
  de: () => import('dayjs/locale/de'),
  fr: () => import('dayjs/locale/fr'),
  es: () => import('dayjs/locale/es'),
};

export const initDayjsLocale = async (locale: string = 'en') => {
  const selected = Object.keys(localeImports).includes(locale) ? locale : 'en';

  if (dayjs.locale() === selected) return;

  try {
    await localeImports[selected](); // safely import
    dayjs.locale(selected);
  } catch (err) {
    console.warn(`Dayjs locale load failed for "${selected}"`, err);
    dayjs.locale('en');
  }
};

export default dayjs;

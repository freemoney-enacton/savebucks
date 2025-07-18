import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import {
  FALLBACK_LOCALE,
  getOptions,
  Locales,
  LANGUAGE_COOKIE,
} from "./settings";
import { cookies } from "next/headers";

async function initI18next(lang: Locales) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`)
      )
    )
    .init(getOptions(lang));

  return i18nInstance;
}

export async function createTranslation(language?: any) {
  if (language) {
    const i18nextInstance = await initI18next(language);

    return {
      t: i18nextInstance.getFixedT(language),
    };
  } else {
    const lang = getLocale();
    const i18nextInstance = await initI18next(lang);

    return {
      t: i18nextInstance.getFixedT(lang),
    };
  }
}

export function getLocale() {
  return (cookies().get(LANGUAGE_COOKIE)?.value ?? FALLBACK_LOCALE) as Locales;
}

import { config } from '@/config';
import { cookies } from 'next/headers';

let getLocale = cookies().get('LANGUAGE_COOKIE')?.value ?? config.default_lang;

export function translate(key: string) {
  return getLocale[key] || key;
}

'use server';

import { cookies } from 'next/headers';
import { LANGUAGE_COOKIE } from '../i18n/settings';
import { public_post_api } from '@/Hook/Api/Server/use-server';

export async function switchLocaleAction(value: string, isLoggedIn: boolean = false) {
  cookies().set(LANGUAGE_COOKIE, value);
  if (isLoggedIn) {
    try {
      public_post_api({ path: `user/update`, body: { lang: value } });
    } catch (error) {
      console.log('🚀 ~ switchLocaleAction ~ error:', error);
    }
  }

  // It does not matter what we return here
  return {
    status: 'success',
  };
}

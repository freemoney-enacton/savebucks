'use server';

import { signIn, signOut } from '@/auth';
import { config } from '@/config';
import { createTranslation } from '@/i18n/server';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';

export const logout = async () => {
  await signOut({ redirect: false });
  cookies().delete(config.NEXT_AUTH_COOKIE_NAME);
  return true;
};

export const login = async ({ email, password, recaptcha }) => {
  const { t } = await createTranslation();
  try {
    await signIn('credentials', { email, password, recaptcha, redirect: false });
    // redirect(DEFAULT_LOGIN_REDIRECT);
    // return {
    //   error: false,
    //   success: true,
    // };
  } catch (error) {
    if (error instanceof AuthError) {
      const type = (error as any)?.type;
      const causeErr = (error.cause as any)?.err;
      switch (type) {
        case 'CredentialsSignin':
          return { error: t('invalid_email_or_password') };
        default:
          return {
            error: causeErr?.message || t('there_was_an_error_signing_in'),
          };
      }
    }
    throw error;
  }
};

export const directLogin = async ({ token }) => {
  const { t } = await createTranslation();
  try {
    await signIn('credentials', { token, redirect: false });
    // redirect(DEFAULT_LOGIN_REDIRECT);
    // return {
    //   error: false,
    //   success: true,
    // };
  } catch (error) {
    if (error instanceof AuthError) {
      const type = (error as any)?.type;
      const causeErr = (error.cause as any)?.err;
      switch (type) {
        case 'CredentialsSignin':
          return { error: causeErr?.message || t('invalid_email_or_password') };
        default:
          return {
            error: causeErr?.message || t('there_was_an_error_signing_in'),
          };
      }
    }
    throw error;
  }
};

'use server';
import { auth } from '@/auth';
import { config } from '@/config';
import { LANGUAGE_COOKIE } from '@/i18n/settings';
import { cookies, headers as nextHeaders } from 'next/headers';

export const public_get_api = async ({
  path,
  headers,
  isBaseURL,
}: {
  path: string;
  headers?: Record<string, any>;
  isBaseURL?: boolean;
}) => {
  try {
    let local = cookies().get(LANGUAGE_COOKIE)?.value;
    let isMobile = cookies().get(config.IS_MOBILE_COOKIE)?.value;
    const session: any = await auth();
    const cloudflareIp = nextHeaders().get('cf-connecting-ip');
    const cfCountry = nextHeaders().get('cf-ipcountry');
    const cfClientIp = nextHeaders().get('cf-connecting-ip');
    const forwardedIp = nextHeaders().get('x-forwarded-for');
    const url = (isBaseURL ? config.BASE_API_END_POINT : config.API_END_POINT) + path;

    const data = await fetch(url, {
      method: 'GET',
      // @ts-ignore
      headers: {
        'Content-Type': 'application/json',
        'x-language': local || 'en',

        // 'x-country': cfCountry || '',
        ...(cfCountry ? { 'x-country': cfCountry } : {}),
        ...(isMobile ? { 'is-app': isMobile } : {}),
        // ...(cfCountry ? { 'CF-IPCountry': cfCountry } : {}),
        ...(cfClientIp ? { 'x-client-ip': cfClientIp } : {}),
        ...(forwardedIp || cloudflareIp ? { 'x-forwarded-for': forwardedIp || cloudflareIp } : {}),
        ...(session?.user?.token ? { Authorization: `${session?.user?.token}` } : {}),
        ...headers,
      },
    });
    const res = await data.json();

    if (data.status === 403) {
      throw new Error('session_expired');
    }
    return { ...res, status: data.status };
  } catch (error: any) {
    return { status: error.message === 'session_expired' ? 403 : 500, error: error.message };
  }
};

export const public_post_api = async ({ path, body, headers }: { path: string; body: any; headers?: HeadersInit }) => {
  try {
    let local = cookies().get(LANGUAGE_COOKIE)?.value;
    let isMobile = cookies().get(config.IS_MOBILE_COOKIE)?.value;
    const session: any = await auth();
    const cloudflareIp = nextHeaders().get('cf-connecting-ip');
    const cfCountry = nextHeaders().get('cf-ipcountry');
    const cfClientIp = nextHeaders().get('cf-connecting-ip');
    const forwardedIp = nextHeaders().get('x-forwarded-for');

    const data = await fetch(config.API_END_POINT + path, {
      method: 'POST',
      // @ts-ignore
      headers: {
        'Content-Type': 'application/json',
        'x-language': local ? local : 'en',
        ...(cfCountry ? { 'x-country': cfCountry } : {}),
        ...(isMobile ? { 'is-app': isMobile } : {}),
        // ...(cfCountry ? { 'CF-IPCountry': cfCountry } : {}),
        ...(cfClientIp ? { 'x-client-ip': cfClientIp } : {}),
        ...(forwardedIp || cloudflareIp ? { 'x-forwarded-for': forwardedIp || cloudflareIp } : {}),
        ...(session?.user?.token ? { Authorization: `${session?.user?.token}` } : {}),
        ...headers,
      },
      body: JSON.stringify(body),
    });
    const res = await data.json();
    if (data.status === 403) {
      throw new Error('session_expired');
    }
    return res;
  } catch (error: any) {
    return { status: error.message === 'session_expired' ? 403 : 500, error: error.message };
  }
};

'use client';
import { config } from '@/config';
import { LANGUAGE_COOKIE } from '@/i18n/settings';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';

export const usePublicApi = () => {
  const { data: session }: any = useSession();
  const public_get_api = async ({ path, headers, isBaseURL }: { path: string; headers?: HeadersInit; isBaseURL?: boolean }) => {
    try {
      let local = Cookies.get(LANGUAGE_COOKIE);
      let isMobile = Cookies.get(config.IS_MOBILE_COOKIE);
      const data = await fetch((isBaseURL ? config.BASE_API_END_POINT : config.API_END_POINT) + path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-language': local ? local : 'en',
          ...(isMobile ? { is_app: isMobile } : {}),
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
  const public_post_api = async ({
    path,
    body,
    headers,
    addContentType = true,
  }: {
    path: string;
    body: any;
    headers?: HeadersInit;
    addContentType?: boolean;
  }) => {
    try {
      let local = Cookies.get(LANGUAGE_COOKIE);
      let isMobile = Cookies.get(config.IS_MOBILE_COOKIE);
      let requestHeaders: HeadersInit = {
        'x-language': local ? local : 'en',
        ...(isMobile ? { is_app: isMobile } : {}),
        ...(session?.user?.token ? { Authorization: `${session?.user?.token}` } : {}),
        ...headers,
      };
      if (addContentType) {
        requestHeaders['Content-Type'] = 'application/json';
      }
      const data = await fetch(config.API_END_POINT + path, {
        method: 'POST',
        headers: requestHeaders,
        body: !addContentType ? body : JSON.stringify(body),
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
  return {
    public_get_api,
    public_post_api,
  };
};

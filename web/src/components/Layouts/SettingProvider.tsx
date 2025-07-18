'use client';
import { config } from '@/config';
import useOneSignal from '@/Hook/use-one-signal';
import { booleanDefaultTrueAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { GoogleTagManager } from '@next/third-parties/google';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { IntercomProvider } from 'react-use-intercom';
import { useSetRecoilState } from 'recoil';
import FacebookPixelEvents from '../Generic/FacebookPixelEvents';
import { setHeightAsCSSVariable } from '@/Helper/utils';
import Cookies from 'js-cookie';
import { FALLBACK_LOCALE, LANGUAGE_COOKIE } from '@/i18n/settings';
import { initDayjsLocale } from '@/Helper/dayjs-setup';
import { Toast } from '../Core/Toast';
import { useTranslation } from 'react-i18next';

const SettingProvider = ({ children, settings }) => {
  const searchParams = useSearchParams();
  const setSettings = useSetRecoilState(objectAtomFamily(atomKey.settings));
  const setSettings_loading = useSetRecoilState(booleanDefaultTrueAtomFamily(atomKey.settings_loading));
  const { update, status } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  useOneSignal();

  useEffect(() => {
    const alreadyLoggedIn = searchParams.get('already_logged_in');
    if (alreadyLoggedIn === 'true') {
      Toast.warn(t('you_are_already_logged_in'));
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('already_logged_in');
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      // Replace URL without reloading page
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname]);

  const getSettingData = () => {
    try {
      setSettings_loading(true);
      setSettings(settings?.data);
      setSettings_loading(false);
    } catch (error) {
      console.log({ error });
      setSettings_loading(false);
    }
  };
  useEffect(() => {
    setHeightAsCSSVariable('header', 'header-height');
  }, []);

  useEffect(() => {
    getSettingData();
    const locale = Cookies.get(LANGUAGE_COOKIE) || FALLBACK_LOCALE;
    initDayjsLocale(locale);
    return () => {};
  }, [settings]);

  useEffect(() => {
    if (pathname.startsWith('/overview/')) {
      if (status === 'authenticated') {
        update({ updated: true });
      }
    }
  }, [pathname]);

  return (
    <div>
      <IntercomProvider
        appId={settings?.data?.services?.intercom_enabled && config.INTERCOM_ID ? config.INTERCOM_ID : ''}
        autoBoot={true}
      >
        {children}
        <Suspense fallback={null}>
          {settings?.data?.analytics?.fb_pixel_id ? (
            <FacebookPixelEvents fbPixelId={settings?.data?.analytics?.fb_pixel_id} />
          ) : null}
          {settings?.data?.analytics?.gtm_pixel_id ? <GoogleTagManager gtmId={settings?.data?.analytics?.gtm_pixel_id} /> : null}
        </Suspense>
      </IntercomProvider>
    </div>
  );
};

export default SettingProvider;

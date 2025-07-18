'use client';
import { stringAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { NextUIProvider } from '@nextui-org/system';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import tailwindConfig from './../../../tailwind.config';
import SettingProvider from './SettingProvider';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  locale: string;
  settings: string;
}

function SetLanguage({ lang }) {
  const setLanguage = useSetRecoilState(stringAtomFamily(atomKey.translation.currentSelectedLanguage));
  useEffect(() => {
    setLanguage(lang);
    return () => {};
  }, [lang]);
  return null;
}

function ProviderLayout({ children, locale, settings }: ProvidersProps) {
  // @ts-ignore
  const primaryColor = tailwindConfig?.theme?.extend?.colors?.primary;

  return (
    <NextUIProvider>
      <NextThemesProvider defaultTheme="light" attribute="class">
        <RecoilRoot>
          <SetLanguage lang={locale} />
          <SettingProvider settings={settings}>{children}</SettingProvider>
          <ProgressBar height="4px" color={primaryColor} options={{ showSpinner: false }} shallowRouting />
          <ToastContainer position="bottom-right" theme="light" closeOnClick pauseOnHover={false} />
        </RecoilRoot>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default ProviderLayout;

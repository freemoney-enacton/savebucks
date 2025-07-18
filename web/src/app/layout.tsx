import { auth } from '@/auth';
import ProviderLayout from '@/components/Layouts/ProviderLayout';
import { initDayjsLocale } from '@/Helper/dayjs-setup';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { getLocale } from '@/i18n/server';
import parse from 'html-react-parser';
import type { Metadata, Viewport } from 'next';
import { SessionProvider } from 'next-auth/react';
import { cookies } from 'next/headers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await public_get_api({ path: 'settings' });
  return {
    title: settings?.data?.default.name,
    openGraph: {
      title: settings?.data?.default.name,
      type: 'website',
    },
    icons: {
      icon: settings?.data?.default.favicon,
    },
  };
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const locale = getLocale();
  const isMobileApp = cookies().get('isMobileApp')?.value;
  const settings = await public_get_api({ path: 'settings' });
  const themeColors = settings?.data?.theme;
  const code_head = settings?.data?.dev?.code_head?.replace(/\r\n/g, '');
  const code_body = settings?.data?.dev?.code_body?.replace(/\r\n/g, '');
  const code_foot = settings?.data?.dev?.code_foot?.replace(/\r\n/g, '');
  const cssVariables = Object.entries(themeColors || {})
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n');
  initDayjsLocale(locale);

  const safeCodeHead = isMobileApp
    ? code_head?.replace(/<script[^>]*cookieyes[^>]*><\/script>/gi, '') // remove CookieYes
    : code_head;

  return (
    <html lang={locale}>
      <head>
        {safeCodeHead && parse(safeCodeHead)}
        <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVariables} }` }} />
      </head>
      <body>
        {code_body && parse(code_body)}
        <SessionProvider session={session}>
          <ProviderLayout settings={settings} locale={locale}>
            {children}
          </ProviderLayout>
        </SessionProvider>
        {code_foot && parse(code_foot)}
      </body>
    </html>
  );
}

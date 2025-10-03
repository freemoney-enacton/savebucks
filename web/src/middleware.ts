import { auth } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from './routes-config';
import { config as Config } from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import { public_get_api, public_post_api } from './Hook/Api/Server/use-server';
import { countryToLanguageMap, FALLBACK_LOCALE, LANGUAGE_COOKIE } from './i18n/settings';

export default auth(async (req: NextRequest): Promise<any> => {
  const pathname = req.nextUrl.pathname;
  // @ts-ignore
  const isLoggedIn = !!req.auth;
  const isMobileApp = req.nextUrl.searchParams.get(Config.IS_MOBILE_COOKIE) || '';
  const isMobileAppFromCookie = req.cookies.get(Config.IS_MOBILE_COOKIE)?.value || '';
  const isReferralParam = req.nextUrl.searchParams.get(Config.REFERRAL_PARAM) || '';
  const response = NextResponse.next();
  const userAgent = req.headers.get('user-agent');
  const isAndroid = userAgent?.match(/Android/i) !== null;
  const isIOS = userAgent?.match(/iPhone|iPad|iPod/i) !== null;
  const platform = isMobileAppFromCookie ? isMobileAppFromCookie : isAndroid ? 'android' : isIOS ? 'ios' : '';
  const settings = (await public_get_api({ path: 'settings' }))?.data || {};
  const offer_default_filter = settings?.default?.offer_default_filter || 'popular';
  const isClickCode = req.nextUrl.searchParams.get(Config.CLICK_CODE_COOKIE) || '';
  const isSource = req.nextUrl.searchParams.get(Config.SOURCE_COOKIE) || '';
  const utmSourceParam = req.nextUrl.searchParams.get(Config.UTM_SOURCE_COOKIE) || '';
  const publisherIdParam = req.nextUrl.searchParams.get(Config.PUBLISHER_ID_COOKIE) || '';
  const transactionIdParam = req.nextUrl.searchParams.get(Config.TRANSACTION_ID_COOKIE) || '';

  // Detect locale from IP using headers
  // const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || '::1';

  let userLocale = FALLBACK_LOCALE;
  const existingLocale = req.cookies.get(LANGUAGE_COOKIE)?.value;
  const countryCode = req.headers.get('cf-ipcountry') || '';
  const countryCookie = req.cookies.get(Config.COUNTRY_COOKIE)?.value;
  if (countryCode && countryCookie !== countryCode) {
    response.cookies.set(Config.COUNTRY_COOKIE, countryCode, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (!existingLocale) {
    const langCode = countryToLanguageMap[countryCode] || FALLBACK_LOCALE;

    const matchedLang = settings?.languages
      ? settings?.languages?.find((lang) => lang.code === langCode && lang.is_enabled)
      : null;
    userLocale = matchedLang?.code || FALLBACK_LOCALE;
    if (isLoggedIn) {
      try {
        await public_post_api({ path: `user/update`, body: { lang: userLocale } });
      } catch (error) {
        console.log('🚀 ~ auth ~ error:', error);
      }
    }
    response.cookies.set(LANGUAGE_COOKIE, userLocale, {
      path: '/',
    });
  }

  if (isReferralParam) {
    // response.cookies.set(Config.REFERRAL_PARAM, isReferralParam, {
    //   path: '/',
    //   domain: `.${Config.root_domain}`,
    // });
    const updatedUrl = new URL(req.url);
    updatedUrl.searchParams.delete(Config.REFERRAL_PARAM);
    const redirectResponse = NextResponse.redirect(updatedUrl.toString());
    redirectResponse.cookies.set(Config.REFERRAL_PARAM, isReferralParam, {
      path: '/',
      domain: `.${Config.ROOT_DOMAIN}`,
    });

    return redirectResponse;
  }

  const shouldStoreDaisyconAttribution =
    utmSourceParam &&
    publisherIdParam &&
    transactionIdParam &&
    utmSourceParam.toLowerCase() === 'daisycon';

  if (shouldStoreDaisyconAttribution) {
    const updatedUrl = new URL(req.url);
    updatedUrl.searchParams.delete(Config.UTM_SOURCE_COOKIE);
    updatedUrl.searchParams.delete(Config.PUBLISHER_ID_COOKIE);
    updatedUrl.searchParams.delete(Config.TRANSACTION_ID_COOKIE);

    const redirectResponse = NextResponse.redirect(updatedUrl.toString());
    const cookieOptions = {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      domain: `.${Config.ROOT_DOMAIN}`,
    } as const;

    redirectResponse.cookies.set(Config.UTM_SOURCE_COOKIE, utmSourceParam, cookieOptions);
    redirectResponse.cookies.set(Config.PUBLISHER_ID_COOKIE, publisherIdParam, cookieOptions);
    redirectResponse.cookies.set(Config.TRANSACTION_ID_COOKIE, transactionIdParam, cookieOptions);

    return redirectResponse;
  }

  if (isClickCode && isSource == 'affiliate') {
    response.cookies.set(Config.CLICK_CODE_COOKIE, isClickCode, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      domain: `.${Config.ROOT_DOMAIN}`,
    });

    const updatedUrl = new URL(req.url);
    updatedUrl.searchParams.delete(Config.CLICK_CODE_COOKIE);
    updatedUrl.searchParams.delete(Config.SOURCE_COOKIE);
    const redirectResponse = NextResponse.redirect(updatedUrl.toString());
    redirectResponse.cookies.set(Config.CLICK_CODE_COOKIE, isClickCode, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      domain: `.${Config.ROOT_DOMAIN}`,
    });

    return redirectResponse;
  }

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(pathname)) return true;
    if (pathname.startsWith('/single-store/')) return true;
    return false;
  });
  // const isPublicRoute = publicRoutes.includes(pathname);
  // const isPublicRoute = publicRoutes.some((routes) => pathname.startsWith(routes)) || pathname === '/';
  const isAuthRoute = authRoutes.includes(pathname);

  if (isMobileApp) {
    response.cookies.set(Config.IS_MOBILE_COOKIE, isMobileApp || platform, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const url = new URL(req.url);
      const queryParams = url.search;

      if (pathname === '/register' && url.searchParams.has('referral')) {
        const response = NextResponse.redirect(new URL(`${DEFAULT_LOGIN_REDIRECT}?already_logged_in=true`, req.url));
        return response;
      }

      const response = NextResponse.redirect(new URL(`${DEFAULT_LOGIN_REDIRECT}${queryParams}`, req.url));
      // setMobileCookie(response);
      return response;
    }
    return response;
  }

  if ((pathname === DEFAULT_LOGIN_REDIRECT || pathname === '/offers') && !req.nextUrl.searchParams.get('sort_by')) {
    const updatedUrl = new URL(req.url);
    if (platform) updatedUrl.searchParams.set('platform', platform);
    updatedUrl.searchParams.set('sort_by', offer_default_filter);
    const response = NextResponse.redirect(updatedUrl.toString());
    if (isMobileApp)
      response.cookies.set(Config.IS_MOBILE_COOKIE, isMobileApp || platform, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

    return response;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const response = NextResponse.redirect(new URL('/register', req.url));
    if (isMobileApp)
      response.cookies.set(Config.IS_MOBILE_COOKIE, isMobileApp || platform, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    // setMobileCookie(response);
    return response;
  }

  return response;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

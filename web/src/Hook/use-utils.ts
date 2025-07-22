import { booleanDefaultFalseAtomFamily, currencyTypeAtom, objectAtomFamily, stringAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Cookies from 'js-cookie';
import { config } from '@/config';
import dayjs from 'dayjs';
import { logout } from '@/actions/auth-actions';
import { deleteAllCookies, removeUserEmailFromOneSignal } from '@/Helper/utils';
import { Toast } from '@/components/Core/Toast';
import { useTranslation } from '@/i18n/client';
import { FALLBACK_LOCALE, LANGUAGE_COOKIE } from '@/i18n/settings';

export const useUtils = () => {
  const [previousUrl, setPreviousUrl] = useRecoilState(stringAtomFamily(atomKey.previousUrl));
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const settings_loading: any = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.settings_loading));
  const [showCurrencyInPoint, setShowCurrencyInPoint] = useRecoilState(currencyTypeAtom);
  const { t } = useTranslation();
  const userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  const isMobileBrowser = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent || '');
  const isMobileApp = Cookies.get(config.IS_MOBILE_COOKIE) ? true : false;
  const isIosApp = Cookies.get(config.IS_MOBILE_COOKIE) === 'ios' && settings?.default?.disable_ios_offers;
  const click_code = Cookies.get(config.CLICK_CODE_COOKIE);
  const referralCode = Cookies.get(config.REFERRAL_PARAM);

  useEffect(() => {
    Cookies.set(config.CURRENCY_SHOW_COOKIE, showCurrencyInPoint ? 'true' : 'false', { path: '/' });
    return () => {};
  }, [showCurrencyInPoint]);

  const getTranslatedValue = (key) => {
    let lang;
    if (typeof key == 'object') {
      let local = Cookies.get(LANGUAGE_COOKIE) || FALLBACK_LOCALE;
      lang = key ? (key?.[local] ? key?.[local] : key?.[FALLBACK_LOCALE]) : '';
    } else {
      lang = key;
    }
    return lang;
  };

  const useDebounce = (value: any, delay: any) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return debouncedValue;
  };

  // function formattedCurrency(currencyString) {
  //   const currencyValue: any = currencyString?.slice(getCurrencyString(currencyString));
  //   const currencySymbol: any = getCurrencyString(currencyString);
  //   const decimalValue = currencyValue?.split('.')?.[1];
  //   console.log('🚀 ~ formattedCurrency ~ decimalValue:', decimalValue);
  //   return {
  //     fixedCurrency: currencyValue ? `${currencySymbol?.slice(0, 1)}${Math.floor(currencyValue)}` : '',
  //     decimalCurrency: decimalValue,
  //   };
  // }

  function formattedCurrency(amount) {
    if (settings_loading || !settings || Object.values(settings)?.length < 1) return Number(amount)?.toFixed(2).toString();

    if (!amount || isNaN(Number(amount))) {
      return { fixedCurrency: '', decimalCurrency: '' };
    }
    if (!settings_loading) {
      const formatter = new Intl.NumberFormat(`${settings?.default?.default_lang}-${settings?.default?.default_country}`, {
        style: 'currency',
        currency: settings?.default?.default_currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const parts = formatter.formatToParts(Number(amount));

      const currencySymbol = parts.find((p) => p.type === 'currency')?.value || '';
      const integerPart = parts.find((p) => p.type === 'integer')?.value || '0';
      const decimalPart = parts.find((p) => p.type === 'fraction')?.value || '00';
      return {
        fixedCurrency: `${currencySymbol}${integerPart}`,
        decimalCurrency: decimalPart,
      };
    } else {
      return { fixedCurrency: '', decimalCurrency: '' };
    }
  }
  function formattedDate(date) {
    return dayjs(date).format(settings?.default?.default_date_format || config.DEFAULT_DATE_FORMATE);
  }

  function formattedDateWithTime(date) {
    return dayjs(date).format(settings?.default?.default_date_time_format || config.DEFAULT_DATE_FORMATE_WITH_TIME);
  }

  const getCurrencyString = (amount: any) => {
    if (settings_loading || !settings || Object.values(settings)?.length < 1) {
      return Number(amount)?.toFixed(2).toString();
    }

    let string = '';

    if (!settings_loading) {
      if (!showCurrencyInPoint) {
        const locale = `${settings?.default?.default_lang}-${settings?.default?.default_country}`;
        const currency = settings?.default?.default_currency;
        const decimalPlaces = settings?.default?.earning_amount_round || 2;

        string = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
          currencyDisplay: 'narrowSymbol',
        }).format(Number(amount));
      } else {
        // Show as points
        const points = Number(amount) * (settings?.default?.point_conversion_rate || 1000);
        string = points.toFixed(0).toString();
      }

      return string.replace(/\s/g, '');
    } else {
      return Number(amount)?.toFixed(2).toString();
    }
  };

  const calculateTimeLeft = (time) => {
    const difference = +new Date(time) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)), // Calculate days
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), // Remaining hours
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)), // Remaining minutes
        seconds: Math.floor((difference % (1000 * 60)) / 1000), // Remaining seconds
      };
    }

    return timeLeft;
  };

  function updatePreviousUrl() {
    setPreviousUrl(location.pathname + location.search);
  }
  function logoutUser(message) {
    if (typeof window !== 'undefined' && isMobileApp && window.ReactNativeWebView !== undefined) {
      window.ReactNativeWebView.postMessage('NEXTJS_LOGOUT');
    }
    logout().finally(() => {
      deleteAllCookies();
      // Cookies.remove(config.NEXT_AUTH_COOKIE_NAME);
      // Cookies.remove(config.SOCIAL_AUTH_COOKIE_NAME);
      removeUserEmailFromOneSignal();
      Toast.show(t(message));
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    });
  }
  const handleSocialSignin = (type) => {
    const queryParams = new URLSearchParams();

    const referralCodeFromCookie = Cookies.get(config.REFERRAL_PARAM) || referralCode;
    if (referralCodeFromCookie) {
      queryParams.append('referrer_code', referralCodeFromCookie);
      Cookies.remove(config.REFERRAL_PARAM);
    }

    if (click_code) {
      queryParams.append(config.CLICK_CODE_COOKIE, click_code);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const socialLoginUrl = `${config.API_END_POINT}auth/${type}${queryString}`;

    if (isMobileApp && typeof window !== 'undefined' && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: `${type.toUpperCase()}_SIGNIN`,
          url: socialLoginUrl,
        })
      );
    } else {
      window.open(socialLoginUrl, '_self');
    }
  };
  return {
    useDebounce,
    formattedCurrency,
    getCurrencyString,
    calculateTimeLeft,
    updatePreviousUrl,
    setShowCurrencyInPoint,
    showCurrencyInPoint,
    previousUrl,
    formattedDate,
    formattedDateWithTime,
    logoutUser,
    isMobileBrowser,
    isMobileApp,
    getTranslatedValue,
    handleSocialSignin,
    isIosApp,
  };
};

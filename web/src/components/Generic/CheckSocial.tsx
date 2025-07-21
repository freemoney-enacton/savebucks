'use client';
import { directLogin } from '@/actions/auth-actions';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes-config';
import { useEffect } from 'react';
import { Toast } from '../Core/Toast';
import { Spinner } from '@nextui-org/react';
import { config } from '@/config';
import Cookies from 'js-cookie';

const CheckSocial = ({ token, action }) => {
  const click_code = Cookies.get(config.CLICK_CODE_COOKIE);
  useEffect(() => {
    (async () => {
      if (token) {
        try {
          directLogin({ token })
            .then(async (res) => {
              if (res?.error) {
                Toast.error(res?.error || 'Something went wrong');
              }

              const userInfo = await fetch(`${config.API_END_POINT}user/me`, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `${token}`,
                },
                method: 'GET',
              }).then((res) => res.json());

              if (userInfo?.data?.email && typeof window !== 'undefined' && window.ReactNativeWebView)
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'LOGIN_SUCCESS',
                    data: {
                      email: userInfo.data.email,
                    },
                  })
                );
              if (click_code && action == 'register') {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'REMOVE_AFFILIATE_DATA',
                  })
                );
              }
              if (click_code && action == 'register') {
                Cookies.remove(config.CLICK_CODE_COOKIE, { domain: `.${config.ROOT_DOMAIN}` });
              }
              window.location.replace(window.location.origin + DEFAULT_LOGIN_REDIRECT);
              // router.push(DEFAULT_LOGIN_REDIRECT);
            })
            .catch((err) => {
              console.log('🚀 ~ directLogin ~ err:', err);
            });
        } catch (error) {
          console.log('🚀 ~ response:', error);
        }
      } else {
      }
    })();

    return () => {};
  }, []);

  return (
    <>
      <div className="container">
        <div className="min-h-screen flex items-center justify-center">
          <Spinner color="default" labelColor="foreground" className="flex-shrink-0 h-12 w-12" />
        </div>
      </div>
    </>
  );
};

export default CheckSocial;

'use client';
import { setUserEmailInOneSignal } from '@/Helper/utils';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const AuthLayout = ({ children }) => {
  const { data, status }: any = useSession();
  const { public_get_api } = usePublicApi();
  const { logoutUser } = useUtils();

  useEffect(() => {
    (async () => {
      if (status === 'authenticated') {
        const token = data?.user?.token;
        if (token) {
          public_get_api({ path: `validate?token=${token}`, isBaseURL: true }).then((res) => {
            if (res?.status == 403 || res?.status == 401) {
              logoutUser('session_expired');
            } else {
              setUserEmailInOneSignal(data);
            }
          });
        }
      }
    })();
  }, [JSON.stringify(data?.user)]);

  return <>{children}</>;
};

export default AuthLayout;

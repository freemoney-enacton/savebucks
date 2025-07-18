import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import OneSignal from 'react-onesignal';

const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID as string;

const useOneSignal = () => {
  const { data, status }: any = useSession();

  const initializeOneSignal = async () => {
    await OneSignal.init({
      appId: oneSignalAppId,
      notifyButton: { enable: true },
      allowLocalhostAsSecureOrigin: true,
    } as any);

    await OneSignal.Notifications?.requestPermission();
    await OneSignal.Slidedown?.promptPush();
  };

  useEffect(() => {
    subscribe(data?.user?.user?.email);
    return () => {};
  }, [status]);

  const subscribe = useCallback(async (userId) => {
    if (userId) {
      await initializeOneSignal();
      if (userId){
        await OneSignal.login(userId);
        await OneSignal.User.addEmail(userId);

      } 
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    await OneSignal.logout();
  }, []);

  return { subscribe, unsubscribe };
};

export default useOneSignal;

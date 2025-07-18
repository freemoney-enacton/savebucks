'use client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

function CheckUserKyc({}: any) {
  const { status, update }: any = useSession();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  const checkStatus = async () => {
    if (settings?.services?.kyc_verification_enabled) {
      if (status === 'authenticated') {
        await update({ updated: true });
      }
    }
  };
  useEffect(() => {
    checkStatus();
  }, []);
  return <></>;
}

export default CheckUserKyc;

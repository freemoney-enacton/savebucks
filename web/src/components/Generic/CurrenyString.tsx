'use client';
import { useUtils } from '@/Hook/use-utils';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';

const CurrencyString = ({ children }) => {
  const { showCurrencyInPoint } = useUtils();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  return (
    <span className="flex items-center gap-1.5">
      {showCurrencyInPoint && settings?.default?.token_icon ? (
        <Image alt="icon" width={20} height={20} src={settings?.default?.token_icon} />
      ) : null}
      {children}
    </span>
  );
};

export default CurrencyString;

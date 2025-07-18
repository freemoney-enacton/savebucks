import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import Link from 'next/link';
import React from 'react';
import { useIntercom } from 'react-use-intercom';
import { useRecoilValue } from 'recoil';

export default function FooterLink({ name, url, target = '_blank' }: any) {
  const { show, hide, isOpen } = useIntercom();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  return url == '/support' && settings && settings?.services?.intercom_enabled ? (
    <div
      className="text-footer-text font-medium hover:text-primary transition-ease cursor-pointer"
      onClick={() => {
        isOpen ? hide() : show();
      }}
    >
      {name}
    </div>
  ) : (
    <Link className="text-footer-text font-medium hover:text-primary transition-ease" href={url} target={target}>
      {name}
    </Link>
  );
}

'use client';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import SkeletonComponent from '../Skeleton/SkeletonComponent';
import { useRouter } from 'next-nprogress-bar';

export default function EmptyHeader({ redirect_home = false }) {
  const router = useRouter();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const handleBack = () => {
    if (redirect_home) {
      // bitlab survey manipulate browser history
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <header className="py-3 sm:py-4 bg-black-600 text-white relative z-20">
      <nav className="secondary-container">
        <div className="flex items-center gap-3 sm:gap-5">
          <button className="-m-2 p-2" onClick={() => handleBack()}>
            <ChevronLeftIcon className="size-4 sm:size-6" />
          </button>

          <Link href="/" className="logo-wrapper h-10 grid place-content-center">
            {!settings?.default?.logo ? (
              <SkeletonComponent count={1} className="max-sm:hidden h-10 w-20 rounded-full" />
            ) : (
              <Image
                className="logo-img max-h-6 sm:max-h-10 !w-auto h-auto"
                src={settings?.default?.logo}
                alt="logo"
                width={1000}
                height={300}
              />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

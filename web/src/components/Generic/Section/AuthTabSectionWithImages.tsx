'use client';
import React from 'react';
import AuthTab from '../AuthTab';
import Link from 'next/link';
import Image from 'next/image';
import useMobileBreakpoint from '@/Hook/use-mobile';
import { useUtils } from '@/Hook/use-utils';
import { useRecoilValue } from 'recoil';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';

const AuthTabSectionWithImages = ({ data }: { data: any }) => {
  const { isTablet } = useMobileBreakpoint();
  const { isMobileApp } = useUtils();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  return (
    <section className="relative z-0 overflow-x-clip overflow-y-visible section !pt-0">
      <div className="container">
        <div className="max-w-[1186px] max-sm:max-w-[400px] max-md:max-w-[400px] mx-auto grid md:grid-cols-2 items-center gap-6">
          <div className="relative space-y-4 sm:space-y-7">
            {/* repeater images */}
            <div className="max-w-[590px] grid grid-cols-3 gap-2 sm:gap-4 items-end">
              {data?.myitems?.length > 0 &&
                data?.myitems.map((item, index) =>
                  item?.link ? (
                    <Link href={item?.link || '/'} target="_blank" key={index} className="transition-ease hover:scale-105">
                      {item?.image ? (
                        <Image className="w-full h-auto" src={item?.image} alt="images" width={5000} height={2000} />
                      ) : null}
                    </Link>
                  ) : item?.image ? (
                    <Image key={index} className="w-full h-auto" src={item?.image} alt="images" width={5000} height={2000} />
                  ) : null
                )}
            </div>
            {/* mobile store images */}
            {!isMobileApp ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {data?.play_store_link && (
                  <Link
                    target="_blank"
                    className="h-7 sm:h-11 transition-ease hover:scale-105"
                    href={data?.play_store_link || '/'}
                  >
                    {data?.play_store_image ? (
                      <Image
                        className="max-h-7 sm:max-h-11 w-auto h-auto"
                        src={data?.play_store_image}
                        alt="store icon"
                        width={5000}
                        height={2000}
                      />
                    ) : null}
                  </Link>
                )}
                {data?.app_store_link && (
                  <Link
                    target="_blank"
                    className="h-7 sm:h-11 transition-ease hover:scale-105"
                    href={data?.app_store_link || '/'}
                  >
                    {data?.app_store_image ? (
                      <Image
                        className="max-h-7 sm:max-h-11 w-auto h-auto"
                        src={data?.app_store_image}
                        alt="store icon"
                        width={5000}
                        height={2000}
                      />
                    ) : null}
                  </Link>
                )}
              </div>
            ) : null}
            {settings.default?.trust_pilot_logo && settings.default?.trust_pilot_link && (
              <div className="!mt-3">
                <Link
                  href={settings.default?.trust_pilot_link || '/'}
                  target="_blank"
                  className="h-7 transition-ease hover:opacity-80"
                >
                  <Image
                    className="max-h-7 w-auto h-auto"
                    src={settings.default?.trust_pilot_logo}
                    alt="trust-pilot"
                    width={5000}
                    height={2000}
                  />
                </Link>
              </div>
            )}
            {/* rich text */}
            {/* {data?.description && <div className="" dangerouslySetInnerHTML={{ __html: data?.description }}></div>} */}
          </div>
          <div className="relative min-h-[472px] max-w-[400px] lg:max-w-[460px] mx-auto w-full bg-black-600 p-4 sm:p-6 border border-gray-400 rounded-lg z-[1]">
            <AuthTab id="home-auth" />
          </div>
        </div>
      </div>
      {/* bg decoration image */}
      {isTablet === false && (
        <Image
          width={4000}
          height={2000}
          src="/images/full-wave-bg.png"
          className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[-2]"
          alt="bg-img"
        />
      )}
    </section>
  );
};

export default AuthTabSectionWithImages;

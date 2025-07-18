'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import FooterLink from './FooterLink';
import FooterAccordian from './FooterAccordian';
import FooterTitle from './FooterTitle';
import SkeletonComponent from '../Skeleton/SkeletonComponent';
import GenericCTA from '../GenericCTA';
import { AppRoutes } from '@/routes-config';
import LangDropdown from '../LangDropdown/LangDropdown';

const Footer = ({ session, className = '' }: { session: any; className?: string }) => {
  const loggedIn = !!session?.user?.token;
  const { public_get_api } = usePublicApi();
  const [footerContent, setFooterContent] = useState([]);

  useEffect(() => {
    public_get_api({ path: 'cms/footers' }).then((res) => {
      if (res?.data && res?.success) {
        setFooterContent(res?.data ? res?.data.sort((a, b) => a.sort_order - b.sort_order) : []);
      }
    });
  }, []);
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  // @ts-ignore
  const bottomLinks: any[] = footerContent
    ?.filter((item: any) => item?.footer_type === 'bottom_links')
    ?.flatMap((item: any) => item.footer_value || []);

  // app stores
  const appStores = [
    {
      key: 'ios',
      url: settings?.download?.app_ios_link,
      imageUrl: '/svg/app-store.svg',
      altText: 'Download on the App Store',
    },
    {
      key: 'android',
      url: settings?.download?.app_android_link,
      imageUrl: '/svg/google-play.svg',
      altText: 'Get it on Google Play',
    },
  ];

  const AppLink = ({ url, imageUrl, altText }) => {
    if (!url) return null;

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block">
        <Image height={80} width={240} src={imageUrl} alt={altText} className="max-h-8 sm:max-h-9 !w-auto" />
      </a>
    );
  };

  const RenderFooterContent = ({ item, index }) => {
    switch (item?.footer_type) {
      case 'about_us':
        return (
          <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4 mx-auto" key={index}>
            <Link href={AppRoutes.home} className="logo-wrapper h-10 flex items-center">
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
            <div className="text-footer-text space-y-2 text-sm">
              <div dangerouslySetInnerHTML={{ __html: item?.footer_value?.about }}></div>
              <div className="pt-4 flex items-center flex-wrap gap-2">
                {appStores.map((store) => (
                  <AppLink key={store.key} url={store.url} imageUrl={store.imageUrl} altText={store.altText} />
                ))}
                <div className="flex items-center gap-2">
                  <LangDropdown className="!py-[7px] sm:!py-2" />
                  {settings?.default?.trust_pilot_logo && settings?.default?.trust_pilot_link && (
                    <Link
                      href={settings.default?.trust_pilot_link || '/'}
                      target="_blank"
                      className="transition-ease hover:opacity-80 align-middle"
                    >
                      <Image
                        className="max-h-7 w-auto h-auto"
                        src={settings.default?.trust_pilot_logo}
                        alt="trust-pilot"
                        width={5000}
                        height={2000}
                      />
                    </Link>
                  )}
                </div>
              </div>
              {/* <p>{item?.footer_value?.copyright}</p> */}
              {/* <p>{item?.footer_value?.name}</p> */}
            </div>
          </div>
        );
      case 'links':
        return (
          <div className="col-span-12 sm:col-span-4 md:col-span-3" key={index}>
            <FooterAccordian title={item?.title}>
              <ul className="space-y-2.5">
                {item?.footer_value &&
                  item?.footer_value.map((link, index) => (
                    <li key={index}>
                      <FooterLink name={link.label} url={link.url} target={link?.open_newtab ? '_blank' : '_self'} />
                    </li>
                  ))}
              </ul>
            </FooterAccordian>
            <div className="max-sm:hidden space-y-[18px]">
              <FooterTitle title={item?.title} />
              <ul className="space-y-[18px]">
                {item?.footer_value &&
                  item?.footer_value.map((link, index) => (
                    <li key={index}>
                      <FooterLink name={link.label} url={link.url} target={link?.open_newtab ? '_blank' : '_self'} />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        );
      case 'social_links':
        return (
          <div className="col-span-12 sm:col-span-4 md:col-span-3" key={index}>
            <FooterAccordian title={item?.title}>
              <div className="flex items-center gap-4 flex-wrap">
                {item?.footer_value &&
                  Object.entries(item?.footer_value)
                    .filter(([key, value]) => value !== null)
                    .map(([key, value]: any) => (
                      <Link key={key} href={value} className="text-gray-500 font-medium link " target="_blank">
                        <Image
                          src={`/images/${key}.png`}
                          className="w-[30px] h-[30px] hover:opacity-80 transition-ease"
                          alt="social-icons"
                          width={30}
                          height={30}
                        />
                      </Link>
                    ))}
              </div>
            </FooterAccordian>
            <div className="max-sm:hidden space-y-[18px] w-fit ml-auto">
              <FooterTitle title={item?.title} />
              <div className="flex items-center gap-4 flex-wrap max-w-[130px]">
                {item?.footer_value &&
                  Object.entries(item?.footer_value)
                    .filter(([key, value]) => value !== null)
                    .map(([key, value]: any) => (
                      <Link key={key} href={value} className="text-gray-500 font-medium link " target="_blank">
                        <Image
                          src={`/images/${key}.png`}
                          className="w-[30px] h-[30px] hover:opacity-80 transition-ease"
                          alt="social-icons"
                          width={30}
                          height={30}
                        />
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };
  return (
    <footer
      className={`footer bg-footer pt-6 sm:pt-12 xl:pl-[224px] mt-5s sm:mt-10s lg:mt-12s ${
        settings?.cta_bar?.cta_enabled && settings?.cta_bar?.cta_location == 'footer'
          ? 'pb-36 sm:pb-40 xl:pb-24'
          : `${loggedIn ? 'pb-24 sm:pb-28 xl:pb-16' : 'pb-10 xl:pb-16'}`
      } ${className}`}
    >
      <div className="container">
        <div className="grid sm:grid-cols-12 gap-4 sm:gap-6">
          {footerContent?.length > 0 &&
            footerContent?.map((item, index) => <RenderFooterContent key={index} item={item} index={index} />)}
        </div>
        {settings?.default?.copyright ? (
          <div className="ftr_btm px-2.5 flex flex-wrap items-center justify-center md:justify-between gap-3 mt-8 sm:mt-14 pt-6 sm:pt-[30px] text-footer-text font-medium border-t border-footer-text">
            <p>{settings?.default?.copyright}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-normal gap-2">
              {bottomLinks?.map((item: any, index: number) => (
                <span key={index} className="group flex items-center gap-2">
                  <FooterLink name={item.label} url={item?.url || '/'} target={item?.open_newtab ? '_blank' : '_self'} />
                  <span className="group-last:hidden">|</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="max-xl:hidden fixed bottom-0 right-0 left-0 xl:left-[224px]">
        {settings?.cta_bar?.cta_enabled && settings?.cta_bar?.cta_location == 'footer' && <GenericCTA />}
      </div>
    </footer>
  );
};

export default Footer;

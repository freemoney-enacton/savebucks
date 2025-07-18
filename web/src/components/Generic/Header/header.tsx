'use client';
import AuthModal from '@/components/Core/AuthModal';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { numberAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import ButtonComponent from '../ButtonComponent';
import ChatDesktopComponent from '../Chat/ChatDesktopComponent';
import NotificationDropdown from '../dropdowns/NotificationDropdown';
import ProfileDropdown from '../dropdowns/ProfileDropdown';
import GenericCTA from '../GenericCTA';
import SkeletonComponent from '../Skeleton/SkeletonComponent';
import TickerBar from '../TickerBar';
import CurrencyString from '../CurrenyString';
import Cookies from 'js-cookie';
import useMobileBreakpoint from '@/Hook/use-mobile';
import { useIntercom } from 'react-use-intercom';
import { KeyIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { AppRoutes } from '@/routes-config';
import { SvgChat, SvgNotification } from '../Icons';
import LangDropdown from '../LangDropdown/LangDropdown';
import useGlobalState from '@/Hook/use-global-state';
import { useRouter, useSearchParams } from 'next/navigation';

const Header = ({
  session,
  stats,
  showTicker = true,
  homepageHeader = false,
}: {
  session: any;
  stats: any;
  showTicker?: boolean;
  homepageHeader?: boolean;
}) => {
  const { t } = useTranslation();
  const isMobileApp = Cookies.get('isMobileApp');
  const { isMobile } = useMobileBreakpoint();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { getCurrencyString, showCurrencyInPoint } = useUtils();
  const [onsignInClick, setOnsignInClick] = useState(false);
  const { toggleChatSidebarValue, setToggleChatSidebarValue } = useGlobalState();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const chatMentionCounter: any = useRecoilValue(numberAtomFamily(atomKey.chatMentionCounter));
  const notificationMentionCounter: any = useRecoilValue(numberAtomFamily(atomKey.notificationMentionCounter));
  const [loading, setLoading] = useState(true);
  const { update } = useIntercom();
  let loggedIn = !!session?.user?.token;

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('chat') === 'open') {
      setToggleChatSidebarValue(true);
    }
  }, [searchParams, setToggleChatSidebarValue]);

  const handleCloseChat = () => {
    setToggleChatSidebarValue(false);

    const params = new URLSearchParams(window.location.search);
    params.delete('chat');
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    router.replace(newUrl, { scroll: false });
  };
  useEffect(() => {
    if (settings && Object.values(settings).length > 0) {
      setLoading(false);
    }
    return () => {};
  }, [settings]);
  useEffect(() => {
    if (toggleChatSidebarValue) {
      update({ horizontalPadding: 350 });
    } else {
      update({ horizontalPadding: 0 });
    }
  }, [toggleChatSidebarValue]);

  return (
    <>
      <header className="sticky top-0 z-20 bg-black-600 text-white shadow-sm">
        {settings?.cta_bar?.cta_enabled && settings?.cta_bar?.cta_location == 'header' && (
          <GenericCTA className="xl:pl-[calc(224px+24px)]" />
        )}
        {homepageHeader ? (
          <nav className="py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-2 border-b border-gray-400 overflow-hidden">
            {/* logo */}
            <Link
              href={AppRoutes.home}
              className={`flex-shrink-0 header-logo logo-wrapper h-7 sm:h-10 grid place-content-center`}
            >
              {!settings?.default?.logo ? (
                <SkeletonComponent count={1} className="max-sm:hidden h-10 w-32 rounded-lg" variant="secondary" />
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
            <div className="header-right-wrapper flex items-center justify-end gap-3 sm:gap-4 lg:gap-7 text-sm">
              {/* after login */}
              <div className="w-full ml-auto flex items-center justify-end gap-2.5 sm:gap-3">
                <LangDropdown />
                <ButtonComponent
                  onClick={() => {
                    onOpen();
                    setOnsignInClick(false);
                  }}
                  label={t('sign_up')}
                  role="button"
                  variant="primary"
                  icon={<RocketLaunchIcon className="size-4 sm:size-5" />}
                  customClass="header-sign-up-btn max-sm:hidden max-sm:!text-xs max-sm:!px-3"
                />

                <ButtonComponent
                  onClick={() => {
                    onOpen();
                    setOnsignInClick(true);
                  }}
                  label={t('login')}
                  role="button"
                  variant="outline"
                  icon={<KeyIcon className="size-4 sm:size-5" />}
                  customClass="max-sm:!text-xs max-sm:!px-3"
                />
              </div>
            </div>
          </nav>
        ) : (
          <nav className="py-2.5 sm:py-3 px-4 md:px-6 lg:px-8 xl:pr-10 xl:pl-[calc(224px+16px)] flex items-center sm:justify-between xl:justify-end gap-2 border-b border-gray-400 overflow-hidden">
            {/* logo */}
            <Link
              href={AppRoutes.home}
              className={`flex-shrink-0 header-logo logo-wrapper xl:hidden h-10 grid place-content-center ${
                loggedIn ? 'max-sm:hidden' : ''
              }`}
            >
              {!settings?.default?.logo ? (
                <SkeletonComponent count={1} className="max-sm:hidden h-10 w-32 rounded-full" variant="secondary" />
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
            {loggedIn && loading ? (
              <div className="w-full flex items-center justify-between sm:justify-end gap-2">
                <SkeletonComponent count={1} className="max-sm:mr-auto h-9 sm:h-[46px] w-16 sm:w-24" variant="secondary" />
                <SkeletonComponent count={1} className="max-sm:order-2 h-9 sm:h-[46px] w-16 sm:w-36" variant="secondary" />
                <SkeletonComponent count={1} className="size-9 sm:size-[46px]" variant="secondary" />
                <SkeletonComponent count={1} className="size-9 sm:size-[46px]" variant="secondary" />
              </div>
            ) : (
              <div className="w-full flex items-center justify-between sm:justify-end gap-2 text-sm">
                {/* <ThemeSwitch /> */}
                {loggedIn && (
                  <Link
                    href={AppRoutes.cashout}
                    className="header-cashout-link cursor-pointer h-9 sm:h-auto p-[9px] sm:p-3 flex items-center bg-black border border-gray-400 rounded-md"
                  >
                    <CurrencyString>
                      <p className="flex items-center gap-1 font-semibold text-xs sm:text-sm">
                        {!showCurrencyInPoint && <Image alt="icon" width={20} height={20} src="/images/euro-coin.png" />}
                        {getCurrencyString(stats?.availablePayout ? stats?.availablePayout : 0)}
                      </p>
                    </CurrencyString>
                  </Link>
                )}

                {/* after login */}
                {loggedIn ? (
                  <div className="flex items-center gap-2">
                    {!isMobileApp && !isMobile && <LangDropdown className="!py-[7px] sm:!py-3 max-sm:!px-2" />}
                    <ProfileDropdown />
                    <div className=" relative">
                      {isMobileApp ? (
                        <ButtonComponent
                          role="link"
                          url={AppRoutes.notification}
                          variant="small"
                          icon={<SvgNotification className="size-4 sm:size-5" />}
                        />
                      ) : (
                        <NotificationDropdown />
                      )}
                      {notificationMentionCounter ? (
                        <div className="h-3.5 sm:h-4 min-w-3.5 sm:min-w-4 px-1 flex items-center justify-center bg-red text-black text-[length:9px] sm:text-[10px] leading-3 font-semibold rounded-full absolute -top-1 -right-1 z-[1]">
                          {notificationMentionCounter}
                        </div>
                      ) : null}
                    </div>

                    {/* chat button */}
                    <div className="max-xl:hidden relative">
                      <ButtonComponent
                        role="button"
                        onClick={() => {
                          setToggleChatSidebarValue(!toggleChatSidebarValue);
                        }}
                        variant="small"
                        icon={<SvgChat className="size-4 sm:size-5" />}
                      />
                      {chatMentionCounter ? (
                        <div className="h-3.5 sm:h-4 min-w-3.5 sm:min-w-4 px-1 flex items-center justify-center bg-red text-black text-[length:9px] sm:text-[10px] leading-3 font-semibold rounded-full absolute -top-1 -right-1 z-[1]">
                          {chatMentionCounter}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="w-full ml-auto flex items-center justify-end gap-2.5 sm:gap-3">
                    {!isMobileApp && !isMobile && <LangDropdown />}
                    <ButtonComponent
                      onClick={() => {
                        onOpen();
                        setOnsignInClick(false);
                      }}
                      label={t('sign_up')}
                      role="button"
                      variant="primary"
                      icon={<RocketLaunchIcon className="size-4 sm:size-5" />}
                      customClass="header-sign-up-btn max-sm:!text-xs max-sm:!px-3"
                    />

                    <ButtonComponent
                      onClick={() => {
                        onOpen();
                        setOnsignInClick(true);
                      }}
                      label={t('login')}
                      role="button"
                      variant="outline"
                      icon={<KeyIcon className="size-4 sm:size-5" />}
                      customClass="max-sm:!text-xs max-sm:!px-3"
                    />
                  </div>
                )}
              </div>
            )}
          </nav>
        )}

        {/* ticker bar */}
        {showTicker && loggedIn && <TickerBar />}
      </header>
      <AuthModal
        isOpen={isOpen}
        selectedKey={onsignInClick ? 'signin' : 'signup'}
        onOpenChange={onOpenChange}
        onClose={onClose}
        id="auth-modal"
      />
      {loggedIn && <ChatDesktopComponent isOpen={toggleChatSidebarValue} setIsOpen={handleCloseChat} />}
    </>
  );
};

export default Header;

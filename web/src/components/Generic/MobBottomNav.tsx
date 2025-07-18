'use client';
import { config } from '@/config';
import useRoutes from '@/Hook/Common/use-routes';
import useMobileBreakpoint from '@/Hook/use-mobile';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useDisclosure } from '@nextui-org/react';
import { Key, Rocket } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import AuthModal from '../Core/AuthModal';
import ButtonComponent from './ButtonComponent';
import GenericCTA from './GenericCTA';
import LangDropdown from './LangDropdown/LangDropdown';
import MobFooterLinks from './MobFooterLinks';
import ModalComponent from './Modals/ModalComponent';
import StickyLinkCard from './StickyLinkCard';

export default function MobBottomNav() {
  const { t } = useTranslation();
  let navigate = usePathname();
  const { isMobile } = useMobileBreakpoint();
  const [onsignInClick, setOnsignInClick] = useState(false);
  const { stickyFooterLinks, menuNavLinks } = useRoutes();
  const { data: session, status }: any = useSession();
  const userInfo = session?.user?.user;
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  return (
    <>
      <div className="mob-bottom-nav xl:hidden w-full fixed bottom-0 left-0 right-0 bg-black shadow-100 z-10">
        {settings?.cta_bar?.cta_enabled && settings?.cta_bar?.cta_location == 'footer' && <GenericCTA />}
        <div className="max-w-[800px] mx-auto px-0">
          <div className="px-3 pb-3.5 sm:pb-4 grid grid-cols-5 items-center gap-2 sm:gap-2.5 text-center">
            <div className="grid place-content-center">
              <button className="ripple h-10" onClick={onOpen}>
                <Bars3Icon className="size-7 sm:size-10 stroke-[1.5]" />
              </button>
            </div>
            {stickyFooterLinks.map((link, index) => (
              <StickyLinkCard key={index} label={link.label} icon={link.icon} url={link.url} onClick={link.onClick} />
            ))}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authIsOpen}
        selectedKey={onsignInClick ? 'signin' : 'signup'}
        onOpenChange={authOnOpenChange}
        onClose={authOnClose}
        id="home-auth"
      />
      <ModalComponent
        placement={'bottom'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        customClass="max-w-[640px] max-xl:!mb-0 max-xl:!rounded-b-none"
      >
        <div className="py-1.5 space-y-5">
          {/* user details  only have to show when user is logged in */}
          {status === 'authenticated' ? (
            <>
              <div className="w-full flex items-end justify-between gap-2">
                <div className="w-full flex items-center gap-2">
                  {session?.user?.user?.avatar ? (
                    <div className="flex-shrink-0 w-10 h-10 grid place-content-center rounded-full overflow-hidden">
                      <Image
                        className="h-full w-full object-cover rounded-full"
                        src={session?.user?.user?.avatar}
                        alt="logo"
                        width={80}
                        height={80}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-700 grid place-content-center rounded-full">
                      <p className="text-[22px] text-black">{userInfo?.name ? userInfo?.name?.charAt(0)?.toUpperCase() : ''}</p>
                    </div>
                  )}

                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-white text-base font-medium line-clamp-1 break-all">{userInfo?.name}</h3>
                      {userInfo?.country_code && (
                        <div className="size-5 rounded-full overflow-hidden">
                          <Image
                            className="h-full w-full object-cover"
                            src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', userInfo?.country_code?.toLowerCase())}
                            alt="icon"
                            width={30}
                            height={30}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* tier code */}
                      {userInfo?.tierDetails && (
                        <div className="flex items-center gap-2.5">
                          {userInfo?.tierDetails.icon ? (
                            <Image
                              className="flex-shrink-0 max-h-5 !w-auto"
                              src={userInfo?.tierDetails.icon}
                              alt="icon"
                              width={30}
                              height={30}
                            />
                          ) : null}
                          <p className="text-white text-sm">{userInfo?.tierDetails?.label}</p>
                        </div>
                      )}
                      {/* level code */}
                      {/* <div className="flex items-center gap-2.5">
                        <Image
                          className="flex-shrink-0 max-h-5 !w-auto"
                          src="/images/level-1.png"
                          alt="icon"
                          width={30}
                          height={30}
                        />
                        <p className="text-white text-sm">{userInfo?.level?.current_level}</p>
                      </div> */}
                    </div>
                  </div>
                </div>
                {isMobile && (
                  <div className="flex-shrink-0">
                    <LangDropdown />
                  </div>
                )}
              </div>
              <div className="border-t border-gray-400"></div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              <ButtonComponent
                onClick={() => {
                  authOnOpen();
                  onClose();
                  setOnsignInClick(false);
                }}
                label={t('sign_up')}
                role="button"
                variant="outline"
                icon={<Key className="w-4 h-4 sm:w-5 sm:h-5" />}
                customClass="max-sm:!text-xs max-sm:!px-3"
              />

              <ButtonComponent
                onClick={() => {
                  authOnOpen();
                  onClose();
                  setOnsignInClick(true);
                }}
                label={t('sign_in')}
                role="button"
                variant="primary"
                icon={<Rocket fill="white" className="w-4 h-4 sm:w-5 sm:h-5" />}
                customClass="max-sm:!text-xs max-sm:!px-3"
              />
              {isMobile && <LangDropdown />}
            </div>
          )}
          <div>
            {menuNavLinks.filter(Boolean).map((link, index) =>
              link ? (
                <Link
                  href={link.url}
                  onClick={() => onClose()}
                  key={index}
                  className={`flex items-center gap-4 py-2.5 group ${
                    navigate.includes(link.url) ? 'text-primary' : 'text-white'
                  }`}
                >
                  <div className="">{link.icon}</div>
                  <p className="text-lg group-hover:text-primary transition-ease">{link.label}</p>
                </Link>
              ) : null
            )}
          </div>
          <MobFooterLinks />
        </div>
      </ModalComponent>
    </>
  );
}

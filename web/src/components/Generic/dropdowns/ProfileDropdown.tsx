'use client';
import useRoutes from '@/Hook/Common/use-routes';
import { useTranslation } from '@/i18n/client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
// import Link from 'next/link';
import { useUtils } from '@/Hook/use-utils';
import SwitchComponent from '@/components/Core/SwitchComponent';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import ButtonComponent from '../ButtonComponent';
import ModalComponent from '../Modals/ModalComponent';

export default function ProfileDropdown() {
  let navigate = usePathname();
  const { data: session }: any = useSession();
  const { links } = useRoutes();
  const { t } = useTranslation();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const [loadingLogout, setLoadingLogout] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { showCurrencyInPoint, setShowCurrencyInPoint, logoutUser } = useUtils();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isServer = typeof window === 'undefined';

  useEffect(() => {
    if (!isServer) {
      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const body = document.querySelector('body');

      if (body) {
        if (isDropdownOpen) {
          body.style.overflow = 'hidden';
          setTimeout(() => {
            body.style.overflow = 'hidden';
          }, 300);
          document.documentElement.style.overflow = 'visible';
          body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      }

      return () => {
        if (body) {
          // Check again in cleanup
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      };
    }
  }, [isDropdownOpen, isServer]);
  const DropContent = ({ data, setIsDropdownOpen }: any) => {
    const router = useRouter();
    return (
      <button
        // href={data.id == 7 ? 'javascript:void(0)' : data.url}
        onClick={() => {
          if (data.id == 7) {
            onOpen();
          } else {
            router.push(data.url);
          }
          setIsDropdownOpen(false);
        }}
        className={`group cursor-pointer w-full py-1.5 px-3 rounded-lg text-white flex items-center gap-2.5 transition-colors transition-ease ${
          navigate.includes(data.url) ? 'bg-gray-400' : 'hover:bg-gray-400'
        }`}
      >
        <div className="w-4 h-4">{data?.icon}</div>
        <p className="text-sm font-medium">{data.name}</p>
      </button>
    );
  };

  const onLogoutClick = () => {
    setLoadingLogout(true);
    logoutUser('logout_successful');
  };
  return (
    <>
      <Dropdown
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        classNames={{
          content: 'p-0 !min-w-[192px] !rounded-lg',
        }}
      >
        <DropdownTrigger className="group">
          <div
            role="button"
            className="max-sm:py-[7px] p-[9px] bg-black border border-gray-400 rounded-md flex items-center gap-2 max-sm:order-2"
          >
            {session?.user?.user?.avatar ? (
              <div className="size-5 sm:size-[26px] grid place-content-center rounded-full overflow-hidden">
                <Image
                  className="h-full w-full object-cover rounded-full"
                  src={session?.user?.user?.avatar}
                  alt="logo"
                  width={26}
                  height={26}
                />
              </div>
            ) : (
              <div className="bg-blue-700 size-5 sm:size-[26px] grid place-content-center rounded-full text-black">
                {session?.user?.user?.name ? session?.user?.user?.name?.charAt(0)?.toUpperCase() : ''}
              </div>
            )}
            <p className="max-sm:hidden max-w-20 truncate font-semibold">{session?.user?.user?.name}</p>
            <ChevronDownIcon className="size-3 stroke-[3px] group-aria-expanded:rotate-180 transition-ease" />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dynamic Actions"
          // items={items}
          classNames={{
            base: 'px-3.5 py-5 bg-black-600 border border-gray-400 rounded-lg',
          }}
          itemClasses={{
            base: [
              'cursor-auto p-0',
              'transition-opacity',
              'data-[hover=true]:text-inherit',
              'data-[hover=true]:bg-transparent',
              // add active class here
            ],
          }}
        >
          <DropdownItem isReadOnly key={'profile'}>
            <div className="space-y-1.5">
              {links.map((data, index) => (
                <DropContent data={data} key={index} setIsDropdownOpen={setIsDropdownOpen} />
              ))}
            </div>
          </DropdownItem>
          <DropdownItem key={'currency'} isReadOnly className="pt-1.5">
            <div onClick={(e) => e.preventDefault()}>
              <div className="py-1.5 px-3 flex items-center justify-between gap-2.5 text-xs font-medium">
                <p className="text-white">
                  {t('show_in')}
                  {settings?.default?.default_currency}
                </p>
                <SwitchComponent
                  isSelected={!showCurrencyInPoint}
                  onToggle={() => {
                    setShowCurrencyInPoint(!showCurrencyInPoint);
                  }}
                />
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} customClass="max-w-[480px] sm:max-w-[388px] !p-[30px]">
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="relative">
              <LogOut className="size-12 sm:size-16 text-white mx-auto" />
              <div className="absolute right-1/2 transform translate-x-1/2 -bottom-2 z-[0] bg-brown h-14 w-14 filter blur-[55px] rounded-full"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white text-sm font-medium">{t('are_you_sure_want_logout')}</p>
            </div>
            <div className="flex item-center justify-center gap-3.5">
              <ButtonComponent
                role="button"
                variant="outline"
                label={t('cancel')}
                customClass="!py-3"
                onClick={() => onClose()}
                disabled={loadingLogout}
              />
              <ButtonComponent
                isLoading={loadingLogout}
                role="button"
                variant="danger"
                label={t('logout')}
                onClick={() => {
                  onLogoutClick();
                }}
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </>
  );
}

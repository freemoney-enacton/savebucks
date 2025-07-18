'use client';
import { switchLocaleAction } from '@/actions/locale-actions';
import { FALLBACK_LOCALE, LANGUAGE_COOKIE } from '@/i18n/settings';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { Select, SelectItem } from '@nextui-org/react';
import Cookie from 'js-cookie';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function LangDropdown({ className }: { className?: string }) {
  const isServer = typeof window === 'undefined';
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const languages: any = settings?.languages;
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: session }: any = useSession();

  useEffect(() => {
    if (!languages) return;
    setSelectedLanguage(languages.find((item: any) => item.code == (Cookie.get(LANGUAGE_COOKIE) || FALLBACK_LOCALE))?.code || '');
  }, [settings]);

  useEffect(() => {
    if (!isServer) {
      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }

      return () => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      };
    }
  }, [isOpen, isServer]);

  const handleLanguageChange = (value: string) => {
    if (value) {
      setSelectedLanguage(value.toLowerCase());

      switchLocaleAction(value.toLowerCase(), session?.user?.user?.id ? true : false).finally(() => {
        window.location.reload();
      });
    }
  };

  if (isServer) return null;

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onClose={() => setIsOpen(false)}
      aria-label="Select language"
      items={languages ? languages : []}
      className="lang-dropdown min-w-16 sm:min-w-24 w-fit font-medium !rounded-lg"
      selectedKeys={[selectedLanguage]}
      classNames={{
        label: 'group-data-[filled=true]:-translate-y-5',
        trigger: `border border-gray-400 rounded-lg bg-white-gr justify-between py-1.5 sm:p-2.5 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-1 sm:gap-2 data-[hover=true]:bg-white-gr ${className}`,
        listboxWrapper: 'max-h-[160px] ',
      }}
      listboxProps={{
        itemClasses: {
          base: [
            'rounded-full',
            'text-white',
            'transition-opacity',
            'data-[hover=true]:bg-transparent',
            'data-[selectable=true]:!bg-transparent',
            'data-[pressed=true]:bg-transparent',
            'data-[focus-visible=true]:ring-0',
          ],
        },
      }}
      popoverProps={{
        classNames: {
          base: '!rounded-lg',
          content: 'p-0 bg-black-600 min-w-24 !rounded-lg border border-gray-400',
        },
      }}
      onChange={(e) => {
        handleLanguageChange(e.target.value);
      }}
      renderValue={(items) => {
        return items.map((item: any) => (
          <span key={item?.data?.name} className="flex items-center gap-2 font-medium">
            {item?.data?.code && (
              <span className="flex-shrink-0 size-5 rounded-full overflow-hidden">
                {item?.data?.flag ? (
                  <Image
                    className="h-full w-full object-cover"
                    src={item?.data?.flag}
                    alt={item?.data?.name}
                    height={20}
                    width={20}
                  />
                ) : null}
              </span>
            )}
            <p>{item?.data?.code ? item?.data?.code?.toUpperCase() : ''}</p>
          </span>
        ));
      }}
    >
      {(user: any) => (
        <SelectItem key={user.code} textValue={user?.code}>
          <span className="flex gap-2 items-center font-medium">
            {user.code && (
              <span className="flex-shrink-0 size-5 rounded-full overflow-hidden">
                {user?.flag ? (
                  <Image className="h-full w-full object-cover" src={user?.flag} alt={user.name} height={20} width={20} />
                ) : null}
              </span>
            )}
            <p>{user.code ? user.code?.toUpperCase() : ''}</p>
          </span>
        </SelectItem>
      )}
    </Select>
  );
}

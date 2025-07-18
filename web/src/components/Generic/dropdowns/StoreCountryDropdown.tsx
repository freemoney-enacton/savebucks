'use client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { Select, SelectItem } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function StoreCountryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const searchParamKey = 'country';
  const languages = settings?.countries ? [{ name: 'All', code: '' }, ...settings.countries] : [];

  useEffect(() => {
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
  }, [isOpen]);
  const params = new URLSearchParams(searchParams);

  const handleCountryChange = (e: string) => {
    const selectedValue = e;

    if (selectedValue) {
      params.set(searchParamKey, selectedValue);
    } else {
      params.delete(searchParamKey);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onClose={() => setIsOpen(false)}
      aria-label="Select country"
      items={languages}
      className="lang-dropdown min-w-32 w-fit font-medium !rounded-lg"
      selectedKeys={[params.get(searchParamKey) || languages[0]?.code]}
      classNames={{
        label: 'group-data-[filled=true]:-translate-y-5',
        trigger:
          'border border-gray-400 rounded-lg bg-white-gr justify-between py-1.5 sm:px-3 sm:py-3 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-1 sm:gap-2 data-[hover=true]:bg-white-gr',
        listboxWrapper: 'max-h-[160px]',
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
          title: '',
        },
      }}
      popoverProps={{
        placement: 'bottom-end',
        prefix: 'store-country-dropdown',
        classNames: {
          base: '!rounded-lg',
          content: 'p-0 bg-black-600 min-w-48 !rounded-lg border border-gray-400',
        },
      }}
      onChange={(e) => {
        const selectedValue = e.target.value;
        handleCountryChange(selectedValue);
      }}
      renderValue={(items) => {
        return items?.map((item: any) => <p key={item.key}>{item.textValue}</p>);
      }}
    >
      {(user: any) => (
        <SelectItem key={user.code} textValue={user.name}>
          <p>{user.name}</p>
        </SelectItem>
      )}
    </Select>
  );
}

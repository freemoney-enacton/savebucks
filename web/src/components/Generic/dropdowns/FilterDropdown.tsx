'use client';
import { config } from '@/config';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from '@/i18n/client';
import { SvgAndroid, SvgApple, SvgDesktop, SvgFunnel } from '../Icons';

export default function FilterDropdown() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamKey = 'platform';

  const handleDropdownChange = (keys) => {
    const params = new URLSearchParams(searchParams);
    const selectedValue = Array.from(keys).join(',');

    if (selectedValue) {
      params.set(searchParamKey, selectedValue);
    } else {
      params.delete(searchParamKey);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };
  const items = [
    {
      key: config.IOS_KEY,
      label: (
        <div className="flex items-center gap-2.5">
          <SvgApple className="flex-shrink-0 size-4" />
          <p className="text-sm">{t('filter_ios')}</p>
        </div>
      ),
    },
    {
      key: config.ANDROID_KEY,
      label: (
        <div className="flex items-center gap-2.5">
          <SvgAndroid className="flex-shrink-0 size-4" />
          <p className="text-sm">{t('filter_android')}</p>
        </div>
      ),
    },
    {
      key: config.DESKTOP_KEY,
      label: (
        <div className="flex items-center gap-2.5">
          <SvgDesktop className="flex-shrink-0 size-4" />
          <p className="text-sm">{t('filter_desktop')}</p>
        </div>
      ),
    },
  ];
  const initialSelectedKeys = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    const keys = params.get(searchParamKey);
    if (!keys || keys.length === 0) {
      return new Set(items.map((item) => item.key));
    } else {
      return new Set(keys.split(','));
    }
  }, [searchParams, items]);

  return (
    <Dropdown
      classNames={{
        content: 'p-0 !min-w-[144px] !rounded-lg',
      }}
    >
      <DropdownTrigger>
        <div role="button" className="small-icon-btn">
          <SvgFunnel className="size-4 sm:size-5" />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        items={items}
        classNames={{
          base: 'px-3.5 py-5 bg-black-600 border border-gray-400 rounded-lg',
        }}
        itemClasses={{
          base: [
            'cursor-auto p-0',
            'transition-opacity',
            'data-[hover=true]:text-inherit',
            'data-[hover=true]:bg-gray-400 group cursor-pointer w-full py-1.5 px-3 rounded-lg text-white flex items-center gap-2.5 transition-colors transition-ease',
            // add active class here
          ],
        }}
        selectionMode="multiple"
        disallowEmptySelection={false}
        // @ts-ignore
        selectedKeys={initialSelectedKeys}
        closeOnSelect={false}
        onSelectionChange={handleDropdownChange}
      >
        {(item) => (
          <DropdownItem
            className={`${
              searchParams?.get('platform')?.includes(item.key) || initialSelectedKeys.has(item.key) ? 'bg-gray-400' : ''
            } hover:bg-gray-400 transition-ease`}
            key={item.key}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

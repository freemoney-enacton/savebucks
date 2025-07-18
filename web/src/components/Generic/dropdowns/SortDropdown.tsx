'use client';
import { useTranslation } from '@/i18n/client';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, StarIcon } from '@heroicons/react/24/solid';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SvgFilter } from '../Icons';

export default function SortDropdown() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const searchParamKey = 'sort_by';

  const handleDropdownChange = (e) => {
    const selectedValue = e;

    const params = new URLSearchParams(searchParams);

    if (selectedValue) {
      params.set(searchParamKey, selectedValue);
    } else {
      params.delete(searchParamKey);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const items = [
    {
      key: 'popular',
      label: (
        <div className="group cursor-pointer w-full py-1.5 px-3 rounded-lg text-white flex items-center gap-2.5 transition-colors transition-ease">
          <StarIcon className="flex-shrink-0 size-4" />
          <p className="text-sm">{t('filter_most_popular')}</p>
        </div>
      ),
    },
    {
      key: 'highest_reward',
      label: (
        <div className="group cursor-pointer w-full py-1.5 px-3 rounded-lg text-white flex items-center gap-2.5 transition-colors transition-ease">
          <ChevronDoubleUpIcon className="flex-shrink-0 size-4" />
          <p className="text-sm">{t('filter_highest_reward')}</p>
        </div>
      ),
    },
    {
      key: 'lowest_reward',
      label: (
        <div className="group cursor-pointer w-full py-1.5 px-3 rounded-lg text-white flex items-center gap-2.5 transition-colors transition-ease">
          <ChevronDoubleDownIcon className="flex-shrink-0 size-4" />
          <p className="text-sm">{t('filter_lowest_reward')}</p>
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      classNames={{
        content: 'p-0 !min-w-[144px] !rounded-lg',
      }}
    >
      <DropdownTrigger>
        <div role="button" className="small-icon-btn">
          <SvgFilter className="size-4 sm:size-5" />
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
            'data-[hover=true]:bg-gray-400',
            // add active class here
          ],
        }}
        onAction={handleDropdownChange}
      >
        {(item) => (
          <DropdownItem
            className={`${searchParams?.get('sort_by') == item.key ? 'bg-gray-400' : ''} hover:bg-gray-400 transition-ease`}
            key={item.key}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

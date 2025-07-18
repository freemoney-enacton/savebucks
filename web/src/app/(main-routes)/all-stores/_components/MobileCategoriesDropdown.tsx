'use client';
import { useTranslation } from '@/i18n/client';
import { Select, SelectItem } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Dummy data (same as in CategoriesSidebar)
const dummyData = [
  {
    label: 'Category 1',
    url: '/single-store',
    showSubMenu: true,
    subMenuData: [
      { name: 'Subcategory 1-1', url: '/category-1/sub-1' },
      { name: 'Subcategory 1-2', url: '/category-1/sub-2' },
    ],
  },
  {
    label: 'Category 2',
    url: '/category-2',
    showSubMenu: true,
    subMenuData: [
      { name: 'Subcategory 2-1', url: '/category-2/sub-1' },
      { name: 'Subcategory 2-2', url: '/category-2/sub-2' },
    ],
  },
];

const MobileCategoriesDropdown = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Flatten the data for the dropdown
  const dropdownOptions = dummyData.flatMap((data) => [
    { label: data.label, url: data.url }, // Main category
    ...(data.showSubMenu
      ? data.subMenuData.map((sub) => ({
          label: `- ${sub.name}`,
          url: sub.url,
        }))
      : []), // Subcategories
  ]);

  const handleDropdownChange = (value: string) => {
    if (value) {
      router.push(value); // Navigate to the selected URL
    }
  };

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

  // Find the selected option based on the current pathname
  const selectedOption = dropdownOptions.find((option) => option.url === pathname);

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onClose={() => setIsOpen(false)}
      aria-label="Select category"
      items={dropdownOptions}
      className="w-full"
      selectedKeys={selectedOption ? [selectedOption.url] : []}
      placeholder={t('shop_categories')} // Default placeholder
      onChange={(e) => handleDropdownChange(e.target.value)}
      renderValue={(items) => {
        if (items.length === 0) {
          return <p className="text-sm">{t('shop_categories')}</p>; // Default label
        }
        return items.map((item) => (
          <p key={item.key} className="text-sm">
            {item.textValue}
          </p>
        ));
      }}
      classNames={{
        label: 'group-data-[filled=true]:-translate-y-5',
        trigger:
          'border border-gray-400 rounded-lg bg-white-gr justify-between py-1.5 sm:px-3 sm:py-3 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-1 sm:gap-2 data-[hover=true]:bg-white-gr',
        listboxWrapper: 'max-h-[160px]',
        value: '!text-white',
      }}
      listboxProps={{
        itemClasses: {
          base: [
            'rounded-lg',
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
          content: 'p-0 bg-black-600 min-w-16 !rounded-lg border border-gray-400',
        },
      }}
    >
      {(option) => (
        <SelectItem key={option.url} textValue={option.label}>
          <p className="text-xs sm:text-sm">{option.label}</p>
        </SelectItem>
      )}
    </Select>
  );
};

export default MobileCategoriesDropdown;

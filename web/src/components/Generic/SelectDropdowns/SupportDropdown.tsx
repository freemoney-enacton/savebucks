import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { useTranslation } from '@/i18n/client';

const SupportDropdown = ({ data, onChange, hint, error }: any) => {
  const { t } = useTranslation();
  return (
    <>
      <Select
        aria-label="Select a month"
        items={data}
        placeholder={t('support_dropdown_value1')}
        disallowEmptySelection={true}
        className="w-full max-sm:self-end !rounded-lg"
        classNames={{
          label: 'group-data-[filled=true]:-translate-y-5',
          trigger:
            '!rounded-lg bg-black bg-white-gr justify-between !py-3.5 !px-5 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-1 sm:gap-2 data-[hover=true]:bg-white-gr !shadow-none',
          listboxWrapper: 'max-h-[200px]',
          listbox: 'border border-gray-400 rounded-lg',
          value: '!text-white',
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
            base: '',
            content: 'p-0 bg-black-600 min-w-16 !rounded-lg',
          },
        }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        // selectorIcon={<CustomIcon />}
        // disableSelectorIconRotation
      >
        {(item: any) => <SelectItem key={item.label}>{item.label}</SelectItem>}
      </Select>
      {error !== undefined && <p className="block text-red text-xs">{hint}</p>}
    </>
  );
};

export default SupportDropdown;

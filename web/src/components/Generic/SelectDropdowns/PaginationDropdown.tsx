import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from '@nextui-org/react';

export default function PaginationDropdown({ data, setValue }) {
  const [selectedValue, setSelectedValue] = useState();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Select
        isOpen={isOpen}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        onClose={() => setIsOpen(false)}
        placeholder={data[0].label}
        selectedKeys={selectedValue}
        disallowEmptySelection={true}
        onSelectionChange={(e) => {
          //@ts-ignore
          setSelectedValue(e);
        }}
        onChange={(e) => {
          if (e.target.value) {
            setValue(e.target.value);
          }
        }}
        className="min-w-12 w-fit !rounded-lg"
        classNames={{
          label: 'group-data-[filled=true]:-translate-y-5',
          trigger:
            'border border-gray-400 !rounded-lg bg-white-gr py-1 !pl-3 px-2 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-2 data-[hover=true]:bg-white-gr flex items-center justify-between',
          listboxWrapper: 'max-h-[200px]',
          listbox: 'border border-gray-400 rounded-lg',
        }}
        listboxProps={{
          itemClasses: {
            base: [
              'rounded-0',
              'text-white',
              'transition-opacity',
              'data-[hover=true]:bg-black-600',
              // 'dark:data-[hover=true]:bg-default-50',
              'data-[selectable=true]:!bg-black-600',
              'data-[pressed=true]:bg-black-600',
              'data-[focus-visible=true]:ring-0',
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: '',
            content: 'p-0 bg-black-600 min-w-[78px] !rounded-lg',
          },
        }}
      >
        {data.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

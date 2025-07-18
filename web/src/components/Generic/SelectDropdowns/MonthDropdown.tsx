import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

export default function MonthDropdown({ data }: any) {
  return (
    <Select
      aria-label="Select a month"
      items={data}
      placeholder={data[0].label}
      className="min-w-[120px]"
      classNames={{
        label: 'group-data-[filled=true]:-translate-y-5',
        trigger: 'rounded-full bg-white-gr data-[hover=true]:bg-white-gr',
        listboxWrapper: 'max-h-[200px]',
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
          content: 'p-0 bg-black-600',
        },
      }}
      // selectorIcon={<CustomIcon />}
      // disableSelectorIconRotation
    >
      {(item: any) => <SelectItem key={item.value}>{item.label}</SelectItem>}
    </Select>
  );
}

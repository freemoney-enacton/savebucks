import { Select, SelectItem } from '@nextui-org/react';
import React from 'react';

const SelectComponent = ({
  label,
  items,
  selectedKeys,
  onSelectionChange,
  icon,
  error,
  selected_value_key,
  return_value_key,
}) => {
  return (
    <div>
      <Select
        // @ts-ignore
        placeholder={
          <div className="flex items-center gap-4 text-white">
            {icon}
            <span>{label}</span>
          </div>
        }
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        className="w-full max-sm:self-end !rounded-lg"
        //   disallowEmptySelection={true}
        classNames={{
          label: 'group-data-[filled=true]:-translate-y-5',
          trigger: `!rounded-lg bg-black bg-white-gr justify-between !py-3.5 !px-5 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-1 sm:gap-2 data-[hover=true]:bg-white-gr !shadow-none ${
            error ? 'border border-red-500' : ''
          }`,
          listboxWrapper: 'max-h-[200px]',
          listbox: 'border border-gray-400 rounded-lg',
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
        renderValue={(items) => {
          // Render the selected value with the common icon
          return (
            <div className="flex items-center gap-4">
              {icon}
              <span>{items[0]?.textValue}</span>
            </div>
          );
        }}
      >
        {items.map((item) => (
          <SelectItem key={item?.[return_value_key]} value={item?.[return_value_key]}>
            {item?.[selected_value_key]}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default SelectComponent;

import React, { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';

const ChatDropdown = ({ chatRooms, setSelectedRoom, selectedRoom }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleValueChange = (value: string) => {
    setSelectedRoom(value);
  };

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      disallowEmptySelection={true}
      aria-label="Select language"
      items={chatRooms}
      className="w-fit"
      classNames={{
        label: 'group-data-[filled=true]:-translate-y-5',
        trigger:
          'h-fit min-h-[unset] px-3 py-2 bg-black justify-between border border-gray-400 rounded-lg [&>svg]:static [&>div]:!w-auto gap-2 data-[hover=true]:bg-black-600',
        listbox: 'p-3 bg-black-600 border-gray-400 rounded-lg [&>ul]:gap-2.5 overflow-hidden',
      }}
      listboxProps={{
        itemClasses: {
          base: [
            'rounded-0 py-2',
            'text-white',
            'transition-opacity',
            'data-[hover=true]:!bg-gray-400',
            'data-[selected=true]:!bg-gray-400',
            'data-[selectable=true]:focus:!bg-gray-400',
            'data-[pressed=true]:!bg-gray-400',
            'data-[focus-visible=true]:ring-0',
          ],
          selectedIcon: 'hidden',
        },
      }}
      popoverProps={{
        placement: 'bottom-end',
        prefix: 'w-[205px]',
        classNames: {
          base: '!w-[170px] sm:min-w-[205px]',
          content: 'p-0 bg-black-600 !w-[170px] sm:min-w-[205px] !rounded-lg',
        },
      }}
      selectedKeys={[selectedRoom]}
      onChange={(e) => {
        handleValueChange(e.target.value);
      }}
      renderValue={(items) => {
        return items.map((item: any) => (
          <div key={item?.data?.name} className="flex items-center gap-2">
            {item?.data?.icon && <Image className="size-5" src={item?.data.icon} alt={item?.data?.name} width={50} height={50} />}
          </div>
        ));
      }}
    >
      {(user: any) => (
        <SelectItem key={user.code} textValue={user?.code}>
          <div className="flex gap-2 items-center">
            {user?.icon && <Image className="size-4 sm:size-5" src={user?.icon} alt={user.name} width={20} height={15} />}
            <p className="text-xs sm:text-sm">{user.name ? user.name?.toUpperCase() : ''}</p>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default ChatDropdown;

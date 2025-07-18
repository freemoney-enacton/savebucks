'use client';
import useConstant from '@/Hook/Common/use-constant';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
const TickerDropdown = ({ selectedSetting, setSelectedSetting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { TickerCountryDropDown } = useConstant();
  const isServer = typeof window === 'undefined';

  // Create selectedKeys set based on current selection
  const selectedKeys = useMemo(() => {
    return new Set([selectedSetting?.key]);
  }, [selectedSetting]);

  const handleDropdownChange = (e) => {
    const value = Array.from(e)[0];
    setSelectedSetting((TickerCountryDropDown && TickerCountryDropDown?.filter((item) => item?.key === value)?.[0]) || e);
  };

  useEffect(() => {
    if (!isServer) {
      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const body = document.querySelector('body');

      if (body) {
        if (isOpen) {
          body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'visible';
          body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      }

      return () => {
        if (body) {
          // Check again in cleanup
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      };
    }
  }, [isOpen, isServer]);
  return (
    <Dropdown
      classNames={{
        content: 'p-0 !min-w-[144px] !rounded-lg',
      }}
      placement="bottom-start"
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
    >
      <DropdownTrigger className="group">
        <div role="button" className="p-2.5 flex items-center gap-2.5 bg-white-gr border border-gray-400 rounded-lg">
          {selectedSetting?.image}
          <ChevronDownIcon className="size-4 text-white group-aria-expanded:rotate-180 transition-ease stroke-[2px]" />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        items={TickerCountryDropDown}
        classNames={{
          base: 'p-4 border border-gray-400 rounded-lg',
        }}
        selectionMode="single"
        itemClasses={{
          base: [
            'rounded-lg',
            'text-white py-1.5 px-3',
            'transition-opacity',
            'data-[hover=true]:text-white',
            'data-[selected=true]:text-white',
            'data-[selected=true]:bg-gray-400',
            'data-[active=true]:bg-gray-400',
          ],
          selectedIcon: 'hidden',
        }}
        disallowEmptySelection={true}
        selectedKeys={selectedKeys}
        onSelectionChange={handleDropdownChange}
      >
        {(item) => (
          <DropdownItem className={`[&>span]:flex [&>span]:gap-2.5`} key={item.key}>
            {item.image}
            <span className="max-w-[200px] truncate">{item.label}</span>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TickerDropdown;

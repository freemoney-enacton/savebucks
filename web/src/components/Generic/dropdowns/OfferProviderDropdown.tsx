'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OfferProviderDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamKey = 'network';
  const { public_get_api } = usePublicApi();

  const [providerData, setProviderData] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const ALL_OFFERS_KEY = 'all_offers';

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const keys = params.get(searchParamKey);
    if (keys) {
      const selectedSet = new Set(keys.split(','));
      setSelectedKeys(selectedSet.size > 0 ? selectedSet : new Set([ALL_OFFERS_KEY]));
    } else {
      setSelectedKeys(new Set([ALL_OFFERS_KEY]));
    }
  }, [searchParams]);

  const handleDropdownChange = (keys: Set<string>) => {
    let selectedValues = Array.from(keys);

    if (selectedValues.includes(ALL_OFFERS_KEY) && selectedValues?.length > 1 && selectedValues[0] === ALL_OFFERS_KEY) {
      selectedValues = selectedValues.filter((key) => key !== ALL_OFFERS_KEY);
    } else if (
      selectedValues.includes(ALL_OFFERS_KEY) &&
      selectedValues?.length > 1 &&
      selectedValues[selectedValues.length - 1] === ALL_OFFERS_KEY
    ) {
      selectedValues = [ALL_OFFERS_KEY];
    } else if (selectedValues.length === 0) {
      selectedValues = [ALL_OFFERS_KEY];
    } else {
      selectedValues = [...selectedValues];
    }
    setSelectedKeys(new Set(selectedValues));

    const params = new URLSearchParams(searchParams);
    if (selectedValues.includes(ALL_OFFERS_KEY)) {
      params.delete(searchParamKey);
    } else {
      params.set(searchParamKey, selectedValues.join(','));
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getAllProvider = async () => {
    const offerProviderResponse = await public_get_api({
      path: 'providers/?type=tasks&iframe=0',
    });
    if (offerProviderResponse?.success && offerProviderResponse?.data) {
      setProviderData(offerProviderResponse?.data);
    }
  };

  useEffect(() => {
    getAllProvider();
  }, []);

  const displayedProviders = [{ code: ALL_OFFERS_KEY, name: 'All Offer Providers' }, ...providerData];

  return (
    <Dropdown
      classNames={{
        content: 'p-0 !min-w-[144px] !rounded-lg',
      }}
    >
      <DropdownTrigger>
        <div role="button" className="small-icon-btn">
          <Square3Stack3DIcon className="size-4 sm:size-5" />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Filter Dropdown"
        items={displayedProviders}
        classNames={{
          base: 'px-3.5 py-5 bg-black-600 border border-gray-400 rounded-lg',
        }}
        selectionMode="multiple"
        itemClasses={{
          base: [
            'rounded-lg',
            'text-white py-1.5 px-3',
            'transition-opacity',
            'data-[hover=true]:text-inherit',
            'data-[hover=true]:bg-gray-400',
            // 'data-[selectable=true]:focus:!bg-white-gr',
          ],
        }}
        disallowEmptySelection={false}
        // closeOnSelect={false}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys: any) => {
          handleDropdownChange(new Set(keys));
        }}
      >
        {(item: any) => (
          <DropdownItem
            className={`${selectedKeys.has(item.code) ? 'bg-gray-400' : ''} hover:bg-gray-400 transition-ease`}
            key={item.code}
          >
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

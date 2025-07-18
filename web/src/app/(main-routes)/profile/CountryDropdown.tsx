import { config } from '@/config';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';

export default function CountryDropdown({ data, selectedCountry }: any) {
  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const countries = data.map((code, index) => ({
    id: index + 1,
    code: code,
    name: displayNames.of(code),
  }));

  const images = countries.map((country) => ({
    code: country.code,
    name: country.name,
    img: config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', country.code.toLowerCase()) || null,
  }));

  const countryData = countries.map((country) => ({
    id: country.id,
    code: country.code,
    name: country.name,
    img: images.find((img) => img.code === country.code)?.img || null,
  }));

  const [selectedCountryCode, setSelectedCountryCode] = useState(countryData?.[0]?.code || '');

  const handleCountryChange = (value: string) => {
    if (value) {
      setSelectedCountryCode(value);
      selectedCountry(value);
    }
  };

  return (
    <div>
      <Select
        aria-label="Select country"
        items={countryData ? countryData : []}
        selectedKeys={[selectedCountryCode]}
        disabled
        className="font-medium"
        classNames={{
          label: 'group-data-[filled=true]:-translate-y-5',
          trigger:
            'h-fit min-h-[unset] px-3 py-2 bg-black justify-between border border-gray-400 rounded-lg [&>svg]:static [&>div]:!w-auto gap-2 cursor-pointer',
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
          classNames: {
            content: 'p-0 bg-black-600 !rounded-lg',
          },
        }}
        onChange={(e) => {
          handleCountryChange(e.target.value);
        }}
        renderValue={(items) => {
          return items.map((item: any) => (
            <div key={item.data.id} className="flex items-center gap-2">
              {item.data.img ? (
                <Image className="flex-shrink-0 max-w-6 h-auto" src={item.data.img} alt={item.data.name} height={24} width={24} />
              ) : null}
              <p>{item.data.name}</p>
            </div>
          ));
        }}
      >
        {(user: any) => (
          <SelectItem key={user.code} textValue={user.name}>
            <div className="flex gap-2 items-center">
              {user.img ? (
                <Image className="flex-shrink-0 max-w-6 h-auto" src={user.img} alt={user.name} height={24} width={24} />
              ) : null}
              <p>{user.name}</p>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}

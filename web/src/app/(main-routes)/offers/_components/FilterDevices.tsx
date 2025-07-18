'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import useConstant from '@/Hook/Common/use-constant';

const FilterDevices = () => {
  const { t } = useTranslation();
  const { deviceFilterOptions } = useConstant();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamKey = 'platform';
  const platform = searchParams.get(searchParamKey) || 'all';

  const setPlatform = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete(searchParamKey);
    } else {
      params.set(searchParamKey, value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex items-center gap-5">
      <p className="font-medium">{t('devices')}</p>
      {deviceFilterOptions.map((option) => (
        <label key={option.key} className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="platform"
            value={option.key}
            checked={platform === option.key}
            onChange={() => setPlatform(option.key)}
          />
          {/* in case if we want to add icon */}
          {/* {option.icon && <span>{option.icon}</span>} */}
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default FilterDevices;

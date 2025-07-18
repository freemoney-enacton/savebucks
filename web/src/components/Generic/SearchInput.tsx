'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SvgSearch } from './Icons';

export default function SearchInput({ placeholder, customClass, ...rest }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParamKey = 'name';

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchParamKey, term);
    } else {
      params.delete(searchParamKey);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleClearSearch() {
    handleSearch('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-2.5 sm:left-4 grid place-content-center">
        <SvgSearch className="size-3 sm:size-[18px] text-white" />
      </div>
      <input
        autoFocus={searchParams.get(searchParamKey)?.length}
        ref={inputRef}
        className={`py-2 px-3 sm:py-3 sm:px-5 w-full bg-transparent border border-gray-400 rounded-lg text-white text-xs sm:text-sm font-medium placeholder:font-medium placeholder:text-white placeholder:text-xs placeholder:sm:text-sm transition-ease focus:ring-0 focus:border-white outline-none pl-7 sm:pl-11 ${
          customClass ? customClass : ''
        }`}
        type="text"
        placeholder={placeholder}
        {...rest}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get(searchParamKey)?.toString()}
      />
      {searchParams.get(searchParamKey)?.length && (
        <div className="absolute inset-y-0 right-2.5 sm:right-4 grid place-content-center" onClick={handleClearSearch}>
          <XMarkIcon className="cursor-pointer size-3.5 sm:size-[18px] text-white stroke-2" />
        </div>
      )}
    </div>
  );
}

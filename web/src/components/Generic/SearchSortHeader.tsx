'use client';
import { useTranslation } from '@/i18n/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SearchSortHeader() {
  const handleTextChange = (value: string) => {
    setSearchInput(value);
  };
  const searchParam = useSearchParams();
  const { t } = useTranslation();
  const defaultInput = searchParam.get('name');
  const [searchInput, setSearchInput] = useState<string | any>(defaultInput);
  const [search] = useDebounce(searchInput, 1000);
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>('');

  const handlePlatformClick = (platform: string) => {
    if (selectedPlatform.includes(platform)) {
      setSelectedPlatform((prevstate) => prevstate.filter((e) => e !== platform));
    } else {
      setSelectedPlatform((prevstate) => [...prevstate, platform]);
    }
  };
  useEffect(() => {
    if (searchParam) {
      // const param = new URLSearchParams(searchParam);
      // param.set('platform', selectedPlatform.join(',').toString());
      // router.replace(`${pathName}?${param.toString()}`);
    }
  }, [selectedPlatform]);

  const handleSortClick = (sort: string) => {
    setSelectedSort((prevstate) => (prevstate === sort ? '' : sort));
  };
  useEffect(() => {
    if (searchParam) {
      // const param = new URLSearchParams(searchParam);
      // param.set('sort_by', selectedSort.toString());
      // router.replace(`${pathName}?${param.toString()}`);
    }
  }, [selectedSort]);

  useEffect(() => {
    if (searchParam) {
      // const param = new URLSearchParams(searchParam);
      // if (search) {
      //   param.set('name', search);
      //   router.replace(`${pathName}?${param.toString()}`);
      // } else {
      //   param.delete('name');
      //   router.replace(`${pathName}?${param.toString()}`);
      // }
    }
    return () => {};
  }, [search]);

  return (
    <>
      <input
        autoFocus
        placeholder={defaultInput?.toString() || t('instruction.type_here')}
        value={searchInput}
        onChange={(e) => handleTextChange(e.currentTarget.value)}
      />
      <label>Platform</label>
      <select name="platform" onChange={(e) => handlePlatformClick(e.currentTarget.value)}>
        <option value="android">Android</option>
        <option value="ios">ios</option>
        <option value="desktop">Desktop</option>
      </select>

      <label>Sort By</label>
      <select name="platform" onChange={(e) => handleSortClick(e.currentTarget.value)}>
        <option value="highest_reward">{t('filter.highest_reward')}</option>
        <option value="lowest_reward">{t('filter.lowest_reward')}</option>
        <option value="latest_featured">{t('filter.latest_featured')}</option>
        <option value="popular">{t('filter.popular')}</option>
      </select>
    </>
  );
}

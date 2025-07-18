import { public_get_api } from '@/Hook/Api/Server/use-server';
import SectionTitle from '@/components/Core/SectionTitle';
import OfferList from '@/components/Generic/OfferList/OfferList';
import SearchInput from '@/components/Generic/SearchInput';
import OfferGridSkeleton from '@/components/Generic/Skeleton/OfferGridSkeleton';
import FilterDropdown from '@/components/Generic/dropdowns/FilterDropdown';
import SortDropdown from '@/components/Generic/dropdowns/SortDropdown';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { unstable_noStore } from 'next/cache';
import { Suspense } from 'react';
import BadgeCard from './BadgeCard';
import BadgeSlider from './BadgeSlider';
import FilterDevices from './_components/FilterDevices';
import OfferProviderDropdown from '@/components/Generic/dropdowns/OfferProviderDropdown';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.seo?.offers_title || t('offers'),
    description: settings?.data?.seo?.offers_desc || t('offers'),
  };
}

const OffersPage = async ({ searchParams }) => {
  const { t } = await createTranslation();
  unstable_noStore();
  const { cat, platform, name, sort_by, network, network_name } = searchParams ?? {};
  const urlSearchParams = new URLSearchParams();
  if (cat) urlSearchParams.append('category', cat);
  if (platform) urlSearchParams.append('platform', platform);
  if (name) urlSearchParams.append('name', name);
  if (sort_by) urlSearchParams.append('sort_by', sort_by);
  if (network) urlSearchParams.append('network', network);

  // API call
  const categoryList = await public_get_api({ path: `categories` });

  return (
    <div className="section">
      <div className="container">
        <div className="space-y-4 sm:space-y-[30px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-7">
              <SectionTitle title={network_name ? network_name + ` ${t('offers')}` : t('all_offers')} customClass="!text-left" />
              <div className="max-lg:hidden">
                <FilterDevices />
              </div>
            </div>
            <div className="flex max-sm:justify-between items-center gap-3 sm:gap-4">
              <div className="w-full max-w-[300px] sm:max-w-[240px]">
                <SearchInput placeholder={t('search')} />
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <SortDropdown />
                <OfferProviderDropdown />
                <div className="lg:hidden">
                  <FilterDropdown />
                </div>
              </div>
            </div>
          </div>
          {categoryList?.data?.length > 0 && (
            <div className="flex gap-3 sm:gap-4">
              <BadgeCard
                data={{
                  name: t('all'),
                  icon: '/images/crown.png',
                }}
              />
              <BadgeSlider data={categoryList.data} />
            </div>
          )}
          <Suspense key={cat + platform + name + sort_by + network} fallback={<OfferGridSkeleton />}>
            <OfferList urlSearchParams={urlSearchParams}></OfferList>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;

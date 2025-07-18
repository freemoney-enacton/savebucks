import { public_get_api } from '@/Hook/Api/Server/use-server';
import SectionTitle from '@/components/Core/SectionTitle';
import SearchInput from '@/components/Generic/SearchInput';
import StoreGridSkeleton from '@/components/Generic/Skeleton/StoreGridSkeleton';
import StoreList from '@/components/Generic/StoreList';
import StoreCountryDropdown from '@/components/Generic/dropdowns/StoreCountryDropdown';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { unstable_noStore } from 'next/cache';
import { Suspense } from 'react';
import CategoriesSidebar from './_components/CategoriesSidebar';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.seo?.all_store_meta_title || t('all_stores'),
    description: settings?.data?.seo?.all_store_meta_desc || t('all_stores'),
  };
}
const AllStorePage = async ({ searchParams }) => {
  unstable_noStore();
  const { t } = await createTranslation();

  const { cat, name, country } = searchParams ?? {};
  const urlSearchParams = new URLSearchParams();
  if (cat) urlSearchParams.append('category', cat);
  if (name) urlSearchParams.append('name', name);
  if (country) urlSearchParams.append('country', country);

  // API call
  const categoryList = await public_get_api({ path: `store-categories` });

  return (
    <div className="section">
      <div className="container">
        <div className="space-y-4 sm:space-y-[30px]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <SectionTitle as="h1" title={t('all_shops')} customClass="!text-left" />
            <div className="flex flex-col sm:flex-row  items-center gap-2 sm:gap-4">
              <div className="w-full flex items-center gap-2 sm:gap-4">
                <div className="flex-1 lg:max-w-[240px]">
                  <SearchInput placeholder={t('search')} />
                </div>
                {/* TODO: add mobile category dropdown in component as this file is server  */}
                {/* {isTablet && (
                <div className="flex-1 ">
                  <MobileCategoriesDropdown />
                </div>
              )} */}
              </div>
              <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <StoreCountryDropdown />
                {/* Not available in FIGMA */}
                {/* <SortDropdown /> */}
              </div>
            </div>
          </div>

          <div className="flex gap-4 lg:gap-6">
            {/* TODO: category side bar condition removed , please add it at component level */}
            <div className="max-lg:hidden flex-shrink-0 w-[240px] xl:w-[340px]">
              {categoryList?.data && categoryList?.data?.length > 0 && <CategoriesSidebar categories={categoryList.data} />}
            </div>
            <div className="w-full ">
              <Suspense key={cat + name + country} fallback={<StoreGridSkeleton count={20} />}>
                <StoreList urlSearchParams={urlSearchParams}></StoreList>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStorePage;

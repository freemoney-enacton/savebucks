import { public_get_api } from '@/Hook/Api/Server/use-server';
import CMSSection from '@/components/Generic/Section/CMSSection';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// import SectionTitle from '@/components/Core/SectionTitle';
// import SearchInput from '@/components/Generic/SearchInput';
// import FilterDropdown from '@/components/Generic/dropdowns/FilterDropdown';
// import SortDropdown from '@/components/Generic/dropdowns/SortDropdown';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.page_seo?.['earn']?.meta_title || t('earn'),
    description: settings?.data?.page_seo?.['earn']?.meta_desc || t('earn'),
  };
}

const EarnPage = async ({ searchParams }) => {
  // const { t } = await createTranslation();

  const EarnPageData = await public_get_api({
    path: 'cms/pages/earn',
  });

  if (EarnPageData?.data?.[0]?.status != 'publish') notFound();
  const RenderHomeSection = ({ item }) => {
    return <CMSSection item={item} page={'Earn'} searchParams={searchParams} />;
  };

  return (
    <div className="section earn-page">
      <div className="space-y-4 sm:space-y-[30px]">
        {/* <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SectionTitle title="Earn" customClass="!text-left w-fit" />
            <div className="flex max-sm:justify-between items-center gap-4">
              <div className="max-w-[172px] sm:max-w-[240px]">
                <SearchInput placeholder={t('search')} />
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <SortDropdown />
                <FilterDropdown />
              </div>
            </div>
          </div>
        </div> */}
        {EarnPageData?.data?.[0]?.blocks?.length > 0 ? (
          <div className="space-y-5 sm:space-y-7 lg:space-y-10">
            {EarnPageData?.data[0]?.blocks?.map((item, index) => (
              <RenderHomeSection key={index} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EarnPage;

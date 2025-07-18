import { public_get_api } from '@/Hook/Api/Server/use-server';
import CMSSection from '@/components/Generic/Section/CMSSection';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.page_seo?.home?.meta_title || t('home'),
    description: settings?.data?.page_seo?.home?.meta_desc || t('home'),
  };
}
const page = async () => {
  let [HomeData] = await Promise.all([
    public_get_api({
      path: 'cms/pages/home',
    }),
  ]);

  if (HomeData?.data?.[0]?.status != 'publish') notFound();

  const RenderHomeSection = ({ item }) => {
    return <CMSSection item={item} page={'Earn'} />;
  };

  return (
    <>
      <div className="home-page">
        {HomeData?.data?.[0]?.blocks?.length > 0
          ? HomeData?.data[0]?.blocks?.map((item, index) => <RenderHomeSection key={index} item={item} />)
          : null}
      </div>
    </>
  );
};

export default page;

import { public_get_api } from '@/Hook/Api/Server/use-server';
import ComingSoon from '@/components/Core/ComingSoon';
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
    title: settings?.data?.page_seo?.['how-it-works']?.meta_title || t('how_it_works'),
    description: settings?.data?.page_seo?.['how-it-works']?.meta_desc || t('how_it_works'),
  };
}

const HowItWorksPage = async () => {
  const { t } = await createTranslation();
  let [HomeData] = await Promise.all([
    public_get_api({
      path: 'cms/pages/how-it-works',
    }),
  ]);

  if (HomeData?.data?.[0]?.status != 'publish') notFound();
  const RenderHomeSection = ({ item }) => {
    return <CMSSection item={item} page={'Earn'} />;
  };
  return HomeData ? (
    <section className="section">
      {HomeData?.data?.[0]?.blocks?.length > 0 ? (
        <div className="containers">
          {HomeData?.data[0]?.blocks?.map((item, index) => (
            <RenderHomeSection key={index} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  ) : (
    <ComingSoon title={t('how_it_works')} />
  );
};

export default HowItWorksPage;

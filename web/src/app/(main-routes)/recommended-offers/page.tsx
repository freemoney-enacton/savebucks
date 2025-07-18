import { public_get_api } from '@/Hook/Api/Server/use-server';
import SectionTitle from '@/components/Core/SectionTitle';
import RecommendedOfferList from '@/components/Generic/RecommendedOfferList/OfferList';
import OfferGridSkeleton from '@/components/Generic/Skeleton/OfferGridSkeleton';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { unstable_noStore } from 'next/cache';
import { Suspense } from 'react';

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

const RecommendedOffers = async ({ searchParams }) => {
  const { t } = await createTranslation();
  unstable_noStore();
  const urlSearchParams = new URLSearchParams();

  return (
    <div className="section">
      <div className="container">
        <div className="space-y-4 sm:space-y-[30px]">
          <div className="flex items-center gap-7">
            <SectionTitle title={t('recommended_offers')} customClass="!text-left" />
          </div>

          <Suspense fallback={<OfferGridSkeleton />}>
            <RecommendedOfferList urlSearchParams={urlSearchParams}></RecommendedOfferList>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default RecommendedOffers;

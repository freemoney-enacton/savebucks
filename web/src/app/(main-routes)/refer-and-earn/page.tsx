import { public_get_api } from '@/Hook/Api/Server/use-server';
import { auth } from '@/auth';
import SectionTitle from '@/components/Core/SectionTitle';
import UserCard from '@/components/Generic/Card/UserCard';
import CMSSection from '@/components/Generic/Section/CMSSection';
import ReferNEarnLinkSection from '@/components/Generic/Section/ReferNEarnLinkSection';
import { createTranslation } from '@/i18n/server';
import ReferTabComponent from './ReferTabComponent';
import ReferHiwModal from '@/components/Generic/Modals/ReferHiwModal';
import { Metadata } from 'next';
import { config } from '@/config';
import ChartComponent from '@/components/Generic/Chart/ChartComponent';
import { Suspense } from 'react';
import PageLoader from '@/components/Generic/PageLoader';
import { cookies } from 'next/headers';
import ReferStatsCardSection from './ReferStatsCardSection';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.page_seo?.['refer-and-earn']?.meta_title || t('refer_and_earn'),
    description: settings?.data?.page_seo?.['refer-and-earn']?.meta_desc || t('refer_and_earn'),
  };
}

const ReferNEarnPage = async () => {
  const session: any = await auth();
  const loggedIn = session?.user;

  return (
    <>
      {loggedIn ? (
        <Suspense fallback={<PageLoader />}>
          <SuspenseLoginComponent session={session} />
        </Suspense>
      ) : (
        <Suspense fallback={<PageLoader />}>
          <SuspenseLogoutComponent />
        </Suspense>
      )}
    </>
  );
};

export default ReferNEarnPage;

async function SuspenseLoginComponent({ session }) {
  const { t } = await createTranslation();
  const isMobileApp = cookies().get('isMobileApp')?.value;
  let [ReferHIWData, ReferTNCData, ReferStatistics, GraphData] = await Promise.all([
    public_get_api({
      path: 'cms/blocks/user_refer_and_earn_hiw',
    }),
    public_get_api({
      path: 'cms/blocks/user_refer_and_earn_terms',
    }),
    public_get_api({
      path: 'referreduser/stats',
    }),
    public_get_api({
      path: 'graph/referral-earnings/last-30-days',
    }),
  ]);

  ReferTNCData = ReferTNCData?.data?.[0]?.blocks[0]?.type ? ReferTNCData?.data[0]?.blocks[0]?.data : '';
  const chartData = {
    labels: Array.from(
      { length: isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS : config.DEFAULT_CHART_DAYS },
      (_, i) => `${GraphData?.data?.[i]?.date}`
    ),
    datasets: [
      {
        label: t('recent_earnings', {
          day: isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS : config.DEFAULT_CHART_DAYS,
        }),
        data: GraphData?.data?.map((item) => item?.RecentEarnings),
      },
    ],
  };
  return (
    <div className="section">
      <div className="container">
        <div className="space-y-4 sm:space-y-10">
          <div className="flex items-center justify-between gap-2">
            <SectionTitle title={t('refer_and_earn')} customClass="!text-left w-fit" />

            {ReferHIWData?.data?.[0]?.blocks[0]?.type == 'how-it-works-wothout-image' &&
              ReferHIWData?.data?.[0]?.blocks[0]?.data?.items?.length > 0 && (
                <ReferHiwModal data={ReferHIWData?.data[0]?.blocks[0]?.data?.items} />
              )}
          </div>
          <div>
            {Object.keys(ReferStatistics?.data || {}).length > 0 && (
              <ReferStatsCardSection data={ReferStatistics?.data} session={session} />
            )}
          </div>

          <UserCard>
            <UserCard.Body>
              <ReferNEarnLinkSection TermsNCondition={ReferTNCData} />
            </UserCard.Body>
          </UserCard>

          <ReferTabComponent />

          {GraphData?.data && (
            <ChartComponent
              title={t('recent_referral_earnings').replace(
                '%{day}',
                isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS.toString() : config.DEFAULT_CHART_DAYS.toString()
              )}
              footerText={
                <>
                  {t('your_referral_earning_status_last').replace(
                    '%{day}',
                    isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS.toString() : config.DEFAULT_CHART_DAYS.toString()
                  )}
                </>
              }
              data={chartData}
              tooltipLabel={t('earnings')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

async function SuspenseLogoutComponent() {
  const ReferPublicData = await public_get_api({
    path: 'cms/pages/refer-and-earn',
  });
  if (ReferPublicData?.data?.[0]?.status != 'publish') notFound();
  const RenderPublicSection = ({ item }) => {
    return <CMSSection item={item} page={'Refer & Earn'} />;
  };
  return (
    <>
      {ReferPublicData?.data?.[0]?.blocks?.length > 0 ? (
        <div>
          {ReferPublicData?.data[0]?.blocks?.map((item, index) => (
            <RenderPublicSection key={index} item={item} />
          ))}
        </div>
      ) : null}
    </>
  );
}

import SectionTitle from '@/components/Core/SectionTitle';
import React from 'react';
import UserInfoCard from '@/components/Generic/Card/UserInfoCard';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import ChartComponent from '@/components/Generic/Chart/ChartComponent';
import { config } from '@/config';
import { createTranslation } from '@/i18n/server';
import UserEarningInfo from '../UserEarningInfo';
import TabComponent from '../TabComponent';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata({ params, searchParams }): Promise<Metadata> {
  const { tab } = params;
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  const getMetaTitle = () => {
    switch (tab) {
      case 'earning':
        return settings?.data?.seo?.userdashboard_earning_title || t(tab);
      case 'withdrawal':
        return settings?.data?.seo?.userdashboard_withdrawal_title || t(tab);
      case 'ongoing-offer':
        return settings?.data?.seo?.userdashboard_ongoing_offers_title || t(tab);
      case 'charge-back':
        return settings?.data?.seo?.userdashboard_chargebacks_title || t(tab);
      default:
        break;
    }
  };
  return {
    title: getMetaTitle(),
    description: t(tab),
  };
}

export default async function OverviewPage({ params, searchParams }) {
  const { tab } = params;
  const { type } = searchParams;
  const isMobileApp = cookies().get('isMobileApp')?.value;

  const { t } = await createTranslation();
  let [EarningStats, GraphData, ShoppingTripGraph] = await Promise.all([
    public_get_api({
      path: 'stats',
    }),
    public_get_api({
      path: 'graph/earnings/last-30-days',
    }),
    public_get_api({
      path: 'graph/earnings/last-30-days-clicks',
    }),
  ]);
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
  const shoppingChartData = {
    labels: Array.from(
      { length: isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS : config.DEFAULT_CHART_DAYS },
      (_, i) => `${ShoppingTripGraph?.data?.[i]?.date}`
    ),
    datasets: [
      {
        label: t('clicks', {
          day: isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS : config.DEFAULT_CHART_DAYS,
        }),
        data: ShoppingTripGraph?.data?.map((item) => item?.clicks),
      },
    ],
  };

  return (
    <div className="py-7 sm:py-10 text-white">
      <div className="container">
        <div className="space-y-7 sm:space-y-10">
          <SectionTitle title={t('overview')} customClass="!text-left" />
          <div className="grid lg:grid-cols-[minmax(430px,_430px)_1fr] 2xl:grid-cols-2 gap-7 2xl:gap-10">
            <UserInfoCard />
            <UserEarningInfo EarningStats={EarningStats?.data} />
          </div>
          <TabComponent tabFromQuery={tab} type={type} />
          {/* earnings graph  */}
          {GraphData?.data && (
            <ChartComponent
              title={t('recent_earnings').replace(
                '%{day}',
                isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS.toString() : config.DEFAULT_CHART_DAYS.toString()
              )}
              footerText={
                <>
                  {t('your_earning_status_last').replace(
                    '%{day}',
                    isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS.toString() : config.DEFAULT_CHART_DAYS.toString()
                  )}
                </>
              }
              data={chartData}
              img="/images/graph-title.png"
              tooltipLabel={t('earnings')}
            />
          )}
          {/* store click graph  */}
          {ShoppingTripGraph?.data && (
            <ChartComponent
              title={t('shopping_trips').replace(
                '%{day}',
                isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS.toString() : config.DEFAULT_CHART_DAYS.toString()
              )}
              footerText={
                <>
                  {t('your_daily_clicks_for_last').replace(
                    '%{day}',
                    isMobileApp ? config.MOBILE_DEFAULT_CHART_DAYS.toString() : config.DEFAULT_CHART_DAYS.toString()
                  )}
                </>
              }
              data={shoppingChartData}
              img="/images/shopping-trip-icon.png"
              showTooltipValueAsCurrency={false}
              tooltipLabel={t('clicks')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

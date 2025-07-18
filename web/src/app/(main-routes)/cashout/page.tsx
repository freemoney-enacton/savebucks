import { public_get_api } from '@/Hook/Api/Server/use-server';
import { auth } from '@/auth';
import Heading from '@/components/Core/Heading';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import UserCard from '@/components/Generic/Card/UserCard';
import CMSSection from '@/components/Generic/Section/CMSSection';
import PaymentModes from './PaymentModes';
import UserAvailableEarningCard from '@/components/Generic/UserAvailableEarningCard';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import CheckUserKyc from '@/components/Generic/CheckUserKyc';
import { AppRoutes } from '@/routes-config';
import { SvgHistory } from '@/components/Generic/Icons';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.page_seo?.['cashout']?.meta_title || t('cashout'),
    description: settings?.data?.page_seo?.['cashout']?.meta_desc || t('cashout'),
  };
}

export default async function CashoutPage() {
  const session = await auth();
  const login = session?.user;
  let CashoutPublicData;
  const { t } = await createTranslation();

  if (!login) {
    CashoutPublicData = await public_get_api({
      path: 'cms/pages/cashout',
    });

    if (CashoutPublicData?.data?.[0]?.status != 'publish') notFound();
    return (
      <>
        {CashoutPublicData?.data?.[0]?.blocks?.length > 0
          ? CashoutPublicData?.data[0]?.blocks?.map((item, index) => <RenderPublicSection key={index} item={item} />)
          : null}
      </>
    );
  }

  let [UserEarningStatistics, paymentMode, giftCards] = await Promise.all([
    public_get_api({
      path: 'stats',
    }),
    public_get_api({
      path: 'payments/types',
    }),
    public_get_api({
      path: 'payments/giftcards',
    }),
  ]);

  return (
    <div className="section">
      <div className="container">
        <div className="space-y-4 sm:space-y-10">
          <div className="flex items-center justify-between gap-2">
            <CheckUserKyc />
            <Heading title={t('cashout')} />
            <ButtonComponent
              role="link"
              variant="primary"
              label={t('cashout_history')}
              url={AppRoutes.overviewWithdrawal}
              icon={<SvgHistory className="size-4" />}
            />
          </div>

          <div className="">
            <UserCard customClass="!w-fit">
              <UserCard.Body>
                <UserAvailableEarningCard UserEarningStatistics={UserEarningStatistics} />
              </UserCard.Body>
            </UserCard>
          </div>
          <PaymentModes paymentModeData={paymentMode?.data} giftCard={giftCards?.data} />
          <p>{t('cashout_note')}</p>
        </div>
      </div>
    </div>
  );
}

const RenderPublicSection = ({ item }) => {
  return <CMSSection item={item} page={'Cashout'} />;
};

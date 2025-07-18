'use client';
import React from 'react';
import { useTranslation } from '@/i18n/client';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import UserStatsCard from '@/components/Generic/Card/UserStatsCard';
import CurrencyString from '@/components/Generic/CurrenyString';
import { useUtils } from '@/Hook/use-utils';

const ReferStatsCardSection = ({ data, session }) => {
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();

  return (
    <div className="space-y-3">
      <SectionTitleWithIcon title={t('refer_statistics')} img="/images/refer-stats-icon.png" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStatsCard
          title={data?.users ? data?.users : 0}
          desc={t('referred_users')}
          cardbg="bg-black-250"
          icon="/images/user-refer-icon.png"
        />
        <UserStatsCard
          title={<CurrencyString>{getCurrencyString(data?.referral_earning ? data?.referral_earning : 0)}</CurrencyString>}
          desc={t('referral_earning')}
          cardbg="bg-black-250"
          customClass="sm:px-3.5 xl:px-5"
          icon="/images/lifetime-earnings-icon.png"
        />
        <UserStatsCard
          title={<CurrencyString>{getCurrencyString(data?.reward_earning ? data?.reward_earning : 0)}</CurrencyString>}
          desc={t('reward_earning')}
          cardbg="bg-black-250"
          icon="/images/complete-offers-icon.png"
        />
        <UserStatsCard
          title={session?.user?.user?.tierDetails?.tier ? session?.user?.user?.tierDetails?.tier : 0}
          desc={t('tier')}
          cardbg="bg-black-250"
          icon="/images/level-star-icon.png"
        />
      </div>
    </div>
  );
};

export default ReferStatsCardSection;

'use client';
import { useUtils } from '@/Hook/use-utils';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

const UserAvailableEarningCard = ({ UserEarningStatistics }) => {
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="shrink-0 size-12 sm:size-20 grid place-content-center">
        <Image src="/images/bank-card.png" className="size-12 sm:size-20" alt="icon" height={80} width={80} />
      </div>
      <div className="sm:space-y-2">
        <h3 className="text-2xl sm:text-3xl text-white font-semibold">
          {getCurrencyString(UserEarningStatistics?.data?.availablePayout ? UserEarningStatistics?.data?.availablePayout : 0)}
        </h3>
        <p className="text-sm sm:text-lg">{t('available_for_payment')}</p>
      </div>
    </div>
  );
};

export default UserAvailableEarningCard;

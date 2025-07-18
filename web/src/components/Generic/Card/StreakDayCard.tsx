'use client';
import Image from 'next/image';
import React from 'react';
import ButtonComponent from '../ButtonComponent';
import { useTranslation } from '@/i18n/client';
import { useUtils } from '@/Hook/use-utils';
interface DayCardProps {
  item: any;
  onClick: () => void;
}

const StreakDayCard: React.FC<DayCardProps> = ({ item, onClick }) => {
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();
  return (
    <div className={`h-fit p-0.5 ${item.reward_type === 'spin' ? 'bg-border-gr' : 'bg-blue-100'} rounded-[10px]`}>
      <div className={`relative rounded-lg p-2 bg-blue-100 text-center space-y-2.5 overflow-clip`}>
        <Image src="/images/calender.png" alt="calender" width={80} height={80} className="size-[30px] mx-auto" />
        <div className="space-y-1.5">
          <div>
            <p className="text-white text-lg font-bold">
              {item?.reward_type == 'spin' && t('upto')} {getCurrencyString(item.amount)}
            </p>
            <p className={`text-blue text-xs font-medium ${item.reward_type === 'spin' ? 'text-white' : ''}`}>
              {t('day')} {item.day}
            </p>
          </div>
          <ButtonComponent
            role="button"
            label={item?.status == 'claimed' ? t('claimed') : t('claim')}
            variant={item?.status == 'claimed' || item?.status == 'pending' ? 'gray' : 'primary'}
            onClick={onClick}
            disabled={item?.status == 'claimed' || item?.status == 'pending' ? true : false}
            customClass="!min-w-fit !w-fit !px-2 !py-1 !rounded hover:!-translate-y-0.5 disabled:!opacity-100"
          />
        </div>
      </div>
    </div>
  );
};

export default StreakDayCard;

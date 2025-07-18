'use client';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { useTranslation } from '@/i18n/client';
import React, { useEffect, useState } from 'react';
import StreakDayCard from '../Card/StreakDayCard';
import Image from 'next/image';
import { Toast } from '@/components/Core/Toast';
import { useDisclosure } from '@nextui-org/react';
import ModalComponent from '../Modals/ModalComponent';
import RewardSpinModal from '../Modals/RewardSpinModal';
import { useUtils } from '@/Hook/use-utils';
import { usePublicApi } from '@/Hook/Api/Client/use-client';

const RewardsStreakSection = ({ streaksData }) => {
  const [streaksDetails, setStreaksDetails] = useState<any>(streaksData);
  const [spinRewardData, setSpinRewardData] = useState<any>({});
  const [streaksDay, setStreaksDay] = useState('');
  const { t } = useTranslation();
  const { public_get_api, public_post_api } = usePublicApi();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { getCurrencyString, calculateTimeLeft } = useUtils();

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(streaksData?.streakInfo?.streakExpiry));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(streaksData?.streakInfo?.streakExpiry));
    }, 1000);

    return () => clearInterval(timer);
  }, [streaksData?.streakInfo?.streakExpiry]);

  const handleClaimClick = (item: any) => {
    if (item.status != 'claimed' || item.status != 'pending') {
      try {
        public_post_api({ path: `bonuses/daily-streaks/${item.day}/claim`, body: {} }).then((res) => {
          if (res?.data && res?.success) {
            public_get_api({
              path: `bonuses/daily-streaks/details`,
            }).then((response) => {
              if (response?.data && response?.success) {
                setStreaksDetails(response?.data);
              }
            });
            if (item?.reward_type == 'spin') {
              setSpinRewardData(res.data);
              setStreaksDay(item.day);
              onOpen();
            } else {
              Toast.success('claimed_successful');
            }
          } else {
            Toast.errorTop(res?.error);
          }
        });
      } catch (error) {
        console.log('🚀 ~ claimLadder ~ error:', error);
      }
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-4">
          <SectionTitleWithIcon
            title={streaksDetails?.streaksWithStatus?.length + ' ' + t('day_streak')}
            img={'/images/streak-icon.png'}
          />

          <p className="text-sm">
            <span className="text-primary font-medium">
              {t('earn')} {getCurrencyString(streaksData?.streakInfo?.requiredEarning)}
            </span>{' '}
            {t('or_more_within')}
            <span className="text-primary font-medium">
              {' '}
              {streaksData?.streakInfo?.streakDurationInHours} {t('hours')}
            </span>{' '}
            {t('to_keep_your_streak')}{' '}
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-3">
          {streaksDetails?.streaksWithStatus?.map((item, index) => (
            <StreakDayCard key={index} item={item} onClick={() => handleClaimClick(item)} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Image className="flex-shrink-0 size-6" src="/images/rewards-timer.png" alt="timer-icon" width={70} height={70} />
          <p className="text-sm">
            {t('time_left')}
            <span className="text-primary font-medium">
              {' '}
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </p>
        </div>
      </div>

      <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} customClass="!max-w-[650px]">
        <div>
          <RewardSpinModal spinRewardData={spinRewardData} spin_type={t('7_day_streak')} day={streaksDay} />
        </div>
      </ModalComponent>
    </>
  );
};

export default RewardsStreakSection;

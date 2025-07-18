'use client';
import { useTranslation } from '@/i18n/client';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../ButtonComponent';
import LadderCard from '../Card/LadderCard';
import dayjs from 'dayjs';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import Image from 'next/image';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { Toast } from '@/components/Core/Toast';
import { useUtils } from '@/Hook/use-utils';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { SvgCalendarCheckFill } from '../Icons';
var relativeTime = require('dayjs/plugin/relativeTime');

const LadderSection = ({ ladderData }) => {
  dayjs.extend(relativeTime);
  const { t } = useTranslation();
  const { calculateTimeLeft } = useUtils();
  const [ladderDetails, setLadderDetails] = useState(ladderData);
  const [doubleLadderState, setDoubleLadderState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { public_get_api, public_post_api } = usePublicApi();

  // useEffect(() => {
  //   public_post_api({ path: 'bonuses/daily-bonus-ladder/double', body: {} }).then((res) => {
  //     if (res?.success === true) {

  //     }
  //   });
  // }, []);
  const doubleLadder = () => {
    try {
      setIsLoading(true);
      public_post_api({ path: 'bonuses/daily-bonus-ladder/double', body: {} }).then((res) => {
        if (res?.data && res?.success) {
          setDoubleLadderState(true);
          // Wait for 30 seconds before calling the second API
          setTimeout(() => {
            public_get_api({
              path: `bonuses/daily-bonus-ladder/details`,
            }).then((response) => {
              if (response?.data && response?.success) {
                setLadderDetails(response?.data);
              }
              setIsLoading(false); // Set loading state to false after handling the response
            });
            if (res?.data?.ladderBonus?.status == 'lost') {
              Toast.error(t('ladder_bonus_lost'));
            }
          }, 3000); //
        } else {
          Toast.errorTop(res?.error);
          setIsLoading(false); // Set loading state to false if there's an error
        }
      });
    } catch (error) {
      console.log('🚀 ~ doubleLadder ~ error:', error);
      setIsLoading(false); // Set loading state to false in case of an exception
    }
  };

  const claimLadder = () => {
    try {
      public_post_api({ path: 'bonuses/daily-bonus-ladder/claim', body: {} }).then((res) => {
        if (res?.data && res?.success) {
          Toast.success(t('ladder_bonus_claimed'));
          public_get_api({
            path: `bonuses/daily-bonus-ladder/details`,
          }).then((response) => {
            if (response?.data && response?.success) {
              setLadderDetails(response?.data);
            }
          });
        } else {
          Toast.errorTop(res?.error);
        }
      });
    } catch (error) {
      console.log('🚀 ~ claimLadder ~ error:', error);
    }
  };

  const selectedTabIndex = (item) => {
    if (ladderDetails?.userLadderDetails) {
      return item?.step === ladderDetails?.userLadderDetails?.step ? true : false;
    } else {
      return item?.step === 1 ? true : false;
    }
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(ladderDetails?.next_available_at));

  useEffect(() => {
    const timer = setInterval(() => {
      if (!ladderDetails?.available) setTimeLeft(calculateTimeLeft(ladderDetails?.next_available_at));
    }, 1000);

    return () => clearInterval(timer);
  }, [ladderDetails?.next_available_at]);

  return (
    <div className="rewards-ladder-section max-md:max-w-[400px] space-y-3">
      <SectionTitleWithIcon title={t('daily_bonus_ladder')} img={'/images/bonus-title-icon.png'} />

      {ladderDetails?.available ? (
        <div className="p-7 bg-black-250 rounded-lg space-y-5">
          {ladderDetails?.detail?.length > 0 && (
            <div className="space-y-2">
              {ladderDetails?.detail.map((item, index) => (
                <LadderCard
                  key={index}
                  item={item}
                  index={index}
                  nextSelectedIndex={ladderDetails?.userLadderDetails?.step}
                  isSelected={selectedTabIndex(item)}
                  loading={isLoading}
                />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <ButtonComponent
              role="button"
              label={t('double_or_0')}
              variant="primary"
              icon={<RocketLaunchIcon className="size-4" />}
              customClass="!px-2.5 !py-2 !text-xs"
              onClick={doubleLadder}
              disabled={!doubleLadderState || isLoading}
            />
            <ButtonComponent
              role="button"
              label={t('daily_claim')}
              variant="outline"
              icon={<SvgCalendarCheckFill className="size-4" />}
              customClass="!w-full !px-2.5 !py-2 !text-xs"
              onClick={claimLadder}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs font-medium text-center">{t('earn_1_or_more_within_24_hours_to_activate_the_daily_leader')}</p>
        </div>
      ) : (
        <div className="md:min-h-[520px] px-6 py-6 sm:py-12 flex flex-col items-center justify-center bg-black-600 rounded-[30px]">
          <div className="text-center space-y-3">
            {ladderDetails?.next_available_at ? (
              <>
                <Image
                  className="size-9 sm:size-14 mx-auto"
                  src="/images/bonus-timer.png"
                  alt="cta-bg"
                  width={100}
                  height={100}
                />
                <p className="text-white text-sm sm:text-base">{t('daily_bonus_ladder_timer_text')}</p>
                <p className="text-gradient bg-primary-gr text-lg sm:text-2xl font-medium">
                  {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </p>
              </>
            ) : (
              <p className="text-gradient bg-primary-gr text-lg sm:text-2xl font-medium">{ladderDetails?.not_available_reason}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LadderSection;

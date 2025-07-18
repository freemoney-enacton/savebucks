'use client';
import { useTranslation } from '@/i18n/client';
import React, { useState } from 'react';
import RoulettePro from 'react-roulette-pro';
// import 'react-roulette-pro/dist/index.css';
import ButtonComponent from '../ButtonComponent';
import { useUtils } from '@/Hook/use-utils';
import Image from 'next/image';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { Toast } from '@/components/Core/Toast';

const RewardSpinModal = ({ spinRewardData, spin_type, day = '' }) => {
  const { getCurrencyString } = useUtils();
  const { public_post_api } = usePublicApi();
  const [isSpinStart, setIsSpinStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinReward, setSpinReward] = useState<any>('');
  const [showWinningAmount, setShowWinningAmount] = useState(false);
  const formattedSpinRewardData = spinRewardData.configuration.map(({ icon, amount, ...rest }, index) => ({
    id: index,
    image: icon,
    text: getCurrencyString(amount),
    ...(rest || {}),
  }));
  const { t } = useTranslation();
  const handlePrizeDefined = () => {
    setShowWinningAmount(true);
  };

  const getSpinReward = () => {
    setLoading(true);
    try {
      public_post_api({
        path:
          spin_type == t('bonus_spin')
            ? `bonuses/bonus-codes/claim/${spinRewardData?.bonusCode?.code}/spin/${spinRewardData?.userSpinCode}`
            : `bonuses/daily-streaks/${day}/spin/${spinRewardData?.userSpinCode}`,
        body: {},
      }).then((res) => {
        if (res?.data && res?.success) {
          setSpinReward(res?.data?.spinReward);
          setIsSpinStart(true);
          setLoading(false);
        } else {
          Toast.errorTop(res?.error);
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-5 sm:space-y-10">
      <p className="text-white text-xl sm:text-2xl font-semibold">{spin_type}</p>
      <p className="text-white text-base sm:text-lg font-medium text-center">
        {t('win_upto')}{' '}
        <span className="text-gradient bg-primary-gr">
          {getCurrencyString(spinRewardData?.maxAmount ? spinRewardData?.maxAmount : 0)}
        </span>
      </p>

      <div className="space-y-5 text-center">
        <div className="p-2.5 border border-gray-400 rounded-lg">
          <RoulettePro
            start={isSpinStart}
            prizes={formattedSpinRewardData}
            prizeIndex={formattedSpinRewardData?.findIndex((a) => a.code == spinReward?.code)}
            spinningTime={5}
            options={{ stopInCenter: true, withoutAnimation: false }}
            defaultDesignOptions={{ prizesWithText: true }}
            onPrizeDefined={handlePrizeDefined}
          />
        </div>
        {!showWinningAmount && (
          <ButtonComponent
            role="button"
            onClick={() => getSpinReward()}
            label={t('spin_now')}
            variant="primary"
            customClass="w-fit !px-4 !py-2 mx-auto !text-xs"
            isLoading={loading || isSpinStart}
            disabled={loading || isSpinStart}
          />
        )}
      </div>
      {showWinningAmount && (
        <div className="relative py-8 sm:py-12 bg-tertiary-gr rounded-lg overflow-hidden">
          <p className="px-4 text-black text-xl sm:text-2xl font-semibold text-center">
            {t('you_win')} {getCurrencyString(spinReward?.amount)}
          </p>
          <Image
            className="absolute left-0 bottom-0 max-h-[50px] sm:max-h-[70px] w-auto h-auto"
            src={'/images/win-left-bg.png'}
            alt="icon"
            width={200}
            height={200}
          />
          <Image
            className="absolute right-0 top-0 max-h-[50px] sm:max-h-[100px] w-auto h-auto"
            src={'/images/win-right-bg.png'}
            alt="icon"
            width={200}
            height={200}
          />
        </div>
      )}

      {spinRewardData?.spin?.variable_rewards ? (
        <div className="space-y-[18px]">
          <div className="inline-flex items-center gap-2.5">
            <Image className="size-[22px]" src={'/images/coin-title-icon.png'} alt="icon" width={45} height={45} />
            <p className="text-white text-base font-medium">
              {t('this_case_contain_possible_winnings').replace('%{count}', spinRewardData?.spinRange?.length)}
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-4 text-white">
            {spinRewardData?.spinRange?.map((item, index) => (
              <div key={index} className="relative bg-spin-card p-5 rounded-[10px] space-y-5 text-center overflow-clip">
                <div className="h-10 flex items-center justify-center">
                  {item.icon ? (
                    <Image className="max-h-10 !h-auto !w-auto mx-auto" alt="icons" src={item.icon} width={80} height={80} />
                  ) : null}
                </div>
                <p className="text-black text-lg font-medium">
                  {getCurrencyString(item.min_amount)} - {getCurrencyString(item.max_amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RewardSpinModal;

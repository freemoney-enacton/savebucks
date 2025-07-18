'use client';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import SwitchComponent from '@/components/Core/SwitchComponent';
import UserStatsCard from '@/components/Generic/Card/UserStatsCard';
import CurrencyString from '@/components/Generic/CurrenyString';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useRecoilValue } from 'recoil';

const UserEarningInfo = ({ EarningStats, hideCurrencyConverterSwitch = false }) => {
  const { t } = useTranslation();
  const { getCurrencyString, showCurrencyInPoint, setShowCurrencyInPoint } = useUtils();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <SectionTitleWithIcon title={t('statistics')} img="/images/leaderboard-icon.png" />
        {hideCurrencyConverterSwitch ? null : (
          <div className="flex items-center gap-2.5">
            <p className="text-white">
              {t('show_in')}
              {settings?.default?.default_currency}
            </p>
            <SwitchComponent
              isSelected={!showCurrencyInPoint}
              onToggle={() => {
                setShowCurrencyInPoint(!showCurrencyInPoint);
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <UserStatsCard
          title={EarningStats?.offerCompleted ? EarningStats?.offerCompleted : 0}
          desc={t('completed_offers')}
          icon="/images/complete-offers-icon.png"
        />
        <UserStatsCard
          title={
            <CurrencyString>
              {getCurrencyString(EarningStats?.lifetimeEarning ? EarningStats?.lifetimeEarning : 0)}
            </CurrencyString>
          }
          desc={t('lifetime_earning')}
          icon="/images/lifetime-earnings-icon.png"
          cardbg="bg-purple-200"
        />
        <UserStatsCard
          title={EarningStats?.referredUsers ? EarningStats?.referredUsers : 0}
          desc={t('user_referred')}
          icon="/images/user-refer-icon.png"
          cardbg="bg-orange-200"
        />
        {hideCurrencyConverterSwitch ? (
          <UserStatsCard
            title={
              <CurrencyString>
                {getCurrencyString(EarningStats?.referralEarnings ? EarningStats?.referralEarnings : 0)}
              </CurrencyString>
            }
            desc={t('affiliate_earnings')}
            icon="/images/available-payout-icon.png"
            cardbg="bg-green-200"
            cashout={hideCurrencyConverterSwitch ? false : true}
          />
        ) : (
          <UserStatsCard
            title={
              <CurrencyString>
                {getCurrencyString(EarningStats?.availablePayout ? EarningStats?.availablePayout : 0)}
              </CurrencyString>
            }
            desc={t('available_payout')}
            icon="/images/available-payout-icon.png"
            cardbg="bg-green-200"
            cashout={true}
            customClass="max-sm:!pt-5 max-sm:!pb-3"
          />
        )}
      </div>
    </div>
  );
};

export default UserEarningInfo;

import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { config } from '@/config';
import { useTranslation } from '@/i18n/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import UserProfileInfoCard from '../Card/UserProfileInfoCard';
import UserPublicTable from '../Table/UserPublicTable';
import { useUtils } from '@/Hook/use-utils';
var relativeTime = require('dayjs/plugin/relativeTime');

const UserPublicProfile = ({ userInfo }) => {
  const { t } = useTranslation();
  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const { getCurrencyString } = useUtils();
  dayjs.extend(relativeTime);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-5">
        {/* TODO: make this dynamic */}
        {userInfo?.avatar ? (
          <div className="flex-shrink-0 size-20 sm:size-[90px] grid place-content-center rounded-full overflow-hidden">
            <Image className="h-full w-full object-cover rounded-full" src={userInfo?.avatar} alt="profile image" width={100} height={100} />
          </div>
        ) : (
          <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full">
            <p className="text-black text-2xl sm:text-4xl">{userInfo?.name ? userInfo?.name?.charAt(0)?.toUpperCase() : ''}</p>
          </div>
        )}
        <div className="space-y-1 w-full">
          <div className="flex items-center gap-2.5">
            <h4 className="text-white text-lg sm:text-2xl font-bold line-clamp-1 break-all">{userInfo?.name}</h4>
            {/* <div className="flex items-center gap-2">
              <Image className="flex-shrink-0 size-4" src="/images/rank-star.png" alt="rank-star" width={40} height={40} />
              <p className="text-rank-bg text-sm font-medium">153</p>
            </div> */}
          </div>
          {/* make this dynamic */}
          <div className="flex items-center gap-5">
            {userInfo?.country_code && (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 size-5 sm:size-6 rounded-full overflow-hidden">
                  <Image
                    className="h-full w-full object-cover"
                    src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', userInfo?.country_code?.toLowerCase())}
                    alt="icon"
                    width={30}
                    height={30}
                  />
                </div>
                {/* add country name */}
                <p className="text-white">{regionNames.of(userInfo?.country_code)}</p>
              </div>
            )}
            {/* joining time */}
            <p className="text-xs sm:text-sm font-medium">{t('joined') + ' ' + dayjs(userInfo?.created_at).fromNow()}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3.5">
        <SectionTitleWithIcon title={t('statistics')} img="/images/leaderboard-icon.png" />

        <div className="flex flex-wrap gap-2.5">
          <UserProfileInfoCard value={userInfo?.stats?.offerCompleted} label={t('completed_offers')} />
          <UserProfileInfoCard
            value={getCurrencyString(userInfo?.stats?.lifetimeEarnings)}
            label={t('lifetime_earning')}
            cardbg="bg-purple-200"
            iconbg="bg-purple-400"
          />
          <UserProfileInfoCard
            value={userInfo?.stats?.referredUsers}
            label={t('user_referred')}
            cardbg="bg-orange-200"
            iconbg="bg-orange-400"
          />
          <UserProfileInfoCard
            value={getCurrencyString(userInfo?.stats?.referralEarnings)}
            label={t('affiliate_earnings')}
            cardbg="bg-green-200"
            iconbg="bg-green-400"
          />
        </div>
      </div>
      <UserPublicTable ref_code={userInfo?.referral_code} hidePagination={true} />
    </div>
  );
};

export default UserPublicProfile;

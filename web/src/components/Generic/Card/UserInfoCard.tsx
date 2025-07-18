'use client';
import { config } from '@/config';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const UserInfoCard = () => {
  const { data: session }: any = useSession();
  const userInfo = session?.user?.user;
  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();

  return (
    <div className="bg-black-250 py-4 px-4 sm:p-5 2xl:p-7 flex gap-4 sm:gap-5 2xl:gap-7 rounded-lg">
      {userInfo?.avatar ? (
        <div className="flex-shrink-0 size-20 sm:size-[90px] grid place-content-center rounded-full overflow-hidden">
          <Image className="h-full w-full object-cover rounded-full" src={userInfo?.avatar} alt="profile image" width={100} height={100} />
        </div>
      ) : (
        <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full">
          <p className="text-black text-2xl sm:text-4xl">{userInfo?.name ? userInfo?.name?.charAt(0)?.toUpperCase() : ''}</p>
        </div>
      )}
      <div className="w-full space-y-2 sm:space-y-4 text-lg font-medium">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <h3 className="text-white text-lg sm:text-2xl font-medium">{userInfo?.name}</h3>
        </div>
        <div className="flex flex-row lg:flex-col 2xl:flex-row 2xl:items-center gap-3 2xl:gap-6">
          {userInfo?.tierDetails && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {userInfo?.tierDetails.icon ? (
                <Image
                  className="max-h-5 sm:max-h-7 !w-auto"
                  src={userInfo?.tierDetails.icon}
                  alt="icon"
                  width={30}
                  height={30}
                />
              ) : null}
              <p className="max-sm:text-xs">
                {/* {t('level')} {userInfo?.level} */}
                {userInfo?.tierDetails?.label}
              </p>
            </div>
          )}
          {userInfo?.tierDetails && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Image className="max-h-5 sm:max-h-7 !w-auto" src="/images/comission.png" alt="icon" width={30} height={30} />
              <p className="max-sm:text-xs">
                {userInfo?.tierDetails?.affiliate_commission} {t('commission')}
              </p>
            </div>
          )}
        </div>
        {userInfo?.country_code && (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex-shrink-0 h-4 sm:h-6 w-6 sm:w-9 rounded overflow-hidden">
              <Image
                className="h-full w-full object-cover"
                src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', userInfo?.country_code?.toLowerCase())}
                alt="icon"
                width={30}
                height={24}
              />
            </div>
            <p className="max-sm:text-xs">{regionNames.of(userInfo?.country_code)}</p>
          </div>
        )}
        {userInfo && Object.values(userInfo?.level).length > 0 && (
          <div className="space-y-2.5">
            <div className="text-xs sm:text-sm lg:text-base">
              <p className="flex justify-between gap-1">
                <span>
                  {t('level')}: {userInfo?.level?.current_level}
                </span>
                <span>
                  {getCurrencyString(userInfo?.level?.next_level_amount_remaining)} {t('to_level_up')}
                </span>
              </p>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-gray-400 rounded-lg relative overflow-hidden">
              <div
                className="h-1.5 sm:h-2 bg-primary-gr rounded-lg"
                style={{ width: `${userInfo?.level?.level_completetion}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;

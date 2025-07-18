import { config } from '@/config';
import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
var relativeTime = require('dayjs/plugin/relativeTime');

const UserProfileDetailsCard = async ({ userProfileInfo }: any) => {
  dayjs.extend(relativeTime);
  const userInfo = userProfileInfo;
  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

  return (
    <div className="bg-black-600 py-4 pl-5 pr-2 sm:p-7 flex gap-5 sm:gap-7 rounded-lg">
      {userInfo?.avatar ? (
        <div className="flex-shrink-0 size-20 sm:size-[90px] grid place-content-center rounded-full overflow-hidden">
          <Image className="h-full w-full object-cover rounded-full" src={userInfo?.avatar} alt="profile image" width={100} height={100} />
        </div>
      ) : (
        <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full">
          <p className="text-black text-2xl sm:text-4xl">{userInfo?.name ? userInfo?.name?.charAt(0)?.toUpperCase() : ''}</p>
        </div>
      )}
      <div className="w-full space-y-2.5 text-lg">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <h3 className="text-white text-lg sm:text-2xl font-medium line-clamp-1 break-all">{userInfo?.name}</h3>
        </div>
        {userInfo?.country_code && (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex-shrink-0 size-5 sm:size-7 rounded-full overflow-hidden">
              <Image
                className="h-full w-full object-cover"
                src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', userInfo?.country_code?.toLowerCase())}
                alt="icon"
                width={30}
                height={30}
              />
            </div>
            <p className="max-sm:text-xs">{regionNames.of(userInfo?.country_code)}</p>
          </div>
        )}
        {userInfo?.created_at && (
          <div>
            <p className="max-sm:text-xs">{dayjs(userInfo?.created_at).fromNow()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileDetailsCard;

'use client';
import { useTranslation } from '@/i18n/client';
import Image from 'next/image';
import React from 'react';

const UserPrivateProfile = ({ name, image, modal = false }: any) => {
  const { t } = useTranslation();
  return (
    <>
      {modal ? (
        <div className="my-auto flex items-center gap-4">
          {image ? (
            <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full overflow-hidden">
              <Image className="h-full w-full object-cover" src={image} alt="profile image" width={100} height={100} />
            </div>
          ) : (
            <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full">
              <p className="text-black text-2xl sm:text-4xl">{name ? name?.charAt(0)?.toUpperCase() : ''}</p>
            </div>
          )}
          <div className="space-y-1 w-full">
            <h4 className="text-white text-lg sm:text-2xl font-bold line-clamp-1 break-all">{name}</h4>
            <p className="text-sm sm:text-lg font-medium">{t('this_is_a_private_profile')}</p>
          </div>
        </div>
      ) : (
        <div className="bg-black-600 py-4 pl-5 pr-2 sm:p-7 flex items-center gap-5 sm:gap-7 rounded-lg">
          {image ? (
            <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full overflow-hidden">
              <Image className="h-full w-full object-cover" src={image} alt="profile image" width={100} height={100} />
            </div>
          ) : (
            <div className="flex-shrink-0 size-20 sm:size-[90px] bg-blue-700 grid place-content-center rounded-full">
              <p className="text-black text-2xl sm:text-4xl">{name ? name?.charAt(0)?.toUpperCase() : ''}</p>
            </div>
          )}
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-white text-lg sm:text-2xl font-medium line-clamp-1 break-all">{name}</h3>
            <p className="text-gray-600 text-sm sm:text-base font-medium">{t('this_is_a_private_profile')}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPrivateProfile;

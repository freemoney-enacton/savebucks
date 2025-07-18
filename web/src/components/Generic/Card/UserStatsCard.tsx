'use client';
import React from 'react';
import ButtonComponent from '../ButtonComponent';
import { useTranslation } from '@/i18n/client';
import { AppRoutes } from '@/routes-config';
import Image from 'next/image';

export default function UserStatsCard({ icon, title, desc, customClass, cardbg, iconbg, cashout = false }: any) {
  const { t } = useTranslation();
  return (
    <div
      className={`user-stats-card py-4 sm:py-5 px-5 rounded-lg relative ${cardbg ? cardbg : 'bg-blue-200'} ${
        customClass ? customClass : ''
      }`}
    >
      <div className={`flex items-center gap-4 2xl:gap-6`}>
        <div className={`max-sm:hidden w-[60px] h-[60px] rounded-full grid place-content-center bg-black`}>
          {icon ? (
            <Image className="max-h-[30px] w-auto h-auto" src={icon} alt="icon" width={40} height={40} loading="lazy" />
          ) : null}
        </div>
        <div className="min-w-[120px] space-y-1 sm:space-y-1.5 ">
          <div className="flex items-center gap-2 ">
            <h4 className="text-xl 2xl:text-2xl font-semibold">{title}</h4>
            <div className="absolute top-[3px] right-1">
              {cashout && (
                <ButtonComponent
                  role="Link"
                  url={AppRoutes.cashout}
                  variant="primary"
                  label={t('cashout')}
                  customClass="cash-out-btn !px-2 !py-1 sm:!py-1.5 !text-xxs !rounded-md hover:!translate-y-[unset]"
                />
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm font-medium break-words">{desc}</p>
        </div>
      </div>
    </div>
  );
}

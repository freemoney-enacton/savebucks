'use client';
import React from 'react';
import { SvgGame } from './Icons';
import { useTranslation } from '@/i18n/client';
import { config } from '@/config';
import Image from 'next/image';

const PlaytimeCTA = () => {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center justify-center h-[calc(100vh-130px)] w-full bg-gradient-to-br from-primary to-black-600 rounded-xl shadow-lg p-6"
      style={{
        background: 'linear-gradient(135deg, var(--primary_light) 0%, #18181b 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-6 max-w-lg w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-black-600 rounded-full p-6 shadow-lg mb-2">
            <SvgGame className="text-primary size-16 sm:size-24" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
            {t('playtime_is')} <span className="text-primary">{t('app_exclusive')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 text-center mt-2">{t('to_access_the_playtime_feature')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
          <a
            href={config.PLAY_STORE_APP_ID}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 w-full flex items-center justify-center py-3 hover:shadow-lg transition">
              <Image
                height={60}
                width={180}
                src={'/svg/google-play.svg'}
                alt={'Get it on Google Play'}
                className="max-h-10 !w-auto"
                priority
              />
            </div>
          </a>
          <a
            href={config.APPLE_APP_ID}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 w-full flex items-center justify-center py-3 hover:shadow-lg transition">
              <Image
                height={60}
                width={180}
                src={'/svg/app-store.svg'}
                alt={'Download on the App Store'}
                className="max-h-10 !w-auto"
                priority
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlaytimeCTA;

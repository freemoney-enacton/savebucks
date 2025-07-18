'use client';
import React from 'react';
import Heading from '@/components/Core/Heading';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import { HomeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen grid place-content-center">
      <div className="container">
        <div className="max-w-[550px] mx-auto py-12 text-center space-y-4">
          <Image className="w-full" src="/images/404.png" alt="404" width={550} height={550} />
          <Heading title={t('page_not_found')} />
          <p className="text-base sm:text-xl font-semibold">{t('not_valid_link')}</p>
          <ButtonComponent
            role="link"
            href="/"
            label={t('back_to_home')}
            variant="primary"
            icon={<HomeIcon className="w-5 h-5" />}
            customClass="!w-full max-w-[280px] mx-auto !py-4"
          />
        </div>
      </div>
    </div>
  );
}

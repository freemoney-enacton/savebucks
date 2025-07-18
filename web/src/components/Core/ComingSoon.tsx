'use client';
import React from 'react';
import Heading from '@/components/Core/Heading';
import { useTranslation } from '@/i18n/client';

const ComingSoon = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div className=" grid place-content-center">
      <div className="container">
        <div className="max-w-[550px] mx-auto py-12 text-center space-y-4">
          <Heading title={title} />
          <p className="text-base sm:text-3xl font-semibold">{t('comming_soon')}</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

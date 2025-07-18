'use client';
import React from 'react';
import { useTranslation } from '@/i18n/client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';

const NotificationReadButton = () => {
  const { t } = useTranslation();
  const { public_post_api } = usePublicApi();

  const onButtonClick = () => {
    try {
      public_post_api({ path: `user/notifications/mark-as-read-all`, body: {} }).then((res) => {
        if (res?.success) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="text-right">
      <button
        onClick={() => {
          onButtonClick();
        }}
        className="bg-red text-gradient text-sm sm:text-lg font-medium link"
      >
        {t('mark_as_read_all')}
      </button>
    </div>
  );
};

export default NotificationReadButton;

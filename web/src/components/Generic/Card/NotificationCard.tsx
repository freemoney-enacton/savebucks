'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import { Toast } from '@/components/Core/Toast';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function NotificationCard({ data }: any) {
  const router = useRouter();
  const { public_get_api } = usePublicApi();
  const { formattedDateWithTime } = useUtils();
  const [loading, setLoading] = useState(false);
  const markNotificationRead = () => {
    try {
      public_get_api({ path: `user/notifications/mark-as-read/${data.id}` }).then((res) => {
        if (res?.success) {
          setLoading(true);
          if (data.url?.includes('chat')) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set(data.url.split('=')[0], data.url.split('=')[1]);
            router.replace(currentUrl.pathname + currentUrl.search);
            setLoading(false);
          } else {
            router.replace(data.url);
          }
        } else {
          Toast.error(res?.error);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className="relative cursor-pointer bg-black-250 p-4 sm:py-6 sm:px-5 rounded-2xl space-y-2 animate-fade-in overflow-hidden"
        onClick={() => markNotificationRead()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                !data.is_read ? 'bg-notification-unread' : 'bg-notification-read'
              }`}
            ></div>
            <h4 className="font-medium">{data.message?.title}</h4>
          </div>
          {/* time for desktop */}
          <p className="max-sm:hidden text-xs">{formattedDateWithTime(data.created_at)}</p>
        </div>
        <p className="text-xs sm:text-sm">{data.message?.description}</p>
        {/* time for mobile */}
        <p className="sm:hidden text-right text-xxs sm:text-xs">{formattedDateWithTime(data.created_at)}</p>
        {loading && (
          <div className="!mt-0 filter backdrop-blur-sm backdrop-opacity-100 absolute inset-0 !bg-overlay/15 flex items-center justify-center z-[1]">
            <Spinner color="white" size="md" />
          </div>
        )}
      </div>
    </>
  );
}

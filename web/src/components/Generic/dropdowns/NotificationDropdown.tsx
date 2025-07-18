import { public_get_api } from '@/Hook/Api/Server/use-server';
import { useUtils } from '@/Hook/use-utils';
import NoDataFound from '@/components/Core/NoDataFound';
import { useTranslation } from '@/i18n/client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SvgNotification } from '../Icons';
import { Toast } from '@/components/Core/Toast';

const NotificationCard = ({ data, setIsNotificationOpen, isNotificationOpen }: any) => {
  const router = useRouter();
  const { formattedDateWithTime } = useUtils();
  const markNotificationRead = () => {
    try {
      public_get_api({ path: `user/notifications/mark-as-read/${data.id}` }).then((res) => {
        if (res?.success) {
          setIsNotificationOpen(!isNotificationOpen);
          if (data?.url?.includes('chat')) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set(data.url.split('=')[0], data.url.split('=')[1]);
            router.replace(currentUrl.pathname + currentUrl.search);
          } else {
            router.replace(data.url);
          }
        } else {
          Toast.error(res?.error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      onClick={() => markNotificationRead()}
      key={data.id}
      className={`py-2.5 px-5 space-y-2 border-b border-gray-400 last:border-b-0 cursor-pointer ${
        data.status === 'unread' ? 'bg-black-600' : ' '
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
            !data.is_read ? 'bg-notification-unread' : 'bg-notification-read'
          }`}
        ></div>
        <h4 className="text-white text-sm font-medium truncate break-all">{data.message?.title}</h4>
      </div>
      <p className="text-xs truncate break-all">{data.message?.description}</p>
      <p className="text-xs">{formattedDateWithTime(data.created_at)}</p>
    </div>
  );
};

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [getNotificationList, setGetNotificationList] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const isServer = typeof window === 'undefined';

  useEffect(() => {
    if (!isServer) {
      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const body = document.querySelector('body');

      if (body) {
        if (isOpen) {
          body.style.overflow = 'hidden';
          setTimeout(() => {
            body.style.overflow = 'hidden';
          }, 300);
          document.documentElement.style.overflow = 'visible';
          body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      }

      return () => {
        if (body) {
          // Check again in cleanup
          body.style.overflow = 'auto';
          body.style.paddingRight = '0';
        }
      };
    }
  }, [isOpen, isServer]);

  useEffect(() => {
    try {
      public_get_api({ path: 'user/notification' }).then((res) => {
        if (res?.success) {
          setGetNotificationList(res?.data?.slice(0, 3));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [isNotificationOpen]);

  return (
    <Dropdown
      classNames={{
        content: 'p-0 !max-w-[315px] !w-[315px] mt-2',
      }}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
    >
      <DropdownTrigger>
        <div role="button" className="small-icon-btn">
          <SvgNotification className="size-4 sm:size-5" />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        items={getNotificationList}
        classNames={{
          base: 'bg-black border border-gray-400 rounded-2xl p-0',
          list: 'gap-0',
        }}
        itemClasses={{
          base: [
            'rounded-lg',
            'text-inherit p-0 cursor-auto',
            'transition-opacity',
            'data-[hover=true]:text-inherit',
            'data-[hover=true]:bg-transparent',
            // add active class here
          ],
        }}
      >
        <DropdownItem
          key="notification"
          isReadOnly
          className="data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0 data-[focus-visible=true]:ring-offset-0"
        >
          <div className="p-5 pb-4 border-b border-gray-400">
            <p className="text-white text-base font-medium">{t('notification')}</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="notificationList"
          className="data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0 data-[focus-visible=true]:ring-offset-0 [&>span]:max-h-[266px] [&>span]:overflow-y-auto [&>span]:no-scrollbar"
        >
          {getNotificationList.length === 0 ? (
            <NoDataFound msg="no_notification_found" />
          ) : (
            <>
              {getNotificationList.map((data, index) => (
                <NotificationCard
                  key={index}
                  data={data}
                  setIsNotificationOpen={setIsNotificationOpen}
                  isNotificationOpen={isNotificationOpen}
                />
              ))}
            </>
          )}
        </DropdownItem>
        {getNotificationList.length != 0 ? (
          <DropdownItem
            key="viewAll"
            className="data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0 data-[focus-visible=true]:ring-offset-0"
          >
            <div className="p-2.5 text-white text-center border-t border-gray-400">
              <Link className="link font-medium" href="/notification">
                {t('links_view_all')}
              </Link>
            </div>
          </DropdownItem>
        ) : (
          <DropdownItem key="viewAll"></DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

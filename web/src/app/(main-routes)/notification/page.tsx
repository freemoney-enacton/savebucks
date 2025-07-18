import { public_get_api } from '@/Hook/Api/Server/use-server';
import Heading from '@/components/Core/Heading';
import NoDataFound from '@/components/Core/NoDataFound';
import NotificationCard from '@/components/Generic/Card/NotificationCard';
import NotificationReadButton from '@/components/Generic/NotificationReadButton';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  return {
    title: t('notification'),
  };
}

export default async function NotificationPage() {
  const { t } = await createTranslation();
  const getNotificationList = await public_get_api({ path: 'user/notification' });

  return (
    <section className="section">
      <div className="container">
        <div className="w-full max-w-[1000px] mx-auto space-y-4 sm:space-y-7">
          <Heading title={t('notification')} customClass="!w-fit" />
          <div className="space-y-4 sm:space-y-7">
            {getNotificationList?.data?.length > 0 &&
            getNotificationList.data.some((notification) => notification.is_read === 0) ? (
              <NotificationReadButton />
            ) : null}
            <div className="space-y-4 sm:space-y-7">
              {getNotificationList?.data?.length > 0 ? (
                <>
                  {getNotificationList?.data.map((data, index) => (
                    <NotificationCard key={index} data={data} />
                  ))}
                </>
              ) : (
                <NoDataFound />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

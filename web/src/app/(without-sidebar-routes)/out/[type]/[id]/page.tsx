import React from 'react';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import EmptyHeader from '@/components/Generic/Header/EmptyHeader';
import Image from 'next/image';
import { SvgLoader, SvgWave } from '@/components/Generic/Icons';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { cookies, headers } from 'next/headers';
import { FALLBACK_LOCALE, LANGUAGE_COOKIE } from '@/i18n/settings';
import { auth } from '@/auth';
import OutPageRedirect from '@/components/Generic/OutPageRedirect';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  return {
    title: t('outpage'),
  };
}

const page = async ({ params }: { params: { id: string; type: string } }) => {
  const { t } = await createTranslation();
  const headersList = headers();
  const referer = headersList.get('referer');
  const userAgent = headersList.get('user-agent');
  const session: any = await auth();
  const local = cookies().get(LANGUAGE_COOKIE)?.value || FALLBACK_LOCALE;

  const storeDetails = await public_get_api({
    path: `out/${params.type}/${params.id}/${session?.user?.user?.id}`,
    headers: {
      'x-user-agent': userAgent ?? undefined,
      'x-referer': referer ?? undefined,
    },
  });

  return (
    <>
      <EmptyHeader />
      <OutPageRedirect redirectUrl={storeDetails?.data?.redirectUrl} />
      <div className="relative px-4 py-5 sm:py-8 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-black flex flex-col justify-center overflow-hidden animate-fade-in">
        <div className="relative max-w-[410px] mx-auto w-full text-center space-y-4 sm:space-y-6">
          <div className="relative bg-black-600 p-4 sm:p-6 border border-gray-400 rounded-xl sm:rounded-3xl z-[1] space-y-4 sm:space-y-6">
            <h2 className="text-primary text-xl sm:text-2xl font-bold">{storeDetails?.data?.store?.cashback_string}</h2>
            <p className="text-base sm:text-xl font-medium">
              {t('outpage_title').replace('{{store_name}}', storeDetails?.data?.store?.name?.[local])}
            </p>
            <div className="space-y-4">
              {storeDetails?.data?.store?.logo && (
                <div className="h-16 flex justify-center text-center">
                  <Image
                    className="max-h-16 w-auto h-auto rounded-lg"
                    src={storeDetails?.data?.store?.logo}
                    alt="logo"
                    width={300}
                    height={300}
                  />
                </div>
              )}
              {params.type == 'coupon' && storeDetails?.data?.clickedItem?.code && (
                <div className="min-w-[223px] w-fit mx-auto p-4 sm:px-5 py-2.5 sm:py-4 bg-black flex items-center justify-between gap-2.5 rounded-lg">
                  <p className="text-primary text-sm   font-medium">{storeDetails?.data?.clickedItem?.code}</p>
                  <button className="hover:opacity-85 transition-ease">
                    <DocumentDuplicateIcon className="flex-shrink-0 size-5" />
                  </button>
                </div>
              )}
              <p>
                {t('reference_id')} <b>{storeDetails?.data?.code}</b>
              </p>
            </div>
            <SvgLoader className="size-9 sm:size-12 mx-auto text-primary animate-spin" />
          </div>

          <p className="relative font-medium z-[2]">
            {t('is_loading_too_long')} <button className="text-primary">{t('click_here')}</button>
          </p>

          {/* decoration */}
          <div className="absolute top-0 z-[0] right-full size-28 xl:size-[220px] bg-purple filter blur-[200px] rounded-full"></div>
          <div className="absolute bottom-0 left-full z-[0] h-40 xl:h-[220px] w-40 xl:w-[320px] bg-[#CB5560] filter blur-[214px] rounded-full"></div>
        </div>
        <SvgWave className="absolute bottom-0 w-full h-auto text-primary" />
      </div>
    </>
  );
};

export default page;

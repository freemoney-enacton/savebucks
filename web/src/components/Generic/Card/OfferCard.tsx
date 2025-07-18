// import { OfferType } from '@/Type/offerType';
'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import AuthModal from '@/components/Core/AuthModal';
import { config } from '@/config';
import { useTranslation } from '@/i18n/client';
import { currencyTypeAtom } from '@/recoil/atom';
import { Spinner, useDisclosure } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import OfferModal from '../Modals/OfferModal';
import OfferCategoriesBadge from '../OfferCategoriesBadge';

export default function OfferCard({ data }: any) {
  const { t } = useTranslation();
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const showCurrencyInPoint = useRecoilValue(currencyTypeAtom);

  const { status }: any = useSession();
  const { public_get_api } = usePublicApi();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();

  const { formattedCurrency, updatePreviousUrl, getCurrencyString } = useUtils();
  const formattedResult = formattedCurrency(data?.payout);
  const decimalCurrency = typeof formattedResult === 'object' ? formattedResult.decimalCurrency : '';
  const fixedCurrency = typeof formattedResult === 'object' ? formattedResult.fixedCurrency : '';

  const handleCardClick = () => {
    if (status === 'unauthenticated') {
      authOnOpen();
    } else {
      updatePreviousUrl();
      window.history.pushState({}, '', `/offer/${data?.slug}`);
      onOpen();
      try {
        setLoading(true);
        public_get_api({ path: `tasks/${data?.network}/${data?.task_id}` })
          .then((res) => {
            if (res?.data && res?.success) {
              setOfferModalData(res?.data);
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.log({ error });
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div
        onClick={() => handleCardClick()}
        className={`h-full group p-[1px] rounded-[9px] cursor-pointer animate-fade-in ${
          data?.is_featured ? 'bg-border-gr' : 'bg-gray-400'
        }`}
      >
        <div className="h-full bg-black-250 p-2.5 sm:p-3 flex flex-col items-center gap-1.5 sm:gap-2.5 rounded-lg">
          <div className="relative w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden">
            {data?.image ? (
              <Image
                loading="lazy"
                className="w-full h-full object-cover"
                src={data?.image}
                width={110}
                height={110}
                alt="logo"
              />
            ) : (
              <Image
                className="w-full h-full object-cover"
                src="/images/offer-1.png"
                width={110}
                height={110}
                alt="fallback image"
                loading="lazy"
              />
            )}
            {data?.platforms?.length > 0 && (
              <div className="absolute top-1.5 right-1.5 px-1 py-1 flex items-center gap-1 bg-overlay/50 rounded-full z-[1]">
                {data?.platforms?.includes(config.DESKTOP_KEY) && (
                  <Image
                    loading="lazy"
                    className="size-3 sm:size-4"
                    src="/images/desktop.png"
                    width={25}
                    height={25}
                    alt="logo"
                  />
                )}
                {data?.platforms?.includes(config.ANDROID_KEY) && (
                  <Image
                    loading="lazy"
                    className="size-3 sm:size-4"
                    src="/images/android.png"
                    width={25}
                    height={25}
                    alt="logo"
                  />
                )}
                {data?.platforms?.includes(config.IOS_KEY) && (
                  <Image loading="lazy" className="size-3 sm:size-4" src="/images/ios.png" width={25} height={25} alt="logo" />
                )}
              </div>
            )}
            {/* hover effect */}
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 h-full w-full grid place-content-center bg-overlay/60 z-0 transition-ease">
              <div className="text-black space-y-1">
                <div className="size-6 sm:size-[30px] mx-auto grid place-content-center bg-black rounded-full">
                  <div className="w-0 h-0 ml-0.5 border-l-[5px] sm:border-l-[8px] border-l-white border-y-[3px] sm:border-y-[6px] border-y-transparent border-solid"></div>
                </div>
                <p className="text-8px sm:text-xxs font-semibold">{t('start_offer')}</p>
              </div>
            </div>
          </div>
          <div className="h-full flex flex-col gap-1 sm:gap-1.5">
            <div className="sm:space-y-0.5">
              <h4 className="text-white text-xs sm:text-13px font-semibold line-clamp-1 break-all">{data?.name}</h4>
              <p className="text-xxs max-sm:leading-normal sm:text-11px line-clamp-1 break-all">{data?.description}</p>
            </div>
            <OfferCategoriesBadge
              name={data?.category?.name}
              backgroundColor={data?.category?.bg_color}
              textColor={data?.badgeColor}
            />
            {data?.payout && (
              <p className="mt-auto text-white text-sm sm:text-base !leading-[1.2] font-bold tracking-[0.04em] text-end">
                {showCurrencyInPoint ? (
                  getCurrencyString(data?.payout)
                ) : (
                  <>
                    {fixedCurrency}
                    {'.'}
                    <span className="text-xxs font-bold tracking-[0.04em]">{decimalCurrency}</span>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        {status === 'loading' && (
          <div className="absolute top-0 z-50 bg-slate-900 w-full h-full rounded-[10px] sm:rounded-2xl">
            <Spinner classNames={{ wrapper: 'w-7 sm:w-10 h-7 sm:h-10' }} color="white" size="lg" />
          </div>
        )}
      </div>

      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
      <OfferModal isOpen={isOpen} onOpenChange={onOpenChange} data={data} OfferModalData={OfferModalData} loading={loading} />
    </>
  );
}

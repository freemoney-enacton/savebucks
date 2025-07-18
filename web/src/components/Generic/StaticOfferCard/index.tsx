'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import OfferModal from '../Modals/OfferModal';
import { useDisclosure } from '@nextui-org/react';
import AuthModal from '@/components/Core/AuthModal';
import { useSession } from 'next-auth/react';
import { config } from '@/config';
import { useUtils } from '@/Hook/use-utils';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useTranslation } from '@/i18n/client';

// this is an old component, the new offer card with banner component is in the OfferCardWithBanner.tsx file
const StaticOfferCard = ({ data }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { status }: any = useSession();
  const { updatePreviousUrl, getCurrencyString } = useUtils();
  const { public_get_api } = usePublicApi();

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
        role="button"
        onClick={() => {
          handleCardClick();
        }}
        className="h-full group relative flex flex-col rounded-lg overflow-hidden z-0 animate-fade-in"
      >
        <div className="shrink-0 relative h-[127px] w-full bg-black-600 border border-b-0 border-gray-400 rounded-t-lg">
          {data?.banner_image ? (
            <Image
              loading="lazy"
              className="w-full h-full object-cover"
              src={data?.banner_image}
              width={312}
              height={127}
              alt={data.name}
            />
          ) : (
            // fallback image
            <Image
              loading="lazy"
              className="w-full h-full object-cover"
              src={'/images/offer-dummy-bg.png'}
              width={312}
              height={127}
              alt="background"
            />
          )}
          {data?.platforms?.length > 0 && (
            <div className="absolute top-1.5 right-1.5 px-1 py-1 flex items-center gap-1 bg-overlay/50 rounded-full z-[1]">
              {data?.platforms?.includes(config.DESKTOP_KEY) && (
                <Image className="size-3 sm:size-4" src="/images/desktop.png" width={25} height={25} alt="logo" />
              )}
              {data?.platforms?.includes(config.ANDROID_KEY) && (
                <Image className="size-3 sm:size-4" src="/images/android.png" width={25} height={25} alt="logo" />
              )}
              {data?.platforms?.includes(config.IOS_KEY) && (
                <Image className="size-3 sm:size-4" src="/images/ios.png" width={25} height={25} alt="logo" />
              )}
            </div>
          )}
          {/* hover effect */}
          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 h-full w-full grid place-content-center bg-overlay/60 z-0 transition-ease">
            <div className="text-black space-y-1">
              <div className="size-[30px] mx-auto grid place-content-center bg-black rounded-full">
                <div className="w-0 h-0 ml-0.5 border-l-[8px] border-l-white border-y-[6px] border-y-transparent border-solid"></div>
              </div>
              <p className="text-xxs font-semibold">{t('start_offer')}</p>
            </div>
          </div>
        </div>
        <div className="h-full p-2.5 bg-black-600 border border-gray-400 rounded-b-lg">
          <div className="flex justify-between gap-3 ">
            <div className="">
              <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-1 break-all">{data.name}</h4>
              <p className="text-xxs max-sm:leading-normal line-clamp-2 break-all">{data?.description}</p>
            </div>
            <div className="flex-shrink-0 space-y-2">
              <div
                className="ml-auto min-w-[72px] w-fit text-black font-medium text-xs max-sm:leading-tight py-1 px-2 rounded-full text-center"
                style={{ background: data?.category?.bg_color, color: data?.badgeColor }}
              >
                <span>{data?.category?.name}</span>
              </div>
              {data?.payout && (
                <p className="text-white text-sm sm:text-base !leading-[1.2] font-semibold text-end">
                  {data.payout && getCurrencyString(data.payout)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <OfferModal isOpen={isOpen} onOpenChange={onOpenChange} data={data} OfferModalData={OfferModalData} loading={loading} />
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
    </>
  );
};

export default StaticOfferCard;

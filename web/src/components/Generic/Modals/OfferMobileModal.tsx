'use client';
import React from 'react';
import ModalComponent from './ModalComponent';
import { useTranslation } from '@/i18n/client';
import { useQRCode } from 'next-qrcode';
import Image from 'next/image';
import { config } from '@/config';

const OfferMobileModal = ({ outUrlIsOpen, outUrlOnOpenChange, data }: any) => {
  const { t } = useTranslation();
  const { Image: QRImage } = useQRCode();
  return (
    <ModalComponent isOpen={outUrlIsOpen} onOpenChange={outUrlOnOpenChange} customClass="max-w-[570px]">
      <div className="flex flex-col items-center justify-center gap-4">
        <span>{t('scan_the_qr_code_with_your_phone')}</span>
        <QRImage
          text={data?.url}
          options={{
            type: 'image/jpeg',
            quality: 0.3,
            errorCorrectionLevel: 'M',
            margin: 1,
            scale: 1,
            width: 200,
            color: {
              dark: '#000',
              light: '#FFF',
            },
          }}
        />
        <span>{t('available_devices')}</span>
        {data?.platforms?.length > 0 && (
          <div className="p-1.5 flex items-center gap-1 bg-overlay/50 rounded-full z-[1]">
            {data?.platforms?.includes(config.DESKTOP_KEY) && (
              <Image loading="lazy" className="size-5" src="/images/desktop.png" width={25} height={25} alt="logo" />
            )}
            {data?.platforms?.includes(config.ANDROID_KEY) && (
              <Image loading="lazy" className="size-5" src="/images/android.png" width={25} height={25} alt="logo" />
            )}
            {data?.platforms?.includes(config.IOS_KEY) && (
              <Image loading="lazy" className="size-5" src="/images/ios.png" width={25} height={25} alt="logo" />
            )}
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 size-[70px] rounded-[14px] overflow-hidden">
            {data?.image ? (
              <Image className="w-full h-full object-cover" src={data?.image} width={90} height={90} alt="logo" />
            ) : (
              <Image
                className="w-full h-full object-cover"
                src="/images/offer-1.png"
                width={90}
                height={90}
                alt="fallback image"
              />
            )}
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-white text-lg sm:text-xl md:text-2xl font-semibold line-clamp-2 pr-3">{data?.name}</h4>
              <p className="text-white font-bold tracking-[0.04em]">{data?.payout}</p>
            </div>
            {data?.description && (
              <div className="[&>p]:mb-1 [&>p]:text-sm [&>p]:text-white [&>p]:font-semibold [&>ul]:mb-1 [&>ul]:list-disc [&>ul]:list-inside [&>ul>li]:text-xs">
                {/* <p>Description</p> */}
                <span
                  className="mb-1 list-disc text-xs list-inside line-clamp-2 cms-box"
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                ></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default OfferMobileModal;

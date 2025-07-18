'use client';
import BackButton from '@/components/Core/Button/BackButton';
import Card from '@/components/Core/Card';
import SectionTitle from '@/components/Core/SectionTitle';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import { config } from '@/config';
import { useTranslation } from '@/i18n/client';
import { InformationCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import CouponSection from './CouponSection';
import DosAndDonts from './DosAndDonts';
import SimilarStoresSection from './SimilarStoresSection';
import StoreTrackerCard from './StoreTrackerCard';
import { useUtils } from '@/Hook/use-utils';

const SingleStorePage = ({ data }) => {
  const { t } = useTranslation();
  const { getTranslatedValue } = useUtils();

  if (data?.length <= 0) return null;
  return (
    <div className="section animate-none">
      <div className="container">
        <div className="space-y-4 sm:space-y-[30px]">
          {/* Back Button and Store Title */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            <BackButton role="button" />
            <SectionTitle as="h1" title={getTranslatedValue(data?.name)} customClass="!text-left" />
          </div>
          <div>
            {/* Store Banner Image */}
            {data.banner_image && (
              <div className="h-44 sm:h-64 md:h-[300px] 2xl:h-[400px] rounded-lg overflow-hidden">
                <Image
                  className="h-full w-full object-cover"
                  src={data.banner_image}
                  alt={getTranslatedValue(data?.name)}
                  width={1500}
                  height={400}
                />
              </div>
            )}

            <div className={`flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-10`}>
              <div className="flex-shrink-0 md:max-w-[300px] lg:max-w-[400px] w-full flex flex-col gap-6">
                <Card
                  className={`${data?.banner_image ? '-mt-20 sm:-mt-[120px] max-md:mx-4' : ''} relative space-y-5 animate-none`}
                >
                  <div className="shrink-0 relative max-w-[240px] sm:max-w-[340px] h-24 sm:h-32 mx-auto flex items-center justify-center bg-black-600 p-3 rounded-[80px]">
                    {/* Brand Logo */}
                    {data.logo ? (
                      <Image
                        height={200}
                        width={200}
                        src={data.logo}
                        alt={`${getTranslatedValue(data?.name)} logo`}
                        className="max-h-16 sm:max-h-20 w-auto h-auto"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <p className="text-primary lg:text-xl font-semibold text-center">{data.cashback_string}</p>
                  {/* Country Flag */}
                  {data.country_tenancy ? (
                    <div className="absolute -bottom-2 -right-2 size-5 lg:size-7 rounded-full overflow-hidden">
                      <Image
                        height={100}
                        width={100}
                        src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', data.country_tenancy?.[0]?.toLowerCase())}
                        alt="Country Flag"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </Card>

                {/* desktop */}
                <StoreTrackerCard data={data} className="hidden md:block" />
              </div>

              <div className="w-full md:pt-6 lg:pt-10 space-y-3 sm:space-y-5">
                <h3 className="text-xl font-bold">{getTranslatedValue(data?.name)}</h3>
                {/* rates cards */}
                {data.cashback.length > 0 && (
                  <div className="max-h-40 sm:max-h-56 pr-3 space-y-3 sm:space-y-5 overflow-y-auto custom-scrollbar">
                    {data.cashback.map((item, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 sm:p-3 bg-black-600 flex items-center justify-between gap-2 rounded-lg"
                      >
                        <p className="font-medium">{getTranslatedValue(item?.title)}</p>
                        <p className="font-medium">{getTranslatedValue(item?.description)}</p>
                        <span className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-190 text-green-750 font-semibold rounded-lg">
                          {item.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shop Now Button */}
                <ButtonComponent
                  variant="primary"
                  label={t('go_to_shop_now')}
                  icon={<RocketLaunchIcon className="size-4 sm:size-5" />}
                  customClass="w-full !py-3"
                  url={`/out/store/${data.id}`}
                  target="_blank"
                />

                {/* Info Box */}
                <div className="p-3 flex items-center gap-2.5 border border-gray-400 rounded-lg">
                  <InformationCircleIcon className="flex-shrink-0 size-5 text-white" />
                  <p>
                    <span className="font-semibold">{t('important')}</span> {t('single_store_note')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* mobile */}
          <StoreTrackerCard data={data} className="md:hidden" />

          {/* about store */}
          {getTranslatedValue(data.about) && (
            <div className="space-y-2 sm:space-y-5">
              <SectionTitleWithIcon title={t('shop_description')} className="lg:text-2xl underline" />

              <Card variant="outline" size="lg" className="animate-none">
                <div
                  className="max-h-32 sm:max-h-44 pr-3 text-xs sm:text-sm overflow-y-auto custom-scrollbar cms-box"
                  dangerouslySetInnerHTML={{ __html: getTranslatedValue(data.about) }}
                />
              </Card>
            </div>
          )}

          {/* dos and don'ts */}
          <DosAndDonts data={data} />

          {/* coupon section */}
          <CouponSection data={data} />

          {/* similar stores section */}
          <SimilarStoresSection data={data} />
        </div>
      </div>
    </div>
  );
};

export default SingleStorePage;

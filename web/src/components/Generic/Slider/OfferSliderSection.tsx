'use client';
import { useTranslation } from '@/i18n/client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Swiper as SwiperType } from 'swiper';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SectionTitleWithIcon from '../../Core/SectionTitleWithIcon';
import OfferCard from '../Card/OfferCard';
import OfferCardWithBanner from '../Card/OfferCardWithBanner';
import SkeletonComponent from '../Skeleton/SkeletonComponent';
import { twMerge } from 'tailwind-merge';
import RecommendedOfferCard from '../Card/RecommendedOfferCard';

export default function OfferSliderSection({ title, img, url, data, style }: any) {
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleBeforeInit = () => {
    setIsLoading(true);
  };

  const handleAfterInit = () => {
    setIsLoading(false);
  };

  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setIsHidden(!swiper.allowSlidePrev && !swiper.allowSlideNext);
  };

  const handleSlideChange = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  };

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="flex items-center justify-between pb-4">
          <SectionTitleWithIcon title={title} img={img} />

          <div className="flex items-center gap-6">
            {url && (
              <Link href={url} className="link font-semibold">
                {t('links_view_all')}
              </Link>
            )}

            {isBeginning && isEnd ? (
              <></>
            ) : (
              <div className={`${isHidden ? 'hidden' : 'flex'} items-center gap-2.5`}>
                <button
                  onClick={handlePrev}
                  className="size-6 sm:size-9 p-1 bg-black-600 grid place-content-center border border-gray-400 rounded-lg sm:rounded-lg disabled:opacity-50"
                  disabled={isBeginning}
                >
                  <ChevronLeftIcon className="size-3 sm:size-4 stroke-2 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="size-6 sm:size-9 p-1 bg-black-600 grid place-content-center border border-gray-400 rounded-lg disabled:opacity-50"
                  disabled={isEnd}
                >
                  <ChevronRightIcon className="size-3 sm:size-4 stroke-2 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="offer-slider max-xl:-mx-4">
          {style == 'large_with_banner' ? (
            // large banner offer slider
            <>
              {isLoading && (
                <div className="max-xl:mx-4 flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <SkeletonComponent count={3} className="lg:flex-1 flex-shrink-0 h-[200px] !w-[284px] rounded-lg" />
                </div>
              )}
              <Swiper
                onSwiper={handleSwiper}
                onSlideChange={handleSlideChange}
                onBeforeInit={handleBeforeInit}
                onInit={handleAfterInit}
                breakpoints={{
                  0: {
                    spaceBetween: 12,
                  },
                  640: {
                    spaceBetween: 16,
                  },
                }}
                slidesPerView={'auto'}
                slidesPerGroup={style == 'large_with_banner' ? 1 : 3}
                className="max-w-full max-xl:!px-4"
                wrapperClass={twMerge('max-w-full', isLoading ? '!hidden' : '')}
              >
                {data.map((item: any, index: number) => (
                  <SwiperSlide key={index} className={`!w-[284px] sm:!w-[284px]`}>
                    <OfferCardWithBanner key={index} data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : style == 'small' ? (
            // default offer slider
            <>
              {isLoading && (
                <div className="max-xl:mx-4 flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <SkeletonComponent
                    count={9}
                    className="flex-shrink-0 h-[182px] sm:h-[232px] !w-[106px] sm:!w-[133px] rounded-lg"
                  />
                </div>
              )}
              <Swiper
                onSwiper={handleSwiper}
                onSlideChange={handleSlideChange}
                onBeforeInit={handleBeforeInit}
                onInit={handleAfterInit}
                breakpoints={{
                  0: {
                    slidesPerView: 3,
                    spaceBetween: 12,
                  },
                  500: {
                    slidesPerView: 4,
                    spaceBetween: 12,
                  },
                  640: {
                    slidesPerView: 'auto',
                    spaceBetween: 16,
                  },
                }}
                slidesPerView={'auto'}
                slidesPerGroup={style == 'large_with_banner' ? 1 : 3}
                className="max-w-full max-xl:!px-4"
                wrapperClass={twMerge('max-w-full', isLoading ? '!hidden' : '')}
              >
                {data.map((item: any, index: number) => (
                  <SwiperSlide key={index} className={`!w-[106px]s sm:!w-[133px]`}>
                    <OfferCard data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : style == 'revenue_universe_featured_offers' ? (
            <>
              {isLoading && (
                <div className="max-xl:mx-4 flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <SkeletonComponent count={3} className="lg:flex-1 flex-shrink-0 h-[200px] !w-[284px] rounded-lg" />
                </div>
              )}
              <Swiper
                onSwiper={handleSwiper}
                onSlideChange={handleSlideChange}
                onBeforeInit={handleBeforeInit}
                onInit={handleAfterInit}
                breakpoints={{
                  0: {
                    spaceBetween: 12,
                  },
                  640: {
                    spaceBetween: 16,
                  },
                }}
                slidesPerView={'auto'}
                slidesPerGroup={style == 'large_with_banner' ? 1 : 3}
                className="max-w-full max-xl:!px-4"
                wrapperClass={twMerge('max-w-full', isLoading ? '!hidden' : '')}
              >
                {data.map((item: any, index: number) => (
                  <SwiperSlide key={index} className={`!w-[284px] sm:!w-[284px]`}>
                    <RecommendedOfferCard key={index} data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
}

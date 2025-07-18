'use client';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import useMobileBreakpoint from '@/Hook/use-mobile';
import { useTranslation } from '@/i18n/client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { twMerge } from 'tailwind-merge';
import StoreCard from '../Card/StoreCard';
import SkeletonComponent from '../Skeleton/SkeletonComponent';

const StoreGridSliderSection = ({ title, img, url, data }: { title: any; img: any; url?: any; data: any }) => {
  const { isMobile } = useMobileBreakpoint();
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
            {isMobile === true &&
              (isBeginning && isEnd ? (
                <></>
              ) : (
                <div className={twMerge('items-center gap-2.5', isHidden ? 'hidden' : 'flex')}>
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
              ))}
          </div>
        </div>
        <div className="sm:hidden store-card-slider max-xl:-mx-4">
          {isLoading && (
            <div className="max-xl:mx-4 flex items-center gap-3 sm:gap-4 overflow-hidden">
              <SkeletonComponent
                count={3}
                className="lg:flex-1 flex-shrink-0 h-[135px] sm:h-[200px] !w-[162px] sm:!w-[232px] rounded-lg"
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
                spaceBetween: 12,
              },
              640: {
                spaceBetween: 16,
              },
            }}
            slidesPerView={'auto'}
            className="max-w-full max-xl:!px-4"
            wrapperClass={twMerge('max-w-full', isLoading ? '!hidden' : '')}
          >
            {data.map((item: any, index: number) => (
              <SwiperSlide key={index} className={`!w-[162px] sm:!w-[232px]`}>
                <StoreCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="max-sm:hidden store-grid">
          {data.map((item: any, index: number) => (
            <StoreCard key={index} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreGridSliderSection;

'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SectionTitleWithIcon from '../../Core/SectionTitleWithIcon';
import PartnerCard from '../Card/PartnerCard';
import { twMerge } from 'tailwind-merge';
import SkeletonComponent from '../Skeleton/SkeletonComponent';

export default function PartnerSliderSection({ data, title, img, providerType, tooltip = false, tooltipContent }: any) {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;

    const handleSwiperUpdate = () => {
      if (swiperInstance) {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
        setIsHidden(
          swiperInstance.slides.length <= swiperInstance.params.slidesPerView
        );
      }
    };

    if (swiperInstance) {
      handleSwiperUpdate();
      swiperInstance.on('slideChange', handleSwiperUpdate);
      swiperInstance.on('reachEnd', handleSwiperUpdate);
      swiperInstance.on('reachBeginning', handleSwiperUpdate);
    }

    return () => {
      if (swiperInstance) {
        swiperInstance.off('slideChange', handleSwiperUpdate);
        swiperInstance.off('reachEnd', handleSwiperUpdate);
        swiperInstance.off('reachBeginning', handleSwiperUpdate);
      }
    };
  }, [data]);

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };


  return (
    <section className="animate-fade-in">
      <div className="container">
        <div className="flex items-center justify-between pb-4">
          <SectionTitleWithIcon title={title} img={img} tooltip={tooltip} tooltipContent={tooltipContent} />

          {isBeginning && isEnd ? (
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
          )}
        </div>
        <div className="partner-slider max-xl:-mx-4">
          {isLoading && (
            <div className="max-xl:mx-4 flex items-center gap-3 sm:gap-4 overflow-hidden">
              <SkeletonComponent count={7} className="flex-shrink-0 h-[98px] sm:h-[126px] !w-[207px] sm:!w-[265px] rounded-lg" />
            </div>
          )}
          <Swiper
            ref={swiperRef}
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
              <SwiperSlide key={index} className="!w-[207px] sm:!w-[265px]">
                <PartnerCard data={item} providerType={providerType} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

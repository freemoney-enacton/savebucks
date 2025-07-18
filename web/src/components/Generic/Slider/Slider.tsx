'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import TestimonialCard from '../Card/TestimonialCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Pagination } from 'swiper/modules';

export default function Slider({ slidesPerView, data, rows }: any) {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;

    const handleSwiperUpdate = () => {
      if (swiperInstance) {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
        setHideButtons(swiperInstance.slides.length <= swiperInstance.params.slidesPerView);
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
    <div className="testimonial-slider group relative">
      <div className="lg:max-w-[1196px] !-mx-4 lg:!mx-auto">
        <Swiper
          ref={swiperRef}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={16}
          breakpoints={{
            0: {
              spaceBetween: 12,
            },
            640: {
              spaceBetween: 16,
            },
            768: {
              spaceBetween: 24,
            },
          }}
          slidesPerView={'auto'}
          className="animate-fade-in max-w-full max-lg:!px-4 !pb-6 sm:!pb-9"
          wrapperClass="max-w-full"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index} className="animate-fade-in !h-auto !w-[230px] sm:!w-[281px]">
              <TestimonialCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        {isBeginning && isEnd ? (
          <></>
        ) : (
          <div
            className={`max-md:hidden ${
              hideButtons ? 'hidden' : 'hidden lg:flex group-hover:max-sm:hidden group-hover:max-lg:flex transition-ease'
            }`}
          >
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-[1] disabled:opacity-50"
              disabled={isBeginning}
            >
              <ChevronLeftIcon className="size-8 stroke-2 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-[1] disabled:opacity-50"
              disabled={isEnd}
            >
              <ChevronRightIcon className="size-8 stroke-2 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

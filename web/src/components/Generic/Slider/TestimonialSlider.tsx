'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import TestimonialCardV2 from '../Card/TestimonialCardV2';

export default function TestimonialSlider({ data }: any) {
  SwiperCore.use([Navigation, Autoplay, FreeMode]);
  const midpoint = Math.ceil(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);
  return (
    <div className="relative">
      <Swiper
        className="animate-fade-in"
        wrapperClass="animate-fade-in"
        speed={3000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
          pauseOnMouseEnter: false,
        }}
        loop={true}
        freeMode={true}
        slidesPerView={'auto'}
        spaceBetween={20}
      >
        {firstHalf.map((item, index) => (
          <SwiperSlide key={index} className="pt-2.5 pb-5 animate-fade-in !h-auto last:max-md:mr-6 !w-[340px]">
            <TestimonialCardV2 data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        className="animate-fade-in"
        wrapperClass="animate-fade-in"
        speed={3000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: false,
          pauseOnMouseEnter: false,
        }}
        loop={true}
        freeMode={true}
        slidesPerView={'auto'}
        spaceBetween={20}
      >
        {secondHalf.map((item, index) => (
          <SwiperSlide key={index} className="pt-2.5 pb-5 animate-fade-in !h-auto last:max-md:mr-6 !w-[340px]">
            <TestimonialCardV2 data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

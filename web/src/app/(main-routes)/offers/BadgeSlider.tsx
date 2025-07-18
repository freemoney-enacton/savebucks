'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import BadgeCard from './BadgeCard';

const BadgeSlider = ({ data }: { data: any }) => {
  // @ts-ignore
  const initialTheme = localStorage.getItem('theme') || 'light';
  return (
    <Swiper
      spaceBetween={16}
      breakpoints={{
        0: {
          spaceBetween: 12,
        },
        640: {
          spaceBetween: 16,
        },
      }}
      slidesPerView={'auto'}
    >
      {data.map((item, index) => (
        <SwiperSlide key={index} className="!w-auto">
          <BadgeCard data={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BadgeSlider;

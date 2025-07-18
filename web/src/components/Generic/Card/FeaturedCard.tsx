'use client';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });
import Image from 'next/image';
import React from 'react';

export default function FeaturedCard({ data }: any) {
  return (
    <div className="relative p-7 bg-black-600 rounded-[30px] space-y-5 sm:space-y-7 text-center sm:even:mb-[-50%] sm:even:mt-auto overflow-hidden">
      <div className="h-12 sm:h-14">
        {data.image ? (
          data.image?.includes('.json') ? (
            <Lottie className="max-h-12 sm:max-h-14 w-auto mx-auto" animationData={data.image} loop={true} />
          ) : (
            <Image className="max-h-12 sm:max-h-14 w-auto mx-auto" src={data.image} alt="logo" width={150} height={150} />
          )
        ) : null}
      </div>
      <div className="space-y-1 sm:space-y-3">
        <h3 className="text-lg sm:text-2xl text-white">{data.title}</h3>
        {data?.content && (
          <p dangerouslySetInnerHTML={{ __html: data?.content }} className="text-xs sm:text-base font-medium cms-box"></p>
        )}
      </div>
      <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2 z-[0] bg-orange h-16 w-16 filter blur-[77px] rounded-full"></div>
    </div>
  );
}

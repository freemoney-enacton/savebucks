'use client';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });
import Image from 'next/image';
import React from 'react';

export default function InfoCard({ data }: any) {
  return (
    <div className="relative text-center space-y-3 sm:space-y-6 max-w-[330px] mx-auto">
      <div className="h-[80px] lg:h-[150px]">
        {data.image ? (
          data.image?.includes('.json') ? (
            <Lottie className="max-h-[80px] lg:max-h-[150px] w-auto mx-auto" animationData={data.image} loop={true} />
          ) : (
            <Image
              className="max-h-[80px] lg:max-h-[150px] w-auto mx-auto"
              src={data.image}
              alt="logo"
              width={150}
              height={150}
            />
          )
        ) : null}
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        <h3 className="text-lg sm:text-xl md:text-2xl xl:text-3xl text-white font-bold">{data.title}</h3>
        {data.description && (
          <div dangerouslySetInnerHTML={{ __html: data.description }} className="text-xs sm:text-sm md:text-base font-medium cms-box"></div>
        )}
      </div>
    </div>
  );
}

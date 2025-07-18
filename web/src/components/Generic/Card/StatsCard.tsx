'use client';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

export default function StatsCard({ data }) {
  return (
    <div className="bg-tertiary-gr p-[2px] rounded-[10px]">
      <div className="relative h-full flex items-center gap-2 sm:gap-4 2xl:gap-6 px-8 sm:px-12 md:px-4 lg:px-5 py-6 xl:py-10 2xl:px-10 rounded-lg bg-black-600">
        <div className="flex-shrink-0 size-12 lg:size-20">
          {data.image ? (
            data.image?.includes('.json') ? (
              <Lottie className="max-h-20 w-auto" animationData={data.image} loop={true} />
            ) : (
              <Image className="max-h-20 w-auto" src={data.image} alt="logo" width={80} height={80} />
            )
          ) : null}
        </div>
        <div className="text-center space-y-2 w-full">
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white">{data.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: data.description }} className="text-xs sm:text-sm cms-box"></p>
        </div>
      </div>
    </div>
  );
}

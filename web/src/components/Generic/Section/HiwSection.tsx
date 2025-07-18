'use client';
import Image from 'next/image';
import React from 'react';
import SectionTitle from '../../Core/SectionTitle';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

export default function HiwSection({ title, img, children }: any) {
  return (
    <section className="section HiwSection">
      <div className="container">
        <div className="space-y-10">
          <SectionTitle title={title} />
          <div className="grid md:grid-cols-2 gap-10 md:gap-6 items-center xl:px-12">
            <div className="relative">
              {img ? (
                img?.includes('.json') ? (
                  <Lottie className="w-auto max-md:max-w-[260px] mx-auto" animationData={img} loop={true} />
                ) : (
                  <Image className="w-auto max-md:max-w-[260px] mx-auto" src={img} alt={title} width={438} height={537} />
                )
              ) : null}
              <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2 z-[0]dd bg-purple-600 h-40 w-40 filter blur-[197px] rounded-full"></div>
            </div>
            <div className="max-sm:max-w-[350px] mx-auto space-y-3.5 sm:space-y-7">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

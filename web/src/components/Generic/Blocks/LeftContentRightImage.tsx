'use client';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import ButtonComponent from '../ButtonComponent';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

const LeftContentRightImage = ({ data }: any) => {
  return (
    <section className="cms-hiw-section-v1">
      <div className="grid lg:grid-cols-2 lg:items-center">
        <div className="right-col order-2 lg:order-1 h-full w-full flex items-center">
          <div className="max-w-[540px] md:max-w-[720px] lg:max-w-[666px] mx-auto lg:ml-auto lg:mr-0 px-4 sm:px-5 pt-12 pb-12 sm:pb-[100px] lg:py-[100px] space-y-4 sm:space-y-5 xl:space-y-7 text-black">
            {data?.title && (
              <h2 className="text-[35px] sm:text-[50px] xl:text-[55px] 2xl:text-[65px] font-medium leading-[1.15]">
                {data?.title}
              </h2>
            )}
            {data?.description_1 && data?.description_1 && (
              <div className="pb-2.5 sm:pb-5 text-base sm:text-xl space-y-2.5 sm:space-y-5">
                {data?.description_1 && <p>{data?.description_1}</p>}
                {data?.description_2 && <p>{data?.description_2}</p>}
              </div>
            )}
            {data?.button_text && (
              <ButtonComponent role="link" href={data?.button_link || ''} label={data?.button_text} variant="primary" />
            )}
          </div>
        </div>
        <div className="h-full w-full order-1 lg:order-2 overflow-hidden">
          {data.image ? (
            data.image?.includes('.json') ? (
              <Lottie className="h-full w-full object-cover" animationData={data?.image} loop={true} />
            ) : (
              <Image className="h-full w-full object-cover" src={data?.image} alt={data?.title} width={5000} height={2000} />
            )
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default LeftContentRightImage;

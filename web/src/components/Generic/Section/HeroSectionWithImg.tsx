'use client';
import React from 'react';
import ButtonComponent from '../ButtonComponent';
import { Rocket } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

const HeroSectionWithImg = ({ item }) => {
  const parts = item?.title.split(/(\|.*?\|)/);
  return (
    <>
      <section className="py-10 md:py-20 lg:py-32 overflow-hidden">
        <div className="relative">
          <div className="container relative z-[1]">
            <div className="relative grid md:grid-cols-2 items-center gap-5 lg:gap-10 max-md:max-w-[400px] mx-auto">
              <div className="text-center md:text-left space-y-4 order-2 md:order-1">
                <div className="max-w-xl">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl leading-[1.5] bg-white-heading-gr text-gradient font-bold">
                    {parts.map((part, index) =>
                      part.startsWith('|') && part.endsWith('|') ? (
                        <span key={index} className="bg-primary-gr text-gradient leading-[1.5]">
                          {part.slice(1, -1)}
                        </span>
                      ) : (
                        <span key={index}>{part}</span>
                      )
                    )}
                  </h1>
                </div>
                <p className="text-base lg:text-xl text-gray-650">{item?.sub_title}</p>
                <div className="relative w-full max-w-[220px] sm:max-w-[296px] max-md:mx-auto">
                  <ButtonComponent
                    role="link"
                    url={item?.button_link}
                    variant="primary"
                    label={item?.button_text}
                    icon={<Rocket className="w-4 sm:w-6 h-4 sm:h-6" />}
                    customClass="w-full lg:!py-3 lg:!text-base"
                  />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[0] bg-orange h-28 w-28 filter blur-[122px] rounded-full"></div>
                </div>
              </div>
              <div className="grid place-content-center order-1 md:order-2">
                {item?.image ? (
                  item?.image?.includes('.json') ? (
                    <Lottie className="!w-auto" animationData={item?.image} loop={true} />
                  ) : (
                    <Image className="!w-auto" src={item?.image} alt="logo" width={674} height={374} />
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-8 z-[0] bg-purple-600 h-20 md:h-[290px] w-20 md:w-[290px] filter blur-[242px] rounded-full"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-[0] bg-orange h-20 md:h-[230px] w-20 md:w-[250px] filter blur-[182px] rounded-full"></div>
        </div>
      </section>
    </>
  );
};

export default HeroSectionWithImg;

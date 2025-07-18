'use client';
import React from 'react';
import ButtonComponent from '../ButtonComponent';
import { Rocket } from 'lucide-react';
import Image from 'next/image';
import Lottie from 'react-lottie-player';

const RewardsCtaSection = ({ item }) => {
  const parts = item?.title ? item?.title?.split(/(\|.*?\|)/) : [];
  const desc = item?.sub_title ? item?.sub_title?.split(/(\|.*?\|)/) : [];
  return (
    <div className="relative py-6 px-6 lg:py-12 lg:px-12 bg-black-600 rounded-[30px] overflow-clip">
      <div className="relative max-w-[330px] text-left space-y-3 z-[1]">
        <h4 className="bg-white-heading-gr text-gradient text-base sm:text-lg font-semibold">
          {parts.map((part, index) =>
            part.startsWith('|') && part.endsWith('|') ? (
              <span key={index} className="bg-primary-gr text-gradient leading-[1.5]">
                {part.slice(1, -1)}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </h4>
        <p className="text-gray-600 text-base sm:text-lg font-medium">
          {desc.map((part, index) =>
            part.startsWith('|') && part.endsWith('|') ? (
              <span key={index} className="text-gradient bg-primary-gr">
                {part.slice(1, -1)}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </p>
        <ButtonComponent
          role="link"
          url={item?.button_link}
          variant="primary"
          label={item?.button_text}
          icon={<Rocket className="size-4 fill-white" />}
          customClass="!px-2.5 !py-2 !text-xs sm:!text-sm"
        />
      </div>
      {/* background image */}
      {item?.image ? (
        item?.image?.includes('.json') ? (
          <Lottie
            className="max-sm:hidden absolute right-0 inset-y-0 z-[0] max-w-[290px] lg:max-w-[390px] h-auto w-auto"
            animationData={item?.image}
            loop={true}
          />
        ) : item?.image ? (
          <Image
            className="max-sm:hidden absolute right-0 inset-y-0 z-[0] max-w-[290px] lg:max-w-[390px] h-auto w-auto"
            src={item?.image}
            alt="logo"
            width={700}
            height={700}
          />
        ) : null
      ) : null}

      {/* gradient blurs */}
      <div className="absolute left-4 bottom-12 z-[0] bg-purple-600 size-12 sm:size-24 filter blur-[85px] rounded-full"></div>
      <div className="absolute right-1/2 transform translate-x-1/2 -top-4 z-[0] bg-orange size-20 sm:w-[199px] sm:h-[60px] filter blur-[77px] rounded-full"></div>
      <div className="absolute right-[10%] bottom-0 z-[0] bg-purple-600 size-12 sm:size-24 filter blur-[130px] rounded-full"></div>
    </div>
  );
};

export default RewardsCtaSection;

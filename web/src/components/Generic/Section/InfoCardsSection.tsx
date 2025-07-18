'use client';
import SectionTitle from '@/components/Core/SectionTitle';
import Image from 'next/image';
import React from 'react';

const InfoCardsSection = ({ data }: { data: any }) => {
  return (
    <section className="section">
      <div className="container">
        <div className="px-3 space-y-4 sm:space-y-10">
          <SectionTitle title={data?.title} />
          <div className="relative max-w-[290px] sm:max-w-[450px] md:max-w-[1188px] mx-auto grid md:grid-cols-3 gap-4 lg:gap-6">
            {/* decoration */}
            <div className="absolute -top-1.5 lg:-top-2 -right-1.5 lg:-right-2 z-[0] bg-tertiary-gr size-28 sm:size-36 rounded-lg sm:rounded-xl"></div>
            <div className="absolute -bottom-1.5 lg:-bottom-2 -left-1.5 lg:-left-2 z-[0] bg-tertiary-gr size-28 sm:size-36 rounded-lg sm:rounded-xl"></div>
            {data.items?.length > 0 &&
              data.items.map((item, index) => (
                <div key={index} className="bg-tertiary-gr p-[2px] rounded-[10px] sm:rounded-[14px]">
                  <div className="relative h-full p-5 xl:p-7 bg-black-600 rounded-lg sm:rounded-xl space-y-3 sm:space-y-5 xl:space-y-7 text-center">
                    <div className="space-y-1.5 w-full">
                      <h4 className="text-base sm:text-xl font-semibold">{item?.title}</h4>
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">{item?.featured_text}</h3>
                      <p className="text-xs sm:text-sm font-medium">{item?.description}</p>
                    </div>
                    <div
                      className="text-xs sm:text-sm font-medium cms-box"
                      dangerouslySetInnerHTML={{ __html: item?.rich_description }}
                    ></div>
                    <div className="flex-shrink-0 size-32 lg:size-44 mx-auto">
                      {item?.image && (
                        <Image className="max-h-32 lg:max-h-44 w-auto" src={item?.image} alt="logo" width={176} height={176} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoCardsSection;

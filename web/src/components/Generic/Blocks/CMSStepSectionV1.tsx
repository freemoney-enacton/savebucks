'use client';
import Image from 'next/image';
import React from 'react';
import SectionTitle from '../../Core/SectionTitle';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

const CMSStepSectionV1 = ({ data }: any) => {
  return (
    <section className="py-12 sm:py-24 2xl:py-[120px]">
      <div className="container">
        <div className="max-lg:max-w-[720px] mx-auto grid lg:grid-cols-2 gap-7 sm:gap-10 lg:gap-0">
          <div className="lg:pr-10">
            <div className="overflow-hidden">
              {data.image ? (
                data.image?.includes('.json') ? (
                  <Lottie className="w-auto" animationData={data.image} loop={true} />
                ) : (
                  <Image className="w-full h-auto" src={data.image} alt={data.title} width={5000} height={2000} />
                )
              ) : null}
            </div>
          </div>
          <div className="w-full space-y-6 sm:space-y-10">
            {data?.title && (
              <SectionTitle
                title={data?.title}
                customClass="!text-[30px] sm:!text-[35px] md:!text-[50px] 2xl:!text-[60px] !font-medium sm:!text-start !leading-[1.1]"
                spanClass="block text-[45px] sm:text-[55px] sm:text-[70px] sm:text-[70px] 2xl:text-[80px] leading-[1] text-primary"
              />
            )}
            {data?.items?.length > 0 && (
              <div className="w-full space-y-6 sm:space-y-9">
                {data?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-5">
                    {item?.image && (
                      <div className="size-[50px] sm:size-[60px] flex items-center justify-centerF">
                        <Image
                          className="max-w-[50px] sm:max-w-[60px] w-auto h-auto"
                          src={item?.image}
                          alt={item?.item_title}
                          width={500}
                          height={500}
                        />
                      </div>
                    )}
                    <div className="space-y-2.5 sm:space-y-3">
                      {item?.title && (
                        <h3 className="text-white text-[22px] sm:text-[28px] font-medium leading-6 sm:leading-8">
                          {item?.title}
                        </h3>
                      )}
                      {item?.content && (
                        <div
                          className="text-[15px] sm:text-lg font-normal leading-[23px] sm:leading-7"
                          dangerouslySetInnerHTML={{ __html: item?.content }}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CMSStepSectionV1;

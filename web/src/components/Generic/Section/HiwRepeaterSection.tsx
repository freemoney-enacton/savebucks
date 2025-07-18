import SectionTitle from '@/components/Core/SectionTitle';
import Image from 'next/image';
import React from 'react';

const HiwRepeaterSection = ({ data }: { data: any }) => {
  return (
    <div className="section !pb-0 container">
      <SectionTitle title={data?.title} />
      {data?.items?.length > 0 &&
        data?.items?.map((item, index) => (
          <section className="group section" key={index}>
            <div className="max-md:max-w-[500px] mx-auto grid md:grid-cols-2 gap-4 sm:gap-8 xl:gap-14">
              <div className="flex gap-1 sm:gap-2 max-md:!order-1 group-odd:order-2 group-even:order-1">
                <div className="flex-shrink-0 size-5 sm:size-7 lg:size-9">
                  {item?.icon_image ? (
                    <Image
                      src={item?.icon_image}
                      alt="icon"
                      className="max-w-5 sm:max-w-7 lg:max-w-9 !w-auto h-auto"
                      height={100}
                      width={100}
                    />
                  ) : null}
                </div>
                <div className="space-y-1 sm:space-y-3">
                  <SectionTitle title={item?.title} as="h3" customClass="!text-base sm:!text-2xl xl:!text-3xl !text-left" />
                  <div className="text-xs sm:text-sm lg:text-base" dangerouslySetInnerHTML={{ __html: item?.description }}></div>
                </div>
              </div>
              <div className="w-full max-md:!order-2 group-odd:order-1 group-even:order-2">
                {item?.image ? <Image src={item?.image} alt="icon" className="w-full h-auto" height={1000} width={1000} /> : null}
              </div>
            </div>
          </section>
        ))}
    </div>
  );
};

export default HiwRepeaterSection;

import Heading from '@/components/Core/Heading';
import Image from 'next/image';
import React from 'react';
import OverviewStatsCard from '../Card/OverviewStatsCard';

const HeroSectionWithMiniStats = ({ data }: { data: any }) => {
  return (
    <section className="relative section z-0">
      {data?.image ? (
        <Image
          className="absolute top-0 inset-x-0 h-full md:w-full object-cover z-[-1]"
          src={data?.image}
          alt="image"
          width={1000}
          height={1000}
          quality={100}
        />
      ) : null}
      <div className="max-w-[1124px] mx-auto px-4 space-y-4 sm:space-y-7">
        <Heading
          title={data?.title}
          customClass="!text-2xl sm:!text-4xl lg:!text-5xl xl:!text-[64px] !leading-[1.2] sm:!leading-[1.2] lg:!leading-[1.2] xl:!leading-[1.2] text-center"
        />

        {data?.items?.length > 0 && (
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
            {data?.items?.map((item, index) => (
              <OverviewStatsCard data={item} key={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSectionWithMiniStats;

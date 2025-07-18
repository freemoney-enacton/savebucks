import Image from 'next/image';
import React from 'react';

export default function StepsCard({ data, index }: any) {
  return (
    <div className="relative flex items-center gap-6 p-5 md:p-6 lg:py-6 lg:px-8 bg-black-250 rounded-lg overflow-hidden group">
      <div className="relative flex group-odd:order-1 group-even:order-2 gap-5 h-fit ml-4 sm:ml-8 text-purple">
        {/* <p className="uppercase origin-center rotate-[270deg] absolute -left-7 top-1/2 transform -translate-y-1/2">step</p> */}
        {/* <h2 className="text-5xl lg:text-7xl font-semibold">{index + 1}</h2> */}
        {data.image && <Image src={data.image} alt="logo" width={80} height={80} />}
      </div>
      <div className="space-y-2 group-odd:order-2 group-even:order-1 w-full">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">{data.title}</h3>
        {data.content && (
          <p
            dangerouslySetInnerHTML={{ __html: data.content }}
            className=" font-medium text-xs sm:text-sm lg:text-lg cms-box"
          ></p>
        )}
      </div>
      <div className="absolute right-1/2 transform translate-x-1/2 -bottom-8 z-[0] bg-orange h-16 w-16 filter blur-[77px] rounded-full"></div>
    </div>
  );
}

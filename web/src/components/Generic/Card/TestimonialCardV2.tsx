import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';

const TestimonialCardV2 = ({ data }: any) => {
  const fullStars = Math.floor(data.rating); // Number of full stars
  const hasHalfStar = data.rating % 1 !== 0; // Check if there's a half star
  const maxStars = 5; // Maximum number of stars
  dayjs.extend(relativeTime);
  return (
    <div className="bg-border-gr p-[1px] rounded-2xl h-full testimonial-card transition-ease">
      <div className="bg-black rounded-2xl px-6 py-7 h-full space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 size-[55px]">
            <Image
              className="max-h-[55px] rounded-full"
              src={
                data?.image ? data?.image : `https://ui-avatars.com/api/?rounded=true&name=${data.user_name}&background=random`
              }
              alt="logo"
              width={400}
              height={400}
            />
          </div>
          <div className="w-full space-y-0.5">
            <p className="text-white text-2xl font-medium leading-[1.1]">{data.user_name}</p>
            <p className="text-base leading-[1.1]">{dayjs(data.date).fromNow()}</p>
          </div>
        </div>
        <div className="self-end flex items-center">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: fullStars }, (_, index) => (
              <Image key={index} className="size-5" src="/images/v1/rating.png" alt="star" width={100} height={100} />
            ))}
            {hasHalfStar && fullStars < maxStars && (
              <Image
                className="h-5 w-2.5 object-cover object-left"
                src="/images/v1/rating.png"
                alt="half star"
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
        <div className="space-y-3">
          <h5 className="text-[22px] font-medium text-white line-clamp-1">{data.title}</h5>
          <p className="text-base line-clamp-4">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCardV2;

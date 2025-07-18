import { StarIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { StarHalfIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';

export default function TestimonialCard({ data }: any) {
  const fullStars = Math.floor(data.rating); // Number of full stars
  const hasHalfStar = data.rating % 1 !== 0; // Check if there's a half star
  const maxStars = 5; // Maximum number of stars
  dayjs.extend(relativeTime);
  return (
    <div className="h-full p-4 sm:py-7 sm:px-5 bg-black border border-gray-400 rounded-lg space-y-2 sm:space-y-4">
      <div className="text-white space-y-1.5 sm:space-y-3">
        <div className="flex items-center gap-2">
          {data.image && (
            <div className="flex-shrink-0 size-7 sm:size-9 rounded-full overflow-hidden">
              <Image
                // src={
                //   data?.image ? data?.image : `https://ui-avatars.com/api/?rounded=true&name=${data.user_name}&background=random`
                // }
                src={`https://ui-avatars.com/api/?rounded=true&name=${data.user_name}&background=random`}
                className="h-full w-full object-cover rounded-full"
                alt="logo"
                width={40}
                height={40}
              />
            </div>
          )}
          <div className="leading-[1.2]">
            <p className="text-xs sm:text-sm">{data.user_name}</p>
            <p className="text-8px sm:text-xxs">{dayjs(data.date).fromNow()}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center">
          {Array.from({ length: fullStars }, (_, index) => (
            <StarIcon key={index} className="size-3.5 sm:size-4 text-yellow" />
          ))}
          {hasHalfStar && fullStars < maxStars && <StarHalfIcon className="size-3.5 sm:size-4 text-yellow" />}
        </div>
      </div>
      <p className="text-sm sm:text-base font-medium text-white line-clamp-1">{data?.title}</p>
      <p
        className="text-xs sm:text-sm line-clamp-[7] sm:line-clamp-6"
        style={{ color: 'color-mix(in srgb, var(--body_text_primary) 50%, transparent)' }}
      >
        {data?.description}
      </p>
    </div>
  );
}

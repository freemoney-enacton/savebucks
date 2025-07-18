'use client';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Link from 'next/link';
import { useUtils } from '@/Hook/use-utils';

const CouponCard = ({ data, store }: { data: any; store: any }) => {
  const { getTranslatedValue } = useUtils();
  return (
    <div className="p-3 sm:p-4 border border-gray-400 rounded-lg space-y-1 sm:space-y-2.5 transition-ease cursor-pointer hover:shadow-sm">
      <p className="text-primary text-xs sm:text-xl font-semibold line-clamp-1 break-all">{store?.cashback_string}</p>
      <p className="text-xxs sm:text-sm line-clamp-3 break-all">{getTranslatedValue(data?.description)}</p>
      <Link
        href={`/out/coupon/${data?.id}`}
        className="size-5 sm:size-7 ml-auto grid place-content-center bg-primary rounded-full"
        target="_blank"
      >
        <ArrowRightIcon className="size-3 sm:size-4 text-black" />
      </Link>
    </div>
  );
};

export default CouponCard;

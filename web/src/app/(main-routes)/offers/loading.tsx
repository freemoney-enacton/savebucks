import React from 'react';
// import { Skeleton } from '@nextui-org/skeleton';
import SkeletonComponent from '@/components/Generic/Skeleton/SkeletonComponent';
import OfferGridSkeleton from '@/components/Generic/Skeleton/OfferGridSkeleton';

const loading = () => {
  return (
    <div className="section">
      <div className="container space-y-4 sm:space-y-[30px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SkeletonComponent count={1} className="h-9 sm:h-[46px] w-[150px]" />
          <div className="flex items-center gap-3 sm:gap-4">
            <SkeletonComponent count={1} className="h-9 sm:h-[46px] w-full sm:w-[150px]" />
            <SkeletonComponent count={1} className="flex-shrink-0 size-9 sm:size-[46px]" />
            <SkeletonComponent count={1} className="lg:hidden flex-shrink-0 size-9 sm:size-[46px]" />
          </div>
        </div>
        <div className="flex items-center gap-4 overflow-hidden">
          <SkeletonComponent count={15} className="flex-shrink-0 h-[68px] sm:h-[76px] w-24 sm:w-24" />
        </div>
        <OfferGridSkeleton />
      </div>
    </div>
  );
};

export default loading;

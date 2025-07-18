import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const SingleOfferPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <SkeletonComponent count={1} className="h-8 w-full max-w-[70%] sm:max-w-[50%] rounded-lg" />

      <div className="flex items-center gap-3.5">
        <div className="w-[90px] h-[90px] flex-shrink-0 rounded-[14px] overflow-hidden">
          <SkeletonComponent count={1} className="h-full w-full" />
        </div>
        <div className=" w-full space-y-1.5">
          <SkeletonComponent count={1} className="h-8 w-20 rounded-md" />
          <SkeletonComponent count={1} className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonComponent count={1} className="h-5 w-[30%] rounded-lg" />
        <SkeletonComponent count={1} className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <SkeletonComponent count={1} className="h-5 w-[30%] rounded-lg" />
        <SkeletonComponent count={1} className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-4">
        <SkeletonComponent count={5} className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
};

export default SingleOfferPageSkeleton;

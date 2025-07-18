import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const OfferModalSkeleton = ({ variant = 'body' }: { variant?: 'body' | 'header' }) => {
  return variant === 'body' ? (
    <div className="!mt-0 space-y-6">
      <div className="space-y-2">
        <SkeletonComponent variant="white" count={1} className="h-5 w-[30%]" />
        <SkeletonComponent variant="white" count={1} className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <SkeletonComponent variant="white" count={1} className="h-5 w-[30%]" />
        <SkeletonComponent variant="white" count={1} className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <SkeletonComponent variant="white" count={10} className="h-11 w-full" />
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3.5">
      <div className="w-[90px] h-[90px] flex-shrink-0 rounded-[14px] overflow-hidden">
        <SkeletonComponent variant="white" count={1} className="h-full w-full" />
      </div>
      <div className="w-full space-y-1.5">
        <SkeletonComponent variant="white" count={1} className="h-8 w-20" />
        <SkeletonComponent variant="white" count={1} className="h-6 w-16" />
      </div>
    </div>
  );
};

export default OfferModalSkeleton;

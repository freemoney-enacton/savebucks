import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const TickerBarSkeleton = () => {
  return (
    <div className="flex items-center gap-2.5 sm:gap-5">
      <SkeletonComponent count={1} className="flex-shrink-0 h-10 w-[66px] rounded-full" />
      <div className="flex gap-2.5 tooltip-wrapper overflow-y-auto no-scrollbar">
        <SkeletonComponent count={15} className="flex-shrink-0 h-11 sm:h-[47px] w-[135px] sm:w-[155px] rounded-full" />
      </div>
    </div>
  );
};

export default TickerBarSkeleton;

import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const StoreGridSkeleton = ({ count = 25, className }: any) => {
  return (
    <div className={`store-grid ${className ? className : ''}`}>
      <SkeletonComponent count={count} className="h-[136px] sm:h-[192px] w-full" />
    </div>
  );
};

export default StoreGridSkeleton;

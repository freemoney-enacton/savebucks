import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const OfferGridSkeleton = ({ count = 25, className }: any) => {
  return (
    <div className={`offer-grid ${className ? className : ''}`}>
      <SkeletonComponent count={count} className="h-[182px] sm:h-[235px] w-full" />
    </div>
  );
};

export default OfferGridSkeleton;

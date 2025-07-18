import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const TableSkeleton = ({ variant = 'white' }: { variant?: string }) => {
  return variant === 'white' ? (
    <div className="table-skeleton space-y-3.5">
      <SkeletonComponent variant="white" count={5} className="h-12 w-full rounded-lg" />
    </div>
  ) : (
    <div className="table-skeleton space-y-3.5 bg-transparent">
      <SkeletonComponent variant="secondary" count={5} className="h-12 w-full rounded-lg" />
    </div>
  );
};

export default TableSkeleton;

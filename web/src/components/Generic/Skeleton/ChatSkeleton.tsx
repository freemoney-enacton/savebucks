import React from 'react';
import SkeletonComponent from './SkeletonComponent';

const ChatSkeleton = () => {
  return (
    <div className="space-y-2.5">
      <SkeletonComponent count={10} className="h-24 w-full rounded-2xl" />
    </div>
  );
};

export default ChatSkeleton;

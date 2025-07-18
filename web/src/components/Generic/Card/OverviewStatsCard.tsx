import React from 'react';

const OverviewStatsCard = ({ data }: any) => {
  return (
    <div className="badge-before h-full bg-black-600 border border-gray-400 rounded-[10px] py-2 sm:py-3 px-3.5 sm:px-4 flex items-center gap-2">
      <p className="text-xxs sm:text-sm leading-[1.1] font-medium">{data?.title || data?.name}</p>
      <div className="flex-shrink-0">
        <p className="text-xs sm:text-sm font-bold text-white">{data?.value ? data?.value : 0}</p>
      </div>
    </div>
  );
};

export default OverviewStatsCard;

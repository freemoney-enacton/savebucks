import React from 'react';
import OverviewStatsCard from '../Card/OverviewStatsCard';

const OverviewStatsSection = ({ item }) => {
  return (
    <div className="container">
      <div className="flex gap-5 justify-center sm:gap-6 py-5 sm:py-5 mx-auto flex-wrap z-[2]">
        {item?.length > 0 && item?.map((data, index) => <OverviewStatsCard data={data} key={index} />)}
      </div>
    </div>
  );
};

export default OverviewStatsSection;

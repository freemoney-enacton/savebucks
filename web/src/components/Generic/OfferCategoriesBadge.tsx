import React from 'react';

const OfferCategoriesBadge = ({
  name,
  backgroundColor,
  textColor,
}: {
  name: string;
  backgroundColor: string;
  textColor?: string;
}) => {
  return (
    <div
      className="min-w-[50px] sm:min-w-[72px] w-fit text-black font-medium text-8px sm:text-xs max-sm:leading-tight py-[3px] sm:py-1 px-1.5 sm:px-2 rounded-full text-center"
      style={{ background: backgroundColor, color: textColor }}
    >
      <span>{name}</span>
    </div>
  );
};

export default OfferCategoriesBadge;

import React from 'react';
import { SvgCrown, SvgDoubleArrow } from '../Icons';
import { StarIcon } from '@heroicons/react/24/solid';

const LadderCard = ({ item, index, isSelected, loading, nextSelectedIndex }) => {
  const ladderIcon = () => {
    switch (index) {
      case 0:
        return <SvgCrown className="size-5" />;
        break;
      case 1:
        return <StarIcon className={`size-5 ${isSelected ? 'text-black' : 'text-gray-400'}`} />;
        break;
      case 2:
        return <StarIcon className={`size-5 ${isSelected ? 'text-black' : 'text-gray-400'}`} />;
      default:
        return <SvgDoubleArrow className={`size-5 ${isSelected ? 'text-black' : 'text-gray-400'} -rotate-90`} />;
        break;
    }
  };
  return (
    <div
      key={index}
      className={`w-full px-4 py-2 flex items-center justify-center gap-2.5 border-2 ${
        index === 0
          ? '!bg-ladder1-gr !border-0'
          : index === 1
          ? 'border-ladder-2'
          : index === 2
          ? 'border-ladder-3'
          : 'bg-black border-transparent'
      } ${isSelected ? 'bg-primary !text-black' : 'bg-black'} rounded-[10px] ${
        loading && item.step === 0 && 'last-card-loading-animation'
      } ${loading && nextSelectedIndex == item.step - 1 && 'next-double-card-loading-animation'}`}
    >
      {item?.icon ? item?.icon : ladderIcon()}
      <p className={`${isSelected ? 'text-black' : 'text-white'} text-base font-medium`}>{item.amount}</p>
    </div>
  );
};

export default LadderCard;

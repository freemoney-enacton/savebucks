import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React from 'react';
import TooltipComponent from '../Generic/TooltipComponent';

export default function SectionTitleWithIcon({ title, img, tooltip = false, tooltipContent, className = '' }: any) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {img && <Image className="max-h-5 sm:max-h-[30px] w-auto" src={img} alt="logo" width={40} height={40} />}
      <h3 className={`text-base sm:text-xl font-semibold bg-white-heading-gr text-gradient ${className}`}>
        {title}
        {tooltip && (
          <span>
            <TooltipComponent
              contentData={<QuestionMarkCircleIcon className="size-4 sm:size-5 ml-1.5 inline text-gray-450" />}
              content={tooltipContent}
              placement="right"
            />
          </span>
        )}
      </h3>
    </div>
  );
}

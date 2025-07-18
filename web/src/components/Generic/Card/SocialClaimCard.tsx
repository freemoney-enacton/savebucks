import React from 'react';
import ButtonComponent from '../ButtonComponent';
import Image from 'next/image';

const SocialClaimCard = ({ imgUrl, title, btnName, onClick }: { imgUrl: any; title: any; btnName: any; onClick: any }) => {
  return (
    <div className="relative bg-black-600 p-4 sm:p-[30px] flex items-center gap-8 rounded-lg">
      <div className="size-9 sm:size-14 flex-shrink-0 flex items-center justify-center">
        {imgUrl ? <Image className="max-h-9 sm:max-h-14 h-auto w-auto" src={imgUrl} alt="icon" width={100} height={100} /> : null}
      </div>
      <div className="space-y-2">
        <p className="text-white text-sm sm:text-lg font-medium">{title}</p>
        <ButtonComponent
          onClick={onClick}
          role="button"
          label={btnName}
          variant="primary"
          customClass="!px-2.5 !py-2 !text-xxs sm:!text-xs"
        />
      </div>
      <div className="!mt-0 absolute left-[5%] top-1/2 -translate-y-1/2 z-[0] bg-orange size-8 filter blur-[39px] rounded-full"></div>
    </div>
  );
};

export default SocialClaimCard;

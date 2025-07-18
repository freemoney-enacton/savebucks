import React from 'react';
import Image from 'next/image';
import SignUpV1 from '../Forms/SignupV1';
import AuthTab from '../AuthTab';
import { config } from '@/config';

const CMSHeroSectionV1 = ({ data }: any) => {
  return (
    <section
      className="relative bg-center bg-no-repeat px-0 py-[38px] z-0"
      style={{ backgroundImage: `url(${data?.left_bg_image})`, backgroundSize: '100% 100%' }}
    >
      <div className="max-lg:hidden absolute inset-y-0 right-0 w-[calc(50%+0px)] z-[-1]">
        {data?.right_bg_image && (
          <Image className="h-full w-full object-cover" src={data?.right_bg_image} alt="" width={4000} height={2000} />
        )}
      </div>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-[600px] mx-auto space-y-5 sm:space-y-6">
            {data?.title && (
              <h1 className="text-white text-[35px] sm:text-[45px] xl:text-[60px] 2xl:text-[75px] font-medium leading-[1.1] capitalize">
                {data?.title}
              </h1>
            )}
            {data?.sub_title && <p className="max-w-[460px] text-white text-base sm:text-lg">{data?.sub_title}</p>}
            {data?.myitems.length > 0 && (
              <div className="pb-5 sm:pb-6 flex items-center gap-5 sm:gap-6">
                {data?.myitems?.map((item, index) => (
                  <div key={index} className="space-y-2.5">
                    {item?.image && (
                      <div className="size-[50px] sm:size-[60px] flex items-center justify-centerF">
                        <Image
                          className="max-w-[50px] sm:max-w-[60px] w-auto h-auto"
                          src={item?.image}
                          alt={item?.item_title}
                          width={500}
                          height={500}
                        />
                      </div>
                    )}
                    {item?.item_title && (
                      <p className="max-w-[460px] text-white text-xs sm:text-sm font-medium uppercase">{item?.item_title}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {data?.image && (
              <>
                <div className="h-[1px] w-full max-w-[300px] bg-border-gr"></div>
                <div className="h-[30px]">
                  <Image className="max-h-[30px] !w-auto !h-auto" width={800} height={200} src={data?.image} alt="icon" />
                </div>
              </>
            )}
          </div>
          <div>
            <div className="sign_up_card_warpper">
              <div className="sign_up_card">{config.AUTH_FORM_STYLE == '1' ? <AuthTab /> : <SignUpV1 />}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CMSHeroSectionV1;

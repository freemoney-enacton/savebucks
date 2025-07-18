'use client';
import React from 'react';
import SectionTitle from '../../Core/SectionTitle';
import Image from 'next/image';
import ButtonComponent from '../ButtonComponent';

const TestimonialSectionV1 = ({ data, children }: any) => {
  return (
    <section className="py-12 sm:py-[100px] bg-black-600 overflow-clip">
      <div className="space-y-7 sm:space-y-14">
        <div className="max-w-[620px] mx-auto tracking-wider">
          <SectionTitle
            title={data?.title}
            sub_title={data?.sub_title}
            customClass="mb-6 !text-[30px] sm:!text-[35px] md:!text-[50px] xl:!text-[55px] !leading-[1.2] capitalize tracking-wider"
            subTitleClass="!text-sm mb-5 uppercase"
          />
          {data?.image && (
            <Image className="max-h-[29px] h-auto w-auto mx-auto" src={data?.image} alt="image" width={1000} height={1000} />
          )}
        </div>
        {children}
        {data?.button_text && (
          <div className="px-4 text-center">
            <ButtonComponent role="link" href={data?.button_link || '/login'} label={data?.button_text} variant="primary" />
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSectionV1;

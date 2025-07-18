import React from 'react';
import SectionTitle from '../../Core/SectionTitle';
import ButtonComponent from '../ButtonComponent';
import { Rocket } from 'lucide-react';
import FeaturedCard from '../Card/FeaturedCard';

export default function FeaturedSection({ item }: any) {
  return (
    <section className="section FeaturedSection">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="grid sm:grid-cols-2 gap-6 max-w-[350px] sm:max-w-[598px] mx-auto order-2 lg:order-1">
            {item?.items?.length > 0 && item?.items.map((data, index) => <FeaturedCard key={index} data={data} />)}
          </div>
          <div className="relative space-y-4 sm:space-y-6 order-1 lg:order-2">
            <SectionTitle title={item?.title} sub_title={item?.sub_title} customClass={'sm:!text-[41px] !leading-[1.2]'} />
            <div className="text-center relative z-[1]">
              <ButtonComponent
                url={item?.button_link}
                label={item?.button_text}
                role="link"
                variant="primary"
                icon={<Rocket fill="white" size={20} />}
                customClass="max-w-[250px] sm:max-w-[281px] w-full sm:!py-5 sm:!text-base"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[0] bg-orange h-28 w-28 filter blur-[122px] rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

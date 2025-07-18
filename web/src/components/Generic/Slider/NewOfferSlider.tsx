'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';
import OfferCardWithBanner from '../Card/OfferCardWithBanner';

SwiperCore.use([Navigation]);
const NewOfferSlider = ({ data, title, img, url }: any) => {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;

    const handleSwiperUpdate = () => {
      if (swiperInstance) {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
        setHideButtons(swiperInstance.slides.length <= swiperInstance.params.slidesPerView);
      }
    };

    if (swiperInstance) {
      handleSwiperUpdate();
      swiperInstance.on('slideChange', handleSwiperUpdate);
      swiperInstance.on('reachEnd', handleSwiperUpdate);
      swiperInstance.on('reachBeginning', handleSwiperUpdate);
    }

    return () => {
      if (swiperInstance) {
        swiperInstance.off('slideChange', handleSwiperUpdate);
        swiperInstance.off('reachEnd', handleSwiperUpdate);
        swiperInstance.off('reachBeginning', handleSwiperUpdate);
      }
    };
  }, [data]);

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  return (
    <div>
      <section className="animate-fade-in">
        <div className="container">
          <div className="flex items-center justify-between pb-4">
            <SectionTitleWithIcon title={title} img={img} />

            <div className="flex items-center gap-6">
              <Link href={url} className="link font-semibold">
                {t('links_view_all')}
              </Link>

              {isBeginning && isEnd ? (
                <></>
              ) : (
                // <div className={`max-md:hidden ${hideButtons ? 'hidden' : 'flex'} items-center gap-0.5`}>
                //   <button onClick={handlePrev} className="p-1 disabled:opacity-50" disabled={isBeginning}>
                //     <ChevronLeftIcon className="w-3 sm:w-4 h-3 sm:h-4 stroke-2 text-white" />
                //   </button>
                //   <button onClick={handleNext} className="p-1 disabled:opacity-50" disabled={isEnd}>
                //     <ChevronRightIcon className="w-3 sm:w-4 h-3 sm:h-4 stroke-2 text-white" />
                //   </button>
                // </div>
                <div className={`max-md:hidden ${hideButtons ? 'hidden' : 'flex'} items-center gap-2.5`}>
                  <button
                    onClick={handlePrev}
                    className="w-6 sm:w-9 h-6 sm:h-9 grid place-content-center bg-white-gr rounded-[10px] disabled:opacity-50"
                    disabled={isBeginning}
                  >
                    <ChevronLeftIcon className="w-3 sm:w-4 h-3 sm:h-4 stroke-2 text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-6 sm:w-9 h-6 sm:h-9 grid place-content-center bg-white-gr rounded-[10px] disabled:opacity-50"
                    disabled={isEnd}
                  >
                    <ChevronRightIcon className="w-3 sm:w-4 h-3 sm:h-4 stroke-2 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="!-mx-4">
            <Swiper
              ref={swiperRef}
              spaceBetween={16}
              slidesPerView={'auto'}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              className="max-w-full !px-4"
              wrapperClass="max-w-full"
            >
              {data.map((item: any, index: number) => (
                <SwiperSlide key={index} className="!w-[300px] sm:!w-[350px] lg:!w-[420px]">
                  <OfferCardWithBanner key={index} data={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewOfferSlider;

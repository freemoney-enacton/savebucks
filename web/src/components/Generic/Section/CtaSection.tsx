'use client';
import { Rocket } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import ButtonComponent from '../ButtonComponent';
import SectionTitle from '../../Core/SectionTitle';
import { useTranslation } from '@/i18n/client';
import { useDisclosure } from '@nextui-org/react';
import AuthModal from '@/components/Core/AuthModal';

export default function CtaSection({ page }) {
  const { t } = useTranslation();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  return (
    <section className="section CtaSection">
      <div className="container">
        <div className="relative bg-black-600 rounded-lg sm:rounded-2xl py-7 px-8 overflow-hidden max-sm:max-w-[455px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-5">
            <div className="max-lg:absolute top-1/2 max-lg:-translate-y-1/2 left-3.5 sm:left-6 lg:col-span-3">
              <Image className="max-sm:max-w-14 !w-auto mx-auto" src={'/images/cta-1.png'} width={100} height={100} alt="logo" />
            </div>
            <div className="max-w-[63%] sm:max-w-[300px] md:max-w-[400px] lg:max-w-full mx-auto lg:col-span-7 flex flex-col lg:flex-row items-center justify-between gap-1 sm:gap-3 lg:gap-5">
              <div className="sm:space-y-2">
                <SectionTitle title={`Welcome to the ${page} Page`} customClass="text-xs sm:text-xl md:text-3xl !text-left" />
                <p className="bg-primary-gr text-gradient text-xxs sm:text-base md:text-xl font-medium">
                  {t('Let_earn_your_first_dollar_now')}
                </p>
              </div>
              <div className="flex-shrink-0 max-lg:self-start sm:space-y-2 text-center">
                <p className="max-lg:hidden text-xl font-medium bg-white-heading-gr text-gradient">Claim Your Rewards</p>
                {/* will have to open auth modal on click of button */}
                <ButtonComponent
                  onClick={() => {
                    authOnOpen();
                  }}
                  label="Start Earning Now"
                  role="button"
                  variant="primary"
                  icon={<Rocket fill="white" className="w-3.5 sm:w-5 h-3.5 sm:h-5" />}
                  customClass="max-sm:!text-xxs max-sm:!font-medium max-sm:!px-3.5 max-sm:!py-1"
                />
              </div>
            </div>
            <div className="max-lg:absolute top-1/2 max-lg:-translate-y-1/2 right-3.5 sm:right-6 lg:col-span-2">
              <Image className="max-sm:max-w-12 !w-auto mx-auto" src={'/images/cta-2.png'} width={100} height={100} alt="logo" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 z-[0] bg-purple-600 h-16 w-16 filter blur-[77px] rounded-full"></div>
          <div className="absolute top-0 left-[20%] z-[0] bg-orange h-12 w-28 filter blur-[77px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 z-[0] bg-yellow h-28 w-28 filter blur-[132px] rounded-full"></div>
        </div>
      </div>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
    </section>
  );
}

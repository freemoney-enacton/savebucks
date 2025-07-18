'use client';
import SectionTitle from '@/components/Core/SectionTitle';
import React from 'react';
import ButtonComponent from '../ButtonComponent';
import { Rocket } from 'lucide-react';
import { useDisclosure } from '@nextui-org/react';
import AuthModal from '@/components/Core/AuthModal';

const SignupCTAWithBg = ({ item }) => {
  const processText = (text) => {
    const pattern = /\|(.*?)\|/g;
    const replacement = '<span class="bg-primary-gr text-gradient">$1</span>';
    return text.replace(pattern, replacement);
  };
  const processedText = processText(item.description);
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();

  return (
    <section
      className="relative py-10 sm:py-20 bg-no-repeat bg-cover bg-center z-[0]"
      // style={{ backgroundImage: 'url(/images/cashout-hero.webp)' }}
      style={{ backgroundImage: item?.image ? `url(${item?.image})` : 'url(/images/cashout-hero-v2.jpg)' }}
    >
      <div className="absolute inset-0 bg-img-overlay z-[0]"></div>
      <div className="container relative z-[1]">
        <div className="grid sm:grid-cols-2 gap-4 items-center max-w-[400px] sm:max-w-[1148px] mx-auto max-sm:text-center">
          <div className="space-y-4">
            <SectionTitle title={item?.title} customClass="sm:!text-left !font-bold" />
            {processedText && (
              <div
                className="[&>ul]:space-y-1.5 [&>ul]:sm:space-y-2.5 [&>ul]:list-disc [&>ul]:list-inside [&>ul>li]:text-sm text-sm cms-box"
                dangerouslySetInnerHTML={{ __html: processedText }}
              ></div>
            )}
          </div>
          <div>
            <div className="max-w-[200px] sm:max-w-[250px] max-sm:mx-auto sm:ml-auto">
              <ButtonComponent
                onClick={() => {
                  authOnOpen();
                }}
                role="button"
                variant="primary"
                label={item?.button_text}
                icon={<Rocket size={20} />}
                customClass="w-full sm:!py-3 sm:!text-base"
              />
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
    </section>
  );
};

export default SignupCTAWithBg;

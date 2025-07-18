'use client';
import React from 'react';
import ModalComponent from './ModalComponent';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import StepsCard from '../Card/StepsCard';
import { useTranslation } from '@/i18n/client';
import ButtonComponent from '../ButtonComponent';
import { useDisclosure } from '@nextui-org/react';

const ReferHiwModal = ({ data }: any) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <ButtonComponent
        role="button"
        label={t('how_it_works')}
        variant="outline"
        customClass="!py-1.5 sm:!py-2.5 !px-2.5 sm:!px-4"
        onClick={onOpen}
      />
      <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} customClass="!max-w-[780px]">
        <div className="space-y-5">
          <SectionTitleWithIcon title={t('how_it_works')} img="/images/refer-hiw.png" />
          <div className="space-y-4">
            {data.map((data, index) => (
              <StepsCard key={index} data={data} index={index} />
            ))}
          </div>
          <div className="text-center">
            <ButtonComponent
              role="button"
              label={t('okay')}
              variant="primary"
              customClass="!py-1.5 sm:!py-2.5 !px-2.5 sm:!px-4"
              onClick={onClose}
            />
          </div>
        </div>
      </ModalComponent>
    </>
  );
};

export default ReferHiwModal;

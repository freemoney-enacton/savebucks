import React from 'react';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { useTranslation } from '@/i18n/client';
import StoreCard from '@/components/Generic/Card/StoreCard';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import { AppRoutes } from '@/routes-config';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const SimilarStoresSection = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  return (
    <section className="space-y-3 sm:space-y-5">
      <SectionTitleWithIcon img="/images/similar-stores-icon.png" title={t('similar_shops')} className="lg:text-2xl" />

      <div className="store-grid">
        {data.similarStores?.slice(0, 14).map((item, index) => (
          <StoreCard key={index} data={item} />
        ))}
      </div>

      <div className="text-center">
        <ButtonComponent
          role="link"
          variant="primary"
          url={AppRoutes.allStores}
          label={t('show_all_shops')}
          icon={<ChevronRightIcon className="size-4 stroke-[3px]" />}
        />
      </div>
    </section>
  );
};

export default SimilarStoresSection;

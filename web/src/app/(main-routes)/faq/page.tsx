import Heading from '@/components/Core/Heading';
import FaqTabSection from '@/components/Generic/Section/FaqTabSection';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.seo?.faq_title || t('faq'),
    description: settings?.data?.seo?.faq_desc || t('faq'),
  };
}

const FaqPage = async () => {
  const { t } = await createTranslation();
  const faqData = await public_get_api({ path: 'cms/faq/all' });

  return (
    <section className="section">
      <div className="container">
        <div className="space-y-5 sm:space-y-10">
          <Heading title={t('frequently_asked_questions')} customClass="!w-fit" />
          <FaqTabSection tabs={faqData?.data} />
        </div>
      </div>
    </section>
  );
};

export default FaqPage;

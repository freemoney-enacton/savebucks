import Heading from '@/components/Core/Heading';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.page_seo?.['terms-of-service']?.meta_title || t('terms_service'),
    description: settings?.data?.page_seo?.['terms-of-service']?.meta_desc || t('terms_service'),
  };
}

const Terms = async () => {
  const TermsData = await public_get_api({
    path: 'cms/pages/terms-of-service',
  });
  if (TermsData?.data?.[0]?.status != 'publish') notFound();
  return (
    <section className="section">
      <div className="container">
        <Heading title={TermsData?.data?.[0]?.name} customClass="!w-fit" />
        {TermsData && TermsData?.data?.[0]?.blocks?.[0]?.type == 'rich-editor' ? (
          <span
            dangerouslySetInnerHTML={{ __html: TermsData?.data?.[0]?.blocks?.[0]?.data?.content }}
            className="cms-box !text-gray-600 prose-sm sm:prose-base lg:prose-lg"
          ></span>
        ) : (
          <div>{TermsData?.data?.[0]?.blocks?.[0]?.data?.content}</div>
        )}
      </div>
    </section>
  );
};

export default Terms;

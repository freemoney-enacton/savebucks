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
    title: settings?.data?.page_seo?.['cookie-policy']?.meta_title || t('cookie_policy'),
    description: settings?.data?.page_seo?.['cookie-policy']?.meta_desc || t('cookie_policy'),
  };
}

const CookiePolicyPage = async () => {
  const BlogData = await public_get_api({
    path: 'cms/pages/cookie-policy',
  });
  if (BlogData?.data?.[0]?.status != 'publish') notFound();
  return (
    <section className="section">
      <div className="container">
        <Heading title={BlogData?.data?.[0]?.name} customClass="!w-fit" />
        {BlogData && BlogData?.data?.[0]?.blocks?.[0]?.type == 'rich-editor' ? (
          <span
            dangerouslySetInnerHTML={{ __html: BlogData?.data?.[0]?.blocks?.[0]?.data?.content }}
            className="cms-box !text-gray-600 prose-sm sm:prose-base lg:prose-lg"
          ></span>
        ) : (
          <div>{BlogData?.data?.[0]?.blocks?.[0]?.data?.content}</div>
        )}
      </div>
    </section>
  );
};

export default CookiePolicyPage;

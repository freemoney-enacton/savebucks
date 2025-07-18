import Heading from '@/components/Core/Heading';
import CMSSection from '@/components/Generic/Section/CMSSection';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { notFound } from 'next/navigation';
import React from 'react';

const DynamicPages = async ({ params }) => {
  const { page } = params;

  const pagesData = await public_get_api({
    path: `cms/pages/${page}`,
  });
  if (pagesData?.data?.[0]?.status != 'publish') notFound();
  const RenderHomeSection = ({ item }) => {
    return <CMSSection item={item} page={page} />;
  };
  return (
    <section className="section">
      <div className="container">
        <Heading title={pagesData?.data?.[0]?.name} customClass="!w-fit" />
        {pagesData?.data?.[0]?.blocks?.length > 0
          ? pagesData?.data[0]?.blocks?.map((item, index) => <RenderHomeSection key={index} item={item} />)
          : null}
      </div>
    </section>
  );
};

export default DynamicPages;

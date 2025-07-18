import Heading from '@/components/Core/Heading';
import BusinessInquiryForm from '@/components/Generic/Forms/BusinessInquiryForm';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.seo?.business_inquiry_title || t('business_inquiries'),
    description: settings?.data?.seo?.business_inquiry_desc || t('business_inquiries'),
  };
}

const BusinessInquiriesPage = async () => {
  const BusinessData = await public_get_api({
    path: 'cms/blocks/business_inquiries',
  });

  return (
    <section className="section">
      <div className="container">
        <div className="space-y-5 sm:space-y-10">
          <Heading title={BusinessData?.data?.[0]?.name} customClass="!w-fit" />
          <div className="grid lg:grid-cols-2 gap-5 md:gap-10">
            <div className="text-gray-600 space-y-5 sm:space-y-10">
              {BusinessData?.data?.[0]?.blocks?.map((block, index) => (
                <div key={index} className="space-y-5">
                  {block?.type == 'rich-editor' ? (
                    <p className="space-y-4" dangerouslySetInnerHTML={{ __html: block?.data?.content }}></p>
                  ) : (
                    <p>{block?.data?.content}</p>
                  )}
                </div>
              ))}
            </div>
            {/* form */}
            <div>
              <BusinessInquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessInquiriesPage;

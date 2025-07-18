'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useEffect, useState } from 'react';
import SingleOfferCommonComponent from '@/components/Generic/SingleOfferCommonComponent';
import BackButton from '@/components/Core/Button/BackButton';

const OfferDetailsPage = ({ params }: { params: { slug: string } }) => {
  const [OfferModalData, setOfferModalData] = useState<any>([]);
  const [loadingOfferData, setLoadingOfferData] = useState(true);
  const { public_get_api } = usePublicApi();

  const getOfferData = () => {
    try {
      public_get_api({ path: `tasks/${params.slug}` })
        .then((res) => {
          if (res.success) {
            setOfferModalData(res?.data);
          }
        })
        .finally(() => setLoadingOfferData(false));
    } catch (error) {
      console.log(error);
      setLoadingOfferData(false);
    }
  };

  useEffect(() => {
    getOfferData();
  }, []);

  return (
    <div className="py-5 sm:py-10 text-white">
      <title>{OfferModalData?.name}</title>
      <div className="container max-w-[600px] lg:max-w-[700px] space-y-4 sm:space-y-10">
        <BackButton role="button" />

        <div className="bg-black-250 rounded-lg space-y-4 sm:space-y-6 overflow-hidden">
          <SingleOfferCommonComponent OfferModalData={OfferModalData} loading={loadingOfferData} />
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsPage;

import { public_get_api } from '@/Hook/Api/Server/use-server';
import NoDataFound from '@/components/Core/NoDataFound';
import InfiniteOffers from '@/components/Generic/InfiniteOffers';
import React from 'react';

const OfferList = async ({ urlSearchParams }) => {
  const offerList = await public_get_api({ path: `tasks?${urlSearchParams.toString()}` });
  return (
    <div>
      {offerList?.data?.length > 0 ? (
        <InfiniteOffers initItems={offerList?.data} url={`tasks`} query={urlSearchParams.toString()} />
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default OfferList;

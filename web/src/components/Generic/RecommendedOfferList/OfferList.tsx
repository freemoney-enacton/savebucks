import { public_get_api } from '@/Hook/Api/Server/use-server';
import NoDataFound from '@/components/Core/NoDataFound';
import React from 'react';
import InfiniteRecommendedOffers from '../InfiniteOffers/InfiniteRecommandedOffers';

const RecommendedOfferList = async ({ urlSearchParams }) => {
  const offerList = await public_get_api({ path: `tasks/revu?${urlSearchParams.toString()}` });
  return (
    <div>
      {offerList?.data?.length > 0 ? (
        <InfiniteRecommendedOffers initItems={offerList?.data} url={`tasks/revu`} query={urlSearchParams.toString()} />
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default RecommendedOfferList;

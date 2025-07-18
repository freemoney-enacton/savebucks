import { public_get_api } from '@/Hook/Api/Server/use-server';
import NoDataFound from '@/components/Core/NoDataFound';
import InfiniteStores from './InfiniteStores';

const StoreList = async ({ urlSearchParams }) => {
  const StoreList = await public_get_api({ path: `stores?${urlSearchParams.toString()}` });
  return (
    <div>
      {StoreList?.data?.length > 0 ? (
        <InfiniteStores initItems={StoreList?.data} url={`stores`} query={urlSearchParams.toString()} />
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default StoreList;

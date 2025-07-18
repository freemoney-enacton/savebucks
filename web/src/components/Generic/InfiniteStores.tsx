'use client';
import usePaginatedData from '@/Hook/Common/use-paginated-data';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import StoreCard from './Card/StoreCard';
import StoreGridSkeleton from './Skeleton/StoreGridSkeleton';

const InfiniteStores = ({ initItems, url, query }) => {
  const { loadMore, items, hasNextPage, loading } = usePaginatedData({
    apiEndPoint: url,
    initItems: initItems,
    query: query,
  });

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => {
      loadMore();
    },
    rootMargin: '0px 0px 40px 0px',
  });

  return (
    // <div className="h-[650px] overflow-y-auto">
    <div>
      <div className="store-grid">
        {items?.map((e, index) => {
          return <StoreCard data={e} key={index} />;
        })}
      </div>
      {(loading || hasNextPage) && (
        <div ref={sentryRef}>
          <StoreGridSkeleton count={4} className="pt-3 sm:pt-4" />
        </div>
      )}
    </div>
  );
};

export default InfiniteStores;

'use client';
import usePaginatedData from '@/Hook/Common/use-paginated-data';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import OfferGridSkeleton from '../Skeleton/OfferGridSkeleton';
import RecommendedOfferCard from '../Card/RecommendedOfferCard';

const InfiniteRecommendedOffers = ({ initItems, url, query }) => {
  const { loadMore, items, hasNextPage, loading } = usePaginatedData({
    apiEndPoint: url,
    initItems: initItems,
    query,
  });

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    rootMargin: '0px 0px 0px 0px',
  });

  return (
    <>
      <div>
        <div className="recommended-offer-grid">
          {items
            ? items?.map((e, index) => {
                return <RecommendedOfferCard data={e} key={index} />;
              })
            : null}
        </div>
        {(loading || hasNextPage) && (
          <div ref={sentryRef}>
            <OfferGridSkeleton count={16} className="pt-2.5 sm:pt-7" />
          </div>
        )}
      </div>
    </>
  );
};

export default InfiniteRecommendedOffers;

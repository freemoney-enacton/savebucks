'use client';
import { useLayoutEffect, useState } from 'react';
import { public_get_api } from '../Api/Server/use-server';

const usePaginatedData = ({ apiEndPoint, initItems = [], query = '' }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any>([]);
  const [pageNo, setPageNo] = useState<any>(2);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  useLayoutEffect(() => {
    setItems(initItems);
    return () => {};
  }, [initItems]);

  function loadMore() {
    if (loading) return;
    if (hasNextPage) {
      setLoading(true);
      public_get_api({ path: `${apiEndPoint}?page=${pageNo}&${query}` })
        .then((response: any) => {
          response?.data?.length > 0 && setItems((prev) => [...prev, ...response?.data]);
          if (response.currentPage <= response.lastPage) {
            setPageNo(pageNo + 1);
            setHasNextPage(true);
          } else {
            setHasNextPage(false);
          }
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })
        .catch(() => {
          // setLoading(false);
        });
    }
  }

  return {
    items,
    loading,
    hasNextPage,
    loadMore,
  };
};

export default usePaginatedData;

'use client';
import { config } from '@/config';
import { useEffect, useState } from 'react';
import { usePublicApi } from '../Api/Client/use-client';

const usePaginatedTableData = ({
  apiEndPoint,
  query = '',
  hidePagination,
  showDefaultPerPage,
}: {
  apiEndPoint: string;
  query?: string;
  hidePagination?: boolean;
  showDefaultPerPage?: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any>([]);
  const [pageNo, setPageNo] = useState<any>(1);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(hidePagination && !showDefaultPerPage ? 4 : config.DEFAULT_TABLE_DATA_LIMIT);
  const { public_get_api } = usePublicApi();

  useEffect(() => {
    if (query) {
      reset();
    }
  }, [query]);

  useEffect(() => {
    if (pageNo >= 1) {
      loadMore();
    }
  }, [pageNo, perPage, query]);

  function nextPage() {
    if (pageNo < lastPage) {
      setPageNo(Number(pageNo) + 1);
    }
  }

  function prevPage() {
    if (pageNo > 1) {
      setPageNo(Number(pageNo) - 1);
    }
  }

  function loadMore() {
    setLoading(true);
    public_get_api({ path: `${apiEndPoint}?page=${pageNo}&limit=${perPage}&${query}` })
      .then((response: any) => {
        setLastPage(response.lastPage);
        setCurrentPage(response.currentPage);
        if (pageNo === 1 && response?.data?.length == 0) {
          setItems([]);
        } else if (response?.data?.length > 0) setItems((prev) => [...response?.data]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function reset() {
    setItems([]);
    setPageNo(1);
    setCurrentPage(1);
    setLastPage(1);
  }

  return {
    items,
    loading,
    loadMore,
    lastPage,
    nextPage,
    prevPage,
    currentPage,
    setPerPage,
    reset,
    setPageNo,
  };
};

export default usePaginatedTableData;

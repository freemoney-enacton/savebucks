'use client';
import usePaginatedTableData from '@/Hook/Common/use-paginated-table-data';
import NoDataFound from '@/components/Core/NoDataFound';
import { config } from '@/config';
import { useTranslation } from '@/i18n/client';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import PaginationNextButton from '../Buttons/PaginationNextButton';
import PaginationPrevButton from '../Buttons/PaginationPrevButton';
import PaginationDropdown from '../SelectDropdowns/PaginationDropdown';
// import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { booleanDefaultFalseAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import TableSkeleton from '../Skeleton/TableSkeleton';
import { useUtils } from '@/Hook/use-utils';

export default function TableComponent({
  title,
  column,
  apiEndPoint,
  query,
  hidePagination,
  hideNextPageNavigation,
  showDefaultPerPage,
}: any) {
  const [value, setValue] = useState(config.DEFAULT_TABLE_DATA_LIMIT);
  const {
    lastPage,
    items: data,
    loading,
    nextPage,
    prevPage,
    currentPage,
    setPerPage,
    setPageNo,
  } = usePaginatedTableData({ apiEndPoint, query, hidePagination, showDefaultPerPage });
  const { t } = useTranslation();
  // const { data: session }: any = useSession();
  const pagination = Array.from({ length: 4 }, (v, i) => (i + 1) * config.DEFAULT_TABLE_DATA_LIMIT).map((value) => {
    return { label: value.toString(), key: value.toString() };
  });
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const settings_loading: any = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.settings_loading));
  const [columns, setColumns] = React.useState<typeof column>(() => [...column]);
  const { showCurrencyInPoint } = useUtils();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: lastPage,
  });

  // const getRowStyle = (row) => {
  //   if (
  //     title == t('levels') &&
  //     session?.user?.user?.tierDetails?.tier &&
  //     session?.user?.user?.tierDetails?.tier == row.original.tier
  //   ) {
  //     return '[&>td]:bg-green-300/20';
  //   }
  // };

  const [state, setState] = React.useState(table.initialState);

  useEffect(() => {
    if (!settings_loading && settings && Object.values(settings)?.length > 0) {
      setColumns([...column]);
      setState(table.initialState);
    }
  }, [settings, settings_loading]);

  useEffect(() => {
    setColumns([...column]);
    setState(table.initialState);
  }, [showCurrencyInPoint]);

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    debugTable: state.pagination.pageIndex > 2,
  }));

  useEffect(() => {
    setPerPage(value);
    setPageNo(1);
    table.setPageSize(value);
    return () => {};
  }, [value]);

  return (
    <div>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="min-w-full align-middle">
            <table className="min-w-full border-separate border-spacing-y-3.5 text-xs lg:text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={100} className="table-skeleton-td p-0 !bg-transparent">
                      <TableSkeleton />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <>
                  <tbody>
                    {data.length == 0 && !loading && (
                      <tr>
                        <td colSpan={100} className="p-0 bg-transparent">
                          <div className="w-full">
                            <NoDataFound />
                          </div>
                        </td>
                      </tr>
                    )}
                    {table.getRowModel().rows.map((row) => (
                      // <tr className={getRowStyle(row)} key={row.id}>
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {table.getFooterGroups().map((footerGroup) => (
                      <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                          <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </tfoot>
                </>
              )}
            </table>
          </div>
        </div>
      </div>

      {hideNextPageNavigation
        ? null
        : currentPage && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 w-full">
                <p className="text-gray-600 flex-shrink-0">
                  {t('page')}
                  {currentPage > table.getPageCount() ? table.getPageCount() : currentPage} of {table.getPageCount()}
                </p>
                {hidePagination ? null : <PaginationDropdown setValue={setValue} data={pagination} />}
              </div>
              <div className="flex items-center gap-2">
                <PaginationPrevButton onClick={prevPage} disabled={currentPage == 1} />
                <PaginationNextButton onClick={nextPage} disabled={currentPage == table.getPageCount()} />
              </div>
            </div>
          )}
    </div>
  );
}

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
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { booleanDefaultFalseAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import TableSkeleton from '../Skeleton/TableSkeleton';
import { useUtils } from '@/Hook/use-utils';
import ModalComponent from '../Modals/ModalComponent';
import { useDisclosure } from '@nextui-org/react';
import ButtonComponent from '../ButtonComponent';
import Image from 'next/image';
import TableTitle from './TableTitle';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import OfferModal from '../Modals/OfferModal';
import AuthModal from '@/components/Core/AuthModal';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export default function MobTableWithPopUp({
  title,
  column,
  apiEndPoint,
  query,
  hidePagination,
  hideNextPageNavigation,
  visibleColumnNames,
  filterDropdown,
  headerImageKey,
  headerTitleKey,
  hideColumnName,
  viewOffer,
}: {
  title?: string;
  column: any;
  apiEndPoint: string;
  query?: string;
  hidePagination?: boolean;
  hideNextPageNavigation?: boolean;
  visibleColumnNames: string[];
  filterDropdown?: any;
  headerImageKey?: any;
  headerTitleKey?: any;
  hideColumnName?: any;
  viewOffer?: boolean;
}) {
  const [value, setValue] = useState(config.DEFAULT_TABLE_DATA_LIMIT);
  const {
    lastPage,
    items: data,
    loading,
    nextPage,
    prevPage,
    currentPage,
    setPerPage,
  } = usePaginatedTableData({ apiEndPoint, query, hidePagination });
  const { t, i18n } = useTranslation();
  const { data: session }: any = useSession();
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

  const getRowStyle = (row) => {
    if (
      title == t('levels') &&
      session?.user?.user?.tierDetails?.tier &&
      session?.user?.user?.tierDetails?.tier == row.original.tier
    ) {
      return '[&>td]:bg-green-300/20';
    }
  };

  useEffect(() => {
    setColumns([...column]);
  }, [i18n.language]);

  const [state, setState] = React.useState(table.initialState);

  useEffect(() => {
    if (!settings_loading && Object.values(settings)?.length > 0) {
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
    table.setPageSize(value);
    return () => {};
  }, [value]);

  return (
    <div className="space-y-2.5">
      {title && !filterDropdown && title && <TableTitle title={title} />}
      {title && filterDropdown && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {title && <TableTitle title={title} />}
          {filterDropdown && filterDropdown}
        </div>
      )}
      <div className="flow-root">
        <div className="overflow-x-auto overflow-y-clip">
          <div className="min-w-full align-middle">
            <table className="mobile-table -my-3.5 min-w-full border-separate border-spacing-y-3.5 text-xs lg:text-sm font-medium">
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={100} className="p-0 !bg-transparent">
                      <TableSkeleton variant="default" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <>
                  <tbody>
                    {data.length == 0 && !loading && (
                      <tr>
                        <td colSpan={100} className="p-0 bg-transparent">
                          <div className="w-full bg-black-250 rounded-lg">
                            <NoDataFound />
                          </div>
                        </td>
                      </tr>
                    )}
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <TableRow
                          key={row.id}
                          getRowStyle={getRowStyle}
                          row={row}
                          visibleColumnNames={visibleColumnNames}
                          headerImageKey={headerImageKey}
                          headerTitleKey={headerTitleKey}
                          hideColumnName={hideColumnName}
                          viewOffer={viewOffer}
                        />
                      );
                    })}
                  </tbody>
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

function TableRow({ getRowStyle, row, visibleColumnNames, headerImageKey, headerTitleKey, hideColumnName, viewOffer }) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const { isOpen: offerIsOpen, onOpen: offerOnOpen, onOpenChange: offerOnOpenChange } = useDisclosure();
  const { updatePreviousUrl } = useUtils();
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const image = row.getVisibleCells()[0].row.original?.[headerImageKey] || '/images/offer-1.png';
  const title = row.getVisibleCells()[0].row.original?.[headerTitleKey];
  const type = row.getVisibleCells()[1].row.original?.task_type;
  const typeBoolean = type !== undefined;
  const { status } = useSession();
  const [SurveyURL, setSurveyURL] = useState('');
  const { isOpen: outUrlIsOpen, onOpenChange: outUrlOnOpenChange } = useDisclosure();
  const handleOfferClick = (data) => {
    if (status === 'unauthenticated') {
      authOnOpen();
    } else if (!data?.slug) {
      setSurveyURL(data?.url);
      updatePreviousUrl();
      outUrlOnOpenChange();
    } else {
      updatePreviousUrl();
      window.history.pushState({}, '', `/offer/${data?.slug}`);
      offerOnOpen();
      try {
        setLoading(true);
        public_get_api({ path: `tasks/${data?.network}/${data?.campaign_id}` })
          .then((res) => {
            if (res?.data && res?.success) {
              setOfferModalData(res?.data);
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.log({ error });
        setLoading(false);
      }
    }
  };
  return (
    <>
      <tr className={getRowStyle(row)} key={row.id} onClick={() => onOpen()}>
        {/** @ts-ignore */}
        {row
          .getVisibleCells()
          .filter((el) => (visibleColumnNames || []).includes(el.column.columnDef.header?.toString()))
          .map((cell) => (
            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
          ))}
        <td className="!pl-0 text-right">
          <button className="flex-shrink-0">
            <ArrowUpRightIcon className="size-3 stroke-[3px] text-white" />
          </button>
        </td>
      </tr>
      <ModalComponent onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} customClass="!max-w-[450px]">
        <div className={`space-y-5 ${!headerImageKey && 'pt-8'}`}>
          {headerImageKey && headerTitleKey && (
            <>
              <div className="flex items-center gap-4">
                {headerImageKey &&
                  (typeBoolean ? (
                    type == 'tasks' ? (
                      <div className="flex-shrink-0 w-[60px] h-[60px] rounded-xl overflow-hidden">
                        {image ? (
                          <Image
                            alt="img"
                            className="max-h-[60px] h-full w-full object-cover"
                            src={image}
                            width={120}
                            height={120}
                          />
                        ) : null}
                      </div>
                    ) : null
                  ) : (
                    <div className="flex-shrink-0 w-[60px] h-[60px] rounded-xl overflow-hidden">
                      {image ? (
                        <Image
                          alt="img"
                          className="max-h-[60px] h-full w-full object-cover"
                          src={image}
                          width={120}
                          height={120}
                        />
                      ) : null}
                    </div>
                  ))}
                {title && <p className="text-white text-base font-medium line-clamp-2">{title}</p>}
              </div>
              <div className="bg-gray bg-opacity-50 h-[1px]"></div>
            </>
          )}
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 text-sm">
            {row
              .getVisibleCells()
              .filter((el) => hideColumnName !== el.column.columnDef.header?.toString())
              .map((cell) => (
                <div key={cell.id} className="space-y-1.5 even:text-right">
                  <p className="text-white font-medium">{cell.column.columnDef.header}</p>
                  <div className="break-words">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                </div>
                // <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
          </div>
          {viewOffer &&
            (typeBoolean ? (
              type == 'tasks' ? (
                <ButtonComponent
                  role="button"
                  variant="primary"
                  label={t('view_offer')}
                  customClass="w-full"
                  onClick={() => handleOfferClick(row.original)}
                />
              ) : null
            ) : (
              <ButtonComponent
                role="button"
                variant="primary"
                label={t('view_offer')}
                customClass="w-full"
                onClick={() => handleOfferClick(row.original)}
              />
            ))}
        </div>
      </ModalComponent>
      {/* authModal */}
      {viewOffer && <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />}
      {/* offerModal */}
      {viewOffer && (
        <OfferModal
          isOpen={offerIsOpen}
          onOpenChange={offerOnOpenChange}
          data={OfferModalData}
          OfferModalData={OfferModalData}
          loading={loading}
        />
      )}
      <ModalComponent isOpen={outUrlIsOpen} onOpenChange={outUrlOnOpenChange} customClass="relative !p-0 max-w-[570px]">
        <>
          <div className="iframe-parent">
            <button
              className="absolute bottom-0 right-0 p-3 bg-black/10 rounded-xl"
              onClick={() => window.open(SurveyURL, '_blank')}
            >
              <ArrowTopRightOnSquareIcon className="size-5 text-white cursor-pointer" />
            </button>
            <iframe src={SurveyURL} className="w-full min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-88px)]"></iframe>
          </div>
        </>
      </ModalComponent>
    </>
  );
}

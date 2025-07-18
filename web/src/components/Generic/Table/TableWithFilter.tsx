'use client';
import { ColumnDef } from '@tanstack/react-table';
import UserCard from '../Card/UserCard';
import TableComponent from './TableComponent';
import MobTableWithPopUp from './MobTableWithPopUp';
import useMobileBreakpoint from '@/Hook/use-mobile';

export default function TableWithFilter({
  title,
  defaultColumns,
  apiEndPoint,
  query,
  hidePagination,
  cardCustomClass = '',
  filterDropdown,
  hideNextPageNavigation = false,
  visibleColumnNames = [],
  headerImageKey,
  headerTitleKey,
  hideColumnName,
  viewOffer,
  showDefaultPerPage = false,
}: {
  title?: string;
  defaultColumns: ColumnDef<any>[];
  apiEndPoint: string;
  query?: string;
  hidePagination?: boolean;
  cardCustomClass?: string;
  filterDropdown?: any;
  hideNextPageNavigation?: boolean;
  visibleColumnNames: string[];
  headerImageKey?: any;
  headerTitleKey?: any;
  hideColumnName?: any;
  viewOffer?: boolean;
  showDefaultPerPage?: boolean;
}) {
  const { isMobile } = useMobileBreakpoint();
  return (
    <>
      {isMobile ? (
        <div className="mt-4 sm:mt-10 sm:hidden">
          <MobTableWithPopUp
            title={title}
            column={defaultColumns}
            apiEndPoint={apiEndPoint}
            query={query}
            hidePagination={hidePagination}
            hideNextPageNavigation={hideNextPageNavigation}
            visibleColumnNames={visibleColumnNames}
            filterDropdown={filterDropdown}
            headerImageKey={headerImageKey}
            headerTitleKey={headerTitleKey}
            hideColumnName={hideColumnName}
            viewOffer={viewOffer}
          />
        </div>
      ) : (
        <UserCard customClass={`${cardCustomClass ? cardCustomClass : ''} max-sm:hidden`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold bg-white-heading-gr text-gradient">{title}</h3>
            {filterDropdown}
          </div>

          {/* <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="max-w-[200px] flex-shrink-0">
            <SearchInput placeholder={t("search")} />
          </div>
          <MonthDropdown data={months} />
        </div> */}
          <UserCard.Body>
            {apiEndPoint && (
              <TableComponent
                title={title}
                column={defaultColumns}
                apiEndPoint={apiEndPoint}
                query={query}
                hidePagination={hidePagination}
                hideNextPageNavigation={hideNextPageNavigation}
                showDefaultPerPage={showDefaultPerPage}
              />
            )}
          </UserCard.Body>
        </UserCard>
      )}
    </>
  );
}

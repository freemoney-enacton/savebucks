"use client";

import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  pagination: any;
}
export default function TablePagination<TData>({
  table,
  pagination,
}: TablePaginationProps<TData>) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params.toString());

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className="flex items-center justify-between w-full sm:space-x-6 lg:space-x-8 max-md:flex-col max-md:items-start max-md:space-y-4">
        <div className="flex items-center md:space-x-2 mr-auto max-sm:gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${params.get("rows_per_page") || "10"}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              searchParams.set("rows_per_page", value);
              searchParams.set("page", "1");
              router.push(`${pathname}?${searchParams.toString()}`);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={`${searchParams.get("rows_per_page")}`}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center md:space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              // table.setPageIndex(0);
              searchParams.set("page", "1");
              router.push(`${pathname}?${searchParams.toString()}`);
            }}
            disabled={
              pagination?.totalPages <= 1 ||
              pagination?.currentPage === 1 ||
              false
            }
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              let prevPage = pagination?.currentPage - 1;
              if (prevPage === 0) prevPage = 1;
              searchParams.set("page", `${prevPage}`);
              router.push(`${pathname}?${searchParams.toString()}`);
            }}
            disabled={
              pagination?.totalPages <= 1 ||
              pagination?.currentPage === 1 ||
              false
            }
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pagination?.currentPage || 1} of {pagination?.totalPages || 0}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const nextPage = pagination?.currentPage + 1;
              searchParams.set("page", `${nextPage}`);
              router.push(`${pathname}?${searchParams.toString()}`);
            }}
            disabled={
              (pagination?.totalPages <= 1 && pagination?.currentPage === 1) ||
              pagination?.currentPage === pagination?.totalPages
            }
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              const lastPage = pagination?.totalPages;
              searchParams.set("page", `${lastPage}`);
              router.push(`${pathname}?${searchParams.toString()}`);
            }}
            disabled={
              (pagination?.totalPages <= 1 && pagination?.currentPage === 1) ||
              pagination?.currentPage === pagination?.totalPages
            }
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

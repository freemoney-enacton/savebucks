"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { payoutStatusColors } from "@/utils/get-color-for-status";
import TablePagination from "../TablePagination";
import { useTranslation } from "@/i18n/client";
import moment from "moment";
import { getCurrencySymbol } from "@/utils/getCurrency";
import DateFilter from "../DateFilter";

type PayoutStatus = "paid" | "pending" | "rejected" | "processing";

export default function PayoutsTable({ data }: any) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: t("payouts.table.date"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center text-gray-600">
            {moment(rowValue.createdAt).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      accessorKey: "earnings",
      header: t("payouts.table.earnings"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center text-gray-900 font-medium">
            {getCurrencySymbol() + rowValue.requestedAmount}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("payouts.table.status"),
      cell: ({ row }) => {
        const rowValue = row.original;
        const statusColor = payoutStatusColors[rowValue.status as PayoutStatus];
        return (
          <div className="flex items-center">
            <StatusBadge status={rowValue.status} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data.result,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="rounded-2xl bg-white">
      <CardHeader className="flex flex-col gap-2 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 py-4 border-b space-y-0">
        <div className="flex items-center justify-around">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("payouts.table.title")}
          </h3>
        </div>
        <DateFilter />
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-gray-600 font-medium px-4 py-3"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b hover:bg-gray-50"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("payouts.table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination table={table} pagination={data.pagination} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status: "processing" | "pending" | "rejected" | "paid";
}) {
  const statusColor =
    payoutStatusColors[
      status.toLowerCase() as "processing" | "pending" | "rejected" | "paid"
    ];

  const className = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`;

  return (
    <span className={`${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

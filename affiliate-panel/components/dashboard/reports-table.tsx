"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/i18n/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TablePagination from "../TablePagination";
import { getCurrencySymbol } from "@/utils/getCurrency";

interface ReportRow {
  date?: string;
  month?: number;
  transactions: number;
  earning: string | number;
}

export default function ReportsTable({
  data,
  dateLabel,
  pagination,
}: {
  data: ReportRow[];
  dateLabel: string;
  pagination?: any;
}) {
  const { t } = useTranslation();

  const columns: ColumnDef<ReportRow>[] = [
    {
      accessorKey: "date",
      header: dateLabel,
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.date || row.original.month}
        </div>
      ),
    },
    {
      accessorKey: "transactions",
      header: t("reports.table.transactions"),
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.transactions}</div>
      ),
    },
    {
      accessorKey: "earning",
      header: t("reports.table.earning"),
      cell: ({ row }) => (
        <div className="flex items-center">
          {getCurrencySymbol() + Number(row.original.earning || 0).toFixed(2)}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="border rounded-2xl">
      <CardHeader>
        <CardTitle>{t("reports.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                      {t("reports.table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {pagination && (
            <TablePagination table={table} pagination={pagination} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

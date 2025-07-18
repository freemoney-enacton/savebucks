"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { transactionStatusColors } from "@/utils/get-color-for-status";
import { AppRoutes } from "@/utils/routes";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoveRight } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TablePagination from "../TablePagination";
import { getCurrencySymbol } from "@/utils/getCurrency";

interface Transaction {
  conversionId: number;
  transactionId: string | null;
  clickCode: string;
  conversionValue: string | null;
  commission: string | null;
  conversionStatus: "pending" | "approved" | "declined" | "paid";
  convertedAt: string;
  conversionCreatedAt: string;
  conversionSub1: string | null;
  conversionSub2: string | null;
  conversionSub3: string | null;
  adminNotes: string | null;
  payoutId: number | null;

  campaignId: number;
  campaignName: string;
  campaignType: string;
  campaignStatus: string;

  campaignGoalId: number;
  goalName: string;
  commissionType: string;
  goalCommissionAmount: string | null;
  trackingCode: string;
  goalStatus: string;

  affiliateId: number;
  affiliateName: string;
  affiliateEmail: string;
  affiliateStatus: string;

  affiliateLinkId: number;
  linkSlug: string;
  destinationUrl: string;
  linkStatus: string;
  linkSub1: string | null;
  linkSub2: string | null;
  linkSub3: string | null;

  clickId: number;
  ipAddress: string;
  country: string | null;
  city: string | null;
  deviceType: string | null;
  referrer: string | null;
  clickedAt: string;
  clickSub1: string | null;
  clickSub2: string | null;
  clickSub3: string | null;
}

export function TransactionsTable({ transactions }: any) {
  const { t } = useTranslation();
  const currentPath = usePathname();

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "conversionCreatedAt",
      header: t("transactions.date"),
      cell: ({ row }) => (
        <div className="flex items-center">
          {moment(row.original.conversionCreatedAt).format("YYYY-MM-DD")}
        </div>
      ),
    },
    {
      accessorKey: "campaignName",
      header: t("transactions.campaign"),
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.campaignName}</div>
      ),
    },
    {
      accessorKey: "goalName",
      header: t("transactions.goal"),
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.goalName}</div>
      ),
    },
    {
      accessorKey: "conversionSub1",
      header: t("transactions.sub1"),
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.conversionSub1 || "-"}
        </div>
      ),
    },
    {
      accessorKey: "conversionSub2",
      header: t("transactions.sub2"),
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.conversionSub2 || "-"}
        </div>
      ),
    },
    {
      accessorKey: "conversionSub3",
      header: t("transactions.sub3"),
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.conversionSub3 || "-"}
        </div>
      ),
    },
    {
      accessorKey: "commission",
      header: t("transactions.earning"),
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center">
          {getCurrencySymbol() +
            Number(row.original.commission || 0).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "conversionStatus",
      header: t("transactions.status"),
      cell: ({ row }) => (
        <div className="flex items-center">
          <StatusBadge status={row.original.conversionStatus} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: transactions?.data || [],
    columns,
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
    <Card className="border rounded-2xl">
      <CardHeader>
        <CardTitle>{t("transactions.recent_title")}</CardTitle>
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
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
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
                      {t("transactions.noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {currentPath === AppRoutes.dashboard ? (
            <div className="flex justify-end">
              <Link href={AppRoutes.transactions}>
                <Button className="text-white bg-brand-500 hover:bg-brand-600">
                  {t("transactions.viewAll")}{" "}
                  <MoveRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <TablePagination
              table={table}
              pagination={transactions?.pagination}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
  if (sorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-6 py-4 border-b", className)}>{children}</div>;
}

function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

function StatusBadge({
  status,
}: {
  status: "approved" | "pending" | "declined" | "paid";
}) {
  const statusColor =
    transactionStatusColors[
      status.toLowerCase() as "approved" | "pending" | "declined" | "paid"
    ];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

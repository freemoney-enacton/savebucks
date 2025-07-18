"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import TablePagination from "../TablePagination";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Api } from "@/services/api-services";
import { toast } from "@/hooks/use-toast";
import DateFilter from "../DateFilter";

export default function PostbacksTable({ data }: any) {
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostbackId, setSelectedPostbackId] = useState<number | null>(
    null
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await Api.delete({
        path: "/postback",
        body: { id },
      });

      if (response.status === "success") {
        setDeleteDialogOpen(false);
        setSelectedPostbackId(null);
        toast({
          title: t("postback.toast.successTitle"),
          description: t("postback.toast.postbackDeleted"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("postback.toast.errorTitle"),
          description: response.message || t("postback.toast.errorMessage"),
        });
        console.error("Failed to delete postback:", response.error);
      }
    } catch (error) {
      console.error("Failed to delete postback:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setSelectedPostbackId(id);
    setDeleteDialogOpen(true);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "createdAt",
      header: t("postback.table.date"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center text-gray-600 whitespace-nowrap">
            {moment(rowValue.createdAt).format("YYYY-MM-DD")}
          </div>
        );
      },
    },
    {
      accessorKey: "campaignGoal",
      header: t("postback.table.campaignGoal"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center text-gray-900">
            {rowValue.campaignName || t("postback.table.noGoal")}
          </div>
        );
      },
    },
    {
      accessorKey: "campaignGoalId",
      header: t("postback.table.goalName"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center">{rowValue.goalName || "-"}</div>
        );
      },
    },
    {
      accessorKey: "postbackUrl",
      header: t("postback.table.postbackUrl"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center text-gray-900 max-w-full">
            <span
              className="break-all min-w-[200px]"
              title={rowValue.postbackUrl}
            >
              {rowValue.postbackUrl}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "methodType",
      header: t("postback.table.methodType"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center text-gray-600">
            {rowValue.methodType || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: t("postback.table.actions"),
      cell: ({ row }) => {
        const rowValue = row.original;
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-300 bg-red-100"
              disabled={deletingId === rowValue.id}
              onClick={() => openDeleteDialog(rowValue.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.result || [],
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
    <Card className="rounded-2xl bg-white">
      <CardHeader className="flex flex-col gap-2 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 py-4 border-b space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("postback.table.title")}
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
                      {t("postback.table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination table={table} pagination={data?.pagination} />
        </div>
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("postback.delete.title")}</DialogTitle>
          </DialogHeader>

          <div>
            <p>{t("postback.delete.description")}</p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-black"
            >
              {t("cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                selectedPostbackId && handleDelete(selectedPostbackId)
              }
              disabled={deletingId === selectedPostbackId}
            >
              {deletingId === selectedPostbackId ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

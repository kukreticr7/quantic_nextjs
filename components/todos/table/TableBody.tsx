"use client";

import { Table } from "@tanstack/react-table";
import { Todo } from "@/lib/types/todo";
import {
  TableBody as UITableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableBodyProps {
  table: Table<Todo>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  isLoading?: boolean;
  userRole?: string;
}

function TableSkeleton() {
  return (
    <UITableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow
          key={index}
          className="border-b border-gray-200 dark:border-gray-700"
        >
          {Array.from({ length: 4 }).map((_, cellIndex) => (
            <TableCell key={`${index}-${cellIndex}`} className="px-4 py-2">
              <Skeleton className="h-4 w-4" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </UITableBody>
  );
}

export function TableBody({
  table,
  onEdit,
  onDelete,
  onToggleComplete,
  isLoading = false,
  userRole,
}: TableBodyProps) {
  const isAdmin = userRole === "admin";

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!table || !table.getRowModel) {
    return (
      <UITableBody>
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            Loading...
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }

  const rows = table.getRowModel().rows;

  if (!rows || !rows.length) {
    return (
      <UITableBody>
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            No results found.
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }

  return (
    <UITableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
          {isAdmin && (
            <TableCell className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(row.original)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(row.original.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          )}
        </TableRow>
      ))}
    </UITableBody>
  );
}

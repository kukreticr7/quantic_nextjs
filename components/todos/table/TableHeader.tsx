"use client";

import { Table } from "@tanstack/react-table";
import { Todo } from "@/lib/types/todo";
import {
  Table as UITable,
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface TableHeaderProps {
  table: Table<Todo>;
}

export function TableHeader({ table }: TableHeaderProps) {
  return (
    <UITableHeader>
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
    </UITableHeader>
  );
}

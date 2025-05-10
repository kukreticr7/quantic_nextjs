"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { Todo } from "@/lib/types/todo";

interface TableFiltersProps {
  table: Table<Todo>;
  statusFilter: "all" | "completed" | "incomplete";
  onStatusFilterChange: (value: "all" | "completed" | "incomplete") => void;
}

export function TableFilters({
  table,
  statusFilter,
  onStatusFilterChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="flex-1 w-full sm:max-w-sm">
        <Input
          placeholder="Filter todos..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Select
          onValueChange={(value: "all" | "completed" | "incomplete") => {
            onStatusFilterChange(value);
            table.getColumn("completed")?.setFilterValue(value);
          }}
          defaultValue={statusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

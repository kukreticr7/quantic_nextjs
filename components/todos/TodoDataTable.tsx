"use client";

import { useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import { Todo } from "@/lib/types/todo";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { EditTodoDialog } from "./EditTodoDialog";
import {
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "@/lib/redux/services/todosApi";
import { TableFilters } from "./table/TableFilters";
import { TableHeader } from "./table/TableHeader";
import { TableBody } from "./table/TableBody";
import { TablePagination } from "./table/TablePagination";
import { TableSkeleton } from "./table/TableSkeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface TodoDataTableProps {
  data: Todo[];
  onEdit: (todo: Todo) => void;
  isLoading?: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function TodoDataTable({
  data,
  onEdit,
  isLoading = false,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TodoDataTableProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "incomplete"
  >("all");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const columns: ColumnDef<Todo>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[500px] truncate font-medium">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "completed",
      header: "Status",
      cell: ({ row }) => {
        const completed = row.getValue("completed");
        return (
          <div className="flex ">
            {completed ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                <Check className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-amber-500 text-amber-500"
              >
                <X className="mr-1 h-3 w-3" />
                Pending
              </Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return value === "completed" ? row.getValue(id) : !row.getValue(id);
      },
    },
    ...(isAdmin
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: Todo } }) => {
              const todo = row.original;

              const handleStatusToggle = async () => {
                try {
                  await updateTodo({
                    ...todo,
                    completed: !todo.completed,
                  }).unwrap();

                  toast({
                    title: "Success",
                    description: `Todo marked as ${
                      !todo.completed ? "completed" : "incomplete"
                    }`,
                  });
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update todo status",
                  });
                }
              };

              return (
                <div className="flex ">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStatusToggle}
                    className={
                      todo.completed ? "text-amber-500" : "text-green-500"
                    }
                    title={
                      todo.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {todo.completed ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage - 1,
          pageSize,
        });
        onPageChange(newState.pageIndex + 1);
        if (newState.pageSize !== pageSize) {
          onPageSizeChange(newState.pageSize);
        }
      }
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <TableFilters
        table={table}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader table={table} />
          <TableBody
            table={table}
            onEdit={setEditingTodo}
            onDelete={async (id) => {
              try {
                await deleteTodo(id).unwrap();
                toast({
                  title: "Success",
                  description: "Todo deleted successfully",
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to delete todo",
                });
              }
            }}
            onToggleComplete={async (id, completed) => {
              try {
                const todoToUpdate = data.find((todo) => todo.id === id);
                if (!todoToUpdate) return;

                await updateTodo({
                  ...todoToUpdate,
                  completed,
                }).unwrap();

                toast({
                  title: "Success",
                  description: `Todo marked as ${
                    completed ? "completed" : "incomplete"
                  }`,
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to update todo status",
                });
              }
            }}
            isLoading={isLoading}
            userRole={session?.user?.role}
          />
        </Table>
      </div>

      <TablePagination
        table={table}
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />

      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          open={!!editingTodo}
          onOpenChange={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}

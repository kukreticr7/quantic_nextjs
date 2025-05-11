"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoDataTable } from "@/components/todos/TodoDataTable";
import { CreateTodoForm } from "@/components/todos/CreateTodoForm";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useGetTodosQuery } from "@/lib/redux/services/todosApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Todo } from "@/lib/types/todo";
import { EditTodoDialog } from "@/components/todos/EditTodoDialog";

/**
 * Main page component for the Todo application
 * Handles authentication, todo list display, creation, and editing
 */
export default function Home() {
  // Initialize hooks for toast notifications, authentication, and routing
  const { toast } = useToast();
  const { status } = useSession();
  const router = useRouter();

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch todos data with pagination
  const { data, isLoading, error } = useGetTodosQuery({
    page,
    limit: pageSize,
  });

  // State to track the todo being edited
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // Redirect to signin page if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show error toast if todo fetching fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handler functions for todo operations
  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleCloseDialog = () => {
    setSelectedTodo(null);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // Show loading state while authentication or data is loading
  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <main className="container mx-auto py-6 px-4 md:px-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quantic Todo App
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <AuthStatus />
          </div>
        </div>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="view">View Todos</TabsTrigger>
            <TabsTrigger value="create">Create Todo</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todo List</CardTitle>
              </CardHeader>
              <CardContent>
                <TodoDataTable
                  data={data?.data ?? []}
                  onEdit={handleEdit}
                  isLoading={isLoading}
                  totalItems={data?.total ?? 0}
                  currentPage={data?.page ?? 1}
                  pageSize={data?.limit ?? 10}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Todo</CardTitle>
                <CardDescription>Add a new todo to your list</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateTodoForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedTodo && (
          <EditTodoDialog
            todo={selectedTodo}
            open={!!selectedTodo}
            onOpenChange={handleCloseDialog}
          />
        )}

        <Toaster />
      </main>
    </ThemeProvider>
  );
}

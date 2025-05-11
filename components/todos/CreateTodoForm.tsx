"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TodoFormValues, todoSchema } from "@/lib/validation/todoSchema";
import { useAddTodoMutation } from "@/lib/redux/services/todosApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

/**
 * Form component for creating new todos
 * Handles form validation, submission, and error handling
 */
export function CreateTodoForm() {
  // Initialize mutation hook for adding todos and toast notifications
  const [addTodo, { isLoading }] = useAddTodoMutation();
  const { toast } = useToast();

  // Initialize form with validation schema and default values
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      completed: false,
      userId: 1,
    },
  });

  /**
   * Handle form submission
   * Creates a new todo and shows success/error notifications
   */
  async function onSubmit(values: TodoFormValues) {
    try {
      await addTodo(values).unwrap();
      form.reset();
      toast({
        title: "Success",
        description: "Todo created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create todo",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter todo title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Completed</FormLabel>
                <FormDescription>Mark this todo as completed</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Todo
        </Button>
      </form>
    </Form>
  );
}

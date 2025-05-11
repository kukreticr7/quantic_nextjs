"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Form validation schema using zod
 * Validates email format and password length
 */
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

// Converts API error messages to user-friendly messages
const getErrorMessage = (error: string | null) => {
  switch (error) {
    case "Invalid credentials format":
      return "Please enter a valid email and password";
    case "No user found with this email":
      return "No account found with this email address";
    case "Invalid password":
      return "Incorrect password";
    case "CredentialsSignin":
      return "Invalid email or password";
    default:
      return error;
  }
};

/**
 * Sign in form component
 * Handles user authentication with email and password
 */
export function SignInForm() {
  // Initialize hooks and state
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Get error message from URL if present (e.g., after failed login attempt)
  const [error, setError] = useState<string | null>(
    getErrorMessage(searchParams.get("error"))
  );

  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handle form submission
   * Attempts to sign in the user and handles success/error states
   */
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Attempt to sign in using NextAuth
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // Show error message if sign in fails
        const errorMessage = getErrorMessage(result.error);
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } else {
        // Redirect to home page on successful login
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Show error message if any */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password input field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit button with loading state */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      {/* Link to registration page */}
      <div className="mt-4 text-center text-sm">
        <span>Don&apos;t have an account? </span>
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </div>
    </>
  );
}

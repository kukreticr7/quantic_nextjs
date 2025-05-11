import { SignInForm } from "@/components/auth/SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function SignInPage() {
  // Check if user is already authenticated
  const session = await getServerSession(authOptions);

  // Redirect to home page if user is already logged in
  if (session) {
    redirect("/");
  }

  return (
    <div className=" flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        {/* Render sign in form component */}
        <SignInForm />
      </div>
    </div>
  );
}

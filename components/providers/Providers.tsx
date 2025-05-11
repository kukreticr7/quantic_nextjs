"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { SessionProvider } from "next-auth/react";

/**
 * Root providers component
 * Wraps the application with necessary providers:
 * - SessionProvider for authentication
 * - Redux Provider for state management
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}

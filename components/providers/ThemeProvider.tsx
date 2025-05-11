"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * Theme provider component
 * Wraps the application with theme management functionality
 * Forces light theme by default
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider forcedTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
}

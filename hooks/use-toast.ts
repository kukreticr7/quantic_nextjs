'use client';

import { toast as sonnerToast } from 'sonner';

/**
 * Props interface for toast notifications
 */
type ToastProps = {
  title?: string | null;
  description?: string | null;
  variant?: 'default' | 'destructive';
};

/**
 * Custom hook for displaying toast notifications
 * Wraps sonner toast with additional functionality
 * Object containing toast function
 */
export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    if (variant === 'destructive') {
      return sonnerToast.error(title || undefined, {
        description: description || undefined,
      });
    }
    return sonnerToast(title || undefined, {
      description: description || undefined,
    });
  };

  return {
    toast,
  };
}

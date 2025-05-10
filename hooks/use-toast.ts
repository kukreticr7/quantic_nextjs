'use client';

import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string | null;
  description?: string | null;
  variant?: 'default' | 'destructive';
};

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

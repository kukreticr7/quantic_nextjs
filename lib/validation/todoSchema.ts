import { z } from 'zod';

export const todoSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title must not exceed 100 characters' }),
  completed: z.boolean().default(false),
  userId: z.number().positive().default(1),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
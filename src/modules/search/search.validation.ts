import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    state: z.string().optional(),
    fuzzy: z.enum(['true', 'false']).optional()
  })
});

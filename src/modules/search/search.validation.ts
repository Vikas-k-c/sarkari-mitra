import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().optional(),
  query: z.string().optional(), // Fallback for the testing guide if user used ?query=farmer
  categoryId: z.string().uuid().optional(),
  state: z.string().optional(),
  fuzzy: z.enum(['true', 'false']).optional()
});

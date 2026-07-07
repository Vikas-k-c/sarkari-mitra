import { z } from 'zod';

export const createSchemeSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  benefits: z.string().optional(),
  applicationUrl: z.string().url().optional(),
  categoryId: z.string().uuid(),
  sourceId: z.string().uuid().optional(),
  eligibility: z.array(
    z.object({
      attribute: z.string(),
      operator: z.string(),
      value: z.string()
    })
  ).optional(),
  documents: z.array(
    z.object({
      name: z.string(),
      isRequired: z.boolean().default(true)
    })
  ).optional()
});

export type CreateSchemeDto = z.infer<typeof createSchemeSchema>;

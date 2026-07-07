import { z } from 'zod';

export const normalizedSchemeSchema = z.object({
  externalId: z.string(),
  sourceSystem: z.string(),
  title: z.string().min(3),
  description: z.string(),
  benefits: z.string().optional(),
  applicationUrl: z.string().url().optional(),
  categoryName: z.string().default('Uncategorized'),
  eligibility: z.array(
    z.object({
      attribute: z.string(),
      operator: z.string(),
      value: z.string()
    })
  ).default([])
});

export type NormalizedScheme = z.infer<typeof normalizedSchemeSchema>;

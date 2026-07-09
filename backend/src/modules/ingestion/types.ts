import { z } from 'zod';

export const normalizedSchemeSchema = z.object({
  externalId: z.string(),
  sourceSystem: z.string(),
  sourceUrl: z.string().url().optional(),
  checksum: z.string().optional(),
  title: z.string().min(3),
  shortDescription: z.string().optional(),
  description: z.string(),
  benefits: z.string().optional(),
  applicationUrl: z.string().url().optional(),
  ministry: z.string().optional(),
  state: z.string().optional(),
  language: z.string().default('en'),
  categoryName: z.string().default('Uncategorized'),
  secondaryCategories: z.array(z.string()).default([]),
  governmentLevel: z.enum(['CENTRAL', 'STATE', 'JOINT']).default('CENTRAL'),
  verificationStatus: z.enum(['VERIFIED', 'REVIEW_REQUIRED']).default('REVIEW_REQUIRED'),
  applicationProcess: z.string().optional(),
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  ).optional(),
  eligibility: z.array(
    z.object({
      attribute: z.string(),
      operator: z.string(),
      value: z.string()
    })
  ).default([]),
  requiredDocuments: z.array(z.string()).default([]),
  lastFetched: z.date().optional(),
  lastUpdated: z.date().optional(),
  lastVerified: z.date().optional()
});

export type NormalizedScheme = z.infer<typeof normalizedSchemeSchema>;

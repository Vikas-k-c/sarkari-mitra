import { z } from "zod";

const profileFields = {
  age: z.number().int().min(1).max(120),
  gender: z.string().trim().min(1).max(30),
  occupation: z.string().trim().min(1).max(100),
  income: z.number().int().nonnegative().max(2_147_483_647),
  education: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  district: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(50),
};

export const createProfileSchema = z.object(profileFields).strict();

export const updateProfileSchema = z
  .object(profileFields)
  .partial()
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one profile field is required",
  });

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

import { z } from "zod";

const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Mobile must be a valid 10-digit Indian number");

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  mobile: mobileSchema,
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/\d/, "Password must contain a number"),
  language: z.string().trim().min(2).max(10).default("en"),
}).strict();

export const loginSchema = z.object({
  mobile: mobileSchema,
  password: z.string().min(1).max(72),
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

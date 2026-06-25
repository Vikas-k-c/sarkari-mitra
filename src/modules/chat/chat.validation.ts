import { z } from 'zod';

export const createSessionSchema = z.object({
  language: z.string().optional().default('en'),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

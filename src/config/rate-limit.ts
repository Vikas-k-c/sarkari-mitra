import { rateLimit } from "express-rate-limit";
import type { Request, Response } from "express";
import { env } from "./env";
import { sendError } from "../utils/response";

const createRateLimitHandler =
  (code: string, message: string) =>
  (req: Request, res: Response): void => {
    sendError(res, {
      statusCode: 429,
      code,
      message,
      requestId: req.id,
    });
  };

export const apiRateLimiter = rateLimit({
  windowMs: env.API_RATE_LIMIT_WINDOW_MS,
  limit: env.API_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  handler: createRateLimitHandler(
    "RATE_LIMIT_EXCEEDED",
    "Too many requests. Please try again later."
  ),
});

export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  handler: createRateLimitHandler(
    "AUTH_RATE_LIMIT_EXCEEDED",
    "Too many authentication attempts. Please try again later."
  ),
});

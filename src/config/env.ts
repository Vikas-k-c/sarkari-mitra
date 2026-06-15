import "dotenv/config";
import { z } from "zod";

const jwtDurationSchema = z
  .string()
  .regex(/^\d+[smhd]$/, "JWT_EXPIRES_IN must use s, m, h, or d (for example 15m)")
  .default("15m")
  .transform((value, context) => {
    const units: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    };
    const unit = value.at(-1);
    const amount = Number(value.slice(0, -1));
    const seconds = unit ? amount * (units[unit] ?? 0) : 0;

    if (seconds < 60 || seconds > 30 * 24 * 60 * 60) {
      context.addIssue({
        code: "custom",
        message: "JWT_EXPIRES_IN must be between 60 seconds and 30 days",
      });
      return z.NEVER;
    }

    return seconds;
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters"),
  JWT_EXPIRES_IN: jwtDurationSchema,
  JWT_ISSUER: z.string().min(1).default("sarkari-mitra-api"),
  JWT_AUDIENCE: z.string().min(1).default("sarkari-mitra-client"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  LOG_FORMAT: z.enum(["dev", "combined"]).default("dev"),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
  SWAGGER_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  API_RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  SERVER_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  SERVER_HEADERS_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  SERVER_KEEP_ALIVE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(5_000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");

  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = {
  ...parsedEnv.data,
  CORS_ORIGINS: parsedEnv.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type Environment = typeof env;

import type { CorsOptions } from "cors";
import { env } from "./env";
import { AppError } from "../errors/AppError";

export const corsOptions: CorsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(
      AppError.forbidden("Origin is not allowed by CORS", "CORS_FORBIDDEN")
    );
  },
};

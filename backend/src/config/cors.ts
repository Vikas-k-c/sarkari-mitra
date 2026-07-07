import type { CorsOptions } from "cors";
import { env } from "./env";
import { AppError } from "../errors/AppError";

export const corsOptions: CorsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
  origin(origin, callback) {
    // Allow all origins for local Flutter development testing
    callback(null, true);
  },
};

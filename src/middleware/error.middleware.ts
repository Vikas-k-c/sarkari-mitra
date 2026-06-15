import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger";
import { sendError } from "../utils/response";

const getPrismaTargets = (
  error: Prisma.PrismaClientKnownRequestError
): string[] | undefined => {
  const target = error.meta?.["target"];

  if (Array.isArray(target)) {
    return target.filter((value): value is string => typeof value === "string");
  }

  return typeof target === "string" ? [target] : undefined;
};

const normalizePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): AppError => {
  switch (error.code) {
    case "P2002":
      return AppError.conflict(
        "A record with the provided value already exists",
        "UNIQUE_CONSTRAINT_VIOLATION",
        { fields: getPrismaTargets(error) ?? [] }
      );
    case "P2003":
      return AppError.badRequest(
        "The operation references a related record that does not exist",
        "FOREIGN_KEY_CONSTRAINT_VIOLATION"
      );
    case "P2014":
      return AppError.conflict(
        "The operation violates a required relation",
        "RELATION_VIOLATION"
      );
    case "P2024":
      return new AppError({
        statusCode: 503,
        code: "DATABASE_TIMEOUT",
        message: "Database service is temporarily unavailable",
      });
    case "P2025":
      return AppError.notFound(
        "Requested record was not found",
        "RECORD_NOT_FOUND"
      );
    default:
      return AppError.internal(error);
  }
};

const isMalformedJsonError = (
  error: unknown
): error is SyntaxError & { status: number; type: string } => {
  return (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400 &&
    "type" in error &&
    error.type === "entity.parse.failed"
  );
};

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return AppError.validation({
      fields: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
  }

  if (error instanceof TokenExpiredError) {
    return AppError.unauthorized("Access token has expired", "TOKEN_EXPIRED");
  }

  if (error instanceof NotBeforeError) {
    return AppError.unauthorized(
      "Access token is not active yet",
      "TOKEN_NOT_ACTIVE"
    );
  }

  if (error instanceof JsonWebTokenError) {
    return AppError.unauthorized("Access token is invalid", "INVALID_TOKEN");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return normalizePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return AppError.badRequest(
      "The database request contains invalid data",
      "DATABASE_VALIDATION_ERROR"
    );
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return new AppError({
      statusCode: 503,
      code: "DATABASE_UNAVAILABLE",
      message: "Database service is temporarily unavailable",
      cause: error,
    });
  }

  if (isMalformedJsonError(error)) {
    return AppError.badRequest("Request body contains invalid JSON", "INVALID_JSON");
  }

  return AppError.internal(error);
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const normalizedError = normalizeError(error);
  const logContext = {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    code: normalizedError.code,
    statusCode: normalizedError.statusCode,
    isOperational: normalizedError.isOperational,
    stack: normalizedError.stack,
  };

  if (normalizedError.statusCode >= 500) {
    logger.error(normalizedError.message, logContext);
  } else if (env.NODE_ENV === "development") {
    logger.info(normalizedError.message, logContext);
  }

  sendError(res, {
    statusCode: normalizedError.statusCode,
    code: normalizedError.code,
    message: normalizedError.message,
    details: normalizedError.details,
    requestId: req.id,
    stack:
      env.NODE_ENV === "development" && normalizedError.statusCode >= 500
        ? normalizedError.stack
        : undefined,
  });
};

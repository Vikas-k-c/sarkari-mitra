export type ErrorDetails = Record<string, unknown> | unknown[];

type AppErrorOptions = {
  statusCode: number;
  code: string;
  message: string;
  details?: ErrorDetails;
  isOperational?: boolean;
  cause?: unknown;
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ErrorDetails;
  public readonly isOperational: boolean;

  constructor({
    statusCode,
    code,
    message,
    details,
    isOperational = true,
    cause,
  }: AppErrorOptions) {
    super(message, { cause });
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(
    message: string,
    code = "BAD_REQUEST",
    details?: ErrorDetails
  ): AppError {
    return new AppError({ statusCode: 400, code, message, details });
  }

  public static unauthorized(
    message = "Authentication is required",
    code = "UNAUTHORIZED"
  ): AppError {
    return new AppError({ statusCode: 401, code, message });
  }

  public static forbidden(
    message = "You do not have permission to perform this action",
    code = "FORBIDDEN"
  ): AppError {
    return new AppError({ statusCode: 403, code, message });
  }

  public static notFound(
    message = "Requested resource was not found",
    code = "NOT_FOUND"
  ): AppError {
    return new AppError({ statusCode: 404, code, message });
  }

  public static conflict(
    message: string,
    code = "CONFLICT",
    details?: ErrorDetails
  ): AppError {
    return new AppError({ statusCode: 409, code, message, details });
  }

  public static validation(details: ErrorDetails): AppError {
    return new AppError({
      statusCode: 422,
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details,
    });
  }

  public static internal(cause?: unknown): AppError {
    return new AppError({
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      isOperational: false,
      cause,
    });
  }
}

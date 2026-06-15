import type { Response } from "express";

type SuccessResponseOptions<T> = {
  statusCode?: number;
  message?: string;
  data: T;
  requestId: string;
};

type ErrorResponseOptions = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
  stack?: string;
};

export const sendSuccess = <T>(
  res: Response,
  options: SuccessResponseOptions<T>
): void => {
  res.status(options.statusCode ?? 200).json({
    success: true,
    ...(options.message && { message: options.message }),
    data: options.data,
    requestId: options.requestId,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  res: Response,
  options: ErrorResponseOptions
): void => {
  res.status(options.statusCode).json({
    success: false,
    error: {
      code: options.code,
      message: options.message,
      ...(options.details !== undefined && { details: options.details }),
      ...(options.stack && { stack: options.stack }),
    },
    requestId: options.requestId,
    timestamp: new Date().toISOString(),
  });
};

import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    AppError.notFound(
      `Route ${req.method} ${req.originalUrl} was not found`,
      "ROUTE_NOT_FOUND"
    )
  );
};

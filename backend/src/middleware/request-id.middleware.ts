import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const requestIdPattern = /^[A-Za-z0-9._:-]{1,128}$/;

export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const incomingRequestId = req.header("x-request-id")?.trim();
  req.id =
    incomingRequestId && requestIdPattern.test(incomingRequestId)
      ? incomingRequestId
      : randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
};

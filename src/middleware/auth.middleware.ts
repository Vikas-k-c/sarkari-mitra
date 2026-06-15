import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.header("authorization");

  if (!authorization) {
    next(AppError.unauthorized("Authentication is required", "AUTH_REQUIRED"));
    return;
  }

  const [scheme, token, extraPart] = authorization.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token || extraPart) {
    next(
      AppError.unauthorized(
        "Authorization header must use the Bearer scheme",
        "INVALID_AUTH_HEADER"
      )
    );
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.user = { id: payload.sub };
    next();
  } catch (error: unknown) {
    next(error);
  }
};

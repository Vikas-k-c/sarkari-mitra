import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestTarget = "body" | "params" | "query";

export const validate = (
  schema: ZodType,
  target: RequestTarget = "body"
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    Object.assign(req[target], result.data);
    next();
  };
};

import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../errors/AppError";
import { sendSuccess } from "../../utils/response";
import { getCurrentUser, loginUser, registerUser } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.validator";

type RegisterRequest = Request<ParamsDictionary, unknown, RegisterInput>;
type LoginRequest = Request<ParamsDictionary, unknown, LoginInput>;

export const register = async (
  req: RegisterRequest,
  res: Response
): Promise<void> => {
  const auth = await registerUser(req.body);

  sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful",
    data: auth,
    requestId: req.id,
  });
};

export const login = async (
  req: LoginRequest,
  res: Response
): Promise<void> => {
  const auth = await loginUser(req.body);

  sendSuccess(res, {
    message: "Login successful",
    data: auth,
    requestId: req.id,
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw AppError.unauthorized("Authentication is required", "AUTH_REQUIRED");
  }

  const user = await getCurrentUser(req.user.id);
  sendSuccess(res, {
    data: { user },
    requestId: req.id,
  });
};

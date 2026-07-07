import { Router } from "express";
import { authRateLimiter } from "../../config/rate-limit";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { login, me, register } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validator";

const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(register)
);
authRouter.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  asyncHandler(login)
);
authRouter.get("/me", authenticate, asyncHandler(me));

export default authRouter;

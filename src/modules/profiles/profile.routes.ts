import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { create, read, update } from "./profile.controller";
import {
  createProfileSchema,
  updateProfileSchema,
} from "./profile.validator";

const profileRouter = Router();

profileRouter.use(authenticate);
profileRouter.post("/", validate(createProfileSchema), asyncHandler(create));
profileRouter.get("/", asyncHandler(read));
profileRouter.patch("/", validate(updateProfileSchema), asyncHandler(update));

export default profileRouter;

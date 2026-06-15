import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../errors/AppError";
import { sendSuccess } from "../../utils/response";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "./profile.service";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "./profile.validator";

type CreateProfileRequest = Request<
  ParamsDictionary,
  unknown,
  CreateProfileInput
>;
type UpdateProfileRequest = Request<
  ParamsDictionary,
  unknown,
  UpdateProfileInput
>;

const getAuthenticatedUserId = (req: Request): string => {
  if (!req.userId) {
    throw AppError.unauthorized("Authentication is required", "AUTH_REQUIRED");
  }

  return req.userId;
};

export const create = async (
  req: CreateProfileRequest,
  res: Response
): Promise<void> => {
  const profile = await createProfile(
    getAuthenticatedUserId(req),
    req.body
  );

  sendSuccess(res, {
    statusCode: 201,
    message: "Profile created successfully",
    data: { profile },
    requestId: req.id,
  });
};

export const read = async (req: Request, res: Response): Promise<void> => {
  const profile = await getProfile(getAuthenticatedUserId(req));

  sendSuccess(res, {
    data: { profile },
    requestId: req.id,
  });
};

export const update = async (
  req: UpdateProfileRequest,
  res: Response
): Promise<void> => {
  const profile = await updateProfile(
    getAuthenticatedUserId(req),
    req.body
  );

  sendSuccess(res, {
    message: "Profile updated successfully",
    data: { profile },
    requestId: req.id,
  });
};

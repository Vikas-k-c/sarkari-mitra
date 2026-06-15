import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../errors/AppError";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "./profile.validator";

export const createProfile = async (
  userId: string,
  input: CreateProfileInput
) => {
  try {
    return await prisma.profile.create({
      data: {
        userId,
        ...input,
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict(
        "A profile already exists for this user",
        "PROFILE_EXISTS"
      );
    }

    throw error;
  }
};

export const getProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw AppError.notFound("Profile was not found", "PROFILE_NOT_FOUND");
  }

  return profile;
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: input,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw AppError.notFound("Profile was not found", "PROFILE_NOT_FOUND");
    }

    throw error;
  }
};

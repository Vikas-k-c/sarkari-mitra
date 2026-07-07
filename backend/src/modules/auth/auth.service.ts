import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { generateAccessToken } from "../../utils/jwt";
import type { LoginInput, RegisterInput } from "./auth.validator";

const publicUserSelect = {
  id: true,
  fullName: true,
  mobile: true,
  language: true,
  createdAt: true,
  updatedAt: true,
} as const;

const authenticationUserSelect = {
  ...publicUserSelect,
  passwordHash: true,
} as const;

// Always run bcrypt for unknown users to reduce mobile-number timing disclosure.
const DUMMY_PASSWORD_HASH =
  "$2b$12$R.I4LU4LsvkJhONdLd8vj.Gon9VsnoZ99Qxg95BY9oD9fH6y3Sjuy";

export const registerUser = async (input: RegisterInput) => {
  const passwordHash = await bcrypt.hash(
    input.password,
    env.BCRYPT_SALT_ROUNDS
  );

  let user;

  try {
    user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        mobile: input.mobile,
        passwordHash,
        language: input.language,
      },
      select: publicUserSelect,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw AppError.conflict(
        "A user with this mobile already exists",
        "USER_EXISTS"
      );
    }

    throw error;
  }

  return {
    user,
    accessToken: generateAccessToken(user.id),
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { mobile: input.mobile },
    select: authenticationUserSelect,
  });

  const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const passwordMatches = await bcrypt.compare(input.password, passwordHash);

  if (!user || !passwordMatches) {
    throw AppError.unauthorized(
      "Invalid mobile or password",
      "INVALID_CREDENTIALS"
    );
  }

  const { passwordHash: _passwordHash, ...publicUser } = user;

  return {
    user: publicUser,
    accessToken: generateAccessToken(user.id),
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user) {
    throw AppError.notFound("User was not found", "USER_NOT_FOUND");
  }

  return user;
};

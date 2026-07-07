import { randomUUID } from "node:crypto";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

const accessTokenSchema = z.object({
  sub: z.string().uuid(),
  type: z.literal("access"),
  iss: z.literal(env.JWT_ISSUER),
  aud: z.union([z.literal(env.JWT_AUDIENCE), z.array(z.literal(env.JWT_AUDIENCE))]),
  iat: z.number().int(),
  exp: z.number().int(),
  jti: z.string().uuid(),
});

export type AccessTokenPayload = JwtPayload &
  z.infer<typeof accessTokenSchema>;

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN,
    subject: userId,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    jwtid: randomUUID(),
  };

  return jwt.sign({ type: "access" }, env.JWT_SECRET, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  if (typeof payload === "string") {
    throw AppError.unauthorized("Access token is invalid", "INVALID_TOKEN");
  }

  const result = accessTokenSchema.safeParse(payload);

  if (!result.success) {
    throw AppError.unauthorized("Access token is invalid", "INVALID_TOKEN");
  }

  return { ...payload, ...result.data };
};

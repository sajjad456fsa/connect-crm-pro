import jwt from "jsonwebtoken";
import { config } from "../config";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
}

export function verifyToken<T>(token: string, refresh = false): T {
  const secret = refresh ? config.jwtRefreshSecret : config.jwtSecret;
  return jwt.verify(token, secret) as T;
}

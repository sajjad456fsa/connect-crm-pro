import { prisma } from "../utils/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt";
import { config } from "../config";

export async function registerUser(data: { name: string; email: string; password: string; role?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email already exists");
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role as any,
    },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLogin: new Date() },
  });

  return { user, accessToken, refreshToken };
}

export async function refreshAuthToken(token: string) {
  const payload = verifyToken<{ userId: string }>(token, true);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });
  return { accessToken, refreshToken };
}

export async function generateVerificationToken(userId: string) {
  return signAccessToken({ userId, action: "verify" });
}

export async function verifyEmailToken(token: string) {
  const payload = verifyToken<{ userId: string; action?: string }>(token);
  if (payload.action !== "verify") {
    throw new Error("Invalid verification token");
  }
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { emailVerified: true },
  });
  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("No account found with that email");
  }

  const resetToken = signAccessToken({ userId: user.id, action: "reset" });
  return resetToken;
}

export async function resetPassword(token: string, password: string) {
  const payload = verifyToken<{ userId: string; action?: string }>(token);
  if (payload.action !== "reset") {
    throw new Error("Invalid reset token");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { password: passwordHash },
  });

  return user;
}

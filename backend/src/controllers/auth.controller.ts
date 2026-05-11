import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  loginUser,
  registerUser,
  refreshAuthToken,
  requestPasswordReset,
  resetPassword,
  verifyEmailToken,
  generateVerificationToken,
} from "../services/auth.service";
import { sendAuthEmail } from "../services/email.service";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await registerUser(payload);
    const verifyToken = await generateVerificationToken(result.user.id);
    await sendAuthEmail({
      to: result.user.email,
      subject: "Verify your Connect CRM account",
      html: `<p>Welcome ${result.user.name},</p><p>Verify your email at <a href=\"${process.env.FRONTEND_URL}/auth/verify?token=${verifyToken}\">this link</a>.</p>`,
    });
    res.status(201).json({
      user: { id: result.user.id, email: result.user.email, name: result.user.name, role: result.user.role },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload.email, payload.password);
    res.json({
      user: { id: result.user.id, email: result.user.email, name: result.user.name, role: result.user.role },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.body.refreshToken;
    if (!token) {
      throw new Error("Refresh token required");
    }
    const result = await refreshAuthToken(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const emailSchema = z.object({ email: z.string().email() });
    const { email } = emailSchema.parse(req.body);
    const resetToken = await requestPasswordReset(email);
    await sendAuthEmail({
      to: email,
      subject: "Reset your Connect CRM password",
      html: `<p>Use this link to reset your password:</p><p><a href=\"${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}\">Reset password</a></p>`,
    });
    res.json({ message: "Password reset sent" });
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = resetSchema.parse(req.body);
    await resetPassword(payload.token, payload.password);
    res.json({ message: "Password reset completed" });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = z.object({ token: z.string() }).parse(req.query);
    const user = await verifyEmailToken(String(token));
    res.json({ message: "Email verified", user: { id: user.id, email: user.email, emailVerified: user.emailVerified } });
  } catch (error) {
    next(error);
  }
}

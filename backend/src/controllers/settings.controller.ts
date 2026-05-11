import { Request, Response, NextFunction } from "express";
import { getSettings, updateSettings } from "../services/settings.service";
import { z } from "zod";

const settingsSchema = z.object({
  companyName: z.string().optional(),
  companyEmail: z.string().email().optional(),
  brandColor: z.string().optional(),
  logoUrl: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  apiKeys: z.array(z.string()).optional(),
  notifications: z.boolean().optional(),
});

export async function getSettingsController(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

export async function updateSettingsController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = settingsSchema.parse(req.body);
    const settings = await updateSettings(payload);
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

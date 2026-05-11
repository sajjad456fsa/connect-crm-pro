import { Request, Response, NextFunction } from "express";
import { listUsers, getUser, updateUser, deactivateUser } from "../services/user.service";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  active: z.boolean().optional(),
});

export async function getUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = updateUserSchema.parse(req.body);
    const user = await updateUser(req.params.id, payload);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deactivateUserController(req: Request, res: Response, next: NextFunction) {
  try {
    await deactivateUser(req.params.id);
    res.json({ message: "User deactivated" });
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "../services/task.service";

const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
  customerId: z.string().optional(),
  leadId: z.string().optional(),
  comments: z.string().optional(),
});

export async function createTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = taskSchema.parse(req.body);
    const task = await createTask({
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function getTasksController(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await listTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function getTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = taskSchema.partial().parse(req.body);
    const task = await updateTask(req.params.id, {
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteTask(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
}

import { prisma } from "../utils/prisma";

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: Date;
  assignedToId?: string;
  customerId?: string;
  leadId?: string;
  comments?: string;
}) {
  return prisma.task.create({ data });
}

export async function listTasks() {
  return prisma.task.findMany({
    include: { assignedTo: true, customer: true, lead: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function getTask(id: string) {
  return prisma.task.findUnique({ where: { id }, include: { assignedTo: true, customer: true, lead: true } });
}

export async function updateTask(id: string, data: any) {
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}

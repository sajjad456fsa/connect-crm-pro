import { prisma } from "../utils/prisma";

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getUser(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUser(id: string, data: any) {
  return prisma.user.update({ where: { id }, data });
}

export async function deactivateUser(id: string) {
  return prisma.user.update({ where: { id }, data: { active: false } });
}

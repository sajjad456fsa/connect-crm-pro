import { prisma } from "../utils/prisma";

export async function getSettings() {
  const existing = await prisma.setting.findFirst();
  if (existing) return existing;
  return prisma.setting.create({ data: {} });
}

export async function updateSettings(data: any) {
  const existing = await prisma.setting.findFirst();
  if (!existing) {
    return prisma.setting.create({ data });
  }
  return prisma.setting.update({ where: { id: existing.id }, data });
}

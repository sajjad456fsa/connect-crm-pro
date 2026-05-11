import { prisma } from "../utils/prisma";

export async function createCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  billingInfo?: string;
  company?: string;
  projectHistory?: string;
}) {
  return prisma.customer.create({ data });
}

export async function listCustomers() {
  return prisma.customer.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getCustomer(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: { documents: true, tasks: true, notes: true },
  });
}

export async function updateCustomer(id: string, data: any) {
  return prisma.customer.update({ where: { id }, data });
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({ where: { id } });
}

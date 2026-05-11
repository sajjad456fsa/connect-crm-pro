import { prisma } from "../utils/prisma";

export async function createLead(data: {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  source?: string;
  status?: string;
  priority?: string;
  budget?: number;
  notes?: string;
  assignedStaffId?: string;
  followUpDate?: Date;
  tags?: string[];
}) {
  return prisma.lead.create({ data });
}

export async function listLeads(userId?: string) {
  return prisma.lead.findMany({
    include: { assignedStaff: true, activities: true, files: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: { assignedStaff: true, activities: true, files: true },
  });
}

export async function updateLead(id: string, data: any) {
  return prisma.lead.update({ where: { id }, data });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } });
}

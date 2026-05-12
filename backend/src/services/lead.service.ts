import { prisma } from "../utils/prisma";
import { LeadStatus, Priority, LeadSource } from "@prisma/client";

export async function createLead(data: {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  leadSource?: string;
  status?: string;
  priority?: string;
  budgetValue?: number;
  country?: string;
  city?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  followUpDate?: Date;
  nextMeetingDate?: Date;
  expectedClosingDate?: Date;
  dealValue?: number;
  conversionProbability?: number;
  lostReason?: string;
  lostReasonNotes?: string;
}) {
  return prisma.lead.create({
    data: {
      leadId: `L${Date.now().toString().slice(-6)}`,
      ...data,
      status: (data.status as LeadStatus) || LeadStatus.NEW_LEAD,
      priority: (data.priority as Priority) || Priority.MEDIUM,
    },
    include: {
      assignedSalesPerson: true,
      assignedBy: true,
      activities: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      files: true,
    },
  });
}

export async function listLeads(userId?: string, filters?: any) {
  const where: any = {};

  // Apply filters
  if (filters) {
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assignedSalesPersonId) where.assignedSalesPersonId = filters.assignedSalesPersonId;
    if (filters.leadSource) where.leadSource = filters.leadSource;
    if (filters.country) where.country = filters.country;
    if (filters.progressMin !== undefined) where.leadProgressPercent = { gte: filters.progressMin };
    if (filters.progressMax !== undefined) where.leadProgressPercent = { ...where.leadProgressPercent, lte: filters.progressMax };
    if (filters.conversionMin !== undefined) where.conversionProbability = { gte: filters.conversionMin };
    if (filters.conversionMax !== undefined) where.conversionProbability = { ...where.conversionProbability, lte: filters.conversionMax };

    // Date range filters
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { companyName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { notes: { contains: filters.search, mode: "insensitive" } },
      ];
    }
  }

  return prisma.lead.findMany({
    where,
    include: {
      assignedSalesPerson: true,
      assignedBy: true,
      activities: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5, // Last 5 activities
      },
      files: true,
      _count: {
        select: { activities: true, files: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedSalesPerson: true,
      assignedBy: true,
      activities: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      files: true,
      tasks: true,
      notifications: {
        where: { read: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateLead(id: string, data: any) {
  return prisma.lead.update({
    where: { id },
    data,
    include: {
      assignedSalesPerson: true,
      assignedBy: true,
      activities: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      files: true,
    },
  });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } });
}

export async function assignLead(leadId: string, salesPersonId: string, assignedById: string) {
  return prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedSalesPersonId: salesPersonId,
      assignedById: assignedById,
      leadAssignedDate: new Date(),
    },
    include: {
      assignedSalesPerson: true,
      assignedBy: true,
    },
  });
}

export async function getLeadActivities(leadId: string) {
  return prisma.leadActivity.findMany({
    where: { leadId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createLeadActivity(
  leadId: string,
  userId: string,
  action: string,
  description: string,
  oldValue?: string,
  newValue?: string,
  metadata?: any
) {
  return prisma.leadActivity.create({
    data: {
      leadId,
      userId,
      action,
      description,
      oldValue,
      newValue,
      metadata,
    },
    include: { user: true },
  });
}

export async function getLeadsAnalytics() {
  const [
    totalLeads,
    leadsByStatus,
    leadsBySource,
    leadsByPriority,
    salesPerformance,
    conversionRates,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["leadSource"],
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["priority"],
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["assignedSalesPersonId"],
      _count: { id: true },
      _sum: { dealValue: true },
      where: { status: LeadStatus.WON },
    }),
    prisma.lead.aggregate({
      where: { status: LeadStatus.WON },
      _count: { id: true },
    }),
  ]);

  const totalWon = conversionRates._count.id;
  const conversionRate = totalLeads > 0 ? (totalWon / totalLeads) * 100 : 0;

  return {
    overview: {
      totalLeads,
      totalWon,
      conversionRate: Math.round(conversionRate * 100) / 100,
    },
    leadsByStatus,
    leadsBySource,
    leadsByPriority,
    salesPerformance: await Promise.all(
      salesPerformance.map(async (perf) => {
        const salesPerson = await prisma.user.findUnique({
          where: { id: perf.assignedSalesPersonId! },
          select: { name: true },
        });
        return {
          salesPerson: salesPerson?.name || "Unknown",
          leadsWon: perf._count.id,
          totalValue: perf._sum.dealValue || 0,
        };
      })
    ),
  };
}

export async function getKanbanData() {
  const leads = await prisma.lead.findMany({
    include: {
      assignedSalesPerson: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Group leads by status for Kanban view
  const kanbanData: Record<string, any[]> = {};

  leads.forEach((lead) => {
    if (!kanbanData[lead.status]) {
      kanbanData[lead.status] = [];
    }
    kanbanData[lead.status].push(lead);
  });

  return kanbanData;
}

import { prisma } from "../utils/prisma";

export async function getDashboardReport() {
  const [leadCount, customerCount, taskCount, revenue] = await Promise.all([
    prisma.lead.count(),
    prisma.customer.count(),
    prisma.task.count(),
    prisma.lead.aggregate({ _sum: { budget: true } }).then((result) => result._sum.budget ?? 0),
  ]);

  const statuses = await prisma.lead.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return {
    leadCount,
    customerCount,
    taskCount,
    revenue,
    statusCounts: statuses.reduce((acc, item) => ({ ...acc, [item.status]: item._count.status }), {}),
  };
}

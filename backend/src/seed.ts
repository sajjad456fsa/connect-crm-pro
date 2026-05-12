import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./utils/hash";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("Sajjad786");

  const admin = await prisma.user.upsert({
    where: { email: "admin@connectcrm.com" },
    update: {},
    create: {
      email: "admin@connectcrm.com",
      name: "Super Admin",
      password: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  console.log("Admin user created:", admin.email);

  const roles = [
    { name: "SUPER_ADMIN" },
    { name: "ADMIN" },
    { name: "SALES_MANAGER" },
    { name: "SALES_AGENT" },
    { name: "SUPPORT_STAFF" },
  ] as const;

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("Roles seeded");

  const salesAgent1 = await prisma.user.upsert({
    where: { email: "john.sales@connectcrm.com" },
    update: {},
    create: {
      email: "john.sales@connectcrm.com",
      name: "John Smith",
      password: await hashPassword("password123"),
      role: "SALES_AGENT",
      emailVerified: true,
    },
  });

  const salesAgent2 = await prisma.user.upsert({
    where: { email: "sarah.sales@connectcrm.com" },
    update: {},
    create: {
      email: "sarah.sales@connectcrm.com",
      name: "Sarah Johnson",
      password: await hashPassword("password123"),
      role: "SALES_AGENT",
      emailVerified: true,
    },
  });

  console.log("Sample sales agents created");

  const sampleLeads = [
    {
      leadId: "L001",
      fullName: "Ahmed Hassan",
      companyName: "Tech Solutions Inc",
      email: "ahmed.hassan@techsolutions.com",
      phone: "+971501234567",
      whatsapp: "+971501234567",
      leadSource: "WEBSITE",
      status: "QUALIFIED",
      priority: "HIGH",
      budgetValue: 50000,
      country: "UAE",
      city: "Dubai",
      address: "Business Bay, Dubai",
      notes: "Interested in enterprise CRM solution. Budget approved.",
      tags: ["Enterprise", "High-Value", "Tech"],
      followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      nextMeetingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedSalesPersonId: salesAgent1.id,
      assignedById: admin.id,
      leadAssignedDate: new Date(),
      leadProgressPercent: 60,
      expectedClosingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      dealValue: 45000,
      conversionProbability: 75,
    },
    {
      leadId: "L002",
      fullName: "Maria Rodriguez",
      companyName: "Global Marketing Ltd",
      email: "maria@globalmarketing.com",
      phone: "+34612345678",
      whatsapp: "+34612345678",
      leadSource: "SOCIAL_MEDIA",
      status: "PROPOSAL_SENT",
      priority: "MEDIUM",
      budgetValue: 25000,
      country: "Spain",
      city: "Madrid",
      address: "Gran Via 123, Madrid",
      notes: "Needs marketing automation tools. Sent proposal last week.",
      tags: ["Marketing", "Automation"],
      followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      assignedSalesPersonId: salesAgent2.id,
      assignedById: admin.id,
      leadAssignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      leadProgressPercent: 70,
      expectedClosingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      dealValue: 22000,
      conversionProbability: 60,
    },
    {
      leadId: "L003",
      fullName: "David Chen",
      companyName: "StartupXYZ",
      email: "david@startupxyz.com",
      phone: "+14155551234",
      whatsapp: "+14155551234",
      leadSource: "REFERRAL",
      status: "NEW_LEAD",
      priority: "URGENT",
      budgetValue: 15000,
      country: "USA",
      city: "San Francisco",
      address: "Silicon Valley, CA",
      notes: "Hot lead from existing customer referral. Needs immediate follow-up.",
      tags: ["Startup", "Referral", "Hot Lead"],
      followUpDate: new Date(),
      assignedSalesPersonId: salesAgent1.id,
      assignedById: admin.id,
      leadAssignedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      leadProgressPercent: 10,
      expectedClosingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      dealValue: 12000,
      conversionProbability: 40,
    },
    {
      leadId: "L004",
      fullName: "Emma Wilson",
      companyName: "Fashion Retail Co",
      email: "emma@fashionretail.com",
      phone: "+442071234567",
      whatsapp: "+442071234567",
      leadSource: "TRADE_SHOW",
      status: "NEGOTIATION",
      priority: "HIGH",
      budgetValue: 35000,
      country: "UK",
      city: "London",
      address: "Oxford Street 456, London",
      notes: "Met at London Fashion Week. Strong interest in retail CRM.",
      tags: ["Retail", "Fashion", "Trade Show"],
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      nextMeetingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedSalesPersonId: salesAgent2.id,
      assignedById: admin.id,
      leadAssignedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      leadProgressPercent: 85,
      expectedClosingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      dealValue: 32000,
      conversionProbability: 90,
    },
    {
      leadId: "L005",
      fullName: "Robert Kim",
      companyName: "Manufacturing Corp",
      email: "robert@manufacturing.com",
      phone: "+8221234567",
      whatsapp: "+8221234567",
      leadSource: "COLD_CALL",
      status: "LOST",
      priority: "LOW",
      budgetValue: 8000,
      country: "South Korea",
      city: "Seoul",
      address: "Gangnam District, Seoul",
      notes: "Lost to competitor. Price was the deciding factor.",
      tags: ["Manufacturing", "Lost"],
      assignedSalesPersonId: salesAgent1.id,
      assignedById: admin.id,
      leadAssignedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      leadProgressPercent: 0,
      lostReason: "PRICE_TOO_HIGH",
      lostReasonNotes: "Competitor offered 20% lower price",
    },
  ] as const;

  const createdLeads: Record<string, { id: string }> = {};
  for (const leadData of sampleLeads) {
    const lead = await prisma.lead.upsert({
      where: { leadId: leadData.leadId },
      update: {},
      create: leadData as any,
    });
    createdLeads[leadData.leadId] = lead;
  }

  console.log("Sample leads created with advanced features");

  const activities = [
    {
      leadId: createdLeads["L001"].id,
      userId: salesAgent1.id,
      action: "lead_created",
      description: "Lead created from website inquiry",
    },
    {
      leadId: createdLeads["L001"].id,
      userId: admin.id,
      action: "lead_assigned",
      description: "Lead assigned to John Smith",
    },
    {
      leadId: createdLeads["L001"].id,
      userId: salesAgent1.id,
      action: "status_changed",
      description: "Status changed from NEW_LEAD to QUALIFIED",
      oldValue: "NEW_LEAD",
      newValue: "QUALIFIED",
    },
    {
      leadId: createdLeads["L001"].id,
      userId: salesAgent1.id,
      action: "call_logged",
      description: "Called lead - discussed requirements and budget",
      metadata: { duration: 15, outcome: "positive" },
    },
    {
      leadId: createdLeads["L002"].id,
      userId: salesAgent2.id,
      action: "meeting_scheduled",
      description: "Meeting scheduled for product demo",
      metadata: { meetingType: "product_demo", attendees: 3 },
    },
    {
      leadId: createdLeads["L003"].id,
      userId: salesAgent1.id,
      action: "note_added",
      description: "Added urgent follow-up note",
    },
    {
      leadId: createdLeads["L004"].id,
      userId: salesAgent2.id,
      action: "proposal_sent",
      description: "Sent customized proposal via email",
      metadata: { proposalValue: 32000, sentVia: "email" },
    },
  ];

  for (const activity of activities) {
    await prisma.leadActivity.create({
      data: activity,
    });
  }

  console.log("Sample lead activities created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

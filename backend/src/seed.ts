import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./utils/hash";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
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

  // Create default roles if not exist
  const roles = [
    { name: "SUPER_ADMIN", displayName: "Super Admin" },
    { name: "ADMIN", displayName: "Admin" },
    { name: "SALES_MANAGER", displayName: "Sales Manager" },
    { name: "SALES_AGENT", displayName: "Sales Agent" },
    { name: "SUPPORT_STAFF", displayName: "Support Staff" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("Roles seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

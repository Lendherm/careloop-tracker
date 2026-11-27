import { PrismaClient, type Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// DEV ONLY: shared password so you can sign in as each role while building.
const DEV_PASSWORD = "Password123!";

const users: { name: string; email: string; role: Role; org: string | null }[] =
  [
    {
      name: "Cora Coordinator",
      email: "coordinator@careloop.test",
      role: "COORDINATOR",
      org: "Screening Programme Office",
    },
    {
      name: "Cliff Clinician",
      email: "clinician@careloop.test",
      role: "CLINICIAN",
      org: "District Hospital",
    },
    {
      name: "Lulu Lab",
      email: "lab@careloop.test",
      role: "LAB_STAFF",
      org: "Central Laboratory",
    },
  ];

async function main() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 12);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, requestedRole: user.role, passwordHash },
    });
  }

  console.log(`Seeded ${users.length} users (password: ${DEV_PASSWORD})`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

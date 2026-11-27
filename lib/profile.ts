import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProfileDTO } from "@/lib/types";
import type { ProfileUpdateInput } from "@/lib/validators";

// Never select passwordHash here.
const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  org: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

type ProfileRow = Prisma.UserGetPayload<{ select: typeof profileSelect }>;

function toDTO(row: ProfileRow): ProfileDTO | null {
  if (!row.role) return null;
  return { ...row, role: row.role, createdAt: row.createdAt.toISOString() };
}

export async function getProfile(userId: string): Promise<ProfileDTO | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });
  return row ? toDTO(row) : null;
}

/** Returns null if the user no longer exists or has no assigned role. */
export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<ProfileDTO | null> {
  try {
    const row = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        // undefined = leave alone, ""/null = clear
        org: input.org === undefined ? undefined : input.org || null,
      },
      select: profileSelect,
    });
    return toDTO(row);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }
    throw error;
  }
}

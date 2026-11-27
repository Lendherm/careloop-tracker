import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

// Compared against when the email does not exist, so a missing account takes
// about as long to reject as a real one.
export const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

// Whole minutes left on a lock, or 0 if the account is not locked.
export function lockMinutesLeft(lockedUntil: Date | null, now = new Date()): number {
  if (!lockedUntil || lockedUntil <= now) return 0;
  return Math.ceil((lockedUntil.getTime() - now.getTime()) / 60_000);
}

// Count a wrong password; pause the account once the limit is reached.
export async function registerFailedLogin(userId: string): Promise<void> {
  const { failedLoginCount } = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: { increment: 1 } },
    select: { failedLoginCount: true },
  });

  if (failedLoginCount >= MAX_FAILED_ATTEMPTS) {
    await prisma.user.update({
      where: { id: userId },
      data: { failedLoginCount: 0, lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) },
    });
  }
}

// After a correct password: forget earlier failures. Only writes when needed.
export async function clearFailedLogins(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: {
      id: userId,
      OR: [{ failedLoginCount: { gt: 0 } }, { lockedUntil: { not: null } }],
    },
    data: { failedLoginCount: 0, lockedUntil: null },
  });
}

import { cache } from "react";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  org: string | null;
  mustChangePassword: boolean;
}

// The signed-in, approved user, or null. Role and status come from the database
// on every request, so a demoted or rejected person loses access straight away.
// Cached per request so the header and the page share one lookup.
export const getActiveUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      org: true,
      mustChangePassword: true,
    },
  });

  if (!user || user.status !== "active" || !user.role) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    org: user.org,
    mustChangePassword: user.mustChangePassword,
  };
});

// For pages. Sends visitors to the login page, and anyone whose password was
// reset to /change-password, from everywhere except that page itself.
export async function requireUser(options: { allowPasswordChange?: boolean } = {}): Promise<SessionUser> {
  const user = await getActiveUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword && !options.allowPasswordChange) redirect("/change-password");
  return user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/cases");
  return user;
}

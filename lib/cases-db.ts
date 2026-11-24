import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/types";

export async function listAccessibleCases(user: {
  id: string;
  role: Role;
}) {
  if (user.role === "coordinator") {
    return prisma.case.findMany({
      include: {
        owner: { select: { id: true, name: true, role: true } },
        _count: { select: { referrals: true, timeline: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return prisma.case.findMany({
    where: { ownerId: user.id },
    include: {
      owner: { select: { id: true, name: true, role: true } },
      _count: { select: { referrals: true, timeline: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCaseDetail(id: string) {
  return prisma.case.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      closedBy: { select: { id: true, name: true } },
      timeline: {
        include: {
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      referrals: {
        include: {
          fromUser: { select: { id: true, name: true } },
          toUser: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function canAccessCase(
  caseOwnerId: string | null | undefined,
  user: { id: string; role: Role }
) {
  if (user.role === "coordinator") return true;
  return caseOwnerId === user.id;
}

export async function listAssignableOwners() {
  return prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true },
    orderBy: { name: "asc" },
  });
}

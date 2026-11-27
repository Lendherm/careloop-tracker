import type { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  COORDINATOR: "Coordinator",
  CLINICIAN: "Clinician",
  LAB_STAFF: "Lab staff",
};

export const ROLES = Object.keys(ROLE_LABELS) as Role[];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.some((role) => role === value);
}

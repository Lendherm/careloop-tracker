import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { lockMinutesLeft } from "@/lib/loginThrottle";
import { generateTempPassword } from "@/lib/passwords";
import { CHECK_FORM, fail, ok, type ServiceResult } from "@/lib/serviceResult";
import type { SessionUser } from "@/lib/session";
import type { MessageResponse, TempPasswordResponse } from "@/lib/types";
import type {
  ChangePasswordInput,
  DecideAccountInput,
  ForcedPasswordInput,
  ProfileInput,
  RegisterInput,
} from "@/lib/validation";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
  org: string | null;
}

export interface PendingAccount {
  id: string;
  name: string;
  email: string;
  org: string | null;
  requestedRole: Role;
  createdAt: Date;
}

export interface ActiveAccount {
  id: string;
  name: string;
  email: string;
  role: Role | null;
  org: string | null;
  mustChangePassword: boolean;
  locked: boolean;
}

export interface Assignee {
  id: string;
  name: string;
  role: Role | null;
}

export function getProfile(user: SessionUser): Profile {
  return { id: user.id, name: user.name, email: user.email, role: user.role, org: user.org };
}

export async function updateProfile(
  user: SessionUser,
  input: ProfileInput
): Promise<ServiceResult<Profile>> {
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: input.name, org: input.org ?? null },
  });
  return ok(getProfile({ ...user, name: updated.name, org: updated.org }));
}

// ---- Sign-up and passwords ----

export async function registerUser(input: RegisterInput): Promise<ServiceResult<MessageResponse>> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (existing) {
    return fail(409, CHECK_FORM, { email: "An account with this email already exists" });
  }

  // No role and pending status: the person has no access until a coordinator
  // approves the account and grants a role.
  await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 12),
      requestedRole: input.requestedRole,
      status: "pending",
      org: input.org,
    },
  });

  return ok({ message: "Account created. A coordinator must approve it before you can sign in." });
}

export async function changePassword(
  user: SessionUser,
  input: ChangePasswordInput
): Promise<ServiceResult<MessageResponse>> {
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  if (!record || !(await bcrypt.compare(input.currentPassword, record.passwordHash))) {
    return fail(400, CHECK_FORM, { currentPassword: "That is not your current password" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(input.newPassword, 12) },
  });
  return ok({ message: "Password changed." });
}

// For someone whose password was reset by a coordinator.
export async function forcedChangePassword(
  user: SessionUser,
  input: ForcedPasswordInput
): Promise<ServiceResult<MessageResponse>> {
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  // The new password must not be the temporary one they just signed in with.
  if (record && (await bcrypt.compare(input.newPassword, record.passwordHash))) {
    return fail(400, CHECK_FORM, {
      newPassword: "Choose a different password from the temporary one",
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(input.newPassword, 12), mustChangePassword: false },
  });
  return ok({ message: "Password saved." });
}

// ---- Coordinator account management ----

export async function listAccounts(
  coordinator: SessionUser
): Promise<{ pending: PendingAccount[]; active: ActiveAccount[] }> {
  const [pending, active] = await Promise.all([
    prisma.user.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, org: true, requestedRole: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { status: "active", NOT: { id: coordinator.id } },
      orderBy: { name: "asc" },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        org: true,
        mustChangePassword: true,
        lockedUntil: true,
      },
    }),
  ]);

  return {
    pending,
    active: active.map(({ lockedUntil, ...person }) => ({
      ...person,
      locked: lockMinutesLeft(lockedUntil) > 0,
    })),
  };
}

export async function decideAccount(
  coordinator: SessionUser,
  userId: string,
  input: DecideAccountInput
): Promise<ServiceResult<MessageResponse>> {
  const decidedAt = new Date();

  const result = await prisma.user.updateMany({
    where: { id: userId, status: "pending" },
    data:
      input.decision === "approve"
        ? { status: "active", role: input.role, approvedById: coordinator.id, approvedAt: decidedAt }
        : { status: "rejected", approvedById: coordinator.id, approvedAt: decidedAt },
  });

  if (result.count !== 1) return fail(409, "That request has already been handled.");
  return ok({ message: input.decision === "approve" ? "Account approved." : "Account rejected." });
}

// Gives someone a temporary password and forces them to choose their own at the
// next sign-in. It also lifts any sign-in lock. The temporary password is
// returned once and never stored in readable form.
export async function resetPassword(
  coordinator: SessionUser,
  userId: string
): Promise<ServiceResult<TempPasswordResponse>> {
  if (userId === coordinator.id) {
    return fail(400, "Change your own password from Profile.");
  }

  const target = await prisma.user.findFirst({
    where: { id: userId, status: "active" },
    select: { id: true },
  });
  if (!target) return fail(404, "That account is not active.");

  const tempPassword = generateTempPassword();
  await prisma.user.update({
    where: { id: target.id },
    data: {
      passwordHash: await bcrypt.hash(tempPassword, 12),
      mustChangePassword: true,
      failedLoginCount: 0,
      lockedUntil: null,
    },
  });

  return ok({ tempPassword });
}

// Active people with one of the given roles, for owner and recipient pickers.
export async function listAssignableUsers(roles: Role[], excludeUserId?: string): Promise<Assignee[]> {
  return prisma.user.findMany({
    where: {
      status: "active",
      role: { in: roles },
      ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true },
  });
}

// ---- Login messages ----

// Wrong attempts are counted in auth.ts. This only chooses what to tell the person.
export async function explainFailedLogin(
  email: string,
  password: string
): Promise<{ status: number; message: string }> {
  const invalid = { status: 401, message: "Invalid email or password." };

  const user = await prisma.user.findUnique({
    where: { email },
    select: { passwordHash: true, status: true, lockedUntil: true },
  });
  if (!user) return invalid;

  const minutes = lockMinutesLeft(user.lockedUntil);
  if (minutes > 0) {
    return {
      status: 429,
      message: `Too many failed attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
    };
  }

  // Only reveal a pending or rejected account after the person proves the password.
  if (
    (user.status === "pending" || user.status === "rejected") &&
    (await bcrypt.compare(password, user.passwordHash))
  ) {
    return {
      status: 403,
      message:
        user.status === "pending"
          ? "Your account is waiting for a coordinator to approve it."
          : "This account was not approved. Contact a coordinator.",
    };
  }

  return invalid;
}

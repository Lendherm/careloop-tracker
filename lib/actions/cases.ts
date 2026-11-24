"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  CaseCreateSchema,
  CaseFormState,
  CaseUpdateSchema,
} from "@/lib/case-schemas";
import { canAccessCase } from "@/lib/cases-db";
import { prisma } from "@/lib/prisma";
import type { CaseStatus, Role } from "@/lib/types";

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    throw new Error("Not authenticated");
  }
  return {
    id: session.user.id,
    role: session.user.role as Role,
    name: session.user.name ?? "User",
  };
}

export async function createCase(
  _prevState: CaseFormState,
  formData: FormData
): Promise<CaseFormState> {
  const user = await requireSession();

  const parsed = CaseCreateSchema.safeParse({
    patientCode: formData.get("patientCode"),
    resultIssuedAt: formData.get("resultIssuedAt"),
    ownerId: formData.get("ownerId") || user.id,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create case.",
    };
  }

  const { patientCode, resultIssuedAt, ownerId } = parsed.data;

  if (user.role !== "coordinator" && ownerId !== user.id) {
    return {
      errors: { ownerId: ["You can only assign yourself as owner."] },
      message: "Not authorized to assign that owner.",
    };
  }

  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner) {
    return {
      errors: { ownerId: ["Selected owner was not found."] },
      message: "Could not create case.",
    };
  }

  let createdId = "";

  try {
    const created = await prisma.case.create({
      data: {
        patientCode,
        resultIssuedAt: new Date(resultIssuedAt),
        ownerId,
        status: "open",
        timeline: {
          create: {
            type: "case_created",
            message: `Case created for patient ${patientCode}.`,
            createdById: user.id,
          },
        },
      },
    });
    createdId = created.id;
  } catch {
    return { message: "Database Error: Failed to create case." };
  }

  revalidatePath("/cases");
  redirect(`/cases/${createdId}`);
}

export async function updateCase(
  caseId: string,
  _prevState: CaseFormState,
  formData: FormData
): Promise<CaseFormState> {
  const user = await requireSession();

  const existing = await prisma.case.findUnique({ where: { id: caseId } });
  if (!existing) {
    return { message: "Case not found." };
  }

  if (!(await canAccessCase(existing.ownerId, user))) {
    return { message: "You are not authorized to edit this case." };
  }

  const parsed = CaseUpdateSchema.safeParse({
    patientCode: formData.get("patientCode"),
    resultIssuedAt: formData.get("resultIssuedAt"),
    status: formData.get("status"),
    ownerId: formData.get("ownerId") || existing.ownerId || undefined,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update case.",
    };
  }

  const { patientCode, resultIssuedAt, status, ownerId } = parsed.data;
  const nextOwnerId =
    user.role === "coordinator" ? ownerId || existing.ownerId : existing.ownerId;

  const changes: string[] = [];
  if (patientCode !== existing.patientCode) {
    changes.push(`patient code → ${patientCode}`);
  }
  if (status !== existing.status) {
    changes.push(`status → ${status}`);
  }
  if (nextOwnerId !== existing.ownerId) {
    changes.push("owner reassigned");
  }

  try {
    await prisma.$transaction([
      prisma.case.update({
        where: { id: caseId },
        data: {
          patientCode,
          resultIssuedAt: new Date(resultIssuedAt),
          status: status as CaseStatus,
          ownerId: nextOwnerId || null,
        },
      }),
      prisma.timelineEvent.create({
        data: {
          caseId,
          type: "case_updated",
          message:
            changes.length > 0
              ? `Case updated: ${changes.join("; ")}.`
              : "Case saved with no field changes.",
          createdById: user.id,
        },
      }),
    ]);
  } catch {
    return { message: "Database Error: Failed to update case." };
  }

  revalidatePath("/cases");
  revalidatePath(`/cases/${caseId}`);
  redirect(`/cases/${caseId}`);
}

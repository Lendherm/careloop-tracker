"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  ProfileFormState,
  ProfileUpdateSchema,
} from "@/lib/profile-schemas";
import { prisma } from "@/lib/prisma";

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "You must be signed in to update your profile." };
  }

  const parsed = ProfileUpdateSchema.safeParse({
    name: formData.get("name"),
    org: formData.get("org") || undefined,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update profile.",
    };
  }

  const { name, org } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        org: org || null,
      },
    });
  } catch {
    return { message: "Database Error: Failed to update profile." };
  }

  revalidatePath("/profile");
  revalidatePath("/");

  return {
    message: null,
    success: "Profile updated. Sign out and back in to refresh the header name.",
  };
}

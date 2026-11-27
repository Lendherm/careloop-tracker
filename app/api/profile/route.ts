import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { jsonError, zodFieldErrors } from "@/lib/http";
import { getProfile, updateProfile } from "@/lib/profile";
import type { ProfileDTO } from "@/lib/types";
import { profileUpdateSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();
  if (!session?.user) return jsonError("Not signed in", 401);

  const profile = await getProfile(session.user.id);
  if (!profile) return jsonError("Profile not found", 404);

  return NextResponse.json<ProfileDTO>(profile);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return jsonError("Not signed in", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON", 400);
  }

  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, zodFieldErrors(parsed.error));
  }

  const profile = await updateProfile(session.user.id, parsed.data);
  if (!profile) return jsonError("Profile not found", 404);

  return NextResponse.json<ProfileDTO>(profile);
}

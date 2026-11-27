import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { getActiveUser, type SessionUser } from "@/lib/session";
import type { ServiceResult } from "@/lib/serviceResult";
import type { ApiError } from "@/lib/types";
import { fieldErrorsFrom } from "@/lib/validation";

export interface IdContext {
  params: Promise<{ id: string }>;
}

export function errorResponse(
  status: number,
  error: string,
  fieldErrors?: Record<string, string>
): NextResponse<ApiError> {
  const body: ApiError = fieldErrors ? { error, fieldErrors } : { error };
  return NextResponse.json(body, { status });
}

export function toResponse<T>(result: ServiceResult<T>, successStatus = 200): NextResponse {
  if (!result.ok) return errorResponse(result.status, result.error, result.fieldErrors);
  return NextResponse.json(result.data, { status: successStatus });
}

// Every handler starts here. Returns the user, or a ready-made 401/403 response.
export async function authenticate(
  options: { roles?: Role[]; allowPasswordChange?: boolean } = {}
): Promise<{ user: SessionUser } | { response: NextResponse<ApiError> }> {
  const user = await getActiveUser();
  if (!user) return { response: errorResponse(401, "Sign in to continue.") };
  if (user.mustChangePassword && !options.allowPasswordChange) {
    return { response: errorResponse(403, "Choose a new password before continuing.") };
  }
  if (options.roles && !options.roles.includes(user.role)) {
    return { response: errorResponse(403, "You do not have permission to do that.") };
  }
  return { user };
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Anything with a zod-style safeParse works, so this does not depend on the zod version.
interface Parser<T> {
  safeParse(input: unknown):
    | { success: true; data: T }
    | {
        success: false;
        error: { issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }> };
      };
}

export function parseBody<T>(
  schema: Parser<T>,
  body: unknown
): { data: T } | { response: NextResponse<ApiError> } {
  const parsed = schema.safeParse(body);
  if (parsed.success) return { data: parsed.data };
  return {
    response: errorResponse(400, "Please check the form.", fieldErrorsFrom(parsed.error.issues)),
  };
}

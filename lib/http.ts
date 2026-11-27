import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import type { ApiError } from "@/lib/types";

export function jsonError(
  error: string,
  status: number,
  fieldErrors?: Record<string, string>
) {
  const body: ApiError = fieldErrors ? { error, fieldErrors } : { error };
  return NextResponse.json<ApiError>(body, { status });
}

/** Collapse Zod issues into { fieldName: firstMessage }. */
export function zodFieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

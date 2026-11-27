import { NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { errorResponse, parseBody, readJson } from "@/lib/apiResponse";
import { explainFailedLogin } from "@/lib/userService";
import type { LoginResponse } from "@/lib/types";
import { loginSchema } from "@/lib/validation";

// POST /api/login  { email, password }
// Wraps Auth.js sign-in so the form can show a clear message: wrong password,
// locked, or waiting for approval. Wrong attempts are counted inside auth.ts.
export async function POST(request: Request) {
  const parsed = parseBody(loginSchema, await readJson(request));
  if ("response" in parsed) return parsed.response;

  const { email, password } = parsed.data;

  try {
    const result: unknown = await signIn("credentials", { email, password, redirect: false });
    // Some Auth.js versions return an error URL instead of throwing.
    if (typeof result === "string" && result.includes("error=")) {
      const failure = await explainFailedLogin(email, password);
      return errorResponse(failure.status, failure.message);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      const failure = await explainFailedLogin(email, password);
      return errorResponse(failure.status, failure.message);
    }
    throw error;
  }

  const body: LoginResponse = { redirectTo: "/cases" };
  return NextResponse.json(body);
}

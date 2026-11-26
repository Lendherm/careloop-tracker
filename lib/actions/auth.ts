"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import {
  AuthFormState,
  LoginSchema,
  RegisterSchema,
} from "@/lib/auth-schemas";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/types";

export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    org: formData.get("org") || undefined,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to register.",
    };
  }

  const { name, email, password, role, org } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return {
      errors: { email: ["An account with this email already exists."] },
      message: "Could not create account.",
    };
  }

  const passwordHash = await hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: role as Role,
        org: org || null,
      },
    });
  } catch {
    return { message: "Database Error: Failed to create account." };
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: "/cases",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Account created, but sign-in failed. Try logging in." };
    }
    throw error;
  }

  return { message: null };
}

export async function authenticate(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to sign in.",
    };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo: "/cases",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password." };
    }
    throw error;
  }

  return { message: null };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

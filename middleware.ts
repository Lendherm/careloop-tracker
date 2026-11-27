import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe: uses only the config without Prisma/bcrypt.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

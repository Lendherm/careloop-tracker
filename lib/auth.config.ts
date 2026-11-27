import type { NextAuthConfig } from "next-auth";
import { isRole } from "@/lib/roles";

/**
 * Edge-safe half of the Auth.js config (no Prisma, no bcrypt).
 * The proxy imports this; auth.ts adds the Credentials provider.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const publicPaths = [
        "/",
        "/login",
        "/register",
        "/api/login",
        "/api/register",
      ];
      if (publicPaths.includes(nextUrl.pathname)) return true;
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        if (typeof user.id === "string") token.id = user.id;
        if (isRole(user.role)) token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === "string") session.user.id = token.id;
      if (isRole(token.role)) session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;

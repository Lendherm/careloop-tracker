import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/roles";
import {
  DUMMY_HASH,
  clearFailedLogins,
  lockMinutesLeft,
  registerFailedLogin,
} from "@/lib/loginThrottle";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      // Every sign-in attempt passes through here, including direct calls to
      // /api/auth, so the lockout is counted here and nowhere else.
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user) {
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        // A locked account rejects everyone, even with the right password.
        if (lockMinutesLeft(user.lockedUntil) > 0) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          await registerFailedLogin(user.id);
          return null;
        }

        await clearFailedLogins(user.id);

        // Only approved accounts with a granted role can ever sign in.
        if (user.status !== "active" || !user.role) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    // The session carries only the user id. Role and status are read from the
    // database on each request (see getActiveUser), so a demoted or removed user
    // loses access immediately instead of when their token expires.
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (isRole(token.role)) session.user.role = token.role;
      return session;
    },
  },
});

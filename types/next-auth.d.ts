import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role: Role;
    org?: string | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      org?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    org?: string | null;
  }
}

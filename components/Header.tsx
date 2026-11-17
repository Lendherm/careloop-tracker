import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";
import NavLinks from "@/components/NavLinks";

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-teal-900/10 bg-[#0F6B6B] text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          CareLoop Tracker
        </Link>
        <NavLinks isLoggedIn={!!session?.user} />
        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="text-white/90">
                {session.user.name} · {session.user.role}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-white/15 px-3 py-1.5 font-medium hover:bg-white/25"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#E07A5F] px-3 py-1.5 font-medium text-white hover:bg-[#d56c52]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

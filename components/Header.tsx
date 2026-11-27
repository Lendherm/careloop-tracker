import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { getNavItems } from "@/lib/navigation";
import NavLinks from "@/components/NavLinks";

export default async function Header() {
  const session = await auth();
  const items = session?.user ? getNavItems(session.user.role) : [];

  return (
    <header className="bg-primary text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href={session?.user ? "/cases" : "/"}
          className="text-lg font-semibold"
        >
          CareLoop Tracker
        </Link>

        {session?.user ? (
          <div className="flex items-center gap-4">
            <NavLinks items={items} />
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded border border-white/40 px-3 py-1.5 text-sm font-medium hover:bg-white/10"
              >
                Log out
              </button>
            </form>
          </div>
        ) : (
          <nav
            aria-label="Account"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Link
              href="/login"
              className="rounded px-3 py-1.5 hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded bg-white px-3 py-1.5 text-primary"
            >
              Register
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

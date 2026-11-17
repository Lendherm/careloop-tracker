import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function CasesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-[#1F2933]">Cases</h1>
        <Link
          href="/cases/new"
          className="rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5a5a]"
        >
          Create case
        </Link>
      </div>
      <p className="text-[#6B7280]">
        Auth is ready for {session.user.name}. Case list/detail UI is owned by
        Rebeca&apos;s feature branch; this page is a protected placeholder so
        login redirects have a landing target.
      </p>
    </main>
  );
}

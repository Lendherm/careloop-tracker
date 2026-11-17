import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F6B6B]">
        CareLoop Tracker
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-[#1F2933]">
        Follow every screening result until treatment or closure.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#6B7280]">
        Each case has one named owner. Coordinators chase overdue, rejected, and
        unassigned work across the care loop.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-md bg-[#0F6B6B] px-5 py-2.5 font-medium text-white hover:bg-[#0c5a5a]"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 bg-white px-5 py-2.5 font-medium text-[#1F2933] hover:bg-slate-50"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}

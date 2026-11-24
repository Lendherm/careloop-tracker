import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listAccessibleCases } from "@/lib/cases-db";
import {
  CASE_STATUS_LABELS,
  ROLE_LABELS,
  formatDate,
} from "@/lib/labels";
import type { CaseStatus, Role } from "@/lib/types";

export default async function CasesPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    redirect("/login");
  }

  const user = {
    id: session.user.id,
    role: session.user.role as Role,
  };
  const cases = await listAccessibleCases(user);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2933]">Cases</h1>
          <p className="mt-1 text-[#6B7280]">
            {user.role === "coordinator"
              ? "All cases across the pathway."
              : "Cases you own."}
          </p>
        </div>
        <Link
          href="/cases/new"
          className="rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5a5a]"
        >
          Create case
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium text-[#1F2933]">No cases yet</p>
          <p className="mt-2 text-sm text-[#6B7280]">
            Create a case from a screening result to start tracking follow-up.
          </p>
          <Link
            href="/cases/new"
            className="mt-6 inline-flex rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5a5a]"
          >
            Create first case
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {cases.map((item) => (
            <li key={item.id}>
              <Link
                href={`/cases/${item.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-[#0F6B6B]/40 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1F2933]">
                      {item.patientCode}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Owner: {item.owner?.name ?? "Unassigned"}
                      {item.owner
                        ? ` · ${ROLE_LABELS[item.owner.role as Role]}`
                        : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-[#0F6B6B]">
                    {CASE_STATUS_LABELS[item.status as CaseStatus]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#6B7280]">
                  Result issued {formatDate(item.resultIssuedAt)} ·{" "}
                  {item._count.timeline} timeline · {item._count.referrals}{" "}
                  referrals
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

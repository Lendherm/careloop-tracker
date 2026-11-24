import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessCase, getCaseDetail } from "@/lib/cases-db";
import {
  CASE_STATUS_LABELS,
  REFERRAL_STATUS_LABELS,
  ROLE_LABELS,
  formatDate,
} from "@/lib/labels";
import type { CaseStatus, ReferralStatus, Role } from "@/lib/types";

export default async function CaseDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    redirect("/login");
  }

  const { id } = await props.params;
  const caseItem = await getCaseDetail(id);
  if (!caseItem) {
    notFound();
  }

  const user = {
    id: session.user.id,
    role: session.user.role as Role,
  };

  if (!(await canAccessCase(caseItem.ownerId, user))) {
    redirect("/cases");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#6B7280]">Case detail</p>
          <h1 className="text-3xl font-bold text-[#1F2933]">
            {caseItem.patientCode}
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Result issued {formatDate(caseItem.resultIssuedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/cases"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-[#1F2933] hover:bg-slate-50"
          >
            Back
          </Link>
          <Link
            href={`/cases/${caseItem.id}/edit`}
            className="rounded-md bg-[#0F6B6B] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0c5a5a]"
          >
            Edit case
          </Link>
        </div>
      </div>

      <section className="mb-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium text-[#6B7280]">Status</h2>
          <p className="mt-1 text-lg text-[#1F2933]">
            {CASE_STATUS_LABELS[caseItem.status as CaseStatus]}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-[#6B7280]">Owner</h2>
          <p className="mt-1 text-lg text-[#1F2933]">
            {caseItem.owner
              ? `${caseItem.owner.name} (${ROLE_LABELS[caseItem.owner.role as Role]})`
              : "Unassigned"}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#1F2933]">Timeline</h2>
        {caseItem.timeline.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-[#6B7280]">
            No timeline events yet.
          </p>
        ) : (
          <ol className="space-y-3">
            {caseItem.timeline.map((event) => (
              <li
                key={event.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="text-sm font-medium text-[#1F2933]">
                  {event.message}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  {event.type} · {formatDate(event.createdAt)}
                  {event.createdBy ? ` · ${event.createdBy.name}` : ""}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-[#1F2933]">Referrals</h2>
        {caseItem.referrals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-[#6B7280]">
            No referrals on this case yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {caseItem.referrals.map((referral) => (
              <li
                key={referral.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="text-sm font-medium text-[#1F2933]">
                  {referral.fromUser.name} → {referral.toUser.name}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  {
                    REFERRAL_STATUS_LABELS[
                      referral.status as ReferralStatus
                    ]
                  }{" "}
                  · {formatDate(referral.createdAt)}
                </p>
                {referral.notes ? (
                  <p className="mt-2 text-sm text-[#6B7280]">{referral.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

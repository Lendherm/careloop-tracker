import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/current-user";
import { getCaseById } from "@/lib/cases";
import  { formatDate } from "@/lib/case-format";
import CaseStatusBadge from "@/components/CaseStatusBadge";

export default async function CaseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireUser();
    const { id } = await params;
    const caseDetail = await getCaseById(id);

    if (!caseDetail) {
        notFound();
    }

    return (
        <main className="mx-auto mac-w-5xl px-4 py-10">
            <Link href="/cases" className="text-sm font-semibold text-[#0F6B6B] underline undeline-offset-2">
            ← Back to cases
            </Link>

            <div className="mt-4 mb-6 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-[#1F2933]">Case {caseDetail.patientCode}</h1>
                <CaseStatusBadge status={caseDetail.status} />
            </div>

            <section aria-labelledby="details-heading" className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <h2 id="details-heading" className="mb-4 text-xl font-bold text-[#1F2933]">Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-[#6B7280]">Result issued</dt>
                        <dd className="font-semibold text-[#1F2933]">{formatDate(caseDetail.resultIssuedAt)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-[#6B7280]">Owner</dt>
                        <dd className="font-semibold text-[#1F2933]">{caseDetail.ownerName ?? 'Unassigned'}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-[#6B7280]">Opened</dt>
                        <dd className="font-semibold text-[#1F2933]">{formatDate(caseDetail.createdAt)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-[#6B7280]">Last Updated</dt>
                        <dd className="font-semibold text-[#1F2933]">{formatDate(caseDetail.updatedAt)}</dd>
                    </div>
                    {caseDetail.closureNote && (
                        <div className="sm:col-span-2">
                            <dt className="text-sm text-[#6B7280]">Closure Note</dt>
                            <dd className="text-[#1F2933]">
                                {caseDetail.closureNote}
                                {caseDetail.closedByName && ` (closed by {caseDetail.closdebyName})`}
                            </dd>
                        </div>
                    )}
                </div>
            </section>

            <section aria-labelledby="refferals-heading" className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <h2 id="referrals-heading" className="mb-4 text-xl font-bold text-[#1F2933]">Referrals</h2>
                {caseDetail.referrals.length === 0 ? (
                    <p className="text-[#6B7280]">No referrals yet</p>
                ) : (
                    <ul className="space-y-3">
                        {caseDetail.referrals.map((r) => (
                            <li key={r.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                                <p className="font-semibold text-[#1F2933]">
                                    {r.fromName} → {r.toName}
                                    <span className="ml-2 text-sm font-normal capitalize text-[#6B7280]">({r.status})</span>
                                </p>
                                {r.notes && <p className="text-[#1F2933]">{r.notes}</p>}
                                <p className="text-sm text-[#6B7280]">{formatDate(r.createdAt)}</p>
                            </li>
                        ))}
                    </ul>
                )} 
            </section>

            <section aria-labelledby="timeline-heading" className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 id="timeline-heading" className="mb-4 text-xl font-bold text-[#1F2933]">Timeline</h2>
                {caseDetail.timeline.map((event) => (
                    <li key={event.id}>
                        <p className="font-semibold text-[#1F2933]">{event.message}</p>
                        <p className="text-sm text-[#6B7280]">
                            {formatDate(event.createdAt)}
                            {event.createdByName && ` . ${event.createdByName}`}
                        </p>
                    </li>
                ))}
            </section>
        </main>
    );
}
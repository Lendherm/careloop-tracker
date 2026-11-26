import Link from "next/link";
import { requireUser } from "@/lib/current-user";
import { getCases } from "@/lib/cases";
import { formatDate } from "@/lib/case-format";
import CaseStatusBadge from "@/components/CaseStatusBadge";

export default async function CasePage() {
  const user = await requireUser();
  const cases = await getCases();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl  font-bold text-[#1F2933]">Cases</h1>
          <p className="text-[#6B7280]">Signed in as {user.name}</p>
        </div>
        <Link 
          href="/cases/new"
          className="rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5a5a]"
          >
            Create case
          </Link>
      </div>

      {cases.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-[#1F2933]">No cases yet.</p>
          <p className="mt-1 text-[#6B7280]">Create the first case to start tracking follow-up.</p>
        </div>
      ): (
        <div className="over-flow-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left">
            <caption className="sr-only">All screening follow-up cases</caption>
            <thead className="bg-[#F7FAFC] text-sm text-[#1F2933]">
              <tr>
                <th scope="col" className="px-4 py-3">Patient Code</th>
                <th scope="col" className="px-4 py-3">Result Issued</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Owner</th>
                <th scope="col" className="px-4 py-3">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <Link
                      href={`/cases/${c.id}`}
                      className="font-semibold text-[#0F6B6B] underline underline-offset-2"
                      >
                        {c.patientCode}
                      </Link>
                  </td>
                  <td className="px-4 py-3 text-[#1F2933]">{formatDate(c.resultIssuedAt)}</td>
                  <td className="px-4 py-3"><CaseStatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-[#1F2933]">{c.ownerName ?? 'Unassigned'}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{formatDate(c.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
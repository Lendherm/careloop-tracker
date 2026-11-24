import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateCase } from "@/lib/actions/cases";
import {
  canAccessCase,
  getCaseDetail,
  listAssignableOwners,
} from "@/lib/cases-db";
import { formatDateInput } from "@/lib/labels";
import CaseForm from "@/components/CaseForm";
import type { CaseStatus, Role } from "@/lib/types";

export default async function EditCasePage(props: {
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

  const owners = await listAssignableOwners();
  const updateCaseWithId = updateCase.bind(null, id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2933]">Edit case</h1>
          <p className="mt-1 text-[#6B7280]">
            Update pathway fields. Changes are written to the timeline.
          </p>
        </div>
        <Link
          href={`/cases/${id}`}
          className="text-sm font-medium text-[#0F6B6B] hover:underline"
        >
          Back to detail
        </Link>
      </div>
      <CaseForm
        action={updateCaseWithId}
        owners={owners.map((owner) => ({
          id: owner.id,
          name: owner.name,
          role: owner.role as Role,
        }))}
        currentUserId={session.user.id}
        canAssignOwner={user.role === "coordinator"}
        submitLabel="Save changes"
        showStatus
        defaultValues={{
          patientCode: caseItem.patientCode,
          resultIssuedAt: formatDateInput(caseItem.resultIssuedAt),
          ownerId: caseItem.ownerId,
          status: caseItem.status as CaseStatus,
        }}
      />
    </main>
  );
}

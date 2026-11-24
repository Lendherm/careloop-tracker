import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createCase } from "@/lib/actions/cases";
import { listAssignableOwners } from "@/lib/cases-db";
import CaseForm from "@/components/CaseForm";
import type { Role } from "@/lib/types";

export default async function NewCasePage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    redirect("/login");
  }

  const owners = await listAssignableOwners();
  const role = session.user.role as Role;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2933]">Create case</h1>
          <p className="mt-1 text-[#6B7280]">
            Capture a screening result and assign an owner. An initial timeline
            event is recorded automatically.
          </p>
        </div>
        <Link
          href="/cases"
          className="text-sm font-medium text-[#0F6B6B] hover:underline"
        >
          Back to cases
        </Link>
      </div>
      <CaseForm
        action={createCase}
        owners={owners.map((owner) => ({
          id: owner.id,
          name: owner.name,
          role: owner.role as Role,
        }))}
        currentUserId={session.user.id}
        canAssignOwner={role === "coordinator"}
        submitLabel="Create case"
      />
    </main>
  );
}

"use client";

import { useActionState } from "react";
import type { CaseFormState } from "@/lib/case-schemas";
import { CASE_STATUS_LABELS, ROLE_LABELS } from "@/lib/labels";
import type { CaseStatus, Role } from "@/lib/types";

const initialState: CaseFormState = { message: null, errors: {} };

type OwnerOption = {
  id: string;
  name: string;
  role: Role;
};

type CaseFormProps = {
  action: (prevState: CaseFormState, formData: FormData) => Promise<CaseFormState>;
  owners: OwnerOption[];
  currentUserId: string;
  canAssignOwner: boolean;
  submitLabel: string;
  defaultValues?: {
    patientCode?: string;
    resultIssuedAt?: string;
    ownerId?: string | null;
    status?: CaseStatus;
  };
  showStatus?: boolean;
};

export default function CaseForm({
  action,
  owners,
  currentUserId,
  canAssignOwner,
  submitLabel,
  defaultValues,
  showStatus = false,
}: CaseFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="patientCode"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Patient code / reference
        </label>
        <input
          id="patientCode"
          name="patientCode"
          type="text"
          required
          minLength={2}
          defaultValue={defaultValues?.patientCode ?? ""}
          aria-describedby="patientCode-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        />
        <div id="patientCode-error" aria-live="polite" aria-atomic="true">
          {state.errors?.patientCode?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="resultIssuedAt"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Screening result date
        </label>
        <input
          id="resultIssuedAt"
          name="resultIssuedAt"
          type="date"
          required
          defaultValue={defaultValues?.resultIssuedAt ?? today}
          aria-describedby="resultIssuedAt-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        />
        <div id="resultIssuedAt-error" aria-live="polite" aria-atomic="true">
          {state.errors?.resultIssuedAt?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      {showStatus ? (
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-[#1F2933]"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "open"}
            aria-describedby="status-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
          >
            {(Object.keys(CASE_STATUS_LABELS) as CaseStatus[]).map((status) => (
              <option key={status} value={status}>
                {CASE_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="ownerId"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Case owner
        </label>
        {canAssignOwner ? (
          <select
            id="ownerId"
            name="ownerId"
            defaultValue={defaultValues?.ownerId ?? currentUserId}
            aria-describedby="ownerId-error"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
          >
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({ROLE_LABELS[owner.role]})
              </option>
            ))}
          </select>
        ) : (
          <>
            <input type="hidden" name="ownerId" value={currentUserId} />
            <input
              id="ownerId"
              type="text"
              disabled
              value={
                owners.find((owner) => owner.id === currentUserId)?.name ??
                "You"
              }
              className="block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-[#6B7280]"
            />
          </>
        )}
        <div id="ownerId-error" aria-live="polite" aria-atomic="true">
          {state.errors?.ownerId?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c5a5a] disabled:opacity-60"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

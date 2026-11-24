"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import type { ProfileFormState } from "@/lib/profile-schemas";
import { ROLE_LABELS } from "@/lib/labels";
import type { Role } from "@/lib/types";

const initialState: ProfileFormState = {
  message: null,
  errors: {},
  success: null,
};

type ProfileFormProps = {
  name: string;
  email: string;
  role: Role;
  org?: string | null;
};

export default function ProfileForm({
  name,
  email,
  role,
  org,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          defaultValue={name}
          aria-describedby="name-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-[#6B7280]"
        />
        <p className="mt-1 text-xs text-[#6B7280]">
          Email is used for sign-in and cannot be changed here.
        </p>
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Role
        </label>
        <input
          id="role"
          type="text"
          value={ROLE_LABELS[role]}
          disabled
          className="block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-[#6B7280]"
        />
      </div>

      <div>
        <label
          htmlFor="org"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Organization / contact
        </label>
        <input
          id="org"
          name="org"
          type="text"
          defaultValue={org ?? ""}
          aria-describedby="org-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        />
        <div id="org-error" aria-live="polite" aria-atomic="true">
          {state.errors?.org?.map((error) => (
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
      {state.success ? (
        <p className="text-sm text-emerald-700" role="status">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c5a5a] disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

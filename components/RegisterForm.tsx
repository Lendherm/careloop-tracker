"use client";

import Link from "next/link";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FormError";
import { SelectField } from "@/components/SelectField";
import { buttonPrimary, linkClass, subheadingClass } from "@/components/styles";
import { ROLES, ROLE_LABELS } from "@/lib/roles";
import type { MessageResponse } from "@/lib/types";
import { formToObject, useApiForm } from "@/lib/useApiForm";

const ROLE_OPTIONS = [
  { value: "", label: "Choose a role" },
  ...ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
];

export function RegisterForm() {
  const { submit, pending, error, fieldErrors, success } = useApiForm<MessageResponse>({
    url: "/api/register",
    refresh: false,
  });

  if (success) {
    return (
      <div role="status">
        <h2 className={subheadingClass}>Request received</h2>
        <p className="mt-2 text-ink">
          Your account has been created. A coordinator needs to approve it before you can sign in.
        </p>
        <Link href="/login" className={`${linkClass} mt-4 inline-block`}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit(formToObject(event.currentTarget));
      }}
      className="mt-5 space-y-4"
    >
      <Field label="Full name" name="name" autoComplete="name" required error={fieldErrors.name} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={fieldErrors.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={10}
        hint="At least 10 characters."
        required
        error={fieldErrors.password}
      />
      <SelectField
        label="Role you are requesting"
        name="requestedRole"
        defaultValue=""
        options={ROLE_OPTIONS}
        required
        error={fieldErrors.requestedRole}
      />
      <Field label="Clinic, lab or hospital (optional)" name="org" error={fieldErrors.org} />

      <FormError message={error && Object.keys(fieldErrors).length === 0 ? error : null} />

      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
        {pending ? "Sending request..." : "Request account"}
      </button>
    </form>
  );
}

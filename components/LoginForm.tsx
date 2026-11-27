"use client";

import { useRouter } from "next/navigation";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FormError";
import { buttonPrimary } from "@/components/styles";
import type { LoginResponse } from "@/lib/types";
import { formToObject, useApiForm } from "@/lib/useApiForm";

export function LoginForm() {
  const router = useRouter();
  const { submit, pending, error } = useApiForm<LoginResponse>({
    url: "/api/login",
    refresh: false,
    onSuccess: (data) => {
      router.push(data.redirectTo);
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit(formToObject(event.currentTarget));
      }}
      className="mt-5 space-y-4"
    >
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      <FormError message={error} />

      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

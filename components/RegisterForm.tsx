"use client";

import { useActionState } from "react";
import { register } from "@/lib/actions/auth";
import type { AuthFormState } from "@/lib/auth-schemas";

const initialState: AuthFormState = { message: null, errors: {} };

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

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
          name="email"
          type="email"
          required
          aria-describedby="email-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state.errors?.email?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          aria-describedby="password-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        />
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {state.errors?.password?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="clinician"
          aria-describedby="role-error"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[#0F6B6B] focus:ring-2"
        >
          <option value="clinician">Clinician</option>
          <option value="coordinator">Coordinator</option>
          <option value="lab_staff">Lab staff</option>
        </select>
        <div id="role-error" aria-live="polite" aria-atomic="true">
          {state.errors?.role?.map((error) => (
            <p key={error} className="mt-1 text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="org"
          className="mb-2 block text-sm font-medium text-[#1F2933]"
        >
          Organization (optional)
        </label>
        <input
          id="org"
          name="org"
          type="text"
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

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-[#0F6B6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c5a5a] disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

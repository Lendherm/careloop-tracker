"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ApiError, ProfileDTO } from "@/lib/types";

interface ProfileFormProps {
  profile: ProfileDTO;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [org, setOrg] = useState(profile.org ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    setFormError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Empty org clears it (server maps ""/null to null).
        body: JSON.stringify({ name, org: org.trim() === "" ? null : org }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiError;
        setFieldErrors(body.fieldErrors ?? {});
        setFormError(body.fieldErrors ? null : body.error);
        return;
      }

      setSaved(true);
      router.refresh(); // re-render server components with the new data
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded border border-black/20 bg-white px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className={inputClass}
        />
        {fieldErrors.name && (
          <p id="name-error" className="mt-1 text-sm text-accent">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="org" className="text-sm font-medium text-ink">
          Organisation / clinic <span className="text-muted">(optional)</span>
        </label>
        <input
          id="org"
          name="org"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          aria-invalid={fieldErrors.org ? true : undefined}
          aria-describedby={fieldErrors.org ? "org-error" : undefined}
          className={inputClass}
        />
        {fieldErrors.org && (
          <p id="org-error" className="mt-1 text-sm text-accent">
            {fieldErrors.org}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-sm text-accent">
          {formError}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm text-primary">
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-primary px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

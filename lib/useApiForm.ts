"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ApiError } from "@/lib/types";

interface UseApiFormConfig<TData> {
  url: string;
  method?: "POST" | "PATCH";
  // Re-run the server components after a successful save (default true).
  refresh?: boolean;
  onSuccess?: (data: TData) => void;
}

export function formToObject(form: HTMLFormElement): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (typeof value === "string") result[key] = value;
  }
  return result;
}

function readApiError(payload: unknown): ApiError {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    const fieldErrors =
      "fieldErrors" in payload && typeof payload.fieldErrors === "object" && payload.fieldErrors
        ? (payload.fieldErrors as Record<string, string>)
        : undefined;
    return { error: payload.error, fieldErrors };
  }
  return { error: "Something went wrong. Please try again." };
}

// Sends a JSON body to one of the API route handlers and tracks the outcome.
export function useApiForm<TData = unknown>(config: UseApiFormConfig<TData>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  async function submit(body: unknown): Promise<TData | null> {
    setPending(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const response = await fetch(config.url, {
        method: config.method ?? "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const failure = readApiError(payload);
        setError(failure.error);
        setFieldErrors(failure.fieldErrors ?? {});
        return null;
      }

      const data = payload as TData;
      setSuccess(true);
      config.onSuccess?.(data);
      if (config.refresh !== false) router.refresh();
      return data;
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      return null;
    } finally {
      setPending(false);
    }
  }

  return { submit, pending, error, fieldErrors, success };
}

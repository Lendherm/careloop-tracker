import type { InputHTMLAttributes } from "react";
import { inputClass } from "@/components/styles";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Field({ label, error, hint, id, ...props }: FieldProps) {
  const inputId = id ?? props.name;
  const describedBy =
    [hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${inputId}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClass}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-accent-ink">
          {error}
        </p>
      )}
    </div>
  );
}

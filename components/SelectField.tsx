import type { SelectHTMLAttributes } from "react";
import { inputClass } from "@/components/styles";
import type { Option } from "@/lib/types";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export function SelectField({ label, options, error, id, ...props }: SelectFieldProps) {
  const selectId = id ?? props.name;

  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={inputClass}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-accent-ink">
          {error}
        </p>
      )}
    </div>
  );
}

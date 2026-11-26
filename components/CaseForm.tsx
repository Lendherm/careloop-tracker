'use client';

import Link from "next/link";
import { useActionState } from "react";
import { createCase, type CaseFormState } from "@/lib/actions/cases";

const initialState: CaseFormState = { message: null, errors: {} };

const inputClass = 
    'w-full rounded-md border border-[#6B7280] bg-white px-3 py-2 text-[#1F2933] focus:border-[#0F6B6B] focus:outline-none focus:ring-2 focus:ring-[#0F6B6B]';

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
    return (
        <div id={id} aria-live="polite" aria-atomic="true">
            {errors?.map((error => (
                <p key={error} className="mt-1 text-sm text-red-700">
                    {error}
                </p>
            )))}
        </div>
    );
}

export default function CaseForm() {
    const [state, formAction, isPending] = useActionState(createCase, initialState);
    const values = state.values ?? { patientCode: '', resultIssuedAt: ''};
    const errors = state.errors ?? {};

    return (
        <form action={formAction} className="max-w-lg space-y-5" noValidate>
            <div>
                <label htmlFor="patientCode" className="mb-1 block font-semibold text-[#1F2933]">
                    Patient Code
                </label>
                <p id="patientCode-hint" className="mb-1 text-sm text-[#6B7280]">
                    Use the screening ID (for example, SCR-1001), not the patient&apos;s name.
                </p>
                <input
                    id="patientCode"
                    name="patientCode"
                    type="text"
                    autoComplete="off"
                    defaultValue={values.patientCode}
                    aria-describedby="patientCode-hint patientCode-error"
                    aria-invalid={Boolean(errors.patientCode)}
                    className={inputClass}
                />
                <FieldErrors id="patientCode-error" errors={errors.patientCode} />
            </div>

            <div>
                <label htmlFor="resultIssuedAt" className="mb-1 block font-semibold text-[#1F2933]">
                    Result issued on
                </label>
                <input 
                    id="resultIssuedAt"
                    name="resultIssuedAt"
                    type="date"
                    defaultValue={values.resultIssuedAt}
                    aria-describedby="resultIssuedAt-error"
                    aria-invalid={Boolean(errors.resultIssuedAt)}
                    className={inputClass}
                />
                <FieldErrors id="resultIssuedAt-error" errors={errors.resultIssuedAt} />
            </div>

            <div aria-live="polite" aria-atomic="true">
                {state.message ? <p className="font-semibold text-red-700">{state.message}</p> : null}
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-[#0F6B6B] px-5 py-2 font-semibold text-white hover:bg-[#0c5a5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B6B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? 'Saving...' : 'Create case'}
                </button>
                <Link 
                    href="/cases"
                    className="rounded-md border border-[#0F6B6B] px-5 py-2 font-semibold text-[#0F6B6B] hover:bg-[#E6F2F2]"
                    >
                        Cancel
                    </Link>
            </div>
        </form>
    );
}
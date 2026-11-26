'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/current-user";
import { createCaseRecord } from "@/lib/cases";

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

const CaseFormSchema = z.object({
    patientCode: z
        .string()
        .trim()
        .min(3, 'Patient code must be at least 3 characters.')
        .max(32, 'Patient code must be 32 characters or fewer.')
        .regex(/^[A-Za-z0-9-]+$/, 'Use only letters, numbers, and dashes.'),
    resultIssuedAt: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose the date the result was issued.')
        .refine((value) => value <= today(), 'The result date cannot be in the future.')
});

export type CaseFormValues = {
    patientCode: string;
    resultIssuedAt: string;
};

export type CaseFormState = {
    errors?: Partial<Record<keyof CaseFormValues, string[]>>;
    message?: string | null;
    values?: CaseFormValues;
};

export async function createCase(
    prevState: CaseFormState,
    formData: FormData
): Promise<CaseFormState> {
    const user = await requireUser();

    const values: CaseFormValues = {
        patientCode: String(formData.get('patientCode') ?? ''),
        resultIssuedAt: String(formData.get('resultIssuedAt') ?? '')
    };

    const validated = CaseFormSchema.safeParse(values);

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: 'Please fix the errors below.',
            values,
        };
    }

    let newCaseId: string;
    try {
        newCaseId = await createCaseRecord({
            patientCode: validated.data.patientCode.toUpperCase(),
            resultIssuedAt: new Date(`${validated.data.resultIssuedAt}T00:00:00Z`),
            ownerId: user.id,
        });
    } catch (error) {
        console.error('DAtabase error while creating case: ', error);
        return { message: 'Could not save the case. Please try again later.', values };
    }

    revalidatePath('/cases');
    redirect(`/cases/${newCaseId}`);
}
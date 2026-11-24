import { z } from "zod";

export const CaseCreateSchema = z.object({
  patientCode: z
    .string()
    .trim()
    .min(2, "Patient code must be at least 2 characters.")
    .max(64, "Patient code is too long."),
  resultIssuedAt: z
    .string()
    .min(1, "Result date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid result date.",
    }),
  ownerId: z.string().trim().min(1, "Owner is required."),
});

export const CaseUpdateSchema = z.object({
  patientCode: z
    .string()
    .trim()
    .min(2, "Patient code must be at least 2 characters.")
    .max(64, "Patient code is too long."),
  resultIssuedAt: z
    .string()
    .min(1, "Result date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid result date.",
    }),
  status: z.enum(["open", "in_progress", "referred", "treated", "closed"], {
    error: "Select a valid status.",
  }),
  ownerId: z.string().trim().optional(),
});

export type CaseFormState = {
  errors?: {
    patientCode?: string[];
    resultIssuedAt?: string[];
    ownerId?: string[];
    status?: string[];
  };
  message?: string | null;
};

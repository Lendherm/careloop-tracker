import { z } from "zod";

// ---- Helpers ----

export type FieldErrors = Record<string, string>;

// One message per field, taken from the first problem found.
export function fieldErrorsFrom(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>
): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    result[key] ??= issue.message;
  }
  return result;
}

// Forms send "" for an empty field; treat that as "not provided".
const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max, `Use ${max} characters or fewer`).optional()
  );

// "YYYY-MM-DD" from a date input, kept as UTC midnight.
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .refine((s) => {
    const d = new Date(`${s}T00:00:00.000Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
  }, "Enter a valid date")
  .transform((s) => new Date(`${s}T00:00:00.000Z`));

const pastDate = isoDate.refine((d) => d.getTime() <= Date.now(), "Date cannot be in the future");
const optionalPastDate = z.preprocess(emptyToUndefined, pastDate.optional());

const roleSchema = z.enum(["COORDINATOR", "CLINICIAN", "LAB_STAFF"]);

const newPassword = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(128, "Use 128 characters or fewer");

// ---- Auth and profile ----

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: newPassword,
  requestedRole: roleSchema,
  org: optionalText(120),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  org: optionalText(120),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords do not match",
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ["newPassword"],
    message: "Choose a password different from your current one",
  });

export const forcedPasswordSchema = z
  .object({ newPassword, confirmPassword: z.string() })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords do not match",
  });

export const decideAccountSchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("approve"), role: roleSchema }),
  z.object({ decision: z.literal("reject") }),
]);

// ---- Cases ----

const patientCode = z
  .string()
  .trim()
  .min(1, "Enter the patient reference code")
  .max(60, "Use 60 characters or fewer");

export const createCaseSchema = z
  .object({
    patientCode,
    resultIssuedAt: pastDate,
    patientNotifiedAt: optionalPastDate,
    ownerId: z.string().min(1, "Choose an owner"),
  })
  .refine((c) => !c.patientNotifiedAt || c.patientNotifiedAt >= c.resultIssuedAt, {
    path: ["patientNotifiedAt"],
    message: "Notification cannot be before the result date",
  });

// PATCH sends the full editable state. An empty date or reason clears it,
// and an empty ownerId means unassigned.
export const updateCaseSchema = z.object({
  patientCode,
  patientNotifiedAt: optionalPastDate,
  delayReason: optionalText(500),
  ownerId: z.preprocess((v) => (v === "" ? null : v), z.string().min(1).nullable()),
});

export const closeCaseSchema = z.object({
  closureNote: optionalText(2000),
  signOff: z.boolean(),
});

// ---- Referrals ----

export const createReferralSchema = z.object({
  toUserId: z.string().min(1, "Choose a clinician"),
  notes: optionalText(1000),
});

export const referralActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("accept"), responseNote: optionalText(1000) }),
  z.object({ action: z.literal("reject"), responseNote: optionalText(1000) }),
  z.object({ action: z.literal("cancel") }),
  z.object({
    action: z.literal("update"),
    toUserId: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    notes: optionalText(1000),
  }),
]);

// ---- Inferred input types ----

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForcedPasswordInput = z.infer<typeof forcedPasswordSchema>;
export type DecideAccountInput = z.infer<typeof decideAccountSchema>;
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type CloseCaseInput = z.infer<typeof closeCaseSchema>;
export type CreateReferralInput = z.infer<typeof createReferralSchema>;
export type ReferralActionInput = z.infer<typeof referralActionSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * PATCH /api/profile body.
 * - strictObject rejects unknown keys, so a client can never sneak in `role`
 *   or `email` and escalate privileges through this endpoint.
 * - `org: null` clears the organisation.
 */
export const profileUpdateSchema = z
  .strictObject({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or fewer")
      .optional(),
    org: z
      .string()
      .trim()
      .max(120, "Organisation must be 120 characters or fewer")
      .nullable()
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.org !== undefined, {
    message: "Provide at least one field to update",
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  org: z.string().trim().optional(),
});

export type ProfileFormState = {
  errors?: {
    name?: string[];
    org?: string[];
  };
  message?: string | null;
  success?: string | null;
};

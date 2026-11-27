import type { Role } from "@prisma/client";

/** Profile as sent over the wire (dates are ISO strings). */
export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  org: string | null;
  createdAt: string;
}

/** Standard error body returned by every API route. */
export interface ApiError {
  error: string;
  fieldErrors?: Record<string, string>;
}

export interface Option {
  value: string;
  label: string;
}

export interface MessageResponse {
  message: string;
}

export interface CreatedResponse {
  id: string;
}

export interface LoginResponse {
  redirectTo: string;
}

export interface TempPasswordResponse {
  tempPassword: string;
}

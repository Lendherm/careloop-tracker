import type { CaseStatus, ReferralStatus, Role } from "@/lib/types";

export const ROLE_LABELS: Record<Role, string> = {
  coordinator: "Coordinator",
  clinician: "Clinician",
  lab_staff: "Lab staff",
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  referred: "Referred",
  treated: "Treated",
  closed: "Closed",
};

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDateInput(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

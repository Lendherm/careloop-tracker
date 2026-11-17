export type Role = "coordinator" | "clinician" | "lab_staff";

export type CaseStatus =
  | "open"
  | "in_progress"
  | "referred"
  | "treated"
  | "closed";

export type ReferralStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  org?: string | null;
}

export interface CaseRecord {
  id: string;
  patientCode: string;
  resultIssuedAt: string;
  status: CaseStatus;
  ownerId?: string | null;
  closureNote?: string | null;
  closedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralRecord {
  id: string;
  caseId: string;
  fromUserId: string;
  toUserId: string;
  status: ReferralStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEventRecord {
  id: string;
  caseId: string;
  type: string;
  message: string;
  createdById?: string | null;
  createdAt: string;
}

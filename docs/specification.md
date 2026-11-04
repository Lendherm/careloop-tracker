# CareLoop Tracker

## Project Title & Description

CareLoop Tracker is a web app that follows a screening result from the day it is issued until the patient has been treated or the case is closed. Each case has one named owner, and anything overdue, rejected, or unassigned goes onto a list for the coordinator to chase. It is meant for screening programme coordinators, lab staff, and clinicians who pass patients between clinics and hospitals.

The initial release (MVP) focuses on authentication with roles, case lifecycle tracking, referrals between clinicians, and a coordinator chase queue.

## Purpose & Target Audience

- **Audience:** Screening programme coordinators, lab staff, and clinicians
- **Purpose:** Make ownership of the next clinical step visible so abnormal results are not lost between lab → clinic → hospital handoffs
- **Problem:** When a patient with an abnormal result moves across services, nobody can easily see who owns the next step, so people drop out without anyone noticing

## User Stories

1. As a staff member, I want to create an account and sign in so that I can work in CareLoop with my role (coordinator, clinician, or lab staff).
2. As a lab staff member or clinician, I want to create a case from a screening result so that follow-up ownership is recorded.
3. As a signed-in user, I want to view and update case details and timeline events so that the pathway stays current.
4. As a clinician, I want to send and respond to referrals on a case so that the receiving clinic can accept or reject responsibility.
5. As a coordinator, I want to see overdue, rejected, and unassigned cases so that I can chase gaps quickly.
6. As a clinician or coordinator, I want to close a case only with a note or clinician sign-off so that closures are accountable.
7. As a coordinator, I want a small dashboard of time-to-notification, referral completion, and delay reasons so that I can spot bottlenecks.

## Acceptance Criteria

### Story 1: Sign up / sign in with roles

- Given a new user, when they submit valid registration information and choose a role, then the system creates an account and signs them in.
- Given invalid credentials, when login is attempted, then the system shows an error and does not grant access.
- Given a signed-in user, when they open Profile, then they can view/update basic profile fields and log out.

### Story 2: Create a case

- Given a signed-in lab staff or clinician, when they submit a valid create-case form, then a case is saved with an owner, result date, and initial timeline entry.
- Given missing required fields, when the form is submitted, then validation blocks submission.

### Story 3: View / update / close cases

- Given a signed-in user, when they open Cases, then they can list cases they are allowed to see and open a detail page.
- Given an open case, when an authorized user edits fields, then changes are saved and a timeline event is recorded.
- Given an open case, when a close is requested without a note or clinician sign-off, then the system blocks closure.

### Story 4: Referrals

- Given an open case, when a sender creates a referral, then the receiving clinician can accept or reject it.
- Given a pending referral, when the sender cancels or edits it (before acceptance), then the referral state updates and appears on the case timeline.
- Given a rejected referral, when a coordinator opens the chase queue, then the case appears in the rejected filter.

### Story 5: Coordinator chase queue

- Given a coordinator, when they open the coordinator page, then they see overdue, rejected, and unassigned cases.
- Given active filters, when applied, then the list updates to matching cases or shows an empty state.

### Story 6: Dashboard metrics (MVP-light)

- Given a coordinator, when they open the dashboard, then they see simple summaries for time to notification, referral completion, and delay reasons from available case data.

## Technical Requirements

- Framework: Next.js App Router
- Language: TypeScript in strict mode
- Styling: Tailwind CSS
- Data: PostgreSQL with Prisma ORM (Supabase Postgres acceptable)
- Auth: Auth.js v5 (NextAuth) or Clerk for sign-in/session/roles
- Performance: Server Components by default; Client Components only where interactivity is needed
- Hosting: Vercel
- Quality: ESLint + Prettier; PR reviews required

## Data Models (MVP)

1. **User / Profile** — auth identity, name, role (`coordinator` | `clinician` | `lab_staff`), optional org/clinic
2. **Case** — patient reference/code, result issued date, status, ownerId, closure note/sign-off, timestamps
3. **Referral** — caseId, fromUserId, toUserId, status (`pending` | `accepted` | `rejected` | `cancelled`), notes
4. **TimelineEvent** (supporting) — caseId, type, message, createdBy, createdAt

CRUD coverage:

- Case: Create, Read, Update, Close (soft delete / terminal status)
- Referral: Create, Read, Update (accept/reject/cancel)
- Profile: Read + Update (counts as Update for the user model)

## Core API Endpoints

- `POST /api/auth/[...nextauth]` (or Clerk-managed auth)
- `GET /api/cases`
- `POST /api/cases`
- `GET /api/cases/:id`
- `PATCH /api/cases/:id`
- `POST /api/cases/:id/close`
- `GET /api/cases/:id/referrals`
- `POST /api/cases/:id/referrals`
- `PATCH /api/referrals/:id`
- `GET /api/coordinator/queue?status=overdue|rejected|unassigned`
- `GET /api/dashboard/summary`
- `GET /api/profile`
- `PATCH /api/profile`

## Implementation Priority

- **P0 (MVP):** Auth + roles, create/list/view/update cases, referrals accept/reject, coordinator queue, close-case rule, profile update
- **P1:** Dashboard metrics polish, richer filters, soft-delete/archive UX, email notifications
- **P2:** Audit exports, multi-site admin, advanced analytics, integrations with external EHR/LIS

## Views (minimum 3)

1. Auth / Profile
2. Cases list + case detail
3. Coordinator chase queue (+ optional dashboard widgets)

## Out of Scope for MVP

- Full EHR integration
- Patient-facing portal
- Real-time chat
- Complex workflow engines beyond owner + referral states

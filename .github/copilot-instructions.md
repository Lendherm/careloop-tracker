# CareLoop Tracker — Copilot Instructions

## Project

CareLoop Tracker follows a screening result from issue date until treatment or closure. Each case has one named owner. Coordinators chase overdue, rejected, and unassigned work.

## Team

- Luis Emilio Nathanael De la rosa Meneses (`Lendherm`)
- Rebeca Arredondo (`rarredondo9`)
- Chawanangwa Gondwe (`Chagon-Nehe`)

## Stack (locked)

- Next.js App Router + TypeScript (strict)
- Tailwind CSS for styling
- PostgreSQL + Prisma ORM
- Auth.js v5 (NextAuth) preferred; Clerk allowed if blocked
- Hosting on Vercel
- ESLint + Prettier

## Routes (MVP)

- `/` — landing
- `/login`, `/register` — auth
- `/profile` — view/update profile + logout
- `/cases` — case list
- `/cases/new` — create case
- `/cases/[id]` — case detail, timeline, referrals
- `/coordinator` — chase queue (overdue / rejected / unassigned)
- `/dashboard` — light coordinator metrics

## Reusable components

- `Header`, `Footer`, `NavLinks`
- `CaseCard`, `CaseStatusBadge`, `CaseTimeline`
- `ReferralForm`, `ReferralActions`
- `QueueFilters`, `EmptyState`, `FormError`, `LoadingSkeleton`

## Data model

- **User/Profile**: id, name, email, role (`coordinator` | `clinician` | `lab_staff`), org/clinic?
- **Case**: id, patientCode, resultIssuedAt, status, ownerId → User, closureNote?, closedById?, timestamps
- **Referral**: id, caseId → Case, fromUserId → User, toUserId → User, status (`pending` | `accepted` | `rejected` | `cancelled`), notes
- **TimelineEvent**: id, caseId → Case, type, message, createdById → User, createdAt

Relationships: User 1—* Case (owner); Case 1—* Referral; Case 1—* TimelineEvent; User 1—* Referral (from/to).

## Coding conventions

- Server Components by default; Client Components only for forms, filters, interactive UI
- No `any`; type props, state, and API responses
- API routes under `app/api/**` for DB operations consumed by the client
- Prefer parameterized Prisma queries; never concatenate user input into SQL
- Feature branches (`feature/...`); PR review required before merge to `main`
- Keep PRs small and scoped to one issue when possible

## Branding

- Tone: calm clinical / trustworthy (not playful)
- Primary: deep teal `#0F6B6B`
- Accent: soft coral `#E07A5F` for alerts/overdue
- Neutrals: ink `#1F2933`, muted `#6B7280`, paper `#F7FAFC`
- Fonts: `Source Sans 3` (UI), optional `IBM Plex Sans` for headings
- Spacing: Tailwind scale; prefer `space-y-4/6`, `gap-4`, max content width `max-w-5xl`
- Cards allowed for case/referral interactive containers; avoid decorative card clutter on marketing surfaces

# Architecture & Design Planning (W03)

## Component architecture

### MVP routes

| Route | Purpose | Week 04 priority |
|-------|---------|------------------|
| `/` | Landing / purpose | Medium |
| `/login`, `/register` | Auth | **High** |
| `/profile` | Profile CRUD + logout | **High** |
| `/cases` | List cases | **High** |
| `/cases/new` | Create case | **High** |
| `/cases/[id]` | Detail + timeline + referrals | High (detail first) |
| `/coordinator` | Chase queue | Medium (Week 05) |
| `/dashboard` | Light metrics | Later MVP |

### Reusable components (hierarchy)

```
AppShell
├── Header
│   └── NavLinks (client: active route)
├── Page content
│   ├── CaseCard
│   ├── CaseStatusBadge
│   ├── CaseTimeline
│   ├── ReferralForm / ReferralActions
│   ├── QueueFilters
│   ├── EmptyState / FormError / LoadingSkeleton
└── Footer
```

### Week 04 implementation order

1. Auth + roles
2. Profile view/update
3. Create case
4. Cases list + detail (read)
5. Shared types + Prisma schema (dependency for all data work)

## Data model sketch

```
┌──────────────┐       owns        ┌─────────────────┐
│ User/Profile │ 1 ────────────── * │ Case            │
│--------------│                   │-----------------│
│ id           │                   │ id              │
│ name         │                   │ patientCode     │
│ email        │                   │ resultIssuedAt  │
│ role         │                   │ status          │
│ org?         │                   │ ownerId ────────┘
└──────┬───────┘                   │ closureNote?
       │                           │ closedById?
       │ from/to                   │ createdAt/updatedAt
       │                           └────────┬──────────┘
       │                                    │ 1
       │                                    │
       │                           ┌────────┴──────────┐
       │                           │ TimelineEvent     │
       │                           │ caseId, type,     │
       │                           │ message, createdBy│
       │                           └───────────────────┘
       │
       │ 1                         ┌─────────────────┐
       └──────────────────────── * │ Referral        │
                                   │ caseId → Case   │
                                   │ fromUserId      │
                                   │ toUserId        │
                                   │ status, notes   │
                                   └─────────────────┘
```

**Database:** PostgreSQL + Prisma (Supabase Postgres acceptable)

**Entities (4):** User/Profile, Case, Referral, TimelineEvent

## Design theme & branding

| Token | Value | Use |
|-------|-------|-----|
| Primary | `#0F6B6B` (deep teal) | Header, primary buttons, links |
| Accent | `#E07A5F` (soft coral) | Overdue / rejected alerts |
| Ink | `#1F2933` | Body text |
| Muted | `#6B7280` | Secondary text |
| Paper | `#F7FAFC` | Page background |
| Typography | Source Sans 3 | UI body + headings |
| Layout | `max-w-5xl`, `px-4`, `gap-4/6` | Consistent spacing |
| UI approach | Tailwind utility classes; shared status badges | No heavy card chrome |

Tone: calm, clinical, trustworthy — suitable for coordinators and clinicians.

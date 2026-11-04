# CareLoop Tracker — Project Constitution

## Purpose

CareLoop Tracker follows a screening result from the day it is issued until the patient has been treated or the case is closed. One named owner is always responsible for the next step. Overdue, rejected, and unassigned work is surfaced for coordinators.

## Required Stack

- Next.js App Router
- TypeScript (strict mode; avoid `any`)
- Tailwind CSS (utility-first; custom CSS only when necessary)
- Database: PostgreSQL via Prisma (or Supabase Postgres)
- Authentication: Auth.js v5 (NextAuth) preferred; Clerk approved alternative
- Hosting: Vercel
- Formatting: Prettier + ESLint

## Next.js Patterns

- Prefer Server Components by default
- Use Client Components only for interactivity (forms, filters, toggles)
- Use file-based App Router routes and Route Handlers for APIs
- Keep shared UI in `components/` and domain helpers in `lib/`

## TypeScript Standards

- Enable `strict` in `tsconfig.json`
- Type props with interfaces/types
- Type API request/response payloads
- Do not use `any`; use `unknown` + narrowing when needed

## Tailwind Conventions

- Utility-first styling in JSX
- Shared design tokens in `globals.css` / `@theme`
- Consistent spacing, typography, and color palette across pages

## Testing Expectations (MVP)

- Manual verification of auth, CRUD, and coordinator queue flows
- Lint and production build must pass before merge (`npm run lint`, `npm run build`)
- Peer review required on every pull request

## Naming Conventions

- Components: `PascalCase` (`CaseCard.tsx`)
- Hooks/utilities: `camelCase` (`getCaseById.ts`)
- Routes: kebab-case folders (`app/cases/[id]`)
- Feature branches: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`

## Collaboration Guidelines

- `main` is protected — no direct pushes
- All work on feature branches
- Pull requests require at least one teammate review before merge
- Issues should be 4–8 hours of work with a clear owner
- Prefer clear, respectful, actionable code review comments

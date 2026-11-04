# Contributing to CareLoop Tracker

## Branching Strategy

1. Pull latest `main` before starting work.
2. Create a feature branch:
   - `feature/user-auth`
   - `feature/case-crud`
   - `fix/queue-filter`
   - `docs/readme-team`
3. Commit small, meaningful changes.
4. Push the branch and open a Pull Request into `main`.
5. Request review from at least one teammate.
6. Merge only after approval + lint/build checks.

## Branch Protection (repo admin)

In GitHub → Settings → Branches → Add rule for `main`:

- Require a pull request before merging
- Require at least 1 approval
- Do not allow bypassing the above settings (when available)
- Restrict direct pushes to `main`

## Code Standards

- TypeScript strict; no `any`
- Tailwind utility-first
- Server Components by default
- Run before opening a PR:
  - `npm run lint`
  - `npm run format:check`
  - `npm run build`

## Issue Workflow

- One primary owner per issue
- Keep issues to roughly 4–8 hours of work
- Move cards: **Todo → In Progress → In Review → Done**

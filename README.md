# CareLoop Tracker

CareLoop Tracker follows a screening result from the day it is issued until the patient has been treated or the case is closed. Each case has one named owner; overdue, rejected, and unassigned work is listed for coordinators to chase.

## Team Members

- Luis Emilio Nathanael De la rosa Meneses (`Lendherm`)
- Rebeca Arredondo (`rarredondo9`) — https://github.com/rarredondo9/wdd430-portfolio
- Chawanangwa Gondwe (`Chagon-Nehe`) — https://github.com/Chagon-Nehe/wdd430-portfolio

## Stack

- Next.js (App Router)
- TypeScript (strict)
- Tailwind CSS
- Auth.js v5 (planned) / Clerk alternative
- PostgreSQL + Prisma (planned)
- Vercel hosting

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run lint
npm run format
npm run build
```

## Workflow

- `main` is protected — no direct pushes
- Work on feature branches (`feature/...`)
- Open a Pull Request; at least one teammate must review before merge
- Track work on the GitHub Project board

## Documentation

- [Project Constitution](docs/constitution.md)
- [Project Specification](docs/specification.md)
- [Architecture & Design (W03)](docs/architecture-and-design.md)
- [Contributing / Branching](CONTRIBUTING.md)
- [Copilot instructions](.github/copilot-instructions.md)

## Project Board

https://github.com/users/Lendherm/projects/1

## Known Issues / Next Steps

- Week 04 milestone: Auth, Profile, Create case, Cases list/detail
- Invite all teammates as repository collaborators if not already added
- Protect `main` in GitHub Settings → Branches

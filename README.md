# Mail Mentor

Mail Mentor is an AI-powered email-writing practice application with interactive scenarios and post-session feedback. Users draft professional emails, exchange replies with an AI persona, review structured feedback, and track skill proficiency, streaks, and badges.

> [!IMPORTANT]
> Mail Mentor is proprietary software under active development. The repository does not grant a license to use, copy, modify, or redistribute the software.

## What is implemented

- Local email/password authentication and optional Google OAuth
- Six seeded scenarios across workplace, job-application, academic, and customer-service contexts
- AI persona replies through Ollama Cloud using `gemma4:cloud`
- Post-session feedback with category scores, strengths, improvements, issue excerpts, and a suggested revision
- Skill proficiency, recent scores, practice streaks, and 19 seeded badges
- Free usage quotas and fixed one-month or one-year Pro access periods purchased through Xendit
- Account settings, deletion, and Pro-only JSON, CSV, and PDF data export
- PostgreSQL persistence, Redis caching, structured logs, and a liveness endpoint

## Technology

- Web: React 19, Vite 8, TypeScript, Zustand, Tailwind CSS
- API: NestJS 11, Prisma 7, PostgreSQL, Redis
- External services: Ollama Cloud, Google OAuth, SMTP, Xendit
- Runtime: Node.js 24 and Docker Compose

## Quick start

Requirements: Docker with Compose support.

```bash
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up --build
```

The database initialization service applies all migrations and loads development seed data before the API starts.

- Web application: <http://localhost:8080>
- API: <http://localhost:3000>
- Liveness check: <http://localhost:3000/health>

AI features require an Ollama Cloud API key in `backend/.env`. Google sign-in is disabled locally unless both Google credentials are configured; password authentication remains available.

See [Getting started](docs/getting-started.md) for the demo account, manual setup, and first-run checks.

## Documentation

- [Getting started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Architecture](docs/architecture.md)
- [Testing](docs/testing.md)
- [Deployment](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Known limitations](docs/known-limitations.md)
- [Contributing](CONTRIBUTING.md)

## Repository layout

```text
.
├── backend/            NestJS API, Prisma schema, migrations, and seed data
├── frontend/           React single-page application and Nginx image
├── docs/               Engineering documentation
└── docker-compose.yml  Local PostgreSQL, Redis, database init, API, and web stack
```

## Validation

```bash
cd backend
npm test -- --runInBand
npm run build
npm run docs:check

cd ../frontend
npm run lint
npm run build
```

The full-application E2E suite has a known Prisma/Jest integration failure. See [Testing](docs/testing.md) before interpreting E2E results.

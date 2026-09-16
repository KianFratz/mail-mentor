# Getting started

Docker Compose is the supported onboarding path. It starts PostgreSQL, Redis, the API, and the web application, and it runs migrations plus development seed data before the API becomes available.

## Requirements

- Docker Engine or Docker Desktop with Compose support
- Git
- An Ollama Cloud API key if you need AI replies or feedback
- Google OAuth credentials only if you need Google sign-in locally

Node.js 24 is required for package-level development outside containers.

## Start the complete stack

From the repository root:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up --build
```

On a fresh database, the `db-init` service runs `prisma migrate deploy` and then the development seed. The API waits for that service to finish successfully.

Open:

- <http://localhost:8080> for the web application
- <http://localhost:3000/health> for API liveness

The development seed creates this private-repository demo account:

```text
Email: testuser@mailmentor.dev
Password: 123123123
```

The seed is development-only. Never run it against a production database or publish the demo credentials in public-facing material.

## Enable AI features

Set `OLLAMA_API_KEY` in `backend/.env`, then recreate the API container:

```bash
docker compose up --build backend
```

The implementation currently uses Ollama Cloud at `https://ollama.com` with `gemma4:cloud`. A local Ollama daemon is not supported.

## Enable Google sign-in

Create a Google OAuth client and set both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `backend/.env`. The local authorized redirect URI is:

```text
http://localhost:3000/auth/google/callback
```

The callback returns the browser to `http://localhost:8080/oauth-success`. When the two credentials are absent, password registration and login still work and Google OAuth routes return an unavailable response.

## Stop or reset the stack

Stop containers while preserving PostgreSQL and Redis volumes:

```bash
docker compose down
```

Removing named volumes deletes local application data and is intentionally not part of the routine workflow. Only do that when you explicitly want a fresh local database.

## Manual package development

Use this path when debugging a package outside Docker. You must provide reachable PostgreSQL and Redis instances yourself.

Backend:

```bash
cd backend
cp .env.example .env
npm ci
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

For manual startup, update `DATABASE_URL` if your database credentials differ from the example.

Frontend, in another terminal:

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

The Vite application is served at <http://localhost:5173>. Set backend `FRONTEND_URL` and `CORS_ORIGINS` to that origin when using the manual path.

## First-run verification

1. Confirm `GET /health` returns `status: "ok"`.
2. Sign in with the seeded demo account or register a local account.
3. Browse the six seeded scenarios.
4. If `OLLAMA_API_KEY` is set, start a scenario and request an AI reply.
5. End a session and verify that a feedback report appears.

See [Troubleshooting](troubleshooting.md) if database initialization, OAuth, AI, or browser requests fail.

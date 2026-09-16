# Troubleshooting

## The API does not start

Read the configuration error from the backend logs. Startup validation lists missing or invalid variable names without printing their values.

For local Compose, confirm both files exist:

```bash
test -f .env
test -f backend/.env
```

Recreate them from the committed examples if necessary. `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are always required.

## `db-init` fails

Inspect the one-shot service:

```bash
docker compose logs db-init
```

It waits for PostgreSQL, applies committed migrations, and loads development seed data. Fix the reported migration or seed problem before restarting the API. Re-running the seed updates the six scenarios by title and does not create new duplicates.

## The frontend cannot call the API

Check all three values together:

- `VITE_API_BASE_URL` is visible to the browser and was present when the frontend image was built.
- `CORS_ORIGINS` includes the exact browser origin, including scheme and port.
- `FRONTEND_URL` matches the browser origin used for redirects.

The local Compose origins are web `http://localhost:8080` and API `http://localhost:3000`. Manual Vite development normally uses `http://localhost:5173`.

## Google sign-in is unavailable

Google OAuth is optional in development. Configure both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; configuring only one fails startup validation.

Confirm the provider's authorized redirect URI exactly matches `${BACKEND_URL}/auth/google/callback`. Production URLs must use HTTPS.

## AI replies or feedback fail

Confirm `OLLAMA_API_KEY` is populated and the running backend received the updated environment. The current implementation supports Ollama Cloud only, uses `gemma4:cloud`, and times out after 55 seconds. A locally running Ollama daemon will not be used.

Do not expect feedback while typing. The detailed feedback report is requested after ending a writing session.

## A Xendit payment does not activate Pro access

1. Confirm Xendit can reach `POST ${BACKEND_URL}/payment/webhook` over HTTPS.
2. Confirm the provider callback token matches `XENDIT_WEBHOOK_TOKEN`.
3. Find the request by `X-Request-ID` in structured logs.
4. Check that the invoice status is successful and the payment reference was not already processed.

The integration uses one-off invoices. It does not create or cancel a recurring agreement at Xendit.

## PDF export fails in a container

The backend runner installs Chromium and sets `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`. For other runtimes, install a compatible Chromium build and set that variable to its executable.

## E2E tests fail before database access

The current full-app E2E harness is incompatible with Prisma's generated dynamic import under Jest without VM-module support. This is a known limitation, not evidence that a configured database is unreachable. See [Testing](testing.md).

## Health is green but a feature is failing

`GET /health` is liveness only. It does not probe PostgreSQL after startup, Redis, SMTP, Google, Ollama Cloud, or Xendit. Inspect provider status, dependency connectivity, and structured request logs separately.

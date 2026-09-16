# Deployment

Mail Mentor provides container images but no platform-specific infrastructure or CI/CD pipeline. This guide defines a provider-neutral production contract.

## Production topology

- Serve the frontend image behind HTTPS.
- Run the backend image as a long-lived API service.
- Provide managed or durable PostgreSQL and Redis services.
- Run migrations as a one-shot release job before shifting traffic.
- Configure Ollama Cloud, Google OAuth, SMTP, and Xendit with production credentials and callbacks.

The root Compose file is for local development. It sets `NODE_ENV=development` and loads demo seed data; do not use it as a production deployment definition.

## Build images

```bash
MAIL_MENTOR_VERSION=replace-with-release-or-commit
docker build -t mail-mentor-api:${MAIL_MENTOR_VERSION} backend
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t mail-mentor-web:${MAIL_MENTOR_VERSION} frontend
```

Use immutable tags such as a release identifier or commit SHA. Set `APP_VERSION` to the same value for the API.

## Configure secrets

Set `NODE_ENV=production` and provide every production variable in [Configuration](configuration.md). Keep values in the platform secret store. Do not bake secrets into either image.

Production validation enforces HTTPS application URLs and distinct JWT secrets of at least 32 characters. The frontend API URL is a build-time value and must be correct before the image is published.

## Apply migrations

Build the backend's migration target from the same revision as the API:

```bash
MAIL_MENTOR_VERSION=replace-with-release-or-commit
docker build \
  --target migrations \
  -t mail-mentor-migrations:${MAIL_MENTOR_VERSION} \
  backend
```

Run that image once with production `DATABASE_URL`:

```bash
MAIL_MENTOR_VERSION=replace-with-release-or-commit
docker run --rm \
  -e DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public' \
  mail-mentor-migrations:${MAIL_MENTOR_VERSION}
```

The `migrations` target runs `prisma migrate deploy` only. It does not load development seed data. Back up the database and review migration SQL before releases with destructive schema changes.

## Configure external services

### Google OAuth

Register this exact redirect URI:

```text
${BACKEND_URL}/auth/google/callback
```

The browser returns to `${FRONTEND_URL}/oauth-success` after a successful callback.

### Xendit

Configure the callback as:

```text
POST ${BACKEND_URL}/payment/webhook
```

Set the callback token to the value of `XENDIT_WEBHOOK_TOKEN`. The endpoint validates `x-callback-token` using a timing-safe comparison. Checkout creates one-off invoices for fixed Pro access periods, not recurring provider subscriptions.

### SMTP

Configure a monitored sender. Port `465` uses implicit TLS; other ports use STARTTLS when the server offers it. Exercise account email flows after deployment.

### Ollama Cloud

Provide `OLLAMA_API_KEY`. The API currently calls `https://ollama.com` with `gemma4:cloud`; the host and model are not configurable.

## Health and observability

`GET /health` returns `status`, `app`, `version`, and `uptimeSeconds`. Use it as a liveness probe only. It does not establish readiness of PostgreSQL, Redis, SMTP, OAuth, AI, or payments.

The backend writes newline-delimited structured JSON to stdout and errors to stderr. Each request receives an `X-Request-ID`; completion logs include the app version, request ID, method, route template, status, duration, and abort state. Aggregate `http_request` events for traffic, error-rate, and latency monitoring.

Add separate dependency checks or provider monitoring appropriate to the hosting platform.

## Release sequence

1. Back up PostgreSQL and verify recovery procedures.
2. Build immutable web, API, and migration images from one revision.
3. Apply production migrations with the one-shot migration image.
4. Deploy the API with production secrets.
5. Verify API liveness and dependency behavior.
6. Deploy the frontend built with the production API URL.
7. Exercise login, one AI request, email delivery, and a provider sandbox payment where available.
8. Monitor structured logs and error rates before completing the rollout.

## Rollback

Roll back application images to the previous immutable tag. Database rollback is migration-specific: Prisma does not automatically reverse production migrations. Prefer backward-compatible migrations and use the pre-release backup only after evaluating data-loss risk.

Redis is non-authoritative and can be recreated. PostgreSQL requires durable backups, retention appropriate to the product's data policy, and periodically tested restoration.

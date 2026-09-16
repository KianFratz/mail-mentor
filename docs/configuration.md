# Configuration

Never commit populated environment files. The committed `.env.example` files contain local placeholders and document the supported keys.

## Configuration files

| File                      | Consumer                                       |
| ------------------------- | ---------------------------------------------- |
| `.env`                    | Docker Compose interpolation and shared values |
| `backend/.env`            | NestJS API and the local database-init service |
| `frontend/.env`           | Vite development server                        |
| `frontend` build argument | Production web image                           |

Copy the corresponding `.env.example` file before local startup.

## Root Compose variables

| Variable            | Required | Purpose                                      |
| ------------------- | -------- | -------------------------------------------- |
| `POSTGRES_USER`     | Yes      | Local PostgreSQL user                        |
| `POSTGRES_PASSWORD` | Yes      | Local PostgreSQL password                    |
| `POSTGRES_DB`       | Yes      | Local PostgreSQL database                    |
| `CORS_ORIGINS`      | No       | Browser origins allowed by the API           |
| `VITE_API_BASE_URL` | No       | API URL compiled into the frontend container |

Compose overrides `DATABASE_URL` and `REDIS_URL` with service-network addresses. PostgreSQL is not published to the host; Redis is published on port `6379`.

## Backend variables

### Required in every environment

| Variable             | Purpose                      |
| -------------------- | ---------------------------- |
| `DATABASE_URL`       | PostgreSQL connection URL    |
| `JWT_SECRET`         | Access-token signing secret  |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |

### Required in production

| Variable               | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `FRONTEND_URL`         | HTTPS browser origin and OAuth/payment redirect base      |
| `BACKEND_URL`          | HTTPS API origin and Google callback base                 |
| `GOOGLE_CLIENT_ID`     | Google OAuth client identifier                            |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                |
| `OLLAMA_API_KEY`       | Ollama Cloud credential for AI replies and feedback       |
| `XENDIT_SECRET_KEY`    | Xendit API credential                                     |
| `XENDIT_WEBHOOK_TOKEN` | Token expected in Xendit's `x-callback-token` header      |
| `MAIL_HOST`            | SMTP host                                                 |
| `MAIL_PORT`            | SMTP port                                                 |
| `MAIL_USER`            | SMTP username                                             |
| `MAIL_PASS`            | SMTP password                                             |
| `MAIL_FROM`            | Sender email or `Display Name <address@example.com>` form |

Production app URLs must use HTTPS and cannot contain credentials, queries, or fragments. JWT secrets must be distinct and at least 32 characters.

### Optional or feature-specific

| Variable                       | Default                  | Purpose                                              |
| ------------------------------ | ------------------------ | ---------------------------------------------------- |
| `NODE_ENV`                     | `development`            | `development`, `test`, or `production`               |
| `PORT`                         | `3000`                   | API listening port                                   |
| `REDIS_URL`                    | `redis://localhost:6379` | Redis connection URL                                 |
| `CORS_ORIGINS`                 | Local Vite origin        | Comma-separated browser origins                      |
| `FRONTEND_URL`                 | None                     | Needed locally for correct OAuth redirects           |
| `BACKEND_URL`                  | Local API URL in OAuth   | API base used to construct the Google callback       |
| `GOOGLE_CLIENT_ID`             | None                     | Enables Google OAuth when configured with its secret |
| `GOOGLE_CLIENT_SECRET`         | None                     | Enables Google OAuth when configured with its ID     |
| `JWT_ACCESS_TOKEN_EXPIRATION`  | `15m`                    | Access-token lifetime                                |
| `JWT_REFRESH_TOKEN_EXPIRATION` | `7d`                     | Refresh-token lifetime                               |
| `APP_VERSION`                  | Backend package version  | Version emitted by health responses and logs         |
| `PUPPETEER_EXECUTABLE_PATH`    | Puppeteer default        | Chromium path used by PDF export                     |

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be supplied together. Payment and SMTP variables may be omitted in development when those features are not exercised.

`CLOUD_API_URL`, `JWT_EXPIRATION`, and `RESEND_API_KEY` are not active configuration. Do not add them to deployment secrets based on older local files.

## Frontend variable

| Variable            | Default                 | Purpose                 |
| ------------------- | ----------------------- | ----------------------- |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Browser-visible API URL |

Vite variables are compiled into the frontend bundle. Changing the value for a container deployment requires rebuilding the frontend image.

## External-service callbacks

- Google: `${BACKEND_URL}/auth/google/callback`
- Google success redirect: `${FRONTEND_URL}/oauth-success`
- Xendit webhook: `POST ${BACKEND_URL}/payment/webhook`
- Xendit success redirect: `${FRONTEND_URL}/settings?payment=success`
- Xendit failure redirect: `${FRONTEND_URL}/pricing?payment=failed`

Store production credentials in the deployment platform's secret manager, not in images, Compose files, build arguments, or source control.

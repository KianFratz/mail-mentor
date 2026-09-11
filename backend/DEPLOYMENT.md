# Backend configuration

Startup validates configuration before constructing service providers. Errors list
invalid variable names and requirements, never their values. NODE_ENV accepts
`development` (default), `test`, or `production`; deployments must set `production`.

All environments require DATABASE_URL (PostgreSQL), JWT_SECRET,
JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET. Google OAuth is
registered in every environment. Local development may omit payment and SMTP
credentials if those features are not used. Configure FRONTEND_URL and BACKEND_URL
for OAuth and email flows locally (typically http://localhost:5173 and
http://localhost:3000).

Production additionally requires:

- FRONTEND_URL and BACKEND_URL: HTTPS URLs without credentials, query, or fragment.
- JWT secrets: distinct values, each at least 32 characters; generate randomly.
- XENDIT_SECRET_KEY and XENDIT_WEBHOOK_TOKEN.
- MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM (an email address).
  Mail uses SMTP; port 465 enables implicit TLS. Other ports use SMTP STARTTLS
  when offered by the server. RESEND_API_KEY is not used.

PORT is optional (default 3000). PORT and MAIL_PORT must be integers from 1 to
65535. Keep credentials in the deployment secret store, never in source control.

Backend logs are newline-delimited JSON on stdout (errors on stderr). Nested
sensitive fields, configured secret values, email addresses, URLs, and Error
objects are redacted. Log fixed event names and allowlisted operational fields;
do not pass request bodies, provider responses, or personal data to the logger.
Public errors have `statusCode`, `error`, and `message`. Client validation messages
are retained; all server errors return `Internal server error` and provider
responses are never sent to clients.

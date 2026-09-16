# Known limitations

This register records verified current constraints. It is not a roadmap and does not imply a delivery commitment.

## Development and testing

- The full-application E2E suite fails at Prisma's generated dynamic import under the current Jest harness. The independent session-ownership E2E suite passes.
- The frontend has no unit, component, or browser automation. Its automated baseline is lint plus a TypeScript/Vite build.
- No CI workflow enforces package or documentation checks.
- The repository has no tagged release, changelog, or formal versioning policy.

## Local and production operations

- Docker Compose is the canonical local setup, but it has not been executed in every supported host environment. The checked-in configuration expects Docker Compose support for health-based dependencies and completed one-shot services.
- There is no provider-specific production infrastructure, automated release pipeline, readiness endpoint, or public metrics endpoint.
- `GET /health` reports process liveness only. It does not continuously verify PostgreSQL, Redis, or external providers.
- PostgreSQL is intentionally not exposed on a host port by the local Compose file. Manual backend development requires a separately reachable PostgreSQL instance.

## Integrations

- AI is hardcoded to Ollama Cloud at `https://ollama.com` with `gemma4:cloud`; local Ollama and alternative models are not configurable.
- The Xendit integration creates one-off invoices and updates a locally tracked Pro access period. It is not provider-managed recurring billing.
- The local cancellation flag does not call a Xendit cancellation API.
- Payment-method availability depends on the Xendit checkout configuration and is not guaranteed by the application.

## Product behavior

- There is no generated or hand-maintained OpenAPI specification. The architecture guide provides only a route-family map.
- Plan metadata includes history, recent-score, badge, and priority-AI fields that are not consistently enforced by backend services. Public copy does not advertise those unenforced distinctions.
- The dashboard contains static greeting/advice content that should not be interpreted as personalized AI output.
- Detailed coaching is generated after a session ends, not continuously while the user types.

When a limitation is resolved, remove it in the same change that introduces and verifies the new behavior.

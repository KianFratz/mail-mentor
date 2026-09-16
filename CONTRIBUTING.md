# Contributing to Mail Mentor

This guide is for authorized collaborators. Mail Mentor is proprietary and is not currently accepting public contributions.

## Before changing code

1. Start from the `development` branch and synchronize it with the shared repository.
2. Create a focused branch. Existing work commonly uses `feature/MAIL-MENTOR-<TOPIC>`.
3. Read the relevant document under `docs/` before changing setup, architecture, integrations, or product behavior.
4. Keep secrets in ignored environment files. Never commit real tokens, user data, provider responses, or production URLs.

Conventional commit prefixes such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, and `chore:` are preferred but are not enforced automatically.

## Local setup

Follow [Getting started](docs/getting-started.md). Docker Compose is the canonical onboarding path; manual startup is documented for debugging individual services.

## Required checks

Run checks for every package you changed:

```bash
cd backend
npm test -- --runInBand
npm run build
npm run docs:check

cd ../frontend
npm run lint
npm run build
```

`npm run lint` in the backend includes `--fix` and can modify files. Review its diff before committing. The current E2E limitation is documented in [Testing](docs/testing.md).

## Documentation is part of the change

Update documentation in the same change whenever you alter:

- installation, commands, runtime versions, or environment variables;
- API routes, system boundaries, or external integrations;
- authentication, AI, payments, quotas, or user-visible behavior;
- database migrations, seeding, deployment, health checks, or logging;
- known limitations or validation results.

Use verified present-tense statements. Put future work in an issue or roadmap rather than describing it as implemented. Run `npm run docs:format` from `backend/` after editing Markdown, then run `npm run docs:check`.

## Review expectations

The project maintainer is accountable for documentation consistency. Reviewers should verify that:

- setup works from a fresh clone;
- example configuration contains placeholders only;
- public documentation does not expose private infrastructure or demo credentials;
- product claims match source-backed behavior;
- new limitations are recorded instead of hidden.

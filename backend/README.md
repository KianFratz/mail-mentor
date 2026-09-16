# Mail Mentor API

NestJS and Prisma backend for Mail Mentor. The API owns authentication, writing sessions, AI replies and feedback, progress tracking, fixed Pro access periods, exports, and external-service integrations.

## Package development

Requires Node.js 24, PostgreSQL, and Redis.

```bash
cp .env.example .env
npm ci
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Useful checks:

```bash
npm test -- --runInBand
npm run build
npm run docs:check
```

The backend lint script applies fixes. The full-app E2E suite has a known Prisma/Jest limitation.

See the repository [README](../README.md), [configuration reference](../docs/configuration.md), [architecture guide](../docs/architecture.md), and [testing guide](../docs/testing.md) for the authoritative project documentation.

This package is private and `UNLICENSED`; no MIT license applies to Mail Mentor.

# Testing

This document distinguishes checks that currently pass from checks that are planned or known to fail.

## Backend

Install and generate the Prisma client before running package checks:

```bash
cd backend
npm ci
npx prisma generate
```

### Unit tests

```bash
npm test -- --runInBand
```

Verified baseline on Node 24: 33 suites and 111 tests pass.

Other useful commands:

```bash
npm run test:watch
npm run test:cov
npm run build
```

`test:cov` writes a coverage directory. `npm run lint` includes `--fix`, so it can modify source files.

### End-to-end tests

```bash
npm run test:e2e -- --runInBand
```

The session-ownership suite passes, but the full `AppModule` suite currently fails before database access because Prisma's generated client's dynamic import is incompatible with the current Jest harness unless VM-module support is configured. After that harness issue is fixed, the full-app suite also requires valid environment variables and reachable PostgreSQL.

Do not report the E2E suite as green until both suites pass in the intended test environment.

## Frontend

```bash
cd frontend
npm ci
npm run lint
npm run build
```

The frontend has no automated unit, component, or browser test command. Lint and TypeScript/Vite build checks are the current automated baseline.

### Public funnel accessibility

The landing page, public pricing page, and registration page use visible keyboard focus indicators and meaningful heading and landmark structure. Landing-page challenge feedback moves focus to its heading after submission and is exposed as a polite live region. Content does not depend on intersection-observer reveal behavior, and reduced-motion mode shortens nonessential animation and transition effects without hiding content.

For changes to this acquisition journey, exercise the landing page, challenge feedback, pricing page, registration page, and their navigation at approximately 360 px, 768 px, 1024 px, and 1440 px viewport widths. At each width:

1. Confirm the page has no unintended horizontal overflow and primary actions remain visible.
2. Traverse the complete journey using Tab, Shift+Tab, Enter, and Space.
3. Confirm focus remains visible and follows the visual reading order.
4. Submit the landing-page challenge and confirm its feedback is announced or receives focus.
5. Reload with reduced motion enabled and confirm all content remains available.
6. Inspect text, focus indicators, coaching annotations, and plan states for sufficient contrast.

The public funnel was verified locally on September 25, 2026, with headless Chrome 152 at 360 px, 768 px, 1024 px, and 1440 px viewport widths. The check covered the landing, public pricing, and registration routes and confirmed:

- no unintended horizontal overflow, missing main landmarks, duplicate top-level headings, or hidden primary actions;
- accessible names and visible focus for keyboard-reachable controls;
- keyboard activation of the mobile navigation, billing-period switch, and challenge submission;
- focus movement and live-region semantics for challenge feedback;
- clearance between anchored landing sections and the fixed navigation; and
- content availability with reduced motion enabled and `IntersectionObserver` unavailable.

## Documentation

The backend package uses its existing Prettier dependency to check all Markdown documents:

```bash
cd backend
npm run docs:check
```

Format Markdown with:

```bash
npm run docs:format
```

The documentation check verifies formatting, not URLs, command behavior, or factual accuracy. Review internal links and execute changed commands during review.

## Verification expectations

For changes that affect setup or operations:

1. Start from copied example environment files.
2. Use a fresh development database when migrations or seeds change.
3. Confirm API liveness and browser-to-API requests.
4. Exercise any external integration whose configuration changed.
5. Record environmental constraints when a check cannot be run.

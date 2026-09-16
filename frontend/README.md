# Mail Mentor Web

React and Vite single-page application for Mail Mentor.

## Package development

Requires Node.js 24 and a running Mail Mentor API.

```bash
cp .env.example .env
npm ci
npm run dev
```

The development server defaults to <http://localhost:5173> and the API URL defaults to <http://localhost:3000>.

Useful checks:

```bash
npm run lint
npm run build
npm run preview
```

The frontend currently has no automated test command. See the repository [README](../README.md), [getting-started guide](../docs/getting-started.md), and [testing guide](../docs/testing.md) for the authoritative project documentation.

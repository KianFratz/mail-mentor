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

## Analytics diagnostics

The frontend emits provider-neutral conversion events to the browser queue
`window.__MAIL_MENTOR_ANALYTICS_QUEUE__` and dispatches each event as a
`mail-mentor:analytics` `CustomEvent`. This queue is initialized when the
frontend loads and does not require an analytics provider or account. Event
records
contain only the event name, an allowlisted context object, and a timestamp;
they never contain account details, tokens, or email content.

For example, inspect the queue from browser developer tools with:

```js
window.__MAIL_MENTOR_ANALYTICS_QUEUE__;
```

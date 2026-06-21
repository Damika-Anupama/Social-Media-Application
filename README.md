# Pulse — Social Media Application (Frontend Demo)

Pulse is a frontend demonstration of a modern social media platform. It runs as a
static-friendly Next.js app with mocked data — no backend, no real auth — designed
to show what a polished, next-level social network could look and feel like.

## Branches

- **`main`** — historical snapshot. Original Spring Boot backend (Java) and the
  legacy Angular 11 + NativeScript frontend, combined into a single workspace.
  Full Git history for each side lives in the original GitHub repos:
  - https://github.com/Damika-Anupama/Social-Media-Application-Backend
  - https://github.com/Damika-Anupama/Social-Media-Application-Frontend
- **`frontend-demo`** — production branch for the live demo. A fresh Next.js 15 +
  React 19 + Tailwind app at the repo root. This is the branch deployed to
  Vercel.

## Demo features (frontend-demo branch)

- **Landing page** — product story, manifesto, social proof, animated hero.
- **Register & Login** — full client-side form validation (email shape,
  password strength meter, username rules, confirm-match, terms checkbox). Any
  input that passes validation signs the user in and redirects to `/dashboard`.
- **Dashboard** — sidebar nav + top bar + mobile tab bar with:
  - Home feed: composer with tone selector, story rail, post cards with
    optimistic like / re-share / bookmark, top-comment surfacing, ranking
    transparency badge.
  - Explore: trending topics, suggested people, masonry visual feed.
  - Messages: two-pane DM layout with live thread.
  - Notifications: grouped, filterable, with type-specific iconography.
  - Profile: cover photo, stats, tabs, the user's own posts.
  - Settings: account, notifications, privacy, appearance (theme picker).
  - Bookmarks, Communities — small but complete.

All data, photography, and accounts are fictional.

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
# open http://localhost:3000
```

## Testing

- **Unit tests (Vitest)** cover the pure form-validation logic
  (`src/lib/validation.ts`) — email/password/handle/name rules, confirm-match,
  and the password-strength scorer.
- **End-to-end (Playwright)** drives the public + auth surface in a real
  Chromium browser: landing render + CTAs, login validation, the successful
  sign-in → `/dashboard` redirect, and the register form. Since the app is
  frontend-only, the suite is valid against the Vercel preview too.

```bash
npm test                 # Vitest unit tests
npm run test:e2e         # Playwright E2E (boots the prod server automatically)
# Against a deployed preview:
E2E_BASE_URL=https://<preview-url> npm run test:e2e
```

## Production build

```bash
npm run build
npm start
```

## Deployment

This branch is configured to deploy to Vercel via the committed `vercel.json`.
See `DEPLOYMENT.md` for the exact procedure and the production URL.

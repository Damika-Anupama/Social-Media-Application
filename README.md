# Pulse — Social Media Application (Frontend Demo)

Pulse is a frontend demonstration of a modern social media platform. It runs as a
static-friendly **Next.js 16 + React 19 + TypeScript + Tailwind** app with mocked
data — no backend, no real auth — designed to show what a polished, next-level
social network could look and feel like.

All data, photography, and accounts are fictional. Any input that passes
client-side validation on the auth screens "signs you in" and redirects to
`/dashboard`; there is no real authentication or server.

## Public demo mirror

This public repository contains only the self-contained `frontend-demo` deployment.
The complete implementation and its history are maintained in a private source
repository, which publishes a sanitized orphan commit here after safety checks.

## Features

- **Landing page** — product story, manifesto, social proof, animated hero.
- **Register & Login** — full client-side validation (email shape, password
  strength meter, username rules, confirm-match, terms checkbox).
- **Home feed** — composer with tone selector, story rail, infinite scroll, post
  cards, top-comment surfacing, ranking-transparency badge.
- **Explore** — trending topics, suggested people, masonry visual feed, search.
- **Messages** — two-pane DM layout with a live-updating thread.
- **Notifications** — grouped, filterable, type-specific iconography.
- **Profiles** — your own profile plus public profile pages via dynamic routes;
  post-detail and community pages via dynamic routing.
- **Settings** — account, notifications, privacy, and a working Appearance panel.
- **Bookmarks & Communities** — small but complete.
- **Command palette (⌘K)** — keyboard-driven navigation + actions.
- **SEO / social metadata** — title templates, Open Graph + Twitter cards, a
  dynamically generated OG image, web manifest, and a custom 404.
- **Responsive** — sidebar + top bar on desktop, mobile tab bar on small screens.

## Real, persistent behaviour (on top of mocked data)

Several interactions are genuinely wired to client-side stores backed by
`localStorage`, so they survive reloads and sync across tabs and surfaces:

- **Composer** (`useUserPosts`) — your posts appear optimistically at the top of
  the feed, persist across reloads, and can be deleted.
- **Likes & bookmarks** (`useReactions`) — survive navigation; the Bookmarks page
  shows posts you actually saved.
- **Following** (`useFollowing`) — one shared store across Explore, the right rail,
  and public profiles; follow state stays consistent everywhere.
- **Notifications** (`useReadNotifications`) — read state persists, and the sidebar
  unread badge reflects the real count.
- **Toasts** — accessible (`aria-live`) confirmation with Undo for follow,
  bookmark, and delete actions.

## Theming & accessibility

- **Light / dark / system theme** — the color system is built on CSS-variable
  tokens (`rgb(var(--token) / <alpha-value>)`), so the whole UI re-themes with no
  per-component changes. `system` follows `prefers-color-scheme` live, and a
  pre-paint script applies the saved theme before hydration (no flash).
- **Appearance preferences** (`PreferencesContext`) — theme, **reduce motion**
  (a user-controlled twin of the `prefers-reduced-motion` media query), and
  **larger type**, all persisted.
- **Accessibility** — skip-to-content link, `aria-current` on active nav,
  dialog/`aria-modal` semantics on the command palette and compose modal,
  labelled live regions, and focus management.

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
# open http://localhost:3000
```

## Quality gates

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint 9 flat config (eslint-config-next)
npm test             # Vitest unit tests
npm run build        # next build
```

CI in the private source repository runs all four checks before the sanitized
frontend demo is published here.

## Testing

- **Unit tests (Vitest)** — 51 tests covering the pure logic behind the app:
  form validation (`validation.ts`), the user-post builder (`useUserPosts.ts`),
  and the (de)serialization / derivation helpers for following (`useFollowing.ts`),
  reactions (`useReactions.ts`), notification read state (`useReadNotifications.ts`),
  display preferences (`PreferencesContext.ts`), and share-URL building (`share.ts`).
  Each parser is hardened against corrupt or malformed `localStorage` data.
- **End-to-end (Playwright)** — drives the public + auth surface, the persistent
  composer (post → optimistic → survives reload → delete), and persistent
  following (follow on Explore → persists → shared with the right rail). Because
  the app is frontend-only, the suite is also valid against a deployed preview.

```bash
npm run test:e2e                                     # boots the prod server automatically
E2E_BASE_URL=https://<preview-url> npm run test:e2e  # against a deployed preview
```

## Production build

```bash
npm run build
npm start
```

## Deployment

This branch is configured to deploy to Vercel via the committed `vercel.json`.
See `DEPLOYMENT.md` for the exact procedure and the production URL.

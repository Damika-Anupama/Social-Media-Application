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
  (`src/lib/validation.ts`), the user-post builder (`src/lib/useUserPosts.ts`),
  and the follow-store (de)serialization helpers (`src/lib/useFollowing.ts`).
- **End-to-end (Playwright)** drives the public + auth surface, the
  **persistent post composer**, and the **persistent following** store: landing
  render + CTAs, login validation, the sign-in → `/dashboard` redirect, the
  register form, composing a post that appears optimistically / **survives a
  reload** (localStorage) / can be deleted, and following an account on Explore
  that **persists across reloads** and is **shared with the right-rail widget**.
  Since the app is frontend-only, the suite is valid against the Vercel preview
  too.

```bash
npm test                 # Vitest unit tests
npm run test:e2e         # Playwright E2E (boots the prod server automatically)
# Against a deployed preview:
E2E_BASE_URL=https://<preview-url> npm run test:e2e
```

## Persistent composer

The home composer is wired to a real client-side store (`useUserPosts`): posts
you write are added optimistically to the top of the **For you** feed and saved
to `localStorage`, so they persist across reloads and sync across tabs. Each of
your posts has a delete control. This is genuine working behaviour layered on
top of the otherwise-mocked feed.

## Persistent following

The **Follow** buttons on the Explore page and the right-rail "People worth
following" widget are backed by a single shared client-side store
(`useFollowing`). Who you follow is saved to `localStorage`
(`pulse.following.v1`), so the **Following** state survives reloads, stays in
sync across browser tabs (via the `storage` event), and is **consistent across
both surfaces** — follow someone in the right rail and they show as followed on
Explore, and vice-versa. Before this, each surface kept its own in-memory `Set`
that reset on every navigation.

## Production build

```bash
npm run build
npm start
```

## Deployment

This branch is configured to deploy to Vercel via the committed `vercel.json`.
See `DEPLOYMENT.md` for the exact procedure and the production URL.

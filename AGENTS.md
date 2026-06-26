# AGENTS.md — Social Media Application

Rules for AI coding agents working in this repo. Lean and high-signal — not a preferences dump.

## What this is
Full-stack social networking platform. `main` = Spring Boot 2.4 REST backend + Angular 11 / NativeScript frontend. `frontend-demo` = Next.js rebuild deployed to Vercel. Public portfolio repo — quality and honesty matter.

## Stack
- **Backend**: Java (Spring Boot 2.4, Maven), REST, Spring Security + stateless JWT, Spring Data JPA, MySQL
- **Frontend**: Angular 11, TypeScript, NativeScript (shared codebase for web + mobile)
- **Frontend demo**: Next.js, React, TypeScript, Tailwind CSS
- **CI**: `Backend/.github/workflows/backend-ci.yml` — compile + JUnit tests (PR #1)

## Rules
1. **Surgical changes** — touch only what the request needs; never rewrite business logic you don't fully understand.
2. **Simplicity first** — no new Spring dependencies without a clear architectural reason.
3. **Test before CI** — run `./mvnw test` locally and confirm pass before adding a CI step. Never add a CI job for a suite that doesn't compile.
4. **No secrets in code** — JWT secret and DB credentials in `application.properties` / env; never committed as literals. Known issue: `NoOpPasswordEncoder` is in use (prototyping shortcut) — documented in `REPO_ISSUES.md`; upgrade to BCrypt before any production use.
5. **Respect the layer boundary** — `api` (controllers) → `business` (BO interfaces + impl) → `dao` (Spring Data JPA) → `entity`/`dto`. Don't skip layers.
6. **Branch + PR only** — never commit directly to `main`. Open a PR for review.
7. **Honest status** — report what was verified (which tests ran, what passed). Never claim features exist that don't.

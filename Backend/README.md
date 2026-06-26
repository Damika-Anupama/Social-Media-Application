# Palindrome — Social Media Backend (Spring Boot)

A Java **Spring Boot** REST API powering a social platform: authentication, user
profiles, a chronological feed ("launches"), reactions, comments, friends,
communities/groups, pages, chat, notifications, and media/email/SMS services.

> This is the real full-stack backend on `main`. The Vercel demo
> ([social-media-application-rosy.vercel.app](https://social-media-application-rosy.vercel.app/))
> is a separate frontend-only Next.js rebuild on the `frontend-demo` branch.

Frontend (Angular/NativeScript) repo:
<https://github.com/Damika-Anupama/Social-Media-Application-Frontend>

---

## Tech stack

| Concern | Technology |
|---|---|
| Language / runtime | Java 8 (source/target 1.8) |
| Framework | Spring Boot 2.4.x — Web, Security, Data JPA, Validation, Mail |
| Auth | Stateless JWT (`io.jsonwebtoken` / jjwt), Spring Security filter chain |
| Persistence | Spring Data JPA + Hibernate, MySQL 8 (HikariCP pool) |
| Mapping | MapStruct (entity ⇄ DTO mappers), Lombok |
| Integrations | Spring Mail (SMTP), Twilio (SMS) |
| Build | Maven (wrapper included), packaged as a deployable `war` |
| Test | JUnit + Spring Security Test + H2 (in-memory) |

## Architecture

The codebase follows a classic layered architecture with interface/implementation
separation at each layer, which keeps controllers thin and business logic testable:

```
HTTP request
   │
   ▼
api/            REST controllers (abstract contract) + api/impl (implementations)
   │            @RestController, /api/v1/* endpoints
   ▼
business/       Business Objects — BO interfaces (business/custom)
   │            + BO implementations (business/custom/impl)
   │            business/util — MapStruct EntityDTOMapper definitions
   ▼
dao/            Spring Data JPA repositories (CrudRepository-based)
   │
   ▼
entity/         JPA @Entity classes (+ embedded composite-key PKs)
                dto/    transport objects     model/  request/response bodies
```

Cross-cutting pieces:

- **`util/SecurityConfig`** — Spring Security filter chain. Stateless session
  policy (`SessionCreationPolicy.STATELESS`), public endpoints whitelisted
  (`/api/v1/authenticate`, user registration, public lookups), everything else
  authenticated.
- **`filter/JWTRequestFilter`** — a `OncePerRequestFilter` that extracts the
  `Bearer` token, resolves the user, validates the token, and populates the
  `SecurityContext` for the request.
- **`util/JWTUtil`** — token generation, claim/subject extraction, expiry and
  validation (HS256).
- **`filter/CORSFilter`** — CORS handling for the Angular/Next.js clients.
- **`service/Exception/GlobalExceptionHandler`** — `@ControllerAdvice` hook.
- **`service/`** — supporting services: `FileService` (media), `EmailService`
  (SMTP), `FullLaunchBodyPackager`, and `DateDescendentObjectCreator` (a
  hand-written heap-sort that merges launches/communities/friends into one
  reverse-chronological feed).

## REST API surface

All endpoints are under `/api/v1`. Representative controllers:

| Area | Controller | Notable endpoints |
|---|---|---|
| Auth | `AuthenticateController` | `POST /authenticate` → JWT |
| Users | `UserController` | `POST /users` (register), `GET /users/info/{id}`, `GET /users/name/{username}` |
| Feed | `LaunchController` | post/list "launches" (feed items) |
| Social graph | `FriendController` | friend requests / suggestions |
| Reactions | `ReactionController` | reactions on feed items |
| Comments | `CommentController` | comments on feed items |
| Communities | `CommunityController` | groups |
| Pages | `PageController` | pages |
| Chat | `ChatController` | messaging |
| Notifications | `NotificationController` | user notifications |
| Email / SMS | `EmailController`, `SMSController` | SMTP + Twilio |

## Security model

- **Stateless JWT** — no server session; the token carries the subject and is
  validated on every request by `JWTRequestFilter`.
- **Public vs. authenticated routes** are declared explicitly in `SecurityConfig`;
  all non-whitelisted routes require a valid token.
- **CORS** is handled by a dedicated filter so the SPA/mobile clients can call the
  API cross-origin.

> **Honest production caveats** (see also [`REPO_ISSUES.md`](REPO_ISSUES.md), a
> self-audit kept in the repo): this is a portfolio/learning project. It uses
> `NoOpPasswordEncoder` and a symmetric HS256 secret, and the global exception
> handler is minimal. The audit file documents these and the recommended
> hardening (BCrypt, asymmetric signing, structured error payloads, dependency
> modernization) — they are known and intentionally tracked, not hidden.

## Configuration

Runtime config lives in `src/main/resources/application.properties`. **All secrets
in the committed file are redacted** (`REDACTED-*` placeholders); supply real
values via environment variables / a secret store before running:

| Key | Purpose |
|---|---|
| `jwt.secret`, `jwt.expirationDateInMs` | JWT signing key + expiry |
| `spring.datasource.url` / hikari `username` / `password` | MySQL connection |
| `spring.mail.*` | SMTP (Gmail) for email |
| `com.palindrome.twilio.*` | Twilio SMS credentials |
| `media-upload.path` | media storage directory |

## Local development

Requires a JDK and a running MySQL 8 (`palindrome` database is auto-created via
`createDatabaseIfNotExist=true`).

```bash
cd Backend
./mvnw spring-boot:run        # starts on the default Spring Boot port (8080)
```

Build a deployable artifact:

```bash
./mvnw clean package          # produces target/palindrome-backend-1.0.0.war
```

## Testing

Unit tests run with no database or Spring context where the logic allows it —
e.g. `JWTUtilTest` exercises token generation/extraction/validation in isolation
by injecting the `@Value` fields via `ReflectionTestUtils`:

```bash
cd Backend
./mvnw test
```

```
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
```

CI (GitHub Actions, `.github/workflows/backend-ci.yml`) compiles the backend and
runs the test suite on every push / pull request that touches `Backend/`.

## Author

**Damika Anupama Nanayakkara** —
[Portfolio](https://damika.is-a.dev/) ·
[GitHub](https://github.com/Damika-Anupama) ·
[LinkedIn](https://www.linkedin.com/in/damika-anupama)

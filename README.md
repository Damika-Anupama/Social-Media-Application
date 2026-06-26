# Social Media Application

> Full-stack social platform — a Spring Boot REST backend with an Angular / NativeScript client, plus a polished **Next.js frontend demo** deployed for quick previewing.

**🔗 Live demo:** [social-media-application-rosy.vercel.app](https://social-media-application-rosy.vercel.app/)

---

## Branch convention

| Branch | Purpose |
|---|---|
| `main` | Full-stack source — **Spring Boot backend + Angular/NativeScript frontend** |
| `frontend-demo` | Frontend-only Next.js build deployed to Vercel (the live demo above) |

---

## Overview

A social networking application covering the core social-feed experience: posts/statuses, stories, chat, groups, and pages. The `main` branch holds the full-stack implementation — a Java **Spring Boot** REST API and an **Angular 11** web client that shares a codebase with a **NativeScript** mobile target. The deployed demo on Vercel is a modern **Next.js** rebuild of the frontend for fast, backend-free previewing.

## Key features

- **Social feed** — posts and statuses with interactions
- **Stories** and story viewing
- **Chat / messaging** between users
- **Groups & Pages** for communities
- **Web + mobile** — shared Angular codebase with a NativeScript mobile target
- **REST API** backend built on Spring Boot

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java, Spring Boot 2.4, Maven, REST |
| Frontend (web/mobile) | Angular 11, TypeScript, NativeScript |
| Frontend demo | Next.js, React, TypeScript, Tailwind CSS (Vercel) |

## Project structure

```
.
├── Backend/                              # Spring Boot REST API
│   ├── src/main/java/com/pali/palindromebackend/
│   │   ├── api/          # REST controllers (AuthenticateController, ChatController, …)
│   │   ├── business/     # BO interfaces + impl; DTO↔Entity mappers; UserDetailsService
│   │   ├── dao/          # Spring Data JPA repositories
│   │   ├── dto/          # Data Transfer Objects (UserDTO, StatusDTO, …)
│   │   ├── entity/       # JPA entities (User, Status, Community, Reaction, …)
│   │   ├── filter/       # JWTRequestFilter — stateless token validation per request
│   │   ├── model/        # Misc request/response models
│   │   ├── service/      # AWS S3 file service (profile images)
│   │   └── util/         # JWTUtil, SecurityConfig, CustomProperties
│   └── pom.xml
└── Frontend/                             # Angular 11 web + NativeScript mobile
    ├── src/app/
    ├── angular.json
    └── nativescript.config.ts
```

## Security architecture (backend)

The backend uses **stateless JWT authentication** (no server-side sessions):

1. Client POSTs credentials to `/api/v1/authenticate` → receives a signed JWT.
2. Every subsequent request carries the JWT in `Authorization: Bearer <token>`.
3. `JWTRequestFilter` (a `OncePerRequestFilter`) validates the token on each request, extracts the username, and loads the `UserDetails` into the `SecurityContext`.
4. `SecurityConfig` (extends `WebSecurityConfigurerAdapter`) marks `/api/v1/authenticate` and user-registration endpoints as public; all other routes require authentication.
5. Tokens are signed with HS256 using a secret from `application.properties`.

> **Known limitation (prototype-era):** `NoOpPasswordEncoder` is in use — passwords are stored as plain text. This is intentional for a portfolio/prototype context and is self-documented in [`REPO_ISSUES.md`](Backend/REPO_ISSUES.md). A production upgrade would swap in BCrypt and a proper secrets vault.

## Local development

### Backend (Spring Boot)

```bash
cd Backend
./mvnw spring-boot:run
```

### Frontend (Angular web)

```bash
cd Frontend
npm install
npm start                 # http://localhost:4200
```

### Frontend (NativeScript mobile)

```bash
cd Frontend
ns run android            # or: ns run ios
```

## Screenshots

> _Add screenshots / demo GIF here._

## Author

**Damika Anupama Nanayakkara** — [Portfolio](https://damika.is-a.dev/) · [GitHub](https://github.com/Damika-Anupama) · [LinkedIn](https://www.linkedin.com/in/damika-anupama)

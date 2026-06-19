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
├── Backend/                  # Spring Boot REST API
│   ├── src/main/java/com/pali # application packages
│   └── pom.xml
└── Frontend/                 # Angular 11 web + NativeScript mobile
    ├── src/app/
    ├── angular.json
    └── nativescript.config.ts
```

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

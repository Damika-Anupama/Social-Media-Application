# Repository Audit Findings (Frontend)

## Security and secrets management
- **Sensitive OAuth credentials committed to source**: Google client ID/secret and Facebook app ID are hardcoded in the development environment file, exposing confidential values and preventing environment-based rotation. Replace with environment-variable driven configuration and omit secrets from the client bundle; use backend OAuth flows or PKCE where applicable.【F:src/environments/environment.ts†L5-L15】
- **Bearer token handling via sessionStorage with no expiry/refresh safeguards**: The token interceptor unconditionally reads a token from `sessionStorage` and forwards it without expiry checks, refresh workflows, or CSRF/XSS protections. Move to secure, HTTP-only cookies or a hardened storage strategy, add refresh token flows, and centralize auth state management with interceptors that handle expiration gracefully.【F:src/app/interceptors/token-interceptor.service.ts†L13-L25】

## Configuration and build hygiene
- **Outdated Angular/NativeScript stack**: The project is pinned to Angular 11/TypeScript 4.0 with deprecated TSLint and legacy NativeScript dependencies, exposing the app to EOL security issues and tooling gaps. Upgrade to current LTS Angular versions, replace TSLint with ESLint, and modernize NativeScript or decouple mobile code paths as needed.【F:package.json†L2-L75】
- **Production environment lacks required settings**: `environment.prod.ts` omits API base URLs and third-party configuration, risking broken builds or accidental use of development settings in production bundles. Define full production-safe configuration and ensure Angular file replacements are aligned with deployment targets.【F:src/environments/environment.prod.ts†L1-L3】

## Code quality and correctness
- **HTTP interceptor lacks interface implementation and strong typing**: `LoggingInterceptorService` omits `HttpInterceptor` implementation and uses loosely typed methods, reducing compile-time checks and making DI ordering harder to reason about. Implement `HttpInterceptor`, type the request/response streams, and rely on Angular’s logging/observability hooks instead of ad-hoc message arrays.【F:src/app/interceptors/logging-interceptor.service.ts†L1-L34】
- **Service methods drop observables and leak debug output**: `sendVerificationCode` never returns the HTTP observable, preventing callers from subscribing or handling errors; `updateUser` still includes console logging. Return the request observable and remove console noise in favor of centralized logging and UI feedback channels.【F:src/app/service/user.service.ts†L12-L85】
- **Dead/unused request parameters**: `findUser`/`findEmail` create `HttpParams` that are never applied, leading to misleading code and potential caching/proxy issues. Remove unused params or correctly attach them to requests with explicit pagination and debouncing strategies.【F:src/app/service/user.service.ts†L47-L56】

## UX/Performance consistency
- **Heavy jQuery/AdminLTE globals inside Angular module**: Global imports of AdminLTE/jQuery assets directly in `AppModule` increase bundle size and risk DOM conflicts with Angular’s renderer. Prefer Angular-friendly UI libraries or lazy-loaded modules, and gate legacy assets behind feature modules or build-time optimization.【F:src/app/app.module.ts†L8-L111】

## Alignment with backend roadmap
- **Front-end lacks parity with backend security/observability upgrades**: The backend roadmap calls for structured logging, OAuth hardening, and modern authentication flows. The frontend should mirror these by adopting structured client-side logging, OpenAPI-driven client generation, MFA-ready UX, and accessibility/localization foundations to maintain end-to-end consistency.

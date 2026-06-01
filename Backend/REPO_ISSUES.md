# Repository Audit Findings

## Security gaps
- **Plain-text password handling**: SecurityConfig uses `NoOpPasswordEncoder`, leaving passwords un-hashed and unsuitable for any environment beyond demos. Replace with a strong encoder (e.g., `BCryptPasswordEncoder`) and migrate stored credentials accordingly.【F:src/main/java/com/pali/palindromebackend/util/SecurityConfig.java†L65-L68】
- **Broadly permissive CORS/auth rules and swallowed errors**: The security configuration wraps HTTP security in a `try` block that only logs to stdout on failure, risking silent misconfiguration and omitting structured logging/alerts. Refactor to fail fast and surface startup misconfiguration through exceptions or dedicated logging.【F:src/main/java/com/pali/palindromebackend/util/SecurityConfig.java†L41-L57】
- **Weak JWT handling**: JWT secrets and expirations are injected as plain strings and parsed manually, with HS256 signing using raw secret text. Prefer strongly typed durations, rotating keys, and asymmetric signing (RS256/ES256) with key management, plus clock skew handling and token revocation strategies.【F:src/main/java/com/pali/palindromebackend/util/JWTUtil.java†L21-L61】

## Error handling and observability
- **Global exception handler is effectively inert**: `GlobalExceptionHandler` only prints uncaught exceptions to stdout instead of returning consistent error responses or integrating with logging/monitoring. Implement `@ExceptionHandler` methods producing structured error payloads and correlate with tracing/metrics.【F:src/main/java/com/pali/palindromebackend/service/Exception/GlobalExceptionHandler.java†L1-L26】
- **Console logging sprinkled through controllers**: Multiple controllers print to stdout (e.g., user ID debugging) instead of using a logger, making production observability and log aggregation difficult. Replace `System.out` calls with a structured logger and remove debug noise.【F:src/main/java/com/pali/palindromebackend/api/impl/UserControllerImpl.java†L50-L52】

## Dependency and build hygiene
- **Outdated & duplicate dependencies**: `pom.xml` targets Spring Boot 2.4.x (EOL) and repeats JUnit dependencies, mixing vintage and Jupiter without BOM alignment. Modernize to a supported Spring Boot version, prune duplicates, and rely on the parent BOM for versions to reduce CVEs and classpath conflicts.【F:pom.xml†L5-L141】

## API design and validation
- **Controller catch-all responses**: Controllers return generic strings on errors and catch broad `Exception`, obscuring root causes and preventing client-specific responses. Prefer domain-specific exceptions, validation annotations, and centralized handling for consistent status codes and messages.【F:src/main/java/com/pali/palindromebackend/api/impl/UserControllerImpl.java†L41-L74】
- **Input validation gaps**: Many request models lack validation annotations despite reliance on `spring-boot-starter-validation`, risking malformed data persistence. Add `@NotNull/@Email/@Size` etc. to DTOs/requests and enforce validation in controllers before processing (representative controller lacks validation hints).【F:src/main/java/com/pali/palindromebackend/api/impl/UserControllerImpl.java†L41-L74】

## Architecture and performance
- **DTO-to-entity mapping done manually in loops**: Controllers repeatedly fetch related entities inside per-item loops (N+1 access patterns) and perform manual mapping, which scales poorly. Introduce batch queries, pagination, and dedicated mappers (e.g., MapStruct) to offload repetitive mapping and avoid N+1 queries.【F:src/main/java/com/pali/palindromebackend/api/impl/UserControllerImpl.java†L57-L115】
- **Lack of API versioning strategy & documentation**: Endpoints are versioned ad hoc (`/api/v1`) without OpenAPI/Swagger documentation or deprecation pathways. Add OpenAPI specs, consistent versioning, and consumer contracts to ease evolution and client integration (inferred from controller definitions).【F:src/main/java/com/pali/palindromebackend/api/impl/UserControllerImpl.java†L23-L38】

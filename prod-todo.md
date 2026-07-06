# Production Deployment TODO

## Critical — App breaks or is insecure without these

- [x] **CORS hardcoded to localhost** — Externalized to `cors.allowed-origins` (`CORS_ALLOWED_ORIGINS` env in prod) in `SecurityConfiguration.java`
- [x] **Secrets in source code** — `secrets.properties` import is now `optional:`; prod resolves all `${...}` from env vars / Docker secrets. Template: `secrets.properties.example`
- [x] **Frontend API URL defaults to localhost** — `.env.production` created (`VITE_API_BASE_URL=/api`, same-origin via nginx)

## Must Create — No deployment mechanism exists

- [x] **Backend Dockerfile** — Multi-stage Maven build → `eclipse-temurin:21-jre-alpine`, non-root
- [x] **Frontend Dockerfile** — Node build stage + nginx serving static files
- [x] **docker-compose.yml** — backend + frontend + PostgreSQL + db-backup + avatar/keys volumes
- [x] **nginx config** — `appointment-booking-frontend/nginx.conf`: `/api` → backend, SPA fallback, HTTPS block (commented)
- [x] **Production Spring profile** — `application-prod.properties`: `ddl-auto=validate`, `logging.level.root=WARN`, `cookie.secure=true`, env-driven CORS

## Should Have — Important for reliability

- [x] **Avatar paths for Linux** — env-driven (`AVATAR_DIRECTORY=/var/uploads/avatars`) on a mounted Docker volume
- [x] **SSL/HTTPS** — Documented in DEPLOYMENT.md (Caddy auto-TLS or certbot + nginx 443 block)
- [x] **Spring Boot Actuator** — `/actuator/health` (public) wired to the container healthcheck
- [x] **Database backups** — `db-backup` sidecar (`postgres-backup-local`), daily dumps to `./backups`
- [x] **RSA keys mounting** — `RSAKeyProperties` reads a configurable `file:`/`classpath:` location; keys mounted read-only, excluded from the image

## Nice to Have — Polish for production

- [ ] **Database migrations** — Replace `ddl-auto` with Flyway/Liquibase (documented as future work in DEPLOYMENT.md)
- [x] **CI/CD pipeline** — `.github/workflows/ci.yml`: build/test + push images to GHCR on `main`
- [ ] **Monitoring** — Log aggregation / error tracking (documented as future work in DEPLOYMENT.md)
- [x] **Rate limiting** — `RateLimitingFilter` throttles `POST /auth/**` per IP (tunable via `APP_RATE_LIMIT_AUTH_*`)
- [x] **Environment documentation** — `DEPLOYMENT.md` documents all env vars and their purpose

## Follow-up (discovered during this work)

- [x] **Generated API client is not reproducible** — regenerated the client, un-ignored `src/API/models`, and committed the full `src/API`; the frontend now builds from a clean checkout. See DEPLOYMENT.md "Generated API client".
- [ ] **Backend test context** — the only test (`contextLoads`) needs a DB + secrets + keys; add an H2 test profile + test keys so CI can run tests (currently skipped).

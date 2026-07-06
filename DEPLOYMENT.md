# Deployment Guide

Production deployment for BookItNow (Spring Boot backend + React/Vite frontend +
PostgreSQL), orchestrated with Docker Compose behind an nginx reverse proxy.

## Architecture

```
                 ┌────────────────────────────┐
  Browser  ─────▶│ frontend (nginx :80/:443)  │
   HTTPS         │  • serves the built SPA     │
                 │  • proxies /api/* ──────────┼──▶ backend (Spring Boot :8080)
                 └────────────────────────────┘            │
                                                            ▼
                                                   postgres (:5432)
                                                            ▲
                                                   db-backup (pg_dump)
```

The frontend calls the API at the same origin under `/api`, so the JWT cookie is
first-party (no cross-site CORS needed). `nginx` strips the `/api` prefix before
forwarding to the backend.

## Quick start

```bash
cp .env.example .env          # then edit values
docker compose up -d --build
```

Then visit `http://<host>/`. See **TLS/HTTPS** below to enable `https`.

---

## Required configuration

### Root `.env` (consumed by docker-compose)

| Variable            | Purpose                                                        | Example |
|---------------------|----------------------------------------------------------------|---------|
| `PUBLIC_URL`        | Public HTTPS origin; used for CORS + cookie/redirect behaviour  | `https://bookitnow.example.com` |
| `POSTGRES_DB`       | Database name                                                   | `bookitnowv2` |
| `POSTGRES_USER`     | Database user                                                   | `bookitnow` |
| `POSTGRES_PASSWORD` | Database password (use a strong secret)                        | `…` |

### Backend environment (set in `docker-compose.yml`, override as needed)

| Variable                    | Purpose                                             | Default in compose |
|-----------------------------|-----------------------------------------------------|--------------------|
| `SPRING_PROFILES_ACTIVE`    | Active Spring profile                               | `prod` |
| `DB_URL`                    | JDBC URL                                             | `jdbc:postgresql://postgres:5432/<db>` |
| `DB_USERNAME` / `DB_PASSWORD` | DB credentials                                    | from `.env` |
| `HIBERNATE_DDL`             | Schema strategy (prod profile forces `validate`)    | `validate` |
| `HIBERNATE_DIALECT`         | Hibernate dialect                                   | PostgreSQL |
| `SSL_CA`                    | DB CA cert (empty for the internal, non-TLS DB)     | `""` |
| `AVATAR_DIRECTORY`          | Avatar upload root (Linux path on a mounted volume) | `/var/uploads/avatars` |
| `AVATAR_USER_DIRECTORY`     | User avatar sub-directory                           | `/var/uploads/avatars/useravatars` |
| `CORS_ALLOWED_ORIGINS`      | Comma-separated allowed browser origins             | `${PUBLIC_URL}` |
| `FRONTEND_IP_ADDRESS`       | Frontend URL used by the backend                    | `${PUBLIC_URL}` |
| `APP_KEYS_PUBLIC_LOCATION`  | JWT public key (Spring resource: `file:`/`classpath:`) | `file:/app/keys/public.pem` |
| `APP_KEYS_PRIVATE_LOCATION` | JWT private key                                     | `file:/app/keys/private.pem` |
| `APP_RATE_LIMIT_AUTH_MAX_REQUESTS` | Max `POST /auth/**` requests per window per IP | `10` |
| `APP_RATE_LIMIT_AUTH_WINDOW_SECONDS` | Rate-limit window length                    | `60` |

> Elasticsearch settings that appear in the local `secrets.properties` are **not**
> required — there is no Elasticsearch dependency wired into the running app.

### Secrets — never commit them

`secrets.properties` is for local dev only and is git-ignored. In production every
`${...}` placeholder in `application.properties` resolves from environment variables
(the file import is `optional:`). Provide them via the compose `.env` / `environment`
blocks or Docker secrets. A template of all keys lives in
`appointment-booking-backend/src/main/resources/secrets.properties.example`.

---

## JWT signing keys (mounted, not baked in)

The RSA keypair is **not** included in the Docker image (see the backend
`.dockerignore`). It is mounted read-only at runtime:

```yaml
volumes:
  - ./appointment-booking-backend/src/main/resources/keys:/app/keys:ro
```

and located via `APP_KEYS_PUBLIC_LOCATION` / `APP_KEYS_PRIVATE_LOCATION`. On the
server, place `public.pem` and `private.pem` in that directory (or point the vars at
a Docker secret path). Locally (non-Docker) the defaults fall back to
`classpath:keys/*.pem`.

Generate a keypair if needed:

```bash
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.pem -out public.pem
```

---

## TLS / HTTPS (Let's Encrypt)

The frontend nginx listens on `:80` out of the box. Two supported options:

**Option A — Caddy in front (simplest, auto-renewing certs).** Put a Caddy container
on the edge; a 3-line `Caddyfile` reverse-proxies to the `frontend` service and
obtains/renews certificates automatically:

```
bookitnow.example.com {
    reverse_proxy frontend:80
}
```

**Option B — certbot + nginx.** Obtain certs with certbot (webroot or standalone),
mount `/etc/letsencrypt` into the frontend container, then uncomment the `443` server
block in `appointment-booking-frontend/nginx.conf` and the `443` port mapping in
`docker-compose.yml`. Renew via a certbot cron/systemd timer.

After enabling HTTPS, keep the backend cookie on `secure=true` (already set in the
prod profile).

---

## Database

### Schema creation (first deploy)

The prod profile uses `ddl-auto=validate`, which **fails if the schema does not yet
exist**. On a brand-new database, create the schema once, then switch back to
`validate`:

```bash
# one-off: let Hibernate create the tables
docker compose run --rm -e HIBERNATE_DDL=update backend
# subsequent runs use validate (the profile default)
docker compose up -d
```

For safe, versioned schema evolution, adopt **Flyway or Liquibase** (see *Future
work*).

### Backups & restore

The `db-backup` service (`prodrigestivill/postgres-backup-local`) writes scheduled
`pg_dump` archives to `./backups` (daily, with weekly/monthly retention). Restore:

```bash
gunzip -c backups/daily/<file>.sql.gz | \
  docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

---

## Health & monitoring

- **Health check:** `GET /actuator/health` (public). Used by the backend container
  healthcheck; other actuator endpoints stay authenticated.
- **Logs:** `docker compose logs -f backend`. Prod logs at `WARN`.
- **Rate limiting:** `POST /auth/**` is throttled per client IP (in-memory, tunable
  via the `APP_RATE_LIMIT_AUTH_*` vars). For multi-instance deployments move this to
  a shared store (Redis / Bucket4j).
- **Aggregation (future):** ship logs/metrics to Grafana+Loki or Sentry.

---

## CI/CD

`.github/workflows/ci.yml` runs on push/PR to `main`:

1. **backend** — `mvn verify` (build + tests).
2. **frontend** — `npm ci` + `vite build`.
3. **images** — on push to `main`, builds and pushes both Docker images to GHCR.

---

## Generated API client

The TypeScript API client under `appointment-booking-frontend/src/API` is generated
from the backend's OpenAPI spec (`typescript-fetch`). The **complete** client —
including `src/API/models` — is now committed, so the frontend builds reproducibly
from a clean checkout with no backend running (the Docker/CI build bypasses the
`prebuild` regeneration hook).

To regenerate after changing backend DTOs/endpoints:

```bash
cd appointment-booking-frontend
# backend must be running on :8080
npm run generate:api      # rewrites src/API from http://localhost:8080/v3/api-docs
```

Then commit the updated `src/API`. (`openapi.json` / `openapi.md5` remain git-ignored
generation artifacts.)

---

## Future work (from `prod-todo.md`)

- **Database migrations** — replace `ddl-auto` with Flyway/Liquibase (baseline the
  current schema, then version changes).
- **Monitoring** — log aggregation + error tracking (Grafana+Loki, or Sentry).

# Production Deployment TODO

## Critical — App breaks or is insecure without these

- [ ] **Cookie `secure(false)`** — Make `CookieUtils.java` configurable per profile (`secure(true)` for prod, `false` for local dev)
- [ ] **CORS hardcoded to localhost** — Externalize allowed origins in `SecurityConfiguration.java` to an environment variable instead of hardcoded `localhost:5173/3000/8080`
- [ ] **Secrets in source code** — `secrets.properties` contains DB password, Elasticsearch password, SSL certs. Production must use environment variables or Docker secrets, not a file
- [ ] **Frontend API URL defaults to localhost** — Create `.env.production` with `VITE_API_BASE_URL=https://yourdomain.com` so the React app calls the correct backend

## Must Create — No deployment mechanism exists

- [ ] **Backend Dockerfile** — Multi-stage Maven build producing a lightweight JRE image
- [ ] **Frontend Dockerfile** — Node build stage + nginx to serve static files
- [ ] **docker-compose.yml** — Orchestrate backend + frontend + PostgreSQL + avatar volume
- [ ] **nginx config** — Reverse proxy (`/api` -> backend), serve frontend static files, HTTPS termination
- [ ] **Production Spring profile** — Create `application-prod.properties` with:
  - `ddl-auto=validate` (not `update`)
  - `logging.level.root=WARN` (no DEBUG SQL logging)
  - `cookie.secure=true`
  - Production CORS origins

## Should Have — Important for reliability

- [ ] **Avatar paths for Linux** — Windows paths (`C:\Users\...`) won't exist on a VPS. Use relative paths or Docker volume mounts (`/var/uploads/avatars`)
- [ ] **SSL/HTTPS** — Set up Let's Encrypt via Caddy or certbot + nginx for automatic certificate renewal
- [ ] **Spring Boot Actuator** — Add health check endpoint (`/actuator/health`) for Docker container health monitoring
- [ ] **Database backups** — Scheduled PostgreSQL `pg_dump` (cron job or Docker sidecar)
- [ ] **RSA keys mounting** — JWT signing keys (`/resources/keys/`) need to be mounted into the Docker container, not baked into the image

## Nice to Have — Polish for production

- [ ] **Database migrations** — Replace `ddl-auto: update` with Flyway or Liquibase for safe, versioned schema changes
- [ ] **CI/CD pipeline** — GitHub Actions to build Docker images and deploy on push to main
- [ ] **Monitoring** — Log aggregation and error tracking (e.g., Grafana + Loki, or Sentry)
- [ ] **Rate limiting** — Protect auth endpoints from brute force attacks
- [ ] **Environment documentation** — Document all required environment variables and their purpose

# BookItNow

An appointment booking app. Customers search for specialists and book free time
slots. Companies manage their employees and see revenue statistics. Employees
manage their working hours, services and appointments.

**Stack:** Spring Boot 3 (Java 21) · React 19 + Vite + Tailwind · embedded H2 database

---

## Quick start: one command

**You need:** [Node.js 20+](https://nodejs.org) and a [Java 21+ JDK](https://adoptium.net).
You don't need a database, Docker, Maven, config files or secrets.

```bash
git clone https://github.com/chris924/bookitnowv2.git
cd bookitnowv2
npm start
```

That's it. Once both parts are up, the app opens in your browser at
**http://localhost:5173**.

> The first run takes a few minutes while Maven and the npm packages download.
> Later runs start in under a minute.

### Demo accounts

The backend fills the database with demo data on every start. The UI is in
Hungarian, so the button to click is listed for each account.

| Role     | Email                    | Password      | Where to log in |
|----------|--------------------------|---------------|-----------------|
| Customer | `john.doe@email.com`     | `password123` | **Belépés** |
| Company  | `cardetailing@gmail.com` | `password`    | **Szolgáltatóknak** |
| Employee | `jdavid@gmail.com`       | `password`    | **Szolgáltatóknak** → flip the toggle to *Alkalmazott belépés* |

### What `npm start` does

1. Checks that Node 20+ and Java 21+ are installed, and that ports `8080` and `5173` are free.
2. Installs the frontend dependencies, on the first run and whenever `package-lock.json` changes.
3. Starts the **backend** on http://localhost:8080 with an embedded in-memory H2 database and demo data.
4. Starts the **frontend** (Vite dev server) on http://localhost:5173.
5. Opens the browser when both are ready. Press **Ctrl+C** to stop both.

Good to know:

- **Data is reset on every backend restart.** The database lives in memory, so
  any accounts or bookings you create are temporary.
- You get logged out when the backend restarts. Without key files, a fresh JWT
  signing key is generated on each start.
- `npm start -- --no-open` skips opening the browser.
- API docs (Swagger UI): http://localhost:8080/swagger-ui.html

### Troubleshooting

| Problem | Fix |
|---|---|
| `Java 21+ ... was not found` | Install a JDK from https://adoptium.net. If `JAVA_HOME` is set, it must point to that JDK. |
| `Port 8080/5173 is already in use` | Stop the other program, often an earlier run that is still going. |
| The backend fails while downloading | Check your internet connection or proxy. Maven needs to reach `repo.maven.apache.org` on the first run. |

---

## Development

### Run the parts separately

```bash
# Backend: http://localhost:8080
cd appointment-booking-backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run

# Frontend: http://localhost:5173 (in a second terminal)
cd appointment-booking-frontend
npm install
npm run dev
```

### Project layout

```
appointment-booking-backend/    Spring Boot REST API (JWT cookie auth, JPA)
appointment-booking-frontend/   React + Vite SPA (generated OpenAPI client in src/API)
scripts/start.mjs               the one-command local runner behind `npm start`
```

### Configuration

Every setting has a working default in
`appointment-booking-backend/src/main/resources/application.properties`, so
nothing needs to be configured. The backend uses an in-memory H2 database that is
recreated and filled with demo data on each start, and it generates JWT signing
keys if no key files are present.

**Using your own PostgreSQL:** copy
`appointment-booking-backend/src/main/resources/secrets.properties.example` to
`secrets.properties` (git-ignored), then uncomment the `DB_*` lines. The demo
data is still re-seeded on every start.

### Regenerating the API client

The TypeScript client in `appointment-booking-frontend/src/API` is generated from
the backend's OpenAPI spec and committed, so the frontend builds without a
running backend. After you change backend DTOs or endpoints:

```bash
cd appointment-booking-frontend
npm run generate:api      # the backend must be running on :8080
```

Then commit the updated `src/API` folder.

### Tests and CI

```bash
cd appointment-booking-backend && ./mvnw verify
```

The tests use the embedded database, so they need no database or secrets.
`.github/workflows/ci.yml` runs on every push and PR to `main`:

1. **backend**: `mvn verify` (build and tests)
2. **frontend**: `npm ci` and `vite build`


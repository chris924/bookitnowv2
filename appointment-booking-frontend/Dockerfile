# ---- Build stage: produce static assets ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# API base URL baked into the bundle at build time.
# Default "/api" matches the nginx reverse proxy in this image (same-origin).
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Bundle with Vite directly, bypassing the "prebuild" hook (which fetches the
# OpenAPI spec from a running backend). Type-checking (tsc) runs in CI, not here.
#
# IMPORTANT: this requires a COMPLETE generated API client under src/API. Because
# src/API/models is currently git-ignored, a clean checkout is missing several DTOs
# and this step will fail with "Could not resolve ./XxxDTO". See DEPLOYMENT.md
# ("Generated API client") for the one-time fix.
RUN npx vite build

# ---- Runtime stage: nginx serving the SPA + proxying /api ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

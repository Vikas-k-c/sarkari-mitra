# Sarkari Mitra Backend

Production-oriented Express, TypeScript, PostgreSQL, Prisma, JWT, and Zod API.

## Setup

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

Use a strong random `JWT_SECRET` in every deployed environment.
Set `TRUST_PROXY_HOPS` only when the API is behind a trusted reverse proxy.
Disable public API documentation in production with `SWAGGER_ENABLED=false`
unless access is restricted at the gateway.

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:studio
```

## API

- `GET /health/live`
- `GET /health/ready`
- `GET /api-docs`
- `GET /api-docs.json`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/profiles`
- `GET /api/v1/profiles`
- `PATCH /api/v1/profiles`

Protected routes require `Authorization: Bearer <access-token>`.

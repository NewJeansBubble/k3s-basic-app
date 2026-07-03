# Backend API

Simple REST API built with Bun, Express, PostgreSQL, Drizzle ORM, Zod, and JWT authentication.

## Setup

Install dependencies:

```bash
bun install
```

Start a temporary PostgreSQL container:

```bash
docker run --rm \
  --name k3s-basic-postgres \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=app \
  -p 5432:5432 \
  postgres:17-alpine
```

Create `.env`:

```env
PORT=3000
DATABASE_URL=postgres://app:app@localhost:5432/app
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=1h
```

Generate a JWT secret with:

```bash
openssl rand -base64 32
```

Run the migrations and start the API:

```bash
bun run db:migrate
bun run dev
```

The API will be available at `http://localhost:3000`.

## Endpoints

| Method   | Path          | Access         |
| -------- | ------------- | -------------- |
| `GET`    | `/`           | Public         |
| `POST`   | `/users`      | Public         |
| `POST`   | `/auth/login` | Public         |
| `GET`    | `/users/:id`  | Owner or ADMIN |
| `PATCH`  | `/users/:id`  | Owner or ADMIN |
| `DELETE` | `/users/:id`  | Owner or ADMIN |

Protected routes require a Bearer token:

```http
Authorization: Bearer <access-token>
```

New users always receive the `USER` role. The `id` and `role` fields cannot be changed through the API.

## Performance test

Configure a test user in `.env`:

```env
PERF_BASE_URL=http://localhost:3000
PERF_EMAIL=performance@example.com
PERF_PASSWORD=password123
PERF_CONNECTIONS=20
PERF_DURATION=15
```

Run the benchmark:

```bash
bun run perf
```

The benchmark logs in once and measures the authenticated `GET /users/:id` endpoint.

## Other commands

```bash
bun run lint
bun run format
bun run format:check
bun run db:generate
bun run db:studio
```

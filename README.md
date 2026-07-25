# E-Commerce Backend API

A full-featured REST API for an e-commerce platform built with **Express**, **Knex**, and **PostgreSQL**. Search is powered by **Elasticsearch**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Variables](#environment-variables)
4. [Migration Commands](#migration-commands)
5. [Seed Commands](#seed-commands)
6. [Running Tests](#running-tests)
7. [Module Dependency Direction (ADR)](#module-dependency-direction-adr)
8. [Project Structure](#project-structure)

---

## Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Node.js | 18.x |
| PostgreSQL | 14.x |
| Elasticsearch | 8.x |
| Docker (optional) | 24.x |

---

## Quick Start

```bash
# 1. Clone and install dependencies
git clone <repo-url>
cd ecommerce-backend
npm install

# 2. Copy the environment template and fill in your values
cp .env.example .env

# 3. Start PostgreSQL and Elasticsearch (Docker shortcut)
docker-compose up -d

# 4. Run database migrations
npm run migrate

# 5. Seed reference data
npm run seed

# 6. Start the development server
npm run dev
```

The API is available at `http://localhost:3000` by default.

---

## Environment Variables

Copy `.env.example` to `.env` and set each variable before starting the server.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port the Express server listens on |
| `NODE_ENV` | No | `development` | Runtime environment (`development` \| `test` \| `production`) |
| `DB_HOST` | Yes | `127.0.0.1` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_NAME` | Yes | `ecommerce_dev` | PostgreSQL database name |
| `DB_USER` | Yes | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | Yes | — | PostgreSQL password |
| `TEST_DB_HOST` | No | `127.0.0.1` | PostgreSQL host for test suite |
| `TEST_DB_PORT` | No | `5432` | PostgreSQL port for test suite |
| `TEST_DB_NAME` | No | `ecommerce_test` | PostgreSQL database name for test suite |
| `TEST_DB_USER` | No | `postgres` | PostgreSQL user for test suite |
| `TEST_DB_PASSWORD` | No | — | PostgreSQL password for test suite |
| `JWT_SECRET` | Yes | — | Secret used to sign JWTs (use a long random string) |
| `JWT_ACCESS_EXPIRY` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | No | `7d` | Refresh token lifetime |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Bcrypt work factor |
| `ELASTICSEARCH_NODE` | Yes | `http://localhost:9200` | Elasticsearch node URL |
| `ELASTICSEARCH_INDEX_PRODUCTS` | No | `products` | Products index name |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window per IP |
| `LOG_LEVEL` | No | `info` | Winston log level |
| `LOG_DIR` | No | `logs` | Directory for log files |
| `CORS_ORIGINS` | No | `http://localhost:3001` | Comma-separated allowed origins |
| `PAYMENT_ADAPTER` | No | `mock` | Payment adapter (`mock`) |
| `ADMIN_EMAIL` | No | `admin@example.com` | Admin seed user e-mail |
| `ADMIN_PASSWORD` | No | `Admin@123` | Admin seed user password |

---

## Migration Commands

```bash
# Apply all pending migrations
npm run migrate
# Equivalent: knex migrate:latest

# Roll back the last batch of migrations
npm run migrate:rollback
# Equivalent: knex migrate:rollback

# Create a new migration file
npm run migrate:make -- <migration_name>
# Equivalent: knex migrate:make <migration_name>
```

Migration files live in `src/db/migrations/` and are numbered sequentially (`001_`, `002_`, …).

---

## Seed Commands

```bash
# Run all seed files in order
npm run seed
# Equivalent: knex seed:run

# Create a new seed file
npm run seed:make -- <seed_name>
# Equivalent: knex seed:make <seed_name>
```

Seed files live in `src/db/seeds/` and are prefixed (`01_`, `02_`, …) to control execution order.

---

## Running Tests

```bash
# Run the full test suite (sequential, shares a single DB connection pool)
npm test

# Run tests and collect coverage
npm run test:coverage
```

Coverage thresholds (branches 70 %, functions/lines/statements 75 %) are enforced and will fail the build if not met.

---

## Module Dependency Direction (ADR)

### Decision

All dependencies between layers must flow **inward** — from higher-level modules toward lower-level infrastructure. Reverse or lateral dependencies are forbidden and are enforced by ESLint (`import/no-restricted-paths` and `import/no-cycle`).

### Allowed dependency direction

```
  HTTP Requests
       │
       ▼
  src/modules/*          (routes → controllers → services)
       │
       ▼
  src/db/repositories    (services call repositories)
       │
       ▼
  src/db/client.js       (Knex instance)
       │
       ▼
  PostgreSQL / Elasticsearch
```

### Supporting layers (may be imported by any layer above them)

```
  src/config/*           ← read by modules, middleware, db client
  src/utils/*            ← read by modules, middleware
  src/middleware/*       ← mounted by app.js; must NOT import from modules
```

### Rationale

- **Testability** — services and repositories can be unit-tested without starting the HTTP layer.
- **Replaceability** — swapping the database client or a payment adapter requires changes only at the adapter boundary.
- **Cycle prevention** — circular imports cause subtle runtime bugs in Node.js; `import/no-cycle` makes them a build error.

### Consequences

- A module's service must not `require` another module's service directly; use the repository layer or an explicit adapter interface.
- Middleware must not `require` application modules; shared logic belongs in `src/utils`.
- Config files must not reference DB or module code.

---

## Project Structure

```
.
├── src/
│   ├── app.js                  # Express app factory (middleware + routes)
│   ├── server.js               # HTTP server entry point
│   ├── config/                 # Environment-derived configuration objects
│   ├── db/
│   │   ├── client.js           # Knex singleton
│   │   ├── migrations/         # Numbered schema migrations
│   │   ├── seeds/              # Ordered seed data
│   │   └── repositories/       # Data-access layer
│   ├── middleware/             # Express middleware (auth, rate-limit, errors…)
│   ├── modules/                # Feature modules (auth, cart, orders…)
│   └── utils/                 # Pure utility functions (logger, pagination…)
├── knexfile.js                 # Knex CLI configuration
├── jest.config.js              # Jest configuration
├── .eslintrc.js                # ESLint rules
├── .env.example                # Environment variable template
├── docker-compose.yml          # Local dev services (Postgres, Elasticsearch)
└── package.json
```

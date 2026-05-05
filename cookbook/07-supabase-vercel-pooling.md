# Supabase Pooling on Vercel

> **Time:** ~1h
> **Stack:** Supabase (Postgres + Supavisor pooler), Vercel preview deploys, Prisma or Drizzle
> **Used in:** every Next.js + Supabase product in the stack

## The problem

You ship a Next.js app on Vercel with Supabase as the database. Local dev is fine. The first preview deploy works. Then under any load (or just rapid re-renders during development), you start seeing `prepared statement "s0" already exists` errors, or `Max client connections reached`, or random query timeouts.

The root cause is that Vercel runs each request in a fresh serverless function with its own DB connection. Supabase Postgres has a connection cap (60 by default on the free tier). At any decent traffic the cap is hit instantly. The fix is the Supavisor pooler — but the pooler has two modes, two URL formats, and two distinct gotchas depending on which ORM you use.

## Solution overview

Use the Supavisor pooled connection URL (port 6543) for all serverless workloads. Use the direct connection URL (port 5432) only for migrations. For most ORMs use **Transaction Mode**; this disables prepared statements but works under serverless connection churn. For raw SQL or when you need prepared statements, use **Session Mode** at a steeper connection cost.

Decide once per project. Document the choice in `CLAUDE.md` so future-you does not undo it.

## Step-by-step

### 1. Find the three URLs in Supabase

In Supabase dashboard → **Project Settings → Database**:

- **Direct connection** (port 5432, looks like `postgres://postgres:[pw]@db.<ref>.supabase.co:5432/postgres`)
- **Connection pooling — Transaction Mode** (port 6543, looks like `postgres://postgres.<ref>:[pw]@aws-0-<region>.pooler.supabase.com:6543/postgres`)
- **Connection pooling — Session Mode** (port 5432, but on the pooler hostname, not the direct DB hostname)

Copy all three. Store as:

```bash
DATABASE_URL=postgres://postgres.<ref>:[pw]@aws-0-<region>.pooler.supabase.com:6543/postgres
DIRECT_URL=postgres://postgres:[pw]@db.<ref>.supabase.co:5432/postgres
```

### 2. Prisma — the canonical setup

`schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Add `?pgbouncer=true&connection_limit=1` to `DATABASE_URL`:

```bash
DATABASE_URL="postgres://...:6543/postgres?pgbouncer=true&connection_limit=1"
```

The `pgbouncer=true` flag tells Prisma to disable prepared statements. The `connection_limit=1` keeps each serverless function from grabbing more than one slot.

Run migrations against `DIRECT_URL` (Prisma uses it automatically when configured above):

```bash
pnpm prisma migrate deploy
```

### 3. Drizzle — the same idea in fewer pieces

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
});

export const db = drizzle(queryClient);
```

`prepare: false` disables prepared statements. `max: 1` is the connection cap per serverless instance.

For migrations use the direct URL in a separate client that does support prepared statements:

```typescript
import postgres from 'postgres';
const migrationClient = postgres(process.env.DIRECT_URL!, { max: 1 });
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
await migrationClient.end();
```

### 4. Supabase JS client — usually fine as-is

`@supabase/supabase-js` calls the PostgREST layer, not raw Postgres. It does not hit the pooler at all and these issues do not apply. Continue using it for client-side reads, RLS-gated queries, and auth.

The pooling discussion only matters for **server-side direct DB access** through Prisma, Drizzle, Kysely, or raw `pg`.

### 5. Vercel env wiring

In Vercel project settings → Environment Variables:

| Var | Production | Preview | Development |
|-----|------------|---------|-------------|
| `DATABASE_URL` | pooled URL | pooled URL | pooled URL |
| `DIRECT_URL` | direct URL | direct URL | direct URL |
| `NEXT_PUBLIC_SUPABASE_URL` | project URL | project URL | project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key | anon key | anon key |

Be careful with preview deploys — every preview branch hits the same prod database unless you have set up Supabase branching. For real isolation use Supabase's branching feature ([docs](https://supabase.com/docs/guides/platform/branching)).

### 6. When to use Session Mode

Session Mode keeps prepared statements working at the cost of holding the connection for the whole serverless invocation. Use it when:

- You have a long-running background job (not a serverless route)
- You use a feature that requires session state (e.g. `LISTEN`/`NOTIFY`, advisory locks, temp tables)
- You hit a library that hard-requires prepared statements and you cannot disable them

For everything else, Transaction Mode wins.

### 7. Verify under load

Simulate connection churn before you trust it. From your laptop:

```bash
hey -n 200 -c 20 https://<preview-url>/api/db-test
```

Where `/api/db-test` runs a trivial query. If you see no `prepared statement` errors and no `Max client connections` errors, the pooler is working. If you do, re-check `?pgbouncer=true` and `connection_limit=1` (Prisma) or `prepare: false` and `max: 1` (Drizzle).

## Pitfalls

- **Forgetting `?pgbouncer=true` and shipping prepared-statement errors only in production.** Local dev usually does not see the issue because there is no connection churn. The first time it shows up is the first traffic spike.
- **Running `prisma migrate dev` against the pooler.** Migrations need a direct connection. Set `directUrl` and Prisma uses it automatically; without it migrations fail mid-way and leave the schema in a broken state.
- **`connection_limit=1` is misread as "1 connection for the whole app."** It is per serverless instance. Vercel may run dozens of concurrent instances; Supavisor multiplexes them onto a smaller pool of real connections.
- **Using the pooled URL for `psql` debugging.** Works but shows wrong server-side state because of pooling. Use the direct URL for interactive queries.
- **Mixing `@supabase/supabase-js` and Prisma in the same route and being surprised they hit different layers.** They do. supabase-js goes through PostgREST. Prisma goes through the pooler. They do not share a connection.

## References

- [Supabase Supavisor docs](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Prisma serverless connection management](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#serverless-environments-faas)
- [Drizzle + Supabase guide](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [Supabase branching](https://supabase.com/docs/guides/platform/branching)
- [recipe 06 — Sentry to catch the connection errors when they slip through](06-sentry-fullstack.md)

# Admin panel and demo sites

`bezikee.com/admin` is the lead pipeline, ported from the `lead-tracking` app: scrape
Google Maps for local businesses with no real website, work them as leads, and generate a
demo site to pitch with. Demo sites are published at `demo.bezikee.com/<uuid>`: anyone
with the link can see the page, and nobody can find it without one.

```
bezikee.com/                  public site           app/(site)/…       static, unchanged
bezikee.com/admin/…           password-protected    app/admin/…        reads Postgres
bezikee.com/api/admin/…       password-protected    app/api/admin/…
demo.bezikee.com/<uuid>       public by link        proxy.ts → app/demo-site/[id]
```

The code lives in `src/admin/` (imported as `@admin/…`). `proxy.ts` handles both the
password check and the demo subdomain, and only runs for admin and demo requests. Public
pages never touch it or the database.

---

## How it differs from lead-tracking

`lead-tracking` ran as a long-lived Docker container on the VPS. The website runs on
Vercel, where functions are short-lived and the filesystem isn't kept, so these parts changed:

| | lead-tracking (VPS) | bezikee-web (Vercel) |
|---|---|---|
| Database | Postgres beside the app | Managed Postgres (Neon), `DATABASE_URL` |
| Demo pages | Files in `generated-sites/`, committed and redeployed | Rows in `demo_sites`, live as soon as a build finishes |
| Demo URL | `/demos/<slug>/index.html` | `demo.bezikee.com/<uuid>`, kept the same when a site is rebuilt |
| Scrapes | Background promise, no time limit | `after()`, stops cleanly at 5 min; **re-run to continue** |
| Stuck jobs | Swept at boot | Swept whenever job state is read, by age |
| Migrations | At container start | During `vercel-build` (`scripts/db-migrate.mts`) |
| Backups | `pg_dump` before each scrape | Neon point-in-time restore |
| Logs | JSONL in `data/logs` | Vercel's Logs tab (JSONL still written locally) |
| Password | `APP_ACCESS_PASSWORD` | `ADMIN_PASSWORD` |

**Long scrapes.** A function can run for at most 300s (the Hobby plan limit). A job stops
about 30s before that and keeps everything it found. It never marks unfinished searches as
covered, so clicking **Re-run the rest** (or running the same sweep again) continues where
it stopped and only pays for the remaining searches. On Vercel Pro you can raise the limit to
800s: change `maxDuration` in `app/api/admin/jobs/route.ts` **and**
`SCRAPE_MAX_DURATION_SECONDS` in `src/admin/lib/scrape/runner.ts` together.

**Generating demo sites** still runs the `claude` CLI, so it only works from a laptop
running `npm run dev`. The Generate button is hidden on bezikee.com. Point your local
`DATABASE_URL` at the production database and anything you generate goes live at once;
everyone else sees the link in the panel.

### How a demo site is generated

1. **Art direction.** Code chooses the layout, hero, footer, palette, font pairing,
   motion and ornament (`src/admin/lib/generate/direction.ts`). Choices suit the trade,
   avoid what recent builds used, and a rebuild always gets a new look.
2. **Design.** The agent (`claude -p`) designs the page with the Hallmark skill
   (`src/admin/skills/hallmark`) and the art direction.
3. **Review, up to twice.** Our own code opens the page in headless Chrome, served with
   the same headers as demo.bezikee.com, and takes phone and laptop screenshots of the
   first screen and the whole page. It also measures sideways scroll and whether the
   call button is on the first screen. The same agent session resumes, looks at the
   screenshots and fixes the page. Invented years and image references also go back for
   fixing rather than failing the build straight away.
4. **Publish.** The page must pass the hard checks, then it goes live on
   demo.bezikee.com.

Needs Google Chrome (or Chromium, Edge or Brave) installed; set `CHROME_PATH` for another
location. Without one, builds still work, just without the visual review. A build takes
about 5–15 minutes. `SITE_AGENT_REVIEWS` changes the maximum number of review rounds (default 3; it stops early once the agent approves an unchanged page).

**The agent is sandboxed** (`src/admin/lib/generate/sandbox.ts`):
- It can write only in its own build folder.
- Its shell runs inside macOS's sandbox: no network, no reading your home folder or
  the project.
- It starts with none of the app's secrets in its environment, and loads no MCP
  servers or claude.ai connectors.
- Anything not pre-approved is refused.

Chrome runs in our process, not the agent's, so the sandbox doesn't need loosening for it.

---

## One-time setup

### 1. Create the database

In Vercel: **Storage → Create → Neon (Postgres)**, connected to this project. That sets
`DATABASE_URL` for you. Use the **pooled** connection string (the host contains `-pooler`):
every function instance opens its own connections, and the pooler stops them from using up
the database's connection limit.

(Any Postgres 14+ works; it only needs `DATABASE_URL`.)

### 2. Set the environment variables

Vercel → Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `DATABASE_URL` | Set by the Neon integration |
| `ADMIN_PASSWORD` | `openssl rand -base64 24`. **Required**: without it `/admin` returns 503 |
| `GOOGLE_MAPS_API_KEY` | The same Places API (New) key lead-tracking used |
| `DEMO_BASE_URL` | Optional. Defaults to `https://demo.bezikee.com` |

Changing `ADMIN_PASSWORD` signs everyone out immediately.

### 3. Add the demo domain

Vercel → Project → Settings → Domains → add `demo.bezikee.com` to **this** project, and
create the DNS record Vercel asks for (a `CNAME` to `cname.vercel-dns.com`). Nothing else is
needed: `proxy.ts` recognises the host and serves only `/<uuid>` on it. Every other path
there is a 404, and the bare domain redirects to bezikee.com.

### 4. Deploy

Push. `vercel-build` applies migrations, then builds. If a migration fails, the build fails
and the previous deployment keeps serving. With no `DATABASE_URL` it skips migrations and the
public site still deploys.

### 5. Move the existing leads across

```bash
# Dump the VPS database through the SSH tunnel (in lead-tracking: npm run tunnel).
pg_dump "postgres://lead_tracking:<password>@localhost:5433/lead_tracking" \
  --format=custom --no-owner --no-privileges --file=leads.dump

# Restore into Neon. Use the *direct* (non-pooler) connection string for this.
# Deploy first so the schema exists; the flags are explained in lead-tracking's DEPLOY.md.
pg_restore --dbname="$NEON_DIRECT_URL" --no-owner --no-privileges \
  --data-only --disable-triggers --exclude-schema=drizzle leads.dump

# Then check the row counts and the id sequence came across:
psql "$NEON_DIRECT_URL" -c "select (select count(*) from businesses) b, (select count(*) from leads) l,
  (select count(*) from lead_events) e, (select count(*) from cell_coverage) c;"
psql "$NEON_DIRECT_URL" -c "select last_value from businesses_id_seq;"
```

Then publish the demo sites that were generated before (it also repoints their leads' old
`/demos/…` links):

```bash
DATABASE_URL="$NEON_DIRECT_URL" npm run demos:import -- \
  --from ../../leads/lead-tracking/generated-sites --dry-run   # look first
DATABASE_URL="$NEON_DIRECT_URL" npm run demos:import -- \
  --from ../../leads/lead-tracking/generated-sites
```

---

## Local development

```bash
createdb bezikee_admin
cp .env.example .env.local        # fill in the admin section
npm run db:migrate
npm run seed:demo                 # optional: 60 fake businesses, local databases only
npm run dev                       # http://localhost:3000/admin/
```

With `ADMIN_PASSWORD` unset locally, there's no login screen. To view demos locally set
`DEMO_BASE_URL=http://demo.localhost:3000`; Chrome and Firefox resolve `*.localhost` to
your machine without any setup.

To generate demos for real, point `DATABASE_URL` at production. **You are then working on
live data**: deletes are real, and `seed:demo` refuses to run unless you pass
`--allow-remote`.

## Commands

| | |
|---|---|
| `npm run dev` | Site and admin panel |
| `npm test` | Admin test suite. Uses its own `bezikee_admin_test` database and wipes it |
| `npm run lint` | Generate route types, then typecheck |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
| `npm run db:generate` | New migration after editing `src/admin/lib/db/schema.ts` |
| `npm run db:studio` | Browse the database |
| `npm run seed:demo` | Fake leads (local databases only) |
| `npm run demos:import` | Publish old `generated-sites/` pages |
| `npm run logs` | Read local JSONL logs (`--errors`, `--job 4`, `--spend`, …) |

## Security notes

- The admin session cookie applies only to `bezikee.com`, so it is never sent to
  `demo.bezikee.com`, where model-written HTML runs. The internal `/demo-site/` route
  returns 404 on the main domain for the same reason.
- Demo pages are served with a CSP that allows no scripts, no network requests and no
  framing, plus `noindex` and `no-referrer` (the link is the secret, so it shouldn't leak
  through the `Referer` header).
- Demo ids are random v4 UUIDs, checked before they reach the database. Nothing else is
  accepted.
- After login, the redirect only goes to `/admin` paths.
- `/admin/` and `/api/` are disallowed in `robots.txt`, and admin pages are `noindex`.

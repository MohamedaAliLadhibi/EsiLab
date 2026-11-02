# Deploy EsiLab on the OVH VPS

This setup runs the two Next.js sites, the public and admin Express APIs,
PostgreSQL, Redis, and Caddy on one VPS. PostgreSQL and Redis are only reachable
inside the Docker network. Caddy serves the three public hostnames over HTTPS
and compresses HTTP responses.

## Before deploying

1. Use an Ubuntu LTS VPS and point DNS A records for `esilab.tn`,
   `www.esilab.tn`, `admin.esilab.tn`, and `api.esilab.tn` to its public IPv4.
   If the domain is different, edit the four domain values in `.env` instead.
2. Install Docker Engine and the Docker Compose plugin.
3. Open inbound TCP ports 22, 80, and 443 in the OVH firewall. Do not expose
   ports 3000, 3001, 4000, 4001, 5432, or 6379 to the public internet.
4. Clone this repository onto the VPS and enter the repository directory.
5. Copy `.env.production.example` to `.env`. Replace all three placeholder
   secrets with unique, strong values. Keep `.env` private; it is git-ignored.

## Build and start

Build the services sequentially to avoid running both memory-heavy Next.js
builds at once on the 4 GB VPS:

```sh
docker compose build public-api admin-api
docker compose build public-site
docker compose build admin-site
```

Start the data services first:

```sh
docker compose up -d postgres redis
```

If this is a fresh catalogue, initialize its schema and canonical fields:

```sh
docker compose run --rm admin-api npm run migrate
docker compose run --rm admin-api npm run seed
```

If you already have catalogue data, export and verify a backup from its current
PostgreSQL server before proceeding. Restore that backup into this Postgres
volume **before** running migrations or the seed. If your existing database
already has Knex migration history, `npm run migrate` will apply only newer
migrations. Do not restore over a database that contains data you need to keep.

Then start the APIs:

```sh
docker compose up -d public-api admin-api
```

Start the sites and HTTPS proxy:

```sh
docker compose up -d public-site admin-site caddy
docker compose ps
docker compose logs --tail=100 caddy public-site admin-site public-api admin-api
```

Once DNS has propagated, verify `https://api.esilab.tn/health`,
`https://www.esilab.tn`, and `https://admin.esilab.tn`. Caddy obtains and renews
HTTPS certificates automatically; keep ports 80 and 443 reachable.

## Keep it responsive

- The Next.js Docker images build the sites before runtime. Build them one at a
  time as shown above; do not run `next build` on every container restart.
- The public API sends short cache headers for GET catalogue responses. The
  homepage also revalidates its catalogue data every five minutes.
- Database connections open on demand and each API process is capped at five
  PostgreSQL connections by default.
- Monitor memory and disk usage with `docker stats` and `df -h`. The 40 GB disk
  also holds the PostgreSQL/Redis volumes and container images.
- Back up PostgreSQL off the VPS regularly. A backup stored only on the same
  VPS will not protect against VPS or disk failure.

## Updating the deployment

From the repository directory, pull the intended commit, rebuild the changed
service, and restart it. For example:

```sh
git pull
docker compose build public-site
docker compose up -d public-site
```

Run `docker compose run --rm admin-api npm run migrate` after deploying a commit
that adds database migrations. Avoid `docker compose down -v`; that removes the
database and Redis data volumes.

# CRM setup

Login lives at `/admin`. The dashboard is at `/crm`. Both are noindex and blocked in `robots.txt`.

## Local vs online (keep them separate)

| | Local (`npm run dev`) | Online (Hostinger) |
|---|---|---|
| Config file | `.env.local` (gitignored) | Node.js env vars in hPanel only |
| Database name | `kpi_plus_dev` on AppServ `127.0.0.1` | Hostinger MySQL (e.g. `u…_kpiplus`) |
| Safety | Remote hosts refused unless `ALLOW_REMOTE_DB=1` | App uses `127.0.0.1` on the server |

Never paste the live Hostinger `DATABASE_URL` into `.env` / `.env.local` for daily work — that overwrites production data when you save CRM/CMS locally.

## Local (MySQL — AppServ)

1. Copy `.env.example` to `.env` if needed.
2. Run once: `npm run db:local`  
   Creates `kpi_plus_dev`, clones from existing `kpi_plus` when empty, and writes `.env.local`.
3. Or create manually:

```sql
CREATE DATABASE IF NOT EXISTS kpi_plus_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```env
# web/.env.local
DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/kpi_plus_dev?sessionVariables=sql_mode='ANSI_QUOTES'"
```

4. Run `npm install` then `npx prisma db push` (or `npm run crm:setup` / `npx prisma migrate deploy`).
5. If `prisma generate` fails with `EPERM` on Windows, stop `next dev`, run `npx prisma generate`, then start the app again.
6. Open http://localhost:3000/admin and create the first owner: name, login phone, recovery email, and your own 4-digit PIN. There is no published default PIN.
7. Leave `LEAD_NOTIFICATION_EMAIL` blank until the live address is confirmed. Do not guess `thekpipus.com`.

Without SMTP, device codes and PIN-reset links are printed in the Next.js terminal in development only.

Legacy SQLite migrations are kept under `prisma/migrations_sqlite/` for reference only.

## Hostinger MySQL

1. Create the database in hPanel → **Databases** (dedicated user, not root). Keep it distinct from local `kpi_plus_dev`.
2. URL-encode special characters in the password (`#` → `%23`, `;` → `%3B`) and keep `ANSI_QUOTES`.
3. Set `DATABASE_URL` and `CRM_BASE_URL` only on the Hostinger Node.js app env. Prefer host `127.0.0.1` (not `localhost`) from the app itself. Do not commit this URL to Git and do not keep it in local `.env` files.
4. Remote admin from this PC (rare): enable Remote MySQL, temporarily set `ALLOW_REMOTE_DB=1`, run the needed Prisma command, then remove the remote URL and the flag.
5. Run `npx prisma migrate deploy` (or `npx prisma db push` on an empty database) against that Hostinger URL.

## Production settings to confirm

- Confirmed lead notification email
- Login phone and recovery email for the owner
- Persistent MySQL `DATABASE_URL` (dedicated user, not root)
- SMTP host, from address, and credentials
- `CRM_BASE_URL` for reset links

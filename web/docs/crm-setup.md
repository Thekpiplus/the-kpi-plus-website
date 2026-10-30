# CRM setup

Login lives at `/admin`. The dashboard is at `/crm`. Both are noindex and blocked in `robots.txt`.

## Local (MySQL — AppServ)

1. Copy `.env.example` to `.env` if needed.
2. Create the database once (AppServ MySQL root password is often `12345678`):

```sql
CREATE DATABASE IF NOT EXISTS kpi_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Set `DATABASE_URL` (include `ANSI_QUOTES` so quoted identifiers in raw SQL keep working):

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/kpi_plus?sessionVariables=sql_mode='ANSI_QUOTES'"
```

4. Run `npm install` then `npx prisma db push` (or `npm run crm:setup` / `npx prisma migrate deploy`).
5. If `prisma generate` fails with `EPERM` on Windows, stop `next dev`, run `npx prisma generate`, then start the app again.
6. Open http://localhost:3000/admin and create the first owner: name, login phone, recovery email, and your own 4-digit PIN. There is no published default PIN.
7. Leave `LEAD_NOTIFICATION_EMAIL` blank until the live address is confirmed. Do not guess `thekpipus.com`.

Without SMTP, device codes and PIN-reset links are printed in the Next.js terminal in development only.

Legacy SQLite migrations are kept under `prisma/migrations_sqlite/` for reference only.

## Hostinger MySQL

1. Create the database in hPanel → **Databases** (dedicated user, not root).
2. URL-encode special characters in the password (`#` → `%23`, `;` → `%3B`) and keep `ANSI_QUOTES`.
3. From this PC use the remote hostname (`srvXXX.hstgr.io`) or its IPv4 address if Prisma fails on IPv6. Enable **Remote MySQL** for your public IP if the connection is refused.
4. On the Hostinger Node.js app, set `DATABASE_URL` with host `127.0.0.1` (not `localhost`) and `CRM_BASE_URL` to the live site. Do not commit this URL to Git.
5. Run `npx prisma migrate deploy` (or `npx prisma db push` on an empty database) against that URL.

## Production settings to confirm

- Confirmed lead notification email
- Login phone and recovery email for the owner
- Persistent MySQL `DATABASE_URL` (dedicated user, not root)
- SMTP host, from address, and credentials
- `CRM_BASE_URL` for reset links

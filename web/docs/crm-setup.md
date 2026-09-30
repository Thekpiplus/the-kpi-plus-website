# CRM setup

Login lives at `/admin`. The dashboard is at `/crm`. Both are noindex and blocked in `robots.txt`.

## Local

1. Copy `.env.example` to `.env` if needed. Keep `DATABASE_URL="file:./dev.db"`.
2. Run `npm install` then `npx prisma migrate dev --name init` (or `npx prisma db push` the first time).
3. Open http://localhost:3000/admin and create the first owner: name, login phone, recovery email, and your own 4-digit PIN. There is no published default PIN.
4. Leave `LEAD_NOTIFICATION_EMAIL` blank until the live address is confirmed. Do not guess `thekpipus.com`.

Without SMTP, device codes and PIN-reset links are printed in the Next.js terminal in development only.

## Production settings to confirm

- Confirmed lead notification email
- Login phone and recovery email for the owner
- Persistent `DATABASE_URL` (SQLite is for local only)
- SMTP host, from address, and credentials
- `CRM_BASE_URL` for reset links

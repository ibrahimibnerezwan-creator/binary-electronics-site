# Database setup

`0000_careful_shiver_man.sql` describes the complete schema for a **new, empty database**, including the local regression-test database. Do not apply this baseline migration to the existing production database.

For an existing Binary Electronics database, run `npx tsx scripts/migrate.ts` to preview the additive migration, then `npm run db:migrate` to apply it. It only creates missing `newsletter`, `contact_messages` and `rate_limits` tables. It does not drop tables, replace catalogue data or change store settings. Apply this migration before deploying the form and rate-limit changes.

The commands use `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from the environment, falling back to the local `.env` file. Verify that they point to the intended Binary Electronics database before applying.

`npm test` always creates its own temporary local database and never uses the production database.

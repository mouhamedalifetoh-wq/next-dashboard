import bcrypt from 'bcrypt';
import { createHash, timingSafeEqual } from 'node:crypto';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

// --- Seed endpoint hardening (not part of the official course) ---------------
// 1. The token is read from the `x-seed-token` HEADER only, never the URL, so it
//    cannot end up in browser history, access logs or Referer headers.
// 2. In production the endpoint is disabled unless SEED_TOKEN is configured.
//    (Locally, with no SEED_TOKEN set, it stays open as in the course.)
// 3. After a successful seed the endpoint refuses to run again.
// The token and the database error details are never logged or returned.

function hasValidToken(request: Request): boolean {
  const expected = process.env.SEED_TOKEN;
  if (!expected) return process.env.NODE_ENV !== 'production';

  const provided = request.headers.get('x-seed-token') ?? '';
  // Hash both sides so the buffers have equal length for timingSafeEqual.
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

async function isAlreadySeeded(): Promise<boolean> {
  const [tables] = await sql`
    SELECT
      to_regclass('public.users') AS users,
      to_regclass('public.customers') AS customers,
      to_regclass('public.invoices') AS invoices,
      to_regclass('public.revenue') AS revenue
  `;
  if (!tables.users || !tables.customers || !tables.invoices || !tables.revenue) {
    return false;
  }

  const [counts] = await sql`
    SELECT
      (SELECT count(*) FROM users) AS users,
      (SELECT count(*) FROM customers) AS customers,
      (SELECT count(*) FROM invoices) AS invoices,
      (SELECT count(*) FROM revenue) AS revenue
  `;
  return (
    Number(counts.users) > 0 &&
    Number(counts.customers) > 0 &&
    Number(counts.invoices) > 0 &&
    Number(counts.revenue) > 0
  );
}

export async function GET(request: Request) {
  // Wrong or missing token: behave as if the route does not exist.
  if (!hasValidToken(request)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    if (await isAlreadySeeded()) {
      return Response.json(
        { message: 'Database already initialized' },
        { status: 410 },
      );
    }

    await sql.begin((sql) => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    // Log only the error type, never its message (it may contain connection details).
    console.error('Seed failed:', error instanceof Error ? error.name : 'unknown');
    return Response.json({ error: 'Seeding failed' }, { status: 500 });
  }
}

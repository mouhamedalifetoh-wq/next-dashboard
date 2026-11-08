import { Metadata } from 'next';
import CustomersTable from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  // Same input hardening as the invoices page: the URL is user input, so only
  // accept a string and drop NUL bytes (Postgres rejects them).
  const rawQuery = searchParams?.query;
  const query = (typeof rawQuery === 'string' ? rawQuery : '').replaceAll(
    '\0',
    '',
  );

  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} query={query} />
    </main>
  );
}

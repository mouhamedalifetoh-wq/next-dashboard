import { Metadata } from 'next';
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page(props: {
  searchParams?: Promise<{ customerId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const customers = await fetchCustomers();
  // Optional preselection from the customer page. Only accepted if it is one of
  // the real customers; anything else is ignored.
  const requested = searchParams?.customerId;
  const defaultCustomerId =
    typeof requested === 'string' && customers.some((c) => c.id === requested)
      ? requested
      : undefined;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} defaultCustomerId={defaultCustomerId} />
    </main>
  );
}

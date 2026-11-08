import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { PencilIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CopyEmail from '@/app/ui/customers/copy-email';
import EditCustomerForm from '@/app/ui/customers/edit-form';
import InvoiceStatus from '@/app/ui/invoices/status';
import EmptyState from '@/app/ui/empty-state';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { fetchCustomerById, fetchInvoicesByCustomer } from '@/app/lib/data';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: 'Customer',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  // The id comes from the URL: a malformed one is a 404, not a database error.
  if (!z.string().uuid().safeParse(id).success) {
    notFound();
  }

  const [customer, invoices] = await Promise.all([
    fetchCustomerById(id),
    fetchInvoicesByCustomer(id),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: customer.name,
            href: `/dashboard/customers/${id}`,
            active: true,
          },
        ]}
      />

      <div className="v-glass mb-6 flex flex-wrap items-center gap-4 p-4 md:p-6">
        <Image
          src={customer.image_url}
          alt={`${customer.name}'s profile picture`}
          width={56}
          height={56}
          className="rounded-full ring-1 ring-white/15"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-semibold">
            {customer.name}
          </p>
          <div className="flex items-center gap-2">
            <p className="truncate text-sm text-virus-mute">{customer.email}</p>
            <CopyEmail email={customer.email} />
          </div>
        </div>
        <dl className="grid w-full grid-cols-3 gap-4 text-sm sm:w-auto">
          <div>
            <dt className="text-xs text-virus-mute">Invoices</dt>
            <dd className="font-display font-semibold">
              {customer.total_invoices}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-virus-mute">Pending</dt>
            <dd className="font-display font-semibold text-virus-amber">
              {customer.total_pending}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-virus-mute">Paid</dt>
            <dd className="font-display font-semibold text-virus-neon">
              {customer.total_paid}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EditCustomerForm
          customer={{ id: customer.id, name: customer.name, email: customer.email }}
        />

        <section className="v-glass p-4 md:p-6" aria-labelledby="cust-invoices">
          <h2
            id="cust-invoices"
            className="mb-4 font-display text-lg font-semibold"
          >
            Invoices
          </h2>
          <Link
            href={`/dashboard/invoices/create?customerId=${customer.id}`}
            className="v-btn-quiet mb-4"
          >
            New invoice for {customer.name}
          </Link>
          {invoices.length === 0 ? (
            <EmptyState
              icon={DocumentTextIcon}
              title="No invoices yet"
              message="This customer has no invoices."
            >
              <Link href="/dashboard/invoices/create" className="v-btn-quiet">
                Create invoice
              </Link>
            </EmptyState>
          ) : (
            <ul className="divide-y divide-white/10">
              {invoices.map((invoice) => (
                <li
                  key={invoice.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-display font-semibold">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p className="text-xs text-virus-mute">
                      {formatDateToLocal(invoice.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <InvoiceStatus status={invoice.status} />
                    <Link
                      href={`/dashboard/invoices/${invoice.id}/edit`}
                      className="v-icon-btn"
                      aria-label={`Edit invoice of ${formatCurrency(invoice.amount)}`}
                    >
                      <PencilIcon className="w-5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

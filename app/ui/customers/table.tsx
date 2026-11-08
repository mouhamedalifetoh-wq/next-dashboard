import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { display } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import EmptyState from '@/app/ui/empty-state';
import { FormattedCustomersTable } from '@/app/lib/definitions';

export default async function CustomersTable({
  customers,
  query = '',
}: {
  customers: FormattedCustomersTable[];
  query?: string;
}) {
  return (
    <div className="w-full">
      <h1
        className={`${display.className} mb-1 text-2xl font-semibold md:text-3xl`}
      >
        Customers
      </h1>
      <p className="mb-6 text-sm text-virus-mute">
        Everyone you invoice, with what they have paid and what is still pending.
      </p>
      <Search placeholder="Search customers..." />
      <div className="mt-6 flow-root">
        {customers.length === 0 ? (
          <div className="v-glass">
            <EmptyState
              icon={query ? MagnifyingGlassIcon : UserGroupIcon}
              title={query ? 'No customers found' : 'No customers yet'}
              message={
                query
                  ? 'Nothing matches that search. Try a different name or email.'
                  : 'Customers will appear here once they have been added.'
              }
            >
              {query ? (
                <Link href="/dashboard/customers" className="v-btn-quiet">
                  Clear search
                </Link>
              ) : null}
            </EmptyState>
          </div>
        ) : (
          <div className="inline-block min-w-full align-middle">
            <div className="v-glass p-2 lg:pt-0">
              <div className="lg:hidden">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full ring-1 ring-white/15"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{customer.name}</p>
                        </div>
                        <p className="text-sm text-virus-mute">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b border-white/10 py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs text-virus-mute">Pending</p>
                        <p className="font-display font-semibold text-virus-amber">
                          {customer.total_pending}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs text-virus-mute">Paid</p>
                        <p className="font-display font-semibold text-virus-neon">
                          {customer.total_paid}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm text-virus-mute">
                      <p>{customer.total_invoices} invoices</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-virus-ink lg:table">
                <thead className="text-left text-xs font-medium uppercase tracking-wider text-virus-mute">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Invoices
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-t border-white/10 text-sm transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full ring-1 ring-white/15"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-virus-mute">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {customer.total_invoices}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-virus-amber">
                        {customer.total_pending}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-virus-neon">
                        {customer.total_paid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

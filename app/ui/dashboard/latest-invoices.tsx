import { ArrowPathIcon, InboxIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { display } from '@/app/ui/fonts';
import { fetchLatestInvoices } from '@/app/lib/data';
import EmptyState from '@/app/ui/empty-state';

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2
        className={`${display.className} mb-4 text-xl font-semibold md:text-2xl`}
      >
        Latest Invoices
      </h2>
      <div className="v-glass flex grow flex-col justify-between p-4">
        {latestInvoices.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="No invoices yet"
            message="New invoices will show up here as soon as they are created."
          />
        ) : (
          <div className="px-2">
            {latestInvoices.map((invoice, i) => {
              return (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}/edit`}
                  className={clsx(
                    'flex animate-fade-up flex-row items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-white/[0.04]',
                    {
                      'border-t border-white/10': i !== 0,
                    },
                  )}
                  style={{ animationDelay: `${400 + i * 70}ms` }}
                >
                  <div className="flex items-center">
                    <Image
                      src={invoice.image_url}
                      alt={`${invoice.name}'s profile picture`}
                      className="mr-4 rounded-full ring-1 ring-white/15"
                      width={32}
                      height={32}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-virus-ink md:text-base">
                        {invoice.name}
                      </p>
                      <p className="hidden text-sm text-virus-mute sm:block">
                        {invoice.email}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`${display.className} truncate text-sm font-semibold text-virus-ink md:text-base`}
                  >
                    {invoice.amount}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
        <div className="flex items-center pb-2 pt-5">
          <ArrowPathIcon className="h-5 w-5 text-virus-mute" />
          <h3 className="ml-2 text-sm text-virus-mute ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}

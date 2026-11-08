import Link from 'next/link';
import clsx from 'clsx';

// Quick filters for the invoices list. They only set ?query= (the search already
// matches the status column), so no new data code is needed.
const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
];

export default function StatusFilter({ query }: { query: string }) {
  const current = query.trim().toLowerCase();
  return (
    <nav aria-label="Filter invoices by status" className="mt-4 flex gap-2">
      {FILTERS.map((f) => {
        const active = current === f.value;
        return (
          <Link
            key={f.label}
            href={f.value ? `/dashboard/invoices?query=${f.value}` : '/dashboard/invoices'}
            aria-current={active ? 'true' : undefined}
            className={clsx(
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150',
              active
                ? 'border-virus-neon/40 bg-virus-neon/10 text-virus-neon'
                : 'border-white/10 text-virus-mute hover:border-white/25 hover:text-virus-ink',
            )}
          >
            {f.label}
          </Link>
        );
      })}
    </nav>
  );
}

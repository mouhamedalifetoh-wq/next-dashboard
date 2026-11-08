import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import CountUp from '@/app/ui/dashboard/count-up';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card
        title="Collected"
        value={totalPaidInvoices}
        type="collected"
        index={0}
        href="/dashboard/invoices?query=paid"
      />
      <Card
        title="Pending"
        value={totalPendingInvoices}
        type="pending"
        index={1}
        href="/dashboard/invoices?query=pending"
      />
      <Card
        title="Total Invoices"
        value={numberOfInvoices}
        type="invoices"
        index={2}
        href="/dashboard/invoices"
      />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
        index={3}
        href="/dashboard/customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
  index = 0,
  href,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
  index?: number;
  href?: string;
}) {
  const Icon = iconMap[type];
  // Pending money is amber, everything else neon: colour is a hint, the label says it too.
  const tone =
    type === 'pending'
      ? 'bg-virus-amber/10 text-virus-amber'
      : 'bg-virus-neon/10 text-virus-neon';

  const card = (
    <div
      className="v-glass animate-fade-up p-5 transition duration-200 hover:-translate-y-0.5 hover:border-virus-neon/30 hover:shadow-glow-lg"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}
        >
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </span>
        <h3 className="text-sm font-medium text-virus-mute">{title}</h3>
      </div>
      <p className="mt-4 truncate font-display text-3xl font-semibold text-virus-ink">
        <CountUp value={value} />
      </p>
    </div>
  );

  // Each card is a shortcut to the page that explains its number.
  return href ? (
    <Link href={href} className="block rounded-2xl" aria-label={`${title}: open details`}>
      {card}
    </Link>
  ) : (
    card
  );
}

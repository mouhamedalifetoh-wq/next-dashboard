'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        // Home matches only itself; Invoices and Customers also stay lit on their
        // nested pages (create, edit).
        const isActive =
          pathname === link.href ||
          (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-transparent px-3 py-2 text-[11px] font-medium transition duration-200 md:h-12 md:flex-none md:flex-row md:justify-start md:gap-3 md:px-3 md:py-0 md:text-sm',
              {
                'border-virus-neon/25 bg-gradient-to-r from-virus-neon/15 to-virus-neon/[0.03] text-virus-neon':
                  isActive,
                'text-virus-mute hover:bg-white/5 hover:text-virus-ink md:hover:translate-x-0.5':
                  !isActive,
              },
            )}
          >
            {isActive ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-[30%] -top-2 h-[3px] rounded-b-full bg-virus-neon shadow-glow md:inset-x-auto md:-left-4 md:bottom-2.5 md:top-2.5 md:h-auto md:w-[3px] md:rounded-b-none md:rounded-r-full"
              />
            ) : null}
            <LinkIcon className="h-5 w-5 md:h-6 md:w-6" />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

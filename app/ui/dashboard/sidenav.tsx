import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import VirusLogo from '@/app/ui/virus-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <>
      {/* Phones: a slim brand bar at the top; the navigation sits at the bottom. */}
      <div className="flex items-center justify-between px-5 pt-5 md:hidden">
        <Link href="/" aria-label="VIRUS home">
          <VirusLogo className="text-lg" markClassName="h-7 w-7" />
        </Link>
      </div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/10 bg-virus-bg/85 px-2 py-2 backdrop-blur-xl md:static md:h-full md:flex-col md:border-r md:border-t-0 md:bg-white/[0.02] md:px-4 md:py-6"
      >
        <Link
          href="/"
          aria-label="VIRUS home"
          className="mb-8 hidden px-2 pt-1 md:block"
        >
          <VirusLogo className="text-xl" markClassName="h-8 w-8" />
        </Link>

        <div className="flex grow flex-row justify-between gap-1 md:flex-col md:justify-start md:gap-1.5">
          <NavLinks />
          <div className="hidden grow md:block" />
          <form
            className="flex md:block"
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="group relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border border-transparent px-3 py-2 text-[11px] font-medium text-virus-mute transition duration-200 hover:bg-white/5 hover:text-virus-ink active:scale-95 md:h-12 md:flex-row md:justify-start md:gap-3 md:px-3 md:py-0 md:text-sm md:hover:translate-x-0.5">
              <PowerIcon className="h-5 w-5 md:h-6 md:w-6" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}

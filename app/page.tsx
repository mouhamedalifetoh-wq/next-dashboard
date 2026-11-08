import VirusLogo from '@/app/ui/virus-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { display } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-5 md:p-8">
      <header className="flex items-center justify-between">
        <VirusLogo className="text-xl" markClassName="h-8 w-8" />
        <Link href="/login" className="v-btn-quiet">
          Log in
        </Link>
      </header>
      <div className="mt-8 flex grow flex-col gap-8 md:mt-12 md:flex-row md:items-center">
        <div className="flex animate-fade-up flex-col justify-center gap-6 md:w-2/5">
          <h1
            className={`${display.className} text-4xl font-semibold leading-tight md:text-5xl`}
          >
            Your invoices, <span className="text-virus-neon">in view.</span>
          </h1>
          <p className="max-w-md text-base text-virus-mute md:text-lg">
            Track invoices, revenue and customers in one place. Search, page
            through and update your billing from a single dashboard.
          </p>
          <Link href="/login" className="v-btn h-12 gap-3 self-start px-6 text-base">
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center md:w-3/5">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden rounded-2xl border border-white/10 shadow-glow-lg md:block"
            alt="Screenshots of the VIRUS dashboard showing the desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block rounded-2xl border border-white/10 shadow-glow-lg md:hidden"
            alt="Screenshot of the VIRUS dashboard showing the mobile version"
          />
        </div>
      </div>
    </main>
  );
}

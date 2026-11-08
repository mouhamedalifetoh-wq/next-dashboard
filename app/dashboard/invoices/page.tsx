import { Metadata } from 'next';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { display } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Invoices',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  // Input hardening (not part of the official course): the URL is user input.
  // A NUL byte in the query makes Postgres throw, and a negative or
  // non-integer page number makes OFFSET invalid. Repeated parameters
  // (?query=a&query=b) arrive as arrays at runtime, so only accept strings.
  const rawQuery = searchParams?.query;
  const query = (typeof rawQuery === 'string' ? rawQuery : '').replaceAll(
    '\0',
    '',
  );
  const requestedPage = Number(searchParams?.page);
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage >= 1
      ? requestedPage
      : 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${display.className} text-2xl font-semibold md:text-3xl`}>
          Invoices
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

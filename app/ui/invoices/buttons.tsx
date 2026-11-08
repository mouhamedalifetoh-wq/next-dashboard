import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DeleteInvoiceButton from '@/app/ui/invoices/delete-button';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="v-btn"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="v-icon-btn"
    >
      <span className="sr-only">Edit</span>
      <PencilIcon className="w-4" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  return <DeleteInvoiceButton id={id} />;
}

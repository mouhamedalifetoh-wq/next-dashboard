'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  AtSymbolIcon,
  CheckCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateCustomer, CustomerState } from '@/app/lib/actions';

export default function EditCustomerForm({
  customer,
}: {
  customer: { id: string; name: string; email: string };
}) {
  const initialState: CustomerState = { message: null, errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction, pending] = useActionState(
    updateCustomerWithId,
    initialState,
  );

  return (
    <form action={formAction} className="v-glass p-4 md:p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">Edit details</h2>

      <div className="mb-4">
        <label htmlFor="name" className="v-label">
          Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            maxLength={100}
            required
            defaultValue={state.values?.name ?? customer.name}
            aria-describedby="name-error"
            className="peer v-input"
          />
          <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-virus-mute transition-colors peer-focus:text-virus-neon" />
        </div>
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name?.map((error) => (
            <p className="mt-2 text-sm text-virus-danger" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="v-label">
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            maxLength={254}
            required
            defaultValue={state.values?.email ?? customer.email}
            aria-describedby="email-error"
            className="peer v-input"
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-virus-mute transition-colors peer-focus:text-virus-neon" />
        </div>
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {state.errors?.email?.map((error) => (
            <p className="mt-2 text-sm text-virus-danger" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" role="status">
        {state.success ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-virus-neon animate-fade-in">
            <CheckCircleIcon className="h-5 w-5" /> {state.message}
          </p>
        ) : state.message ? (
          <p className="mt-2 text-sm text-virus-danger">{state.message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/customers" className="v-btn-quiet">
          Back
        </Link>
        <Button type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}

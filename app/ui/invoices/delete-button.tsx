'use client';

import { useId, useRef } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice } from '@/app/lib/actions';

// Deleting is permanent, so ask first. Native <dialog>: focus is trapped, Escape
// closes it, and it works without any extra library.
export default function DeleteInvoiceButton({ id }: { id: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId(); // the list renders this button twice (cards and table)
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <>
      <button
        type="button"
        className="v-icon-btn"
        onClick={() => dialog.current?.showModal()}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="v-glass m-auto w-[min(92vw,24rem)] bg-virus-bg p-6 text-virus-ink backdrop:bg-black/70"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <h2 id={titleId} className="font-display text-lg font-semibold">
          Delete this invoice?
        </h2>
        <p className="mt-2 text-sm text-virus-mute">This cannot be undone.</p>
        <form action={deleteInvoiceWithId} className="mt-6 flex justify-end gap-3">
          <button type="button" className="v-btn-quiet" onClick={() => dialog.current?.close()}>
            Cancel
          </button>
          <button type="submit" className="v-btn bg-virus-danger text-white shadow-none">
            Delete
          </button>
        </form>
      </dialog>
    </>
  );
}

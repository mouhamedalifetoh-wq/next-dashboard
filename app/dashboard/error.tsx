'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ErrorState from '@/app/ui/error-state';

// Catches errors anywhere in the dashboard that a nearer boundary does not
// (for example the overview page). The invoices pages have their own, in
// app/dashboard/invoices/error.tsx.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      icon={ExclamationTriangleIcon}
      title="Something went wrong!"
      message="We couldn't load this page. Try again in a moment."
    >
      <button className="v-btn" onClick={() => retry()}>
        Try again
      </button>
    </ErrorState>
  );
}

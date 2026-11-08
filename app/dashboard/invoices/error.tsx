'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ErrorState from '@/app/ui/error-state';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      icon={ExclamationTriangleIcon}
      title="Something went wrong!"
      message="We couldn't load your invoices. Try again in a moment."
    >
      <button
        className="v-btn"
        onClick={
          // The course uses reset(), which re-renders without re-fetching, so a
          // failed server render stays failed. Next 16's docs recommend retry(),
          // which re-fetches the route and recovers once the problem is gone.
          () => retry()
        }
      >
        Try again
      </button>
    </ErrorState>
  );
}

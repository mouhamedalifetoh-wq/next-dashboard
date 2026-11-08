'use client';

import { useEffect } from 'react';

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
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // The course uses reset(), which re-renders without re-fetching, so a
          // failed server render stays failed. Next 16's docs recommend retry(),
          // which re-fetches the route and recovers once the problem is gone.
          () => retry()
        }
      >
        Try again
      </button>
    </main>
  );
}

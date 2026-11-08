import Link from 'next/link';
import { MapIcon } from '@heroicons/react/24/outline';
import ErrorState from '@/app/ui/error-state';

// The 404 page for any URL that does not exist in the app.
export default function NotFound() {
  return (
    <ErrorState
      icon={MapIcon}
      tone="neutral"
      title="404 Not Found"
      message="That page doesn't exist. Check the address, or head back to the start."
    >
      <Link href="/" className="v-btn">
        Back to VIRUS
      </Link>
    </ErrorState>
  );
}

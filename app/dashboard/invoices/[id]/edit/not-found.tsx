import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import ErrorState from '@/app/ui/error-state';

export default function NotFound() {
  return (
    <ErrorState
      icon={FaceFrownIcon}
      tone="neutral"
      title="404 Not Found"
      message="Could not find the requested invoice."
    >
      <Link href="/dashboard/invoices" className="v-btn">
        Go Back
      </Link>
    </ErrorState>
  );
}

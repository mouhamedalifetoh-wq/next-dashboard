import type { ComponentType, ReactNode, SVGProps } from 'react';

// A calm placeholder for "nothing to show here". Used for empty search results,
// an empty chart, an empty list, and pages that are not built yet.
export default function EmptyState({
  icon: Icon,
  title,
  message,
  children,
  className = '',
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  message: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-10 text-center ${className}`}
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-virus-neon/10 text-virus-neon">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="font-display text-lg font-semibold text-virus-ink">
        {title}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-virus-mute">{message}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

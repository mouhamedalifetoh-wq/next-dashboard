import type { ComponentType, ReactNode, SVGProps } from 'react';

// The full-panel screen for errors and 404s. Plain wording, one clear next step.
// Presentation only: the error boundary or not-found file decides what to pass in.
export default function ErrorState({
  icon: Icon,
  tone = 'danger',
  title,
  message,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: 'danger' | 'neutral';
  title: string;
  message: string;
  children?: ReactNode;
}) {
  const iconTone =
    tone === 'danger'
      ? 'bg-virus-danger/10 text-virus-danger'
      : 'bg-virus-neon/10 text-virus-neon';
  return (
    <main className="flex h-full min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-up">
      <span
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconTone}`}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="font-display text-2xl font-semibold text-virus-ink">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm text-virus-mute">{message}</p>
      {children ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      ) : null}
    </main>
  );
}

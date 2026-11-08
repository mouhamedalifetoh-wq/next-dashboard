// The VIRUS mark: a hexagon with a V. Pure SVG, no image file, scales with font size.
// A solid colour on purpose: a shared gradient id breaks when one copy of the logo
// sits inside a hidden (display: none) parent, as the mobile and desktop copies do.
export function VirusMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 8px rgba(43, 255, 136, 0.45))' }}
    >
      <path
        d="M16 2.5 28 9.3v13.4L16 29.5 4 22.7V9.3z"
        stroke="#2bff88"
        strokeWidth="1.8"
      />
      <path
        d="M9.5 11.5 16 23l6.5-11.5"
        stroke="#2bff88"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VirusLogo({
  className = '',
  markClassName = 'h-8 w-8',
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 font-display font-bold uppercase leading-none tracking-[0.18em] text-virus-ink ${className}`}
    >
      <VirusMark className={markClassName} />
      <span>VIRUS</span>
    </div>
  );
}

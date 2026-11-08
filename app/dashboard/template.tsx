// A template re-renders on every navigation between dashboard routes, so this
// gives each page the same short entrance. Pure CSS; switched off by the
// prefers-reduced-motion rule in global.css.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}

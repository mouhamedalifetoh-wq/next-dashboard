'use client';

import { useEffect, useRef } from 'react';

// Shows a number that counts up from 0 to its real value once, on first load.
// - The server renders the real value, so without JavaScript (or before it loads)
//   the correct number is already there.
// - It receives the value already formatted by the data layer ("$1,006.26" or
//   "13") and ends on exactly that string, so what is shown never differs from
//   what the database returned.
// - If the visitor asked for reduced motion, it does nothing.
// The animation writes straight to the element instead of using React state, so
// it costs no extra renders.
export default function CountUp({
  value,
  duration = 800,
}: {
  value: string | number;
  duration?: number;
}) {
  const final = String(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = Number(final.replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(target) || target === 0) return;

    const isCurrency = final.trim().startsWith('$');
    const format = (n: number) =>
      isCurrency
        ? n.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : Math.round(n).toLocaleString('en-US');

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      el.textContent = t < 1 ? format(target * eased) : final; // end on the exact string
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    el.textContent = format(0);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [final, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}

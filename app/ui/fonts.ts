import { Inter, Space_Grotesk } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

// Headings, the wordmark and big numbers. Exposed as a CSS variable so Tailwind's
// `font-display` class and plain CSS can both use it.
export const display = Space_Grotesk({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
});

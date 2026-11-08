import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Not part of the official course: added so `pnpm lint` can run (Next 16 removed `next lint`).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    // The course's Tailwind config uses require('@tailwindcss/forms'); leave it as-is.
    files: ['tailwind.config.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
]);

export default eslintConfig;

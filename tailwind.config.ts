import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      // VIRUS design tokens. One place to change the palette.
      colors: {
        virus: {
          bg: '#07090a', // page: almost black
          ink: '#eaf2ee', // primary text
          mute: '#93a09a', // secondary text
          neon: '#2bff88', // the accent
          'neon-ink': '#03140b', // dark text that sits on neon
          amber: '#f2b544', // pending status only
          danger: '#ff6070', // errors only
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 22px -6px rgba(43, 255, 136, 0.45)',
        'glow-lg': '0 10px 40px -12px rgba(43, 255, 136, 0.45)',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      'fade-up': {
        from: { opacity: '0', transform: 'translateY(14px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      'fade-in': {
        from: { opacity: '0' },
        to: { opacity: '1' },
      },
      'grow-y': {
        from: { transform: 'scaleY(0)', opacity: '0' },
        to: { transform: 'scaleY(1)', opacity: '1' },
      },
    },
    animation: {
      'fade-up': 'fade-up 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both',
      'fade-in': 'fade-in 0.5s ease-out both',
      'grow-y': 'grow-y 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;

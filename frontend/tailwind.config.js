/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        institutional: {
          bg: '#0B0D13',
          surface: '#12151E',
          card: '#1A1E2B',
          hover: '#22283A',
          border: '#262B3D',
          borderLight: '#323950',
          textMuted: '#94A3B8',
          textDim: '#64748B',
        },
        status: {
          greenBg: '#064E3B',
          greenText: '#34D399',
          greenBorder: '#065F46',
          amberBg: '#78350F',
          amberText: '#FBBF24',
          amberBorder: '#92400E',
          crimsonBg: '#7F1D1D',
          crimsonText: '#F87171',
          crimsonBorder: '#991B1B',
          zincBg: '#27272A',
          zincText: '#A1A1AA',
          zincBorder: '#3F3F46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

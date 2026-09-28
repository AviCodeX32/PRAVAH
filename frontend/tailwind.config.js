/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0F294A',
          navyLight: '#1E3A8A',
          navyDark: '#0A1D36',
          teal: '#0D9488',
          tealLight: '#14B8A6',
          blue: '#0284C7',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          textMain: '#0F172A',
          textMuted: '#64748B',
          textSub: '#475569',
        },
        status: {
          greenBg: '#ECFDF5',
          greenText: '#065F46',
          greenBorder: '#A7F3D0',
          amberBg: '#FFFBEB',
          amberText: '#92400E',
          amberBorder: '#FDE68A',
          redBg: '#FEF2F2',
          redText: '#991B1B',
          redBorder: '#FECACA',
          blueBg: '#EFF6FF',
          blueText: '#1E40AF',
          blueBorder: '#BFDBFE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

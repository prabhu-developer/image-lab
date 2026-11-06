/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-subtle': 'var(--color-surface-subtle)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        foreground: 'var(--color-text)',
        'foreground-muted': 'var(--color-text-muted)',
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          dark: '#6366F1',
        },
        success: {
          DEFAULT: '#25845A',
          subtle: '#ECFDF5',
          dark: '#34D399',
        },
        error: {
          DEFAULT: '#D94B4B',
          subtle: '#FEF2F2',
          dark: '#F87171',
        },
        neutral: {
          50: '#FBFBF9',
          100: '#F7F7F5',
          200: '#EBEBE7',
          300: '#E7E7E3',
          400: '#BCBCB7',
          500: '#777777',
          600: '#555555',
          700: '#3A3A3C',
          800: '#252528',
          900: '#202124',
          950: '#141415',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

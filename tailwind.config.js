/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0C447C',
          light: '#1a5a9e',
          dark: '#083460',
        },
        pink50: '#fb27e8',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rowSlide: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse50: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.25s ease-out forwards',
        'row-slide': 'rowSlide 0.22s ease-out both',
        'pulse-50': 'pulse50 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

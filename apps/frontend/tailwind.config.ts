import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
}
export default config
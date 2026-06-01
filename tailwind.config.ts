import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#16a34a',
          dark: '#14532d',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config

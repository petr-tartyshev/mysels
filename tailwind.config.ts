import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F80ED',
        secondary: '#C5D3E8',
        light: '#E8EAF0',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
}
export default config
